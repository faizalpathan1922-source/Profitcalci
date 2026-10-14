import React, { useState } from 'react';
import { Calculator, ArrowRight, HelpCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { ManagedCalculator } from '../types/admin';
import { evaluateSafeFormula } from '../utils/formulaEngine';
import { useCurrency } from '../context/CurrencyContext';

interface DynamicCalculatorRendererProps {
  tool: ManagedCalculator;
}

export const DynamicCalculatorRenderer: React.FC<DynamicCalculatorRendererProps> = ({ tool }) => {
  const { formatAmount } = useCurrency();
  const inputFields = tool.inputFields || [];
  const formulaSteps = tool.formulaSteps || [];
  const faqs = tool.faqs || [];

  // Initialize state with default field values
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const f of inputFields) {
      initial[f.id] = f.defaultValue ?? 0;
    }
    return initial;
  });

  const [copied, setCopied] = useState(false);

  const handleInputChange = (fieldId: string, val: string) => {
    const num = parseFloat(val);
    setInputs((prev) => ({
      ...prev,
      [fieldId]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    const resetVals: Record<string, number> = {};
    for (const f of inputFields) {
      resetVals[f.id] = f.defaultValue ?? 0;
    }
    setInputs(resetVals);
  };

  // Evaluate formula steps sequentially so later steps can use earlier results
  const stepResults: Record<string, number> = {};
  const currentScope: Record<string, number> = { ...inputs };

  for (const step of formulaSteps) {
    const calculatedVal = evaluateSafeFormula(step.expression, currentScope);
    stepResults[step.outputFieldId] = calculatedVal;
    currentScope[step.outputFieldId] = calculatedVal;
  }

  const primaryStep = formulaSteps.find((s) => s.isPrimaryResult) || formulaSteps[0];
  const primaryVal = primaryStep ? stepResults[primaryStep.outputFieldId] ?? 0 : 0;

  const handleCopySummary = () => {
    let summary = `🧮 ${tool.name} Calculation Results:\n`;
    for (const f of inputFields) {
      summary += `• ${f.label}: ${inputs[f.id] ?? 0}${f.unit ? ` ${f.unit}` : ''}\n`;
    }
    summary += `-----------------------\n`;
    for (const s of formulaSteps) {
      const val = stepResults[s.outputFieldId] ?? 0;
      summary += `✓ ${s.label}: ${s.unit === '₹' ? formatAmount(val) : `${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}${s.unit ? ` ${s.unit}` : ''}`}\n`;
    }
    summary += `\nCalculated on ProfitCalci (https://profitcalci.in/tool/${tool.slug})`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Calculator className="w-5 h-5" />
              </span>
              {tool.badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {tool.badge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {tool.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset inputs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs Left, Live Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Enter Input Parameters
          </h2>

          {inputFields.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No input fields configured for this calculator yet.
            </p>
          ) : (
            <div className="space-y-4">
              {inputFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={field.id} className="font-semibold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                    {field.unit && (
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        ({field.unit})
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id={field.id}
                      type="number"
                      step={field.step ?? 1}
                      min={field.min}
                      max={field.max}
                      value={inputs[field.id] === 0 ? '' : inputs[field.id]}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    />
                  </div>
                  {field.helpText && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {tool.formulaNotes && (
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Formula Logic:</span>
              <p>{tool.formulaNotes}</p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Highlight Card */}
          {primaryStep && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg space-y-2">
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
                Primary Result
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {primaryStep.unit === '₹' ? (
                  formatAmount(primaryVal)
                ) : (
                  <>
                    {primaryVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    {primaryStep.unit ? ` ${primaryStep.unit}` : ''}
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-100 font-medium">{primaryStep.label}</p>
            </div>
          )}

          {/* Detailed Metric Cards */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Output Breakdown
            </h3>

            {formulaSteps.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No formula outputs defined.</p>
            ) : (
              <div className="space-y-2.5">
                {formulaSteps.map((step) => {
                  const val = stepResults[step.outputFieldId] ?? 0;
                  const isPrimary = step.outputFieldId === primaryStep?.outputFieldId;

                  return (
                    <div
                      key={step.outputFieldId}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isPrimary
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs text-slate-700 dark:text-slate-300 block">
                          {step.label}
                        </span>
                        <code className="text-[10px] text-slate-400 font-mono">
                          {step.expression}
                        </code>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {step.unit === '₹' ? (
                          formatAmount(val)
                        ) : (
                          <>
                            {val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            {step.unit ? ` ${step.unit}` : ''}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
