import React, { useState, useEffect } from 'react';
import {
  AppConfig,
  DisplayLayoutConfig,
  TVItem,
  TypographyLetterSpacing,
  TypographyShadowEffect
} from '../types/tvConfig';
import { QRCodeRenderer } from './QRCodeRenderer';
import { Clock, Thermometer } from 'lucide-react';
import {
  DEFAULT_DISPLAY_LAYOUT,
  DEFAULT_ITEM_BADGE_STYLE,
  DEFAULT_SEQUENCE_BADGE_STYLE
} from '../data/defaultConfig';

interface TVDisplayPreviewProps {
  config: AppConfig;
  currentItem?: TVItem;
  mode?: 'preview' | 'tv' | 'fullscreen';
  className?: string;
  sequenceNumber?: number;
  showLayoutGuides?: boolean;
}

/**
 * Computes effective 100%-normalized footer section widths when Date & Time
 * or Temperature are toggled ON/OFF.
 */
export function computeEffectiveFooterWidths(
  layout: DisplayLayoutConfig
): [number, number, number] {
  const showDT = layout.showDateTime !== false;
  const showTemp = layout.showTemperature !== false;

  const rawDT = showDT ? Math.max(5, layout.footerHorizontal.dateTimePercent) : 0;
  const rawTemp = showTemp ? Math.max(5, layout.footerHorizontal.temperaturePercent) : 0;
  const rawLogo = Math.max(10, layout.footerHorizontal.logoPercent);

  const activeSum = rawDT + rawTemp + rawLogo;
  if (activeSum <= 0) return [0, 0, 100];

  const effDT = showDT ? Math.round((rawDT / activeSum) * 100) : 0;
  const effTemp = showTemp ? Math.round((rawTemp / activeSum) * 100) : 0;
  const effLogo = Math.max(0, 100 - effDT - effTemp);

  return [effDT, effTemp, effLogo];
}

export function getLetterSpacingCss(spacing?: TypographyLetterSpacing): string {
  switch (spacing) {
    case 'tight':
      return '-0.03em';
    case 'wide':
      return '0.07em';
    case 'expanded':
      return '0.15em';
    case 'normal':
    default:
      return '0em';
  }
}

export function getBadgeShadowCss(
  effect: TypographyShadowEffect | undefined,
  accentColor: string
): string {
  switch (effect) {
    case 'none':
      return 'none';
    case 'soft':
      return '0 8px 18px -4px rgba(0, 0, 0, 0.75)';
    case 'neon':
      return `0 0 18px ${accentColor}, 0 0 34px ${accentColor}99`;
    case 'glow':
    default:
      return `0 10px 24px -4px ${accentColor}88`;
  }
}

export function getTitleTextShadowCss(
  effect: TypographyShadowEffect | undefined,
  accentColor: string
): string {
  switch (effect) {
    case 'none':
      return 'none';
    case 'soft':
      return '0 3px 8px rgba(0, 0, 0, 0.85)';
    case 'neon':
      return `0 0 12px ${accentColor}, 0 2px 10px rgba(0, 0, 0, 0.9)`;
    case 'glow':
    default:
      return `0 4px 14px ${accentColor}66, 0 2px 6px rgba(0, 0, 0, 0.85)`;
  }
}

export const TVDisplayPreview: React.FC<TVDisplayPreviewProps> = ({
  config,
  currentItem,
  mode = 'preview',
  className = '',
  sequenceNumber = 3,
  showLayoutGuides = false
}) => {
  const item =
    currentItem ||
    config.items[config.playlist.activeItemIndex] ||
    config.items[0];

  const { screenDesign, branding, banner } = config;
  const layout = config.displayLayout || DEFAULT_DISPLAY_LAYOUT;
  const itemBadge = config.itemBadgeStyle || DEFAULT_ITEM_BADGE_STYLE;
  const seqBadge = config.sequenceBadgeStyle || DEFAULT_SEQUENCE_BADGE_STYLE;

  const isPreview = mode === 'preview';

  // Live ticking date and time for footer left section
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = screenDesign.background;
    if (bg.style === 'solid') {
      return { backgroundColor: bg.color || '#000000' };
    }
    if (bg.style === 'moving_gradient') {
      return {
        background: `linear-gradient(135deg, ${bg.color || '#000000'}, ${
          bg.secondaryColor || '#1e1b4b'
        }, ${bg.color || '#000000'})`,
        backgroundSize: '200% 200%'
      };
    }
    return {
      backgroundColor: bg.color || '#000000',
      backgroundImage: `radial-gradient(circle at 35% 50%, ${
        bg.ambientGlowColor || '#e11d48'
      }33 0%, transparent 65%)`
    };
  };

  const isBottledWaterScreenshot =
    item.imageUrl?.includes('image_5c97a408') ||
    item.imageUrl?.includes('image_9ed6af21') ||
    (item.itemNumber === '095' && item.name.toLowerCase().includes('water'));

  const getFontFamily = (family?: string) => {
    if (family === 'serif') return 'ui-serif, Georgia, Cambria, "Times New Roman", serif';
    if (family === 'mono') return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    if (family === 'impact') return 'Impact, "Arial Black", "Franklin Gothic Heavy", sans-serif';
    return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  };

  const getFontWeight = (weight?: string): number => {
    switch (weight) {
      case 'normal':
        return 400;
      case 'semibold':
        return 600;
      case 'bold':
        return 700;
      case 'bolder':
        return 800;
      case 'black':
      default:
        return 900;
    }
  };

  // Vertical Row Proportions (Always sum to 100% when rows are active)
  const hasHeader = layout.showHeader !== false && layout.vertical.headerPercent > 0;
  const hasFooter = layout.showFooter !== false && layout.vertical.footerPercent > 0;

  const headerPct = hasHeader ? layout.vertical.headerPercent : 0;
  const footerPct = hasFooter ? layout.vertical.footerPercent : 0;
  const contentPct = Math.max(10, 100 - headerPct - footerPct);

  // Horizontal Content Column Proportions
  const leftColPct = layout.contentHorizontal.productImagePercent;
  const midColPct = layout.contentHorizontal.itemDetailsPercent;
  const rightColPct = layout.contentHorizontal.qrCodePercent;

  // Horizontal Footer Section Proportions (Auto-expands to 100% when Date/Time or Temp is OFF)
  const showDateTime = layout.showDateTime !== false;
  const showTemperature = layout.showTemperature !== false;
  const [footerLeftPct, footerMidPct, footerRightPct] = computeEffectiveFooterWidths(layout);

  // Responsive QR size based on column width and preview mode
  const dynamicQrSize = isPreview
    ? Math.max(46, Math.min(115, Math.round(rightColPct * 3.6)))
    : Math.max(110, Math.min(260, Math.round(rightColPct * 9.5)));

  const guideBorder = showLayoutGuides ? 'border border-dashed border-emerald-400/60' : '';
  const badgeBgColor = itemBadge.backgroundColor || item.badgeColor || '#F91515';
  const badgeBorderWidth = itemBadge.borderWidth || 0;

  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden select-none flex flex-col justify-between transition-all duration-150 font-sans ${
        isPreview
          ? 'rounded-xl shadow-2xl border border-gray-800'
          : 'rounded-none shadow-none w-full h-full'
      } ${className}`}
      style={getBackgroundStyle()}
    >
      {/* Background Animated Gradient Pulse if moving gradient */}
      {screenDesign.background.style === 'moving_gradient' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 animate-pulse"
          style={{
            background: `radial-gradient(ellipse at 40% 40%, ${
              screenDesign.background.ambientGlowColor || '#e11d48'
            }44, transparent 70%)`
          }}
        />
      )}

      {/* 1. HEADER ROW (Controlled by Vertical Slider 1) */}
      {hasHeader && (
        <div
          className={`relative w-full border-b border-gray-800/80 bg-black/50 flex items-center justify-between px-3 sm:px-6 z-20 shrink-0 overflow-hidden transition-all duration-150 ${guideBorder}`}
          style={{ height: `${headerPct}%` }}
        >
          {showLayoutGuides && (
            <span className="absolute top-0.5 left-1.5 px-1 py-0.2 rounded bg-emerald-500/90 text-black font-mono font-black text-[8px] z-30">
              HEADER {headerPct}%
            </span>
          )}
          <span className="text-[9px] sm:text-xs font-bold tracking-widest uppercase text-emerald-400 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              {layout.headerText || 'SARAVANAA BHAVAN · SPECIAL RECOMMENDATIONS'}
            </span>
          </span>
          <span className="text-[9px] sm:text-[11px] text-gray-400 font-mono shrink-0 ml-2">
            {branding.branchName || 'Croydon'}
          </span>
        </div>
      )}

      {/* 2. MAIN CONTENT ROW (Controlled by Vertical Slider 2 & Horizontal Sliders 1-3) */}
      <div
        className="relative w-full flex items-center justify-between z-10 overflow-hidden transition-all duration-150"
        style={{ height: `${contentPct}%` }}
      >
        {/* COLUMN 1: Product Image (Left Column Slider) */}
        <div
          className={`relative h-full shrink-0 flex items-center justify-center overflow-hidden transition-all duration-150 ${guideBorder}`}
          style={{ width: `${leftColPct}%` }}
        >
          {showLayoutGuides && (
            <span className="absolute top-1 left-1.5 px-1 py-0.2 rounded bg-sky-500/90 text-black font-mono font-black text-[8px] z-30">
              IMG {leftColPct}%
            </span>
          )}

          {/* Ambient Glow behind the food/drink */}
          <div
            className="absolute w-36 h-36 md:w-72 md:h-72 rounded-full blur-3xl opacity-35 pointer-events-none"
            style={{
              backgroundColor:
                item.accentGlowColor ||
                screenDesign.background.ambientGlowColor ||
                branding.accentColor
            }}
          />

          <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden p-1.5 sm:p-3">
            {isBottledWaterScreenshot ? (
              <div className="relative w-full h-full overflow-hidden flex items-center justify-start rounded-xl">
                <img
                  src="/assets/aistudio/image_5c97a408.png"
                  alt={item.name}
                  className="h-full max-w-none object-cover"
                  style={{
                    width: '270%',
                    objectPosition: 'left center',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.8))'
                  }}
                />
              </div>
            ) : (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] rounded-xl"
              />
            )}
          </div>
        </div>

        {/* COLUMN 2: Item # & Product Name (Middle Column Slider) */}
        <div
          className={`relative h-full shrink-0 flex flex-col items-center justify-center text-center px-1 z-10 overflow-hidden transition-all duration-150 ${guideBorder}`}
          style={{ width: `${midColPct}%` }}
        >
          {showLayoutGuides && (
            <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-amber-400/90 text-black font-mono font-black text-[8px] z-30">
              INFO {midColPct}%
            </span>
          )}

          {/* Item Number Badge */}
          {config.playlist.showItemNumber && (
            <div className="flex flex-col items-center mb-1">
              <span
                className="uppercase drop-shadow mb-0.5 whitespace-nowrap"
                style={{
                  fontFamily: getFontFamily(itemBadge.fontFamily),
                  fontWeight: getFontWeight(itemBadge.fontWeight),
                  letterSpacing: getLetterSpacingCss(itemBadge.letterSpacing),
                  fontSize: isPreview
                    ? `${Math.max(7, Math.round((itemBadge.labelFontSize || 16) * 0.55))}px`
                    : `${itemBadge.labelFontSize || 16}px`,
                  color: itemBadge.labelColor || '#FFFFFF'
                }}
              >
                {itemBadge.label || item.badgeLabel || 'Item #'}
              </span>
              <div
                className="flex items-center justify-center leading-none transition-all duration-150"
                style={{
                  backgroundColor: badgeBgColor,
                  color: itemBadge.textColor || '#FFFFFF',
                  borderRadius: `${
                    isPreview
                      ? Math.max(4, Math.round(itemBadge.borderRadius * 0.55))
                      : itemBadge.borderRadius
                  }px`,
                  border:
                    badgeBorderWidth > 0
                      ? `${
                          isPreview ? Math.max(1, Math.round(badgeBorderWidth * 0.6)) : badgeBorderWidth
                        }px solid ${itemBadge.borderColor || '#FFFFFF'}`
                      : 'none',
                  fontFamily: getFontFamily(itemBadge.fontFamily),
                  fontWeight: getFontWeight(itemBadge.fontWeight),
                  letterSpacing: getLetterSpacingCss(itemBadge.letterSpacing),
                  fontSize: isPreview
                    ? `${Math.max(11, Math.round(itemBadge.fontSize * 0.42))}px`
                    : `${itemBadge.fontSize}px`,
                  padding: isPreview ? '3px 10px' : '8px 28px',
                  boxShadow: getBadgeShadowCss(itemBadge.textShadow, badgeBgColor)
                }}
              >
                {item.itemNumber}
              </div>
            </div>
          )}

          {/* Dish / Beverage Title */}
          <h1
            className="leading-tight mb-0.5 uppercase break-words max-w-full transition-all duration-150"
            style={{
              color: itemBadge.titleColor || '#FFFFFF',
              fontFamily: getFontFamily(itemBadge.titleFontFamily || itemBadge.fontFamily),
              fontWeight: getFontWeight(itemBadge.fontWeight),
              letterSpacing: getLetterSpacingCss(itemBadge.letterSpacing),
              textShadow: getTitleTextShadowCss(itemBadge.textShadow, badgeBgColor),
              fontSize: isPreview
                ? `${Math.max(8, Math.round((itemBadge.titleFontSize || 44) * 0.34))}px`
                : `${itemBadge.titleFontSize || 44}px`
            }}
          >
            {item.name}
          </h1>

          {/* Subtitle / Variations */}
          {config.playlist.showSubtitle && item.subtitle && (
            <p
              className="font-semibold break-words max-w-full leading-tight transition-all duration-150"
              style={{
                color: itemBadge.subtitleColor || '#E2E8F0',
                fontFamily: getFontFamily(itemBadge.titleFontFamily || itemBadge.fontFamily),
                letterSpacing: getLetterSpacingCss(itemBadge.letterSpacing),
                fontSize: isPreview
                  ? `${Math.max(7, Math.round((itemBadge.subtitleFontSize || 22) * 0.4))}px`
                  : `${itemBadge.subtitleFontSize || 22}px`
              }}
            >
              {item.subtitle}
            </p>
          )}
        </div>

        {/* COLUMN 3: QR Code & SEQ Number (Right Column Slider) */}
        <div
          className={`relative h-full shrink-0 flex items-center justify-center p-1 z-10 overflow-hidden transition-all duration-150 ${guideBorder}`}
          style={{ width: `${rightColPct}%` }}
        >
          {showLayoutGuides && (
            <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-rose-500/90 text-white font-mono font-black text-[8px] z-30">
              QR {rightColPct}%
            </span>
          )}

          <div className="flex flex-col items-center justify-center max-w-full max-h-full">
            <QRCodeRenderer
              value={branding.menuUrl}
              pattern={screenDesign.qrCode.pattern}
              dotColor={screenDesign.qrCode.dotColor}
              cardColor={screenDesign.qrCode.cardColor}
              isTransparent={screenDesign.qrCode.isTransparent}
              effect={screenDesign.qrCode.effect}
              centerLogoUrl={
                screenDesign.qrCode.showCenterLogo
                  ? screenDesign.qrCode.centerLogoUrl || branding.logoUrl
                  : undefined
              }
              headerText={screenDesign.qrCode.headerText || 'SCAN HERE'}
              headerColor={screenDesign.qrCode.headerColor || '#F91515'}
              footerText={
                seqBadge.showBadge && config.playlist.showSequenceNumber
                  ? `${seqBadge.prefix || 'SEQ - #'}${sequenceNumber}`
                  : undefined
              }
              footerColor={seqBadge.backgroundColor || '#F91515'}
              footerTextColor={seqBadge.textColor || '#FFFFFF'}
              footerFontSize={seqBadge.fontSize}
              footerBorderRadius={seqBadge.borderRadius}
              footerFontFamily={getFontFamily(seqBadge.fontFamily)}
              footerFontWeight={getFontWeight(seqBadge.fontWeight)}
              footerBorderWidth={seqBadge.borderWidth || 0}
              footerBorderColor={seqBadge.borderColor || '#FFFFFF'}
              footerLetterSpacing={getLetterSpacingCss(seqBadge.letterSpacing)}
              size={dynamicQrSize}
            />
          </div>
        </div>
      </div>

      {/* 3. FOOTER ROW (Auto-expands active sections to 100% when Date/Time or Temp is OFF) */}
      {hasFooter && (
        <div
          className={`relative w-full border-t border-gray-800/90 bg-black/75 flex items-center justify-between px-2 sm:px-5 z-20 shrink-0 overflow-hidden transition-all duration-150 ${guideBorder}`}
          style={{ height: `${footerPct}%` }}
        >
          {showLayoutGuides && (
            <span className="absolute top-0.5 right-1.5 px-1 py-0.2 rounded bg-emerald-500/90 text-black font-mono font-black text-[8px] z-30">
              FOOTER {footerPct}%
            </span>
          )}

          {/* SECTION 1: Date & Time (Shown when showDateTime is ON) */}
          {showDateTime && footerLeftPct > 0 && (
            <div
              className={`h-full flex items-center gap-1 text-gray-300 font-mono text-[9px] sm:text-xs overflow-hidden shrink-0 border-r border-gray-800/70 pr-1.5 transition-all duration-150 ${guideBorder}`}
              style={{ width: `${footerLeftPct}%` }}
            >
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
              <div className="truncate leading-tight">
                <span className="font-bold text-white">{currentTime || '10:45 AM'}</span>
                <span className="text-gray-400 ml-1 hidden sm:inline">{currentDate}</span>
              </div>
            </div>
          )}

          {/* SECTION 2: Temperature (Shown when showTemperature is ON) */}
          {showTemperature && footerMidPct > 0 && (
            <div
              className={`h-full flex items-center gap-1 text-sky-400 font-mono text-[9px] sm:text-xs overflow-hidden shrink-0 border-r border-gray-800/70 px-1.5 transition-all duration-150 ${guideBorder}`}
              style={{ width: `${footerMidPct}%` }}
            >
              <Thermometer className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="font-bold text-sky-300 truncate">22°C</span>
              <span className="text-gray-400 text-[8px] hidden md:inline truncate">Croydon</span>
            </div>
          )}

          {/* SECTION 3: Saravanaa Bhavan Brand Logo & Branch (Auto-expands up to 100%) */}
          <div
            className={`h-full flex items-center justify-between ${
              showDateTime || showTemperature ? 'pl-2' : 'px-1'
            } overflow-hidden shrink-0 transition-all duration-150 ${guideBorder}`}
            style={{ width: `${footerRightPct}%` }}
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-[8px] sm:text-[9px] shrink-0 border border-emerald-400">
                HSB
              </div>
              <div className="flex flex-col truncate">
                <span
                  className="font-black tracking-tight text-[10px] sm:text-sm leading-none truncate"
                  style={{ color: banner.titleColor || '#F91515' }}
                >
                  {banner.textTitle || 'SARAVANAA BHAVAN'}®
                </span>
                <span className="text-[6px] sm:text-[8px] font-bold text-gray-300 uppercase tracking-wider truncate">
                  {banner.textSubtitle || "WORLD'S NO. 1 INDIAN VEGETARIAN RESTAURANT CHAIN"}
                </span>
              </div>
            </div>

            <div className="flex items-center pl-2 border-l border-gray-700/60 shrink-0">
              <span className="font-bold text-white text-[10px] sm:text-xs tracking-tight">
                {branding.branchName || 'Croydon'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
