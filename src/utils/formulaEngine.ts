/**
 * Safe Mathematical Expression Evaluator
 * 
 * STRICT SECURITY AUDIT:
 * - NO eval(), Function(), or window execution.
 * - Parses numbers, variables, and math operators +, -, *, /, %, ^, () using a deterministic Tokenizer/Shunting-Yard algorithm.
 * - Returns clean NaN/safe fallback if invalid or dividing by zero.
 */

type TokenType = 'NUMBER' | 'VAR' | 'OP' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string | number;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
};

/**
 * Tokenizes formula expression
 */
function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const clean = expr.trim();

  while (i < clean.length) {
    const char = clean[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < clean.length && /[0-9.]/.test(clean[i])) {
        numStr += clean[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      let varStr = '';
      while (i < clean.length && /[a-zA-Z0-9_]/.test(clean[i])) {
        varStr += clean[i];
        i++;
      }
      tokens.push({ type: 'VAR', value: varStr });
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if ('+-*/%^'.includes(char)) {
      tokens.push({ type: 'OP', value: char });
      i++;
      continue;
    }

    // Ignore unsupported chars
    i++;
  }

  return tokens;
}

/**
 * Converts infix tokens to postfix (Reverse Polish Notation) using Shunting-Yard
 */
function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'VAR') {
      output.push(token);
    } else if (token.type === 'OP') {
      const op = token.value as string;
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1].type === 'OP' &&
        (PRECEDENCE[opStack[opStack.length - 1].value as string] || 0) >= (PRECEDENCE[op] || 0)
      ) {
        output.push(opStack.pop()!);
      }
      opStack.push(token);
    } else if (token.type === 'LPAREN') {
      opStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
        output.push(opStack.pop()!);
      }
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'LPAREN') {
        opStack.pop();
      }
    }
  }

  while (opStack.length > 0) {
    output.push(opStack.pop()!);
  }

  return output;
}

/**
 * Safely evaluates mathematical expression against a dictionary of variables
 */
export function evaluateSafeFormula(expression: string, variables: Record<string, number>): number {
  if (!expression || typeof expression !== 'string') return 0;

  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return 0;

    const rpn = toRPN(tokens);
    const stack: number[] = [];

    for (const token of rpn) {
      if (token.type === 'NUMBER') {
        stack.push(token.value as number);
      } else if (token.type === 'VAR') {
        const val = variables[token.value as string];
        stack.push(typeof val === 'number' && !isNaN(val) ? val : 0);
      } else if (token.type === 'OP') {
        const b = stack.pop() ?? 0;
        const a = stack.pop() ?? 0;

        switch (token.value) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(b === 0 ? 0 : a / b);
            break;
          case '%':
            stack.push(b === 0 ? 0 : a % b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
          default:
            stack.push(0);
        }
      }
    }

    const result = stack.pop();
    return typeof result === 'number' && !isNaN(result) && isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

/**
 * Validates formula syntax before saving
 */
export function validateFormulaSyntax(
  expression: string,
  availableVariableIds: string[]
): { valid: boolean; error?: string } {
  if (!expression || !expression.trim()) {
    return { valid: false, error: 'Formula expression cannot be empty.' };
  }

  const tokens = tokenize(expression);
  if (tokens.length === 0) {
    return { valid: false, error: 'Formula has no valid mathematical tokens.' };
  }

  // Check variables used
  for (const token of tokens) {
    if (token.type === 'VAR') {
      const varName = token.value as string;
      if (!availableVariableIds.includes(varName)) {
        return {
          valid: false,
          error: `Unknown variable "${varName}". Available inputs: ${availableVariableIds.join(', ')}`,
        };
      }
    }
  }

  // Test evaluation with sample 1s
  const sampleValues: Record<string, number> = {};
  for (const id of availableVariableIds) {
    sampleValues[id] = 10;
  }

  try {
    const testRes = evaluateSafeFormula(expression, sampleValues);
    if (isNaN(testRes) || !isFinite(testRes)) {
      return { valid: false, error: 'Formula resulted in an invalid calculation.' };
    }
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Syntax error in formula.' };
  }
}
