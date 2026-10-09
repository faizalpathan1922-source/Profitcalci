import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Tag, 
  FileText, 
  MessageSquareShare, 
  GitCompare, 
  Search, 
  QrCode, 
  Percent, 
  Sparkles,
  ArrowRight,
  Target,
  Banknote,
  AlertTriangle,
  ClipboardList,
  Receipt,
  Layers,
  FileImage,
  Instagram,
  Heading,
  Share2,
  Store,
  ShoppingBag
} from 'lucide-react';
import { ToolItem } from '../types';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (slug: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const getIcon = () => {
    switch (tool.iconName) {
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-teal-600" />;
      case 'Tag':
        return <Tag className="w-6 h-6 text-indigo-600" />;
      case 'Percent':
        return <Percent className="w-6 h-6 text-cyan-600" />;
      case 'Target':
        return <Target className="w-6 h-6 text-rose-600" />;
      case 'Store':
        return <Store className="w-6 h-6 text-emerald-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-emerald-600" />;
      case 'Banknote':
        return <Banknote className="w-6 h-6 text-amber-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-rose-500" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'ClipboardList':
        return <ClipboardList className="w-6 h-6 text-teal-600" />;
      case 'Receipt':
        return <Receipt className="w-6 h-6 text-violet-600" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-indigo-600" />;
      case 'QrCode':
        return <QrCode className="w-6 h-6 text-slate-800" />;
      case 'FileImage':
        return <FileImage className="w-6 h-6 text-blue-500" />;
      case 'MessageSquareShare':
        return <MessageSquareShare className="w-6 h-6 text-emerald-600" />;
      case 'Instagram':
        return <Instagram className="w-6 h-6 text-pink-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-600" />;
      case 'Heading':
        return <Heading className="w-6 h-6 text-blue-700" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-indigo-600" />;
      case 'Search':
        return <Search className="w-6 h-6 text-violet-600" />;
      case 'GitCompare':
        return <GitCompare className="w-6 h-6 text-amber-600" />;
      default:
        return <Calculator className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(tool.slug)}
      className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all duration-200 ease-in-out hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-500/40 active:scale-[0.99] cursor-pointer flex flex-col justify-between h-full relative"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 transition-all">
            {getIcon()}
          </div>
          {tool.badge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
          {tool.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
        <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Open Tool
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 capitalize">
          {tool.category}
        </span>
      </div>
    </div>
  );
};
