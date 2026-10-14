import { ToolItem, ToolCategory } from './index';

export type FormulaOperationType =
  | 'basic_arithmetic' // e.g. price * (1 - discount/100)
  | 'percentage_markup' // e.g. cost * (1 + markup/100)
  | 'percentage_margin' // e.g. cost / (1 - margin/100)
  | 'sum_deductions' // e.g. selling - (cogs + ship + pack + fee)
  | 'break_even_units'; // e.g. fixed / (selling - variable)

export interface CalculatorInputField {
  id: string; // e.g. "sellingPrice"
  label: string; // e.g. "Selling Price"
  placeholder?: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // e.g. "₹", "%", "units"
  helpText?: string;
  required?: boolean;
}

export interface CalculatorFormulaStep {
  outputFieldId: string; // e.g. "netProfit"
  label: string; // e.g. "Net Profit"
  expression: string; // safe math formula e.g. "sellingPrice - costPrice - shippingCost"
  unit?: string; // e.g. "₹" or "%"
  isPrimaryResult?: boolean;
  color?: 'emerald' | 'amber' | 'rose' | 'blue';
}

export interface CalculatorFaqItem {
  question: string;
  answer: string;
}

export interface ManagedCalculator {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  description: string;
  badge?: string;
  iconName: string;
  tags: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  published: boolean;
  isCustomCreated?: boolean; // true if created via form builder
  // Custom builder schema
  inputFields?: CalculatorInputField[];
  formulaSteps?: CalculatorFormulaStep[];
  faqs?: CalculatorFaqItem[];
  formulaNotes?: string;
}

export interface EditablePageContent {
  homepage: {
    heroBadge: string;
    heroHeading: string;
    heroSubheading: string;
    ctaPrimaryText: string;
    bannerNotice?: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    story: string;
  };
  contact: {
    supportEmail: string;
    phone: string;
    address: string;
    responseTime: string;
  };
  faq: CalculatorFaqItem[];
}

export interface EditableSeoItem {
  title: string;
  description: string;
  keywords?: string;
}

export interface AdminConfiguration {
  version: number;
  lastUpdated: string;
  passcodeHash: string;
  passcodeSalt: string;
  passcodeConfigured: boolean;
  tools: ManagedCalculator[];
  content: EditablePageContent;
  seo: Record<string, EditableSeoItem>;
  categories: { id: ToolCategory; label: string; icon: string }[];
}
