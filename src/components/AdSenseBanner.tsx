import React from 'react';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
  label?: string;
}

/**
 * AdSenseBanner component
 * Completely hidden / returns null so no empty placeholder gray boxes are rendered.
 */
export const AdSenseBanner: React.FC<AdSenseBannerProps> = () => {
  return null;
};
