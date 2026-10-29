import React, { useMemo } from 'react';
import QRCode from 'qrcode';
import { QRStylePattern, QREffect } from '../types/tvConfig';

interface QRCodeRendererProps {
  value: string;
  pattern: QRStylePattern;
  dotColor: string;
  cardColor: string;
  isTransparent: boolean;
  effect: QREffect;
  centerLogoUrl?: string;
  showCenterLogo?: boolean;
  headerText?: string;
  headerColor?: string;
  footerText?: string;
  footerColor?: string;
  footerTextColor?: string;
  footerFontSize?: number;
  footerBorderRadius?: number;
  footerFontFamily?: string;
  footerFontWeight?: number | string;
  footerBorderWidth?: number;
  footerBorderColor?: string;
  footerLetterSpacing?: string;
  size?: number;
  className?: string;
}

export const QRCodeRenderer: React.FC<QRCodeRendererProps> = ({
  value,
  pattern,
  dotColor,
  cardColor,
  isTransparent,
  effect,
  centerLogoUrl,
  showCenterLogo = true,
  headerText,
  headerColor,
  footerText,
  footerColor,
  footerTextColor = '#FFFFFF',
  footerFontSize,
  footerBorderRadius,
  footerFontFamily,
  footerFontWeight,
  footerBorderWidth = 0,
  footerBorderColor = '#FFFFFF',
  footerLetterSpacing = '0.05em',
  size = 200,
  className = ''
}) => {
  // Generate QR matrix using qrcode library
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(value || 'https://orders.scoopdine.co.uk', {
        errorCorrectionLevel: 'H' // High error correction so center logo works without breaking scan
      });
      return qr.modules;
    } catch {
      // Fallback simple matrix if generation fails
      return null;
    }
  }, [value]);

  const moduleCount = qrData ? qrData.size : 25;
  const margin = 2;
  const viewBoxSize = moduleCount + margin * 2;

  // Determine center mask area for logo (center 20% of QR)
  const centerStart = Math.floor(moduleCount * 0.38);
  const centerEnd = Math.ceil(moduleCount * 0.62);

  const getEffectStyle = () => {
    switch (effect) {
      case 'shadow':
        return 'drop-shadow-lg';
      case 'glow':
        return 'drop-shadow-[0_0_12px_rgba(249,21,21,0.5)]';
      case 'neon':
        return 'drop-shadow-[0_0_18px_rgba(249,21,21,0.85)]';
      case 'none':
      default:
        return '';
    }
  };

  const isCompact = size < 120;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        isCompact ? 'p-1.5 rounded-xl' : 'p-3 rounded-2xl'
      } ${getEffectStyle()} ${className}`}
      style={{
        backgroundColor: isTransparent ? 'transparent' : cardColor,
        color: dotColor,
        width: size ? `${size}px` : 'auto'
      }}
    >
      {/* Top Header Badge (e.g. "SCAN HERE" or "SCAN ME") */}
      {headerText && (
        <div
          className={`w-full text-center uppercase text-white shadow-sm font-black tracking-wider ${
            isCompact
              ? 'py-0.5 px-1.5 rounded text-[8px] mb-1'
              : 'py-1.5 px-3 rounded-lg text-xs md:text-sm mb-2'
          }`}
          style={{
            backgroundColor: headerColor || dotColor
          }}
        >
          {headerText}
        </div>
      )}

      {/* SVG QR Code */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <g transform={`translate(${margin}, ${margin})`}>
            {qrData &&
              Array.from({ length: moduleCount }).map((_, r) =>
                Array.from({ length: moduleCount }).map((_, c) => {
                  const isDark = qrData.get(r, c);
                  if (!isDark) return null;

                  // Clear out center area if logo is enabled
                  if (
                    showCenterLogo &&
                    centerLogoUrl &&
                    r >= centerStart &&
                    r < centerEnd &&
                    c >= centerStart &&
                    c < centerEnd
                  ) {
                    return null;
                  }

                  // Finder patterns (top-left, top-right, bottom-left 7x7 areas)
                  const isFinder =
                    (r < 7 && c < 7) ||
                    (r < 7 && c >= moduleCount - 7) ||
                    (r >= moduleCount - 7 && c < 7);

                  if (isFinder) {
                    // Standard sharp or rounded corner finder
                    return (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width={1}
                        height={1}
                        rx={pattern === 'rounded' ? 0.3 : 0}
                        ry={pattern === 'rounded' ? 0.3 : 0}
                        fill={dotColor}
                      />
                    );
                  }

                  // Data module rendering based on pattern
                  switch (pattern) {
                    case 'rounded':
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={c + 0.05}
                          y={r + 0.05}
                          width={0.9}
                          height={0.9}
                          rx={0.35}
                          ry={0.35}
                          fill={dotColor}
                        />
                      );
                    case 'dotted':
                      return (
                        <circle
                          key={`${r}-${c}`}
                          cx={c + 0.5}
                          cy={r + 0.5}
                          r={0.44}
                          fill={dotColor}
                        />
                      );
                    case 'dashed':
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={c + 0.1}
                          y={r + 0.15}
                          width={0.8}
                          height={0.7}
                          rx={0.3}
                          ry={0.3}
                          fill={dotColor}
                        />
                      );
                    case 'square':
                    default:
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width={1}
                          height={1}
                          fill={dotColor}
                        />
                      );
                  }
                })
              )}
          </g>
        </svg>

        {/* Center Logo */}
        {showCenterLogo && centerLogoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <div
              className="p-1 rounded-full shadow-md bg-white border-2 flex items-center justify-center overflow-hidden"
              style={{
                width: `${size * 0.24}px`,
                height: `${size * 0.24}px`,
                borderColor: dotColor
              }}
            >
              <img
                src={centerLogoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Sequence Badge (e.g. "SEQ - #3") */}
      {footerText && (
        <div
          className={`uppercase shadow-sm text-center whitespace-nowrap transition-all duration-200 ${
            isCompact ? 'mt-1 px-1.5 py-0.5' : 'mt-2 px-3 py-1'
          }`}
          style={{
            backgroundColor: footerColor || headerColor || dotColor,
            color: footerTextColor || '#FFFFFF',
            borderRadius:
              footerBorderRadius !== undefined
                ? `${isCompact ? Math.max(2, Math.round(footerBorderRadius * 0.6)) : footerBorderRadius}px`
                : isCompact
                ? '4px'
                : '6px',
            fontSize:
              footerFontSize !== undefined
                ? `${isCompact ? Math.max(7, Math.round(footerFontSize * 0.58)) : footerFontSize}px`
                : isCompact
                ? '8px'
                : '12px',
            fontFamily: footerFontFamily,
            fontWeight: footerFontWeight || 900,
            letterSpacing: footerLetterSpacing,
            border:
              footerBorderWidth && footerBorderWidth > 0
                ? `${isCompact ? Math.max(1, Math.round(footerBorderWidth * 0.6)) : footerBorderWidth}px solid ${footerBorderColor || '#FFFFFF'}`
                : 'none'
          }}
        >
          {footerText}
        </div>
      )}
    </div>
  );
};
