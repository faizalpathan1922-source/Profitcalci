export type ToolCategory = 'calculators' | 'ecommerce' | 'invoicing' | 'ai-tools';

export interface ToolItem {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  badge?: string;
  tags: string[];
}

export interface GstCalculationState {
  amount: number;
  gstRate: number;
  mode: 'exclusive' | 'inclusive';
  transactionType: 'intra' | 'inter';
  customRate?: number;
}

export interface GstResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  effectiveRate: number;
}

export interface ProfitCalcState {
  platform: 'meesho' | 'amazon' | 'flipkart' | 'custom';
  costPrice: number;
  sellingPrice: number;
  referralFeePercent: number;
  closingFee: number;
  shippingCost: number;
  packagingCost: number;
  rtoPercent: number; // Return to origin %
  rtoShippingLoss: number; // Cost incurred when returned
  adSpendPerUnit: number;
  gstRate: number;
}

export interface ProfitResult {
  marketplaceFee: number;
  closingFee: number;
  shippingTotal: number;
  packagingTotal: number;
  rtoLossPerUnit: number;
  totalDeductions: number;
  netPayout: number;
  netProfit: number;
  netMarginPercent: number;
  roiPercent: number;
  status: 'profit' | 'loss' | 'breakeven';
}

export interface SellingPriceState {
  costPrice: number;
  targetType: 'margin' | 'fixed_profit';
  targetMarginPercent: number;
  targetProfitAmount: number;
  platformFeePercent: number;
  shippingCost: number;
  packagingCost: number;
  gstRate: number;
  rtoPercent: number;
  rtoLossAmount: number;
}

export interface SellingPriceResult {
  recommendedPrice: number;
  actualPayout: number;
  marketplaceFee: number;
  gstAmount: number;
  netProfit: number;
  achievedMargin: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstRate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  reverseCharge: boolean;
  // Seller
  sellerName: string;
  sellerTradeName: string;
  sellerGstin: string;
  sellerPan: string;
  sellerAddress: string;
  sellerCity: string;
  sellerState: string;
  sellerPincode: string;
  sellerPhone: string;
  sellerEmail: string;
  // Buyer
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerCity: string;
  buyerState: string;
  buyerPincode: string;
  buyerPhone: string;
  // Bank details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  // Items
  items: InvoiceItem[];
  notes: string;
  terms: string;
}

export interface WhatsAppAdState {
  businessName: string;
  productName: string;
  regularPrice: number;
  offerPrice: number;
  features: string;
  campaignType: 'festive' | 'clearance' | 'new_arrival' | 'flash_sale' | 'wholesale';
  tone: 'hinglish' | 'friendly' | 'urgent' | 'formal';
  whatsappNumber: string;
  customNotes?: string;
}
