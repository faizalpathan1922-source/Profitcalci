import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto'; // 'auto' follows active theme
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  theme = 'auto',
}) => {
  // Height presets
  const heightClasses = {
    sm: 'h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-11 sm:h-12',
    xl: 'h-14 sm:h-16',
  };

  // Detect theme safely
  let contextDark = false;
  try {
    const themeContext = useTheme();
    contextDark = themeContext.isDark;
  } catch {
    contextDark = false;
  }

  const isDarkMode = theme === 'dark' ? true : theme === 'light' ? false : contextDark;

  // Concept 1: Smart Calculator Key Mark
  if (variant === 'mark') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${heightClasses[size]} aspect-square ${className}`}>
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="ProfitCalci Icon"
        >
          <rect width="128" height="128" rx="28" fill="#059669" />
          <rect x="26" y="24" width="76" height="20" rx="6" fill="#022C22" opacity="0.35" />
          <circle cx="44" cy="72" r="8" fill="#FFFFFF" />
          <circle cx="84" cy="98" r="8" fill="#FFFFFF" />
          <path d="M 86 64 L 42 106" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
          <path d="M 78 44 L 96 44 L 96 62" stroke="#A7F3D0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    );
  }

  // Full Horizontal Brand Logo: Concept 1 ("Smart Calculator Key")
  const profitColor = isDarkMode ? '#F8FAFC' : '#0F172A';
  const subtitleColor = isDarkMode ? '#94A3B8' : '#64748B';

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <svg
        viewBox="0 0 520 120"
        className={`${heightClasses[size]} w-auto object-contain shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ProfitCalci Logo"
      >
        {/* Concept 1 Icon Mark */}
        <g transform="translate(10, 10)">
          <rect width="100" height="100" rx="22" fill="#059669" />
          <rect x="20" y="20" width="60" height="16" rx="5" fill="#022C22" opacity="0.4" />
          <circle cx="34" cy="56" r="6" fill="#FFFFFF" />
          <circle cx="66" cy="78" r="6" fill="#FFFFFF" />
          <path d="M 68 50 L 32 84" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M 62 36 L 76 36 L 76 50" stroke="#A7F3D0" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Concept 1 Typography */}
        <g transform="translate(132, 28)">
          <text
            x="0"
            y="42"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="46"
            fontWeight="900"
            letterSpacing="-1"
          >
            <tspan fill={profitColor}>Profit</tspan>
            <tspan fill="#059669">Calci</tspan>
            <tspan fill="#10B981" fontSize="28" fontWeight="800">.in</tspan>
          </text>
          <text
            x="2"
            y="68"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="11.5"
            fontWeight="700"
            fill={subtitleColor}
            letterSpacing="2"
          >
            BUSINESS TOOLS FOR INDIAN SELLERS
          </text>
        </g>
      </svg>
    </div>
  );
};
