import React, { useState } from 'react';
import {
  Sliders,
  SlidersHorizontal,
  LayoutTemplate,
  Layers,
  Type,
  Maximize2,
  RotateCcw,
  Sparkles,
  Clock,
  Thermometer,
  QrCode,
  Eye,
  Tv,
  ArrowLeft,
  Grid,
  Minus,
  Plus,
  Power
} from 'lucide-react';
import {
  AppConfig,
  DisplayLayoutConfig,
  ItemBadgeConfig,
  SequenceBadgeConfig,
  TypographyLetterSpacing,
  TypographyShadowEffect
} from '../types/tvConfig';
import {
  TVDisplayPreview,
  computeEffectiveFooterWidths,
  getLetterSpacingCss,
  getBadgeShadowCss
} from './TVDisplayPreview';

interface DisplayLayoutConfigEditorProps {
  config: AppConfig;
  onUpdateDisplayLayout?: (layout: Partial<DisplayLayoutConfig>) => void;
  onUpdateItemBadgeStyle?: (style: Partial<ItemBadgeConfig>) => void;
  onUpdateSequenceBadgeStyle?: (style: Partial<SequenceBadgeConfig>) => void;
  onResetToDefault?: () => void;
  onOpenFullscreenDisplay?: () => void;
  onBack?: () => void;
  onNotify?: (msg: string) => void;
}

/**
 * Mathematically exact 3-slider auto-balancer:
 * Guarantees all 3 integers stay within [minVal, maxVal] and always sum to 100%.
 */
export function balanceThreeSliders(
  current: [number, number, number],
  changedIndex: 0 | 1 | 2,
  newVal: number,
  minVal = 5,
  maxVal = 90
): [number, number, number] {
  const effectiveMax = Math.min(maxVal, 100 - minVal * 2);
  const clamped = Math.max(minVal, Math.min(effectiveMax, Math.round(newVal)));
  const remaining = 100 - clamped;

  const idxA = ((changedIndex + 1) % 3) as 0 | 1 | 2;
  const idxB = ((changedIndex + 2) % 3) as 0 | 1 | 2;

  const curA = Math.max(minVal, current[idxA]);
  const curB = Math.max(minVal, current[idxB]);
  const sumOthers = curA + curB;

  let nextA: number;
  let nextB: number;

  if (sumOthers > 0) {
    nextA = Math.round((remaining * curA) / sumOthers);
  } else {
    nextA = Math.round(remaining / 2);
  }
  nextB = remaining - nextA;

  if (nextA < minVal) {
    nextA = minVal;
    nextB = remaining - nextA;
  } else if (nextB < minVal) {
    nextB = minVal;
    nextA = remaining - nextB;
  }

  if (nextA > effectiveMax) {
    nextA = effectiveMax;
    nextB = remaining - nextA;
  } else if (nextB > effectiveMax) {
    nextB = effectiveMax;
    nextA = remaining - nextB;
  }

  const result: [number, number, number] = [0, 0, 0];
  result[changedIndex] = clamped;
  result[idxA] = nextA;
  result[idxB] = nextB;
  return result;
}

const COLOR_PRESETS = [
  '#F91515',
  '#E11D48',
  '#EA580C',
  '#D97706',
  '#10B981',
  '#0EA5E9',
  '#2563EB',
  '#7C3AED',
  '#0F172A',
  '#FFFFFF'
];

const TEXT_COLOR_PRESETS = [
  '#FFFFFF',
  '#F8FAFC',
  '#FDE047',
  '#34D399',
  '#38BDF8',
  '#F87171',
  '#000000'
];

interface TypographyPreset {
  id: string;
  label: string;
  desc: string;
  itemBadge: Partial<ItemBadgeConfig>;
  seqBadge: Partial<SequenceBadgeConfig>;
}

const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'saravanaa_bold',
    label: 'Saravanaa Bold',
    desc: 'Heavy crimson badge + crisp white display sans',
    itemBadge: {
      fontSize: 54,
      backgroundColor: '#F91515',
      textColor: '#FFFFFF',
      borderRadius: 16,
      fontWeight: 'black',
      fontFamily: 'sans',
      titleFontFamily: 'sans',
      labelFontSize: 16,
      titleFontSize: 44,
      subtitleFontSize: 22,
      titleColor: '#FFFFFF',
      subtitleColor: '#FFFFFF',
      borderWidth: 0,
      borderColor: '#FFFFFF',
      letterSpacing: 'normal',
      textShadow: 'glow'
    },
    seqBadge: {
      fontSize: 14,
      backgroundColor: '#F91515',
      textColor: '#FFFFFF',
      borderRadius: 8,
      fontWeight: 'black',
      fontFamily: 'sans',
      borderWidth: 0,
      borderColor: '#FFFFFF',
      letterSpacing: 'normal'
    }
  },
  {
    id: 'luxury_serif',
    label: 'Luxury Serif',
    desc: 'Gold-stroked editorial serif + warm saffron tones',
    itemBadge: {
      fontSize: 50,
      backgroundColor: '#1E1B18',
      textColor: '#FDE047',
      borderRadius: 12,
      fontWeight: 'bold',
      fontFamily: 'serif',
      titleFontFamily: 'serif',
      labelFontSize: 15,
      titleFontSize: 42,
      subtitleFontSize: 20,
      titleColor: '#FEF08A',
      subtitleColor: '#E2E8F0',
      borderWidth: 2,
      borderColor: '#EAB308',
      letterSpacing: 'wide',
      textShadow: 'soft'
    },
    seqBadge: {
      fontSize: 13,
      backgroundColor: '#1E1B18',
      textColor: '#FDE047',
      borderRadius: 6,
      fontWeight: 'bold',
      fontFamily: 'serif',
      borderWidth: 1,
      borderColor: '#EAB308',
      letterSpacing: 'wide'
    }
  },
  {
    id: 'modern_neon',
    label: 'Modern Neon',
    desc: 'Impact display + electric cyan halo & white ring',
    itemBadge: {
      fontSize: 58,
      backgroundColor: '#0EA5E9',
      textColor: '#FFFFFF',
      borderRadius: 20,
      fontWeight: 'black',
      fontFamily: 'impact',
      titleFontFamily: 'impact',
      labelFontSize: 16,
      titleFontSize: 46,
      subtitleFontSize: 21,
      titleColor: '#38BDF8',
      subtitleColor: '#F8FAFC',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      letterSpacing: 'expanded',
      textShadow: 'neon'
    },
    seqBadge: {
      fontSize: 14,
      backgroundColor: '#0EA5E9',
      textColor: '#FFFFFF',
      borderRadius: 10,
      fontWeight: 'black',
      fontFamily: 'mono',
      borderWidth: 1,
      borderColor: '#FFFFFF',
      letterSpacing: 'wide'
    }
  },
  {
    id: 'clean_retail',
    label: 'Clean Minimal',
    desc: 'Sharp monospace numbers + high-contrast emerald',
    itemBadge: {
      fontSize: 48,
      backgroundColor: '#10B981',
      textColor: '#06281E',
      borderRadius: 8,
      fontWeight: 'black',
      fontFamily: 'mono',
      titleFontFamily: 'sans',
      labelFontSize: 14,
      titleFontSize: 40,
      subtitleFontSize: 20,
      titleColor: '#FFFFFF',
      subtitleColor: '#A7F3D0',
      borderWidth: 0,
      borderColor: '#FFFFFF',
      letterSpacing: 'tight',
      textShadow: 'soft'
    },
    seqBadge: {
      fontSize: 13,
      backgroundColor: '#10B981',
      textColor: '#06281E',
      borderRadius: 4,
      fontWeight: 'bold',
      fontFamily: 'mono',
      borderWidth: 0,
      borderColor: '#FFFFFF',
      letterSpacing: 'tight'
    }
  }
];

export const DisplayLayoutConfigEditor: React.FC<DisplayLayoutConfigEditorProps> = ({
  config,
  onUpdateDisplayLayout,
  onUpdateItemBadgeStyle,
  onUpdateSequenceBadgeStyle,
  onResetToDefault,
  onOpenFullscreenDisplay,
  onBack,
  onNotify
}) => {
  const { theme, displayLayout, itemBadgeStyle, sequenceBadgeStyle, items, playlist } = config;
  const isDark = theme === 'dark';

  const [activeConfigTab, setActiveConfigTab] = useState<'layout' | 'typography'>('layout');
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [previewItemIdx, setPreviewItemIdx] = useState<number>(playlist.activeItemIndex || 0);

  const previewItem = items[previewItemIdx] || items[0];

  const showDateTime = displayLayout.showDateTime !== false;
  const showTemperature = displayLayout.showTemperature !== false;
  const [effFooterDT, effFooterTemp, effFooterLogo] =
    computeEffectiveFooterWidths(displayLayout);

  // 1. Vertical Row Sliders (Header + Content + Footer = 100%)
  const handleVerticalSlider = (index: 0 | 1 | 2, value: number) => {
    const current: [number, number, number] = [
      displayLayout.vertical.headerPercent,
      displayLayout.vertical.contentPercent,
      displayLayout.vertical.footerPercent
    ];
    const balanced = balanceThreeSliders(current, index, value, 5, 90);
    onUpdateDisplayLayout?.({
      showHeader: true,
      showFooter: true,
      vertical: {
        headerPercent: balanced[0],
        contentPercent: balanced[1],
        footerPercent: balanced[2]
      }
    });
  };

  // 2. Content Row Horizontal Column Sliders (Image + Item Details + QR = 100%)
  const handleContentColSlider = (index: 0 | 1 | 2, value: number) => {
    const current: [number, number, number] = [
      displayLayout.contentHorizontal.productImagePercent,
      displayLayout.contentHorizontal.itemDetailsPercent,
      displayLayout.contentHorizontal.qrCodePercent
    ];
    const balanced = balanceThreeSliders(current, index, value, 5, 90);
    onUpdateDisplayLayout?.({
      contentHorizontal: {
        productImagePercent: balanced[0],
        itemDetailsPercent: balanced[1],
        qrCodePercent: balanced[2]
      }
    });
  };

  // 3. Footer Row Horizontal Section Sliders (Date/Time + Temp + Brand Logo = 100%)
  const handleFooterSlider = (index: 0 | 1 | 2, value: number) => {
    const current: [number, number, number] = [
      displayLayout.footerHorizontal.dateTimePercent,
      displayLayout.footerHorizontal.temperaturePercent,
      displayLayout.footerHorizontal.logoPercent
    ];
    const balanced = balanceThreeSliders(current, index, value, 5, 90);
    onUpdateDisplayLayout?.({
      showFooter: true,
      footerHorizontal: {
        dateTimePercent: balanced[0],
        temperaturePercent: balanced[1],
        logoPercent: balanced[2]
      }
    });
  };

  const handleToggleDateTime = () => {
    const nextVal = !showDateTime;
    onUpdateDisplayLayout?.({ showDateTime: nextVal });
    onNotify?.(
      `Date & Time widget turned ${nextVal ? 'ON' : 'OFF (Remaining footer auto-expanded to 100%)'}`
    );
  };

  const handleToggleTemperature = () => {
    const nextVal = !showTemperature;
    onUpdateDisplayLayout?.({ showTemperature: nextVal });
    onNotify?.(
      `Temperature widget turned ${nextVal ? 'ON' : 'OFF (Remaining footer auto-expanded to 100%)'}`
    );
  };

  const handleApplyLayoutPreset = (preset: 'default_spec' | 'balanced' | 'cinematic') => {
    if (preset === 'default_spec') {
      onUpdateDisplayLayout?.({
        showHeader: true,
        showFooter: true,
        showDateTime: true,
        showTemperature: true,
        vertical: { headerPercent: 10, contentPercent: 80, footerPercent: 10 },
        contentHorizontal: { productImagePercent: 80, itemDetailsPercent: 10, qrCodePercent: 10 },
        footerHorizontal: { dateTimePercent: 10, temperaturePercent: 10, logoPercent: 80 }
      });
      onNotify?.('Applied User Spec (80 / 10 / 10) layout proportions');
    } else if (preset === 'balanced') {
      onUpdateDisplayLayout?.({
        showHeader: true,
        showFooter: true,
        showDateTime: true,
        showTemperature: true,
        vertical: { headerPercent: 10, contentPercent: 78, footerPercent: 12 },
        contentHorizontal: { productImagePercent: 50, itemDetailsPercent: 30, qrCodePercent: 20 },
        footerHorizontal: { dateTimePercent: 18, temperaturePercent: 14, logoPercent: 68 }
      });
      onNotify?.('Applied Balanced 3-Column (50 / 30 / 20) layout');
    } else if (preset === 'cinematic') {
      onUpdateDisplayLayout?.({
        showHeader: true,
        showFooter: true,
        showDateTime: false,
        showTemperature: false,
        vertical: { headerPercent: 8, contentPercent: 82, footerPercent: 10 },
        contentHorizontal: { productImagePercent: 62, itemDetailsPercent: 23, qrCodePercent: 15 },
        footerHorizontal: { dateTimePercent: 10, temperaturePercent: 10, logoPercent: 80 }
      });
      onNotify?.('Applied Full-Brand Footer Cinematic layout');
    }
  };

  const handleApplyTypographyPreset = (preset: TypographyPreset) => {
    onUpdateItemBadgeStyle?.(preset.itemBadge);
    onUpdateSequenceBadgeStyle?.(preset.seqBadge);
    onNotify?.(`Applied "${preset.label}" typography preset`);
  };

  const getFontFamilyStyle = (family?: string) => {
    if (family === 'serif') return 'ui-serif, Georgia, Cambria, serif';
    if (family === 'mono') return 'ui-monospace, SFMono-Regular, Menlo, monospace';
    if (family === 'impact') return 'Impact, "Arial Black", sans-serif';
    return 'ui-sans-serif, system-ui, sans-serif';
  };

  const getFontWeightVal = (weight?: string): number => {
    if (weight === 'normal') return 400;
    if (weight === 'semibold') return 600;
    if (weight === 'bold') return 700;
    if (weight === 'bolder') return 800;
    return 900;
  };

  const cardSurface = isDark
    ? 'bg-[#151f35] border-[#22304f] text-white'
    : 'bg-white border-gray-200 text-gray-900 shadow-xs';
  const subSurface = isDark
    ? 'bg-[#0f172a] border-[#1e293b]'
    : 'bg-gray-50 border-gray-200';
  const inputSurface = isDark
    ? 'bg-[#0f172a] border-[#263554] text-white focus:border-emerald-500'
    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-600';

  const verticalSum =
    displayLayout.vertical.headerPercent +
    displayLayout.vertical.contentPercent +
    displayLayout.vertical.footerPercent;
  const contentSum =
    displayLayout.contentHorizontal.productImagePercent +
    displayLayout.contentHorizontal.itemDetailsPercent +
    displayLayout.contentHorizontal.qrCodePercent;
  const footerEffectiveSum = effFooterDT + effFooterTemp + effFooterLogo;

  return (
    <div className="h-full min-h-0 flex flex-col gap-2.5 overflow-hidden select-none">
      {/* TOP COMMAND BAR: Back Button + Mode Switcher + Context Presets + Broadcast */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl border flex-shrink-0 ${cardSurface}`}
      >
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isDark
                  ? 'bg-[#0f172a] border-gray-700 hover:border-emerald-500 text-gray-200'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Schedule</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-gray-700/50">
            <LayoutTemplate className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold tracking-tight uppercase">
              Display Layout &amp; Typography
            </span>
          </div>

          {/* Segmented Mode Tabs */}
          <div
            className={`inline-flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-[#0b1120] border-[#1e293b]' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveConfigTab('layout')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeConfigTab === 'layout'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Layout Sliders (Auto 100%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveConfigTab('typography')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeConfigTab === 'typography'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Item &amp; Sequence Typography</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Context Presets + Reset + Broadcast */}
        <div className="flex items-center gap-1.5">
          {activeConfigTab === 'layout' ? (
            <div className="hidden xl:flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => handleApplyLayoutPreset('default_spec')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${subSurface} hover:border-emerald-500/60`}
              >
                80/10/10 Spec
              </button>
              <button
                type="button"
                onClick={() => handleApplyLayoutPreset('balanced')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${subSurface} hover:border-emerald-500/60`}
              >
                50/30/20 Balanced
              </button>
              <button
                type="button"
                onClick={() => handleApplyLayoutPreset('cinematic')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${subSurface} hover:border-emerald-500/60`}
              >
                Full-Logo Footer
              </button>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-1 mr-1">
              {TYPOGRAPHY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyTypographyPreset(preset)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${subSurface} hover:border-emerald-500/60`}
                  title={preset.desc}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onResetToDefault}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#0f172a] border-gray-700 hover:border-gray-500 text-gray-300'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700'
            }`}
            title="Reset layout and typography to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullscreenDisplay}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Broadcast</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* MAIN SIDE-BY-SIDE WORKSPACE (7 COLS CONTROLS / 5 COLS LIVE PREVIEW) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
        {/* ================================================================= */}
        {/* LEFT 7 COLUMNS: INTERACTIVE SLIDERS OR TYPOGRAPHY STUDIO          */}
        {/* ================================================================= */}
        <div className="col-span-12 lg:col-span-7 h-full min-h-0 flex flex-col justify-between gap-2.5 overflow-hidden">
          {activeConfigTab === 'layout' ? (
            <>
              {/* CARD 1: VERTICAL ROW PROPORTIONS (Header + Content + Footer = 100%) */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        1. Vertical Row Proportions (3 Rows)
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Adjusting any row automatically balances the other rows to equal 100%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDisplayLayout?.({ showHeader: !displayLayout.showHeader })
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer flex items-center gap-1 transition-colors ${
                        displayLayout.showHeader !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5" />
                      <span>Header: {displayLayout.showHeader !== false ? 'ON' : 'OFF'}</span>
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tabular-nums">
                      Total: {verticalSum}%
                    </span>
                  </div>
                </div>

                {/* Live Stacked Proportion Bar */}
                <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black/40 p-0.5 gap-0.5 my-1">
                  <div
                    style={{ width: `${displayLayout.vertical.headerPercent}%` }}
                    className="h-full bg-emerald-500 rounded-l-full transition-all duration-150"
                    title={`Header: ${displayLayout.vertical.headerPercent}%`}
                  />
                  <div
                    style={{ width: `${displayLayout.vertical.contentPercent}%` }}
                    className="h-full bg-sky-500 transition-all duration-150"
                    title={`Content: ${displayLayout.vertical.contentPercent}%`}
                  />
                  <div
                    style={{ width: `${displayLayout.vertical.footerPercent}%` }}
                    className="h-full bg-amber-500 rounded-r-full transition-all duration-150"
                    title={`Footer: ${displayLayout.vertical.footerPercent}%`}
                  />
                </div>

                {/* 3 Vertical Sliders in Compact Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      idx: 0 as const,
                      label: 'Header Row',
                      sub: 'Top Marquee',
                      val: displayLayout.vertical.headerPercent,
                      color: 'text-emerald-400',
                      accent: 'accent-emerald-500'
                    },
                    {
                      idx: 1 as const,
                      label: 'Content Row',
                      sub: 'Main Dish Stage',
                      val: displayLayout.vertical.contentPercent,
                      color: 'text-sky-400',
                      accent: 'accent-sky-500'
                    },
                    {
                      idx: 2 as const,
                      label: 'Footer Row',
                      sub: 'Time · Temp · Logo',
                      val: displayLayout.vertical.footerPercent,
                      color: 'text-amber-400',
                      accent: 'accent-amber-500'
                    }
                  ].map((s) => (
                    <div key={s.label} className={`p-2 rounded-lg border ${subSurface}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-[11px] font-bold block leading-tight">
                            {s.label}
                          </span>
                          <span className="text-[9px] text-gray-400 block">{s.sub}</span>
                        </div>
                        <span className={`text-xs font-mono font-black tabular-nums ${s.color}`}>
                          {s.val}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleVerticalSlider(s.idx, s.val - 1)}
                          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer"
                          title="Decrease 1%"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={1}
                          value={s.val}
                          onChange={(e) => handleVerticalSlider(s.idx, Number(e.target.value))}
                          className={`w-full h-1.5 rounded-lg cursor-pointer ${s.accent}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleVerticalSlider(s.idx, s.val + 1)}
                          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer"
                          title="Increase 1%"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: HORIZONTAL CONTENT ROW COLUMNS (Image 80% + Details 10% + QR 10% = 100%) */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        2. Content Row Horizontal Columns (3 Columns)
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Left: Product Image · Middle: Item # &amp; Dish Name · Right: QR Code &amp; SEQ #
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 tabular-nums">
                    Total: {contentSum}%
                  </span>
                </div>

                {/* Live Stacked Proportion Bar */}
                <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black/40 p-0.5 gap-0.5 my-1">
                  <div
                    style={{ width: `${displayLayout.contentHorizontal.productImagePercent}%` }}
                    className="h-full bg-sky-500 rounded-l-full transition-all duration-150"
                  />
                  <div
                    style={{ width: `${displayLayout.contentHorizontal.itemDetailsPercent}%` }}
                    className="h-full bg-amber-500 transition-all duration-150"
                  />
                  <div
                    style={{ width: `${displayLayout.contentHorizontal.qrCodePercent}%` }}
                    className="h-full bg-rose-500 rounded-r-full transition-all duration-150"
                  />
                </div>

                {/* 3 Content Column Sliders */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      idx: 0 as const,
                      label: 'Left: Dish Image',
                      sub: 'Product Photo',
                      val: displayLayout.contentHorizontal.productImagePercent,
                      color: 'text-sky-400',
                      accent: 'accent-sky-500'
                    },
                    {
                      idx: 1 as const,
                      label: 'Middle: Item Info',
                      sub: 'Item # & Title',
                      val: displayLayout.contentHorizontal.itemDetailsPercent,
                      color: 'text-amber-400',
                      accent: 'accent-amber-500'
                    },
                    {
                      idx: 2 as const,
                      label: 'Right: QR & SEQ',
                      sub: 'Scan QR + SEQ #',
                      val: displayLayout.contentHorizontal.qrCodePercent,
                      color: 'text-rose-400',
                      accent: 'accent-rose-500'
                    }
                  ].map((s) => (
                    <div key={s.label} className={`p-2 rounded-lg border ${subSurface}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-[11px] font-bold block leading-tight">
                            {s.label}
                          </span>
                          <span className="text-[9px] text-gray-400 block">{s.sub}</span>
                        </div>
                        <span className={`text-xs font-mono font-black tabular-nums ${s.color}`}>
                          {s.val}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleContentColSlider(s.idx, s.val - 1)}
                          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={1}
                          value={s.val}
                          onChange={(e) => handleContentColSlider(s.idx, Number(e.target.value))}
                          className={`w-full h-1.5 rounded-lg cursor-pointer ${s.accent}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleContentColSlider(s.idx, s.val + 1)}
                          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: FOOTER HORIZONTAL SECTIONS + DATE & TIME / TEMPERATURE ON-OFF TOGGLES */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        3. Footer Row Section Splits &amp; Widget Toggles
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Toggle Date &amp; Time or Temperature ON/OFF — active sections auto-expand to 100%
                      </p>
                    </div>
                  </div>

                  {/* Date & Time ON/OFF + Temperature ON/OFF Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleToggleDateTime}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-all ${
                        showDateTime
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
                      }`}
                      title="Toggle Date & Time display in footer"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Date &amp; Time: {showDateTime ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleTemperature}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-all ${
                        showTemperature
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-xs'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
                      }`}
                      title="Toggle Temperature display in footer"
                    >
                      <Thermometer className="w-3 h-3" />
                      <span>Temperature: {showTemperature ? 'ON' : 'OFF'}</span>
                    </button>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 tabular-nums">
                      {footerEffectiveSum}%
                    </span>
                  </div>
                </div>

                {/* Live Stacked Proportion Bar (Reflects Auto-Expanded Effective Widths) */}
                <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black/40 p-0.5 gap-0.5 my-1">
                  {showDateTime && effFooterDT > 0 && (
                    <div
                      style={{ width: `${effFooterDT}%` }}
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-150"
                      title={`Date & Time: ${effFooterDT}%`}
                    />
                  )}
                  {showTemperature && effFooterTemp > 0 && (
                    <div
                      style={{ width: `${effFooterTemp}%` }}
                      className="h-full bg-sky-500 transition-all duration-150"
                      title={`Temperature: ${effFooterTemp}%`}
                    />
                  )}
                  <div
                    style={{ width: `${effFooterLogo}%` }}
                    className="h-full bg-amber-500 rounded-r-full transition-all duration-150"
                    title={`HSB Logo: ${effFooterLogo}%`}
                  />
                </div>

                {/* 3 Footer Section Sliders */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Left: Date & Time */}
                  <div
                    className={`p-2 rounded-lg border transition-opacity ${subSurface} ${
                      !showDateTime ? 'opacity-55' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[11px] font-bold block leading-tight">
                          Left: Date &amp; Time
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleDateTime}
                          className={`text-[9px] font-bold underline cursor-pointer ${
                            showDateTime ? 'text-emerald-400' : 'text-gray-400'
                          }`}
                        >
                          {showDateTime ? 'Active (Click to Hide)' : 'Hidden (Click to Show)'}
                        </button>
                      </div>
                      <span className="text-xs font-mono font-black tabular-nums text-emerald-400">
                        {showDateTime ? `${effFooterDT}%` : 'OFF'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!showDateTime}
                        onClick={() =>
                          handleFooterSlider(0, displayLayout.footerHorizontal.dateTimePercent - 1)
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <input
                        type="range"
                        min={5}
                        max={90}
                        step={1}
                        disabled={!showDateTime}
                        value={displayLayout.footerHorizontal.dateTimePercent}
                        onChange={(e) => handleFooterSlider(0, Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-emerald-500 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={!showDateTime}
                        onClick={() =>
                          handleFooterSlider(0, displayLayout.footerHorizontal.dateTimePercent + 1)
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle: Temperature */}
                  <div
                    className={`p-2 rounded-lg border transition-opacity ${subSurface} ${
                      !showTemperature ? 'opacity-55' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[11px] font-bold block leading-tight">
                          Middle: Temperature
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleTemperature}
                          className={`text-[9px] font-bold underline cursor-pointer ${
                            showTemperature ? 'text-sky-400' : 'text-gray-400'
                          }`}
                        >
                          {showTemperature ? 'Active (Click to Hide)' : 'Hidden (Click to Show)'}
                        </button>
                      </div>
                      <span className="text-xs font-mono font-black tabular-nums text-sky-400">
                        {showTemperature ? `${effFooterTemp}%` : 'OFF'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!showTemperature}
                        onClick={() =>
                          handleFooterSlider(
                            1,
                            displayLayout.footerHorizontal.temperaturePercent - 1
                          )
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <input
                        type="range"
                        min={5}
                        max={90}
                        step={1}
                        disabled={!showTemperature}
                        value={displayLayout.footerHorizontal.temperaturePercent}
                        onChange={(e) => handleFooterSlider(1, Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-sky-500 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={!showTemperature}
                        onClick={() =>
                          handleFooterSlider(
                            1,
                            displayLayout.footerHorizontal.temperaturePercent + 1
                          )
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right: HSB Brand Logo */}
                  <div className={`p-2 rounded-lg border ${subSurface}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[11px] font-bold block leading-tight">
                          Right: HSB Logo
                        </span>
                        <span className="text-[9px] text-amber-400/90 font-semibold block">
                          {!showDateTime || !showTemperature
                            ? 'Auto-Expanded'
                            : 'Brand & Branch'}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black tabular-nums text-amber-400">
                        {effFooterLogo}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!showDateTime && !showTemperature}
                        onClick={() =>
                          handleFooterSlider(2, displayLayout.footerHorizontal.logoPercent - 1)
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <input
                        type="range"
                        min={5}
                        max={90}
                        step={1}
                        disabled={!showDateTime && !showTemperature}
                        value={displayLayout.footerHorizontal.logoPercent}
                        onChange={(e) => handleFooterSlider(2, Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-amber-500 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={!showDateTime && !showTemperature}
                        onClick={() =>
                          handleFooterSlider(2, displayLayout.footerHorizontal.logoPercent + 1)
                        }
                        className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 cursor-pointer disabled:opacity-40"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* =============================================================== */
            /* TAB 2: ENHANCED ITEM, TITLE & SEQUENCE TYPOGRAPHY STUDIO        */
            /* =============================================================== */
            <>
              {/* TYPOGRAPHY CARD 1: ITEM NUMBER BADGE (#095), STROKE & GLOW */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Type className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        1. Item Number Badge (#{previewItem?.itemNumber || '095'}) &amp; Border Stroke
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Font size, radius, border stroke, glow effect, family &amp; weight
                      </p>
                    </div>
                  </div>

                  {/* Quick Typography Preset Pills + Live Specimen */}
                  <div className="flex items-center gap-1.5">
                    <div className="hidden sm:flex items-center gap-1 mr-1">
                      {TYPOGRAPHY_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyTypographyPreset(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors ${subSurface} hover:border-emerald-500/60`}
                          title={p.desc}
                        >
                          {p.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>

                    <div
                      className="px-2.5 py-0.5 text-xs transition-all"
                      style={{
                        backgroundColor: itemBadgeStyle.backgroundColor,
                        color: itemBadgeStyle.textColor || '#FFFFFF',
                        borderRadius: `${Math.min(14, itemBadgeStyle.borderRadius)}px`,
                        border:
                          (itemBadgeStyle.borderWidth || 0) > 0
                            ? `${Math.min(3, itemBadgeStyle.borderWidth || 0)}px solid ${
                                itemBadgeStyle.borderColor || '#FFFFFF'
                              }`
                            : 'none',
                        fontFamily: getFontFamilyStyle(itemBadgeStyle.fontFamily),
                        fontWeight: getFontWeightVal(itemBadgeStyle.fontWeight),
                        letterSpacing: getLetterSpacingCss(itemBadgeStyle.letterSpacing),
                        boxShadow: getBadgeShadowCss(
                          itemBadgeStyle.textShadow,
                          itemBadgeStyle.backgroundColor
                        )
                      }}
                    >
                      {previewItem?.itemNumber || '095'}
                    </div>
                  </div>
                </div>

                {/* Sliders + Stroke + Font Controls */}
                <div className="grid grid-cols-12 gap-2 my-auto py-1">
                  {/* Number Size */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Badge Size</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {itemBadgeStyle.fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={24}
                      max={84}
                      value={itemBadgeStyle.fontSize}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ fontSize: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Corner Radius */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Radius</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {itemBadgeStyle.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={36}
                      value={itemBadgeStyle.borderRadius}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ borderRadius: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Border Stroke Width + Color */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Stroke</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-amber-400">
                          {itemBadgeStyle.borderWidth || 0}px
                        </span>
                        <input
                          type="color"
                          value={itemBadgeStyle.borderColor || '#FFFFFF'}
                          onChange={(e) =>
                            onUpdateItemBadgeStyle?.({ borderColor: e.target.value })
                          }
                          className="w-3.5 h-3.5 rounded cursor-pointer border-0 bg-transparent p-0"
                          title="Stroke Colour"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      step={1}
                      value={itemBadgeStyle.borderWidth || 0}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ borderWidth: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Label Font Size */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Label Size</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {itemBadgeStyle.labelFontSize || 16}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={32}
                      value={itemBadgeStyle.labelFontSize || 16}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ labelFontSize: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Row 2: Font Family, Weight, Shadow/Glow, Colours */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Badge Font
                    </label>
                    <select
                      value={itemBadgeStyle.fontFamily}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({
                          fontFamily: e.target.value as ItemBadgeConfig['fontFamily']
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="sans">Sans-Serif</option>
                      <option value="impact">Impact Heavy</option>
                      <option value="mono">Monospace</option>
                      <option value="serif">Serif Classic</option>
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Weight
                    </label>
                    <select
                      value={itemBadgeStyle.fontWeight}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({
                          fontWeight: e.target.value as ItemBadgeConfig['fontWeight']
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="normal">Normal (400)</option>
                      <option value="semibold">Semi-Bold (600)</option>
                      <option value="bold">Bold (700)</option>
                      <option value="bolder">Extra-Bold (800)</option>
                      <option value="black">Black (900)</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Badge Background &amp; Text Colours
                    </label>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {COLOR_PRESETS.slice(0, 7).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => onUpdateItemBadgeStyle?.({ backgroundColor: color })}
                            className={`w-4.5 h-4.5 rounded border transition-transform cursor-pointer ${
                              itemBadgeStyle.backgroundColor.toLowerCase() === color.toLowerCase()
                                ? 'scale-110 border-white ring-1 ring-emerald-400'
                                : 'border-white/20 opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input
                          type="color"
                          value={itemBadgeStyle.backgroundColor}
                          onChange={(e) =>
                            onUpdateItemBadgeStyle?.({ backgroundColor: e.target.value })
                          }
                          className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                        />
                      </div>

                      <div className="flex items-center gap-1 pl-2 border-l border-gray-700">
                        <span className="text-[10px] text-gray-400">Text:</span>
                        <input
                          type="color"
                          value={itemBadgeStyle.textColor || '#FFFFFF'}
                          onChange={(e) =>
                            onUpdateItemBadgeStyle?.({ textColor: e.target.value })
                          }
                          className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TYPOGRAPHY CARD 2: PRODUCT TITLE, SUBTITLE, TRACKING & SHADOW/GLOW */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        2. Product Name, Letter-Spacing &amp; Glow Effects
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Title &amp; subtitle sizing, letter tracking, shadow/glow &amp; colours
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-black uppercase truncate max-w-[180px]"
                    style={{
                      color: itemBadgeStyle.titleColor || '#FFFFFF',
                      fontFamily: getFontFamilyStyle(
                        itemBadgeStyle.titleFontFamily || itemBadgeStyle.fontFamily
                      ),
                      letterSpacing: getLetterSpacingCss(itemBadgeStyle.letterSpacing)
                    }}
                  >
                    {previewItem?.name || 'Bottled Water'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 my-auto py-1">
                  {/* Product Title Font Size */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Title Size</span>
                      <span className="font-mono font-bold text-amber-400">
                        {itemBadgeStyle.titleFontSize || 44}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={72}
                      value={itemBadgeStyle.titleFontSize || 44}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ titleFontSize: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Subtitle Font Size */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Subtitle Size</span>
                      <span className="font-mono font-bold text-amber-400">
                        {itemBadgeStyle.subtitleFontSize || 22}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={40}
                      value={itemBadgeStyle.subtitleFontSize || 22}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({ subtitleFontSize: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Letter Spacing
                    </label>
                    <select
                      value={itemBadgeStyle.letterSpacing || 'normal'}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({
                          letterSpacing: e.target.value as TypographyLetterSpacing
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="tight">Tight (-0.03em)</option>
                      <option value="normal">Normal (0em)</option>
                      <option value="wide">Wide (+0.07em)</option>
                      <option value="expanded">Expanded (+0.15em)</option>
                    </select>
                  </div>

                  {/* Shadow / Glow Effect */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Shadow / Glow
                    </label>
                    <select
                      value={itemBadgeStyle.textShadow || 'glow'}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({
                          textShadow: e.target.value as TypographyShadowEffect
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="none">None (Flat)</option>
                      <option value="soft">Soft Drop Shadow</option>
                      <option value="glow">Ambient Glow</option>
                      <option value="neon">Neon Halo</option>
                    </select>
                  </div>

                  {/* Row 2: Title Font Family, Label Text, Title & Subtitle Colours */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Title Font
                    </label>
                    <select
                      value={itemBadgeStyle.titleFontFamily || itemBadgeStyle.fontFamily || 'sans'}
                      onChange={(e) =>
                        onUpdateItemBadgeStyle?.({
                          titleFontFamily: e.target.value as ItemBadgeConfig['fontFamily']
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="sans">Sans-Serif</option>
                      <option value="impact">Impact Heavy</option>
                      <option value="serif">Serif Classic</option>
                      <option value="mono">Monospace</option>
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Label Text
                    </label>
                    <input
                      type="text"
                      value={itemBadgeStyle.label || 'Item #'}
                      onChange={(e) => onUpdateItemBadgeStyle?.({ label: e.target.value })}
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    />
                  </div>

                  <div className="col-span-6 flex items-center justify-between gap-2 pt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Title:</span>
                      {TEXT_COLOR_PRESETS.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateItemBadgeStyle?.({ titleColor: c })}
                          className={`w-4.5 h-4.5 rounded border cursor-pointer ${
                            (itemBadgeStyle.titleColor || '#FFFFFF').toLowerCase() ===
                            c.toLowerCase()
                              ? 'scale-110 border-emerald-400 ring-1 ring-emerald-400'
                              : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="color"
                        value={itemBadgeStyle.titleColor || '#FFFFFF'}
                        onChange={(e) => onUpdateItemBadgeStyle?.({ titleColor: e.target.value })}
                        className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-gray-700">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Sub:</span>
                      <input
                        type="color"
                        value={itemBadgeStyle.subtitleColor || '#FFFFFF'}
                        onChange={(e) =>
                          onUpdateItemBadgeStyle?.({ subtitleColor: e.target.value })
                        }
                        className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TYPOGRAPHY CARD 3: SEQUENCE NUMBER BADGE (SEQ - #3) STYLING */}
              <div
                className={`flex-1 min-h-0 rounded-xl border p-3 flex flex-col justify-between overflow-hidden ${cardSurface}`}
              >
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <QrCode className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        3. Sequence Number Badge ({sequenceBadgeStyle.prefix}3) &amp; Stroke
                      </h3>
                      <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Size, radius, stroke, letter-spacing &amp; colours below the QR code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSequenceBadgeStyle?.({
                          showBadge: !sequenceBadgeStyle.showBadge
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                        sequenceBadgeStyle.showBadge
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}
                    >
                      {sequenceBadgeStyle.showBadge ? 'Visible' : 'Hidden'}
                    </button>

                    <div
                      className="px-2.5 py-0.5 text-xs shadow-sm transition-all"
                      style={{
                        backgroundColor: sequenceBadgeStyle.backgroundColor,
                        color: sequenceBadgeStyle.textColor || '#FFFFFF',
                        borderRadius: `${sequenceBadgeStyle.borderRadius}px`,
                        border:
                          (sequenceBadgeStyle.borderWidth || 0) > 0
                            ? `${sequenceBadgeStyle.borderWidth}px solid ${
                                sequenceBadgeStyle.borderColor || '#FFFFFF'
                              }`
                            : 'none',
                        fontFamily: getFontFamilyStyle(sequenceBadgeStyle.fontFamily),
                        fontWeight: getFontWeightVal(sequenceBadgeStyle.fontWeight),
                        letterSpacing: getLetterSpacingCss(sequenceBadgeStyle.letterSpacing)
                      }}
                    >
                      {sequenceBadgeStyle.prefix}3
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 my-auto py-1">
                  {/* Font Size */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">SEQ Size</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {sequenceBadgeStyle.fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={28}
                      value={sequenceBadgeStyle.fontSize}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({ fontSize: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Corner Radius */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Radius</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {sequenceBadgeStyle.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      value={sequenceBadgeStyle.borderRadius}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({ borderRadius: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* SEQ Stroke Width + Color */}
                  <div className={`col-span-3 p-1.5 rounded-lg border ${subSurface}`}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-gray-300">Stroke</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-amber-400">
                          {sequenceBadgeStyle.borderWidth || 0}px
                        </span>
                        <input
                          type="color"
                          value={sequenceBadgeStyle.borderColor || '#FFFFFF'}
                          onChange={(e) =>
                            onUpdateSequenceBadgeStyle?.({ borderColor: e.target.value })
                          }
                          className="w-3.5 h-3.5 rounded cursor-pointer border-0 bg-transparent p-0"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      step={1}
                      value={sequenceBadgeStyle.borderWidth || 0}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({ borderWidth: Number(e.target.value) })
                      }
                      className="w-full h-1.5 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Prefix Text */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Prefix Text
                    </label>
                    <input
                      type="text"
                      value={sequenceBadgeStyle.prefix}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({ prefix: e.target.value })
                      }
                      className={`w-full px-2 py-1 text-xs font-mono rounded-lg border focus:outline-none ${inputSurface}`}
                    />
                  </div>

                  {/* Row 2: Font Family, Letter-Spacing, Colours */}
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      SEQ Font
                    </label>
                    <select
                      value={sequenceBadgeStyle.fontFamily}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({
                          fontFamily: e.target.value as SequenceBadgeConfig['fontFamily']
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="sans">Sans-Serif</option>
                      <option value="impact">Impact Heavy</option>
                      <option value="mono">Monospace</option>
                      <option value="serif">Serif</option>
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                      Spacing
                    </label>
                    <select
                      value={sequenceBadgeStyle.letterSpacing || 'normal'}
                      onChange={(e) =>
                        onUpdateSequenceBadgeStyle?.({
                          letterSpacing: e.target.value as TypographyLetterSpacing
                        })
                      }
                      className={`w-full px-2 py-1 text-xs rounded-lg border focus:outline-none ${inputSurface}`}
                    >
                      <option value="tight">Tight</option>
                      <option value="normal">Normal</option>
                      <option value="wide">Wide</option>
                      <option value="expanded">Expanded</option>
                    </select>
                  </div>

                  <div className="col-span-6 flex items-center justify-between gap-1 pt-3">
                    <div className="flex items-center gap-1">
                      {COLOR_PRESETS.slice(0, 6).map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            onUpdateSequenceBadgeStyle?.({ backgroundColor: color })
                          }
                          className={`w-4.5 h-4.5 rounded border transition-transform cursor-pointer ${
                            sequenceBadgeStyle.backgroundColor.toLowerCase() ===
                            color.toLowerCase()
                              ? 'scale-110 border-white ring-1 ring-emerald-400'
                              : 'border-white/20 opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={sequenceBadgeStyle.backgroundColor}
                        onChange={(e) =>
                          onUpdateSequenceBadgeStyle?.({ backgroundColor: e.target.value })
                        }
                        className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-gray-700">
                      <span className="text-[10px] text-gray-400">Text:</span>
                      <input
                        type="color"
                        value={sequenceBadgeStyle.textColor || '#FFFFFF'}
                        onChange={(e) =>
                          onUpdateSequenceBadgeStyle?.({ textColor: e.target.value })
                        }
                        className="w-4.5 h-4.5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT 5 COLUMNS: LIVE DISPLAY PREVIEW + INTERACTIVE BLUEPRINT MAP */}
        {/* ================================================================= */}
        <div
          className={`col-span-12 lg:col-span-5 h-full min-h-0 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
        >
          {/* Preview Header with Quick Widget Status */}
          <div className="flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Live Display Output Preview
                </h3>
                <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Real-time 16:9 signage canvas with active proportions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleDateTime}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  showDateTime
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isDark
                    ? 'bg-[#0f172a] border-gray-700 text-gray-500'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
                title="Toggle Date & Time ON/OFF"
              >
                <Clock className="w-3 h-3" />
                <span>{showDateTime ? 'Time ON' : 'Time OFF'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleTemperature}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  showTemperature
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                    : isDark
                    ? 'bg-[#0f172a] border-gray-700 text-gray-500'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
                title="Toggle Temperature ON/OFF"
              >
                <Thermometer className="w-3 h-3" />
                <span>{showTemperature ? 'Temp ON' : 'Temp OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGuides((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  showGuides
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isDark
                    ? 'bg-[#0f172a] border-gray-700 text-gray-400'
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                title="Toggle live layout grid guides on preview"
              >
                <Grid className="w-3 h-3" />
                <span>Guides</span>
              </button>
            </div>
          </div>

          {/* Live 16:9 Display Preview */}
          <div className="my-auto py-1">
            <div className="w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <TVDisplayPreview
                config={config}
                currentItem={previewItem}
                mode="preview"
                sequenceNumber={previewItemIdx + 1}
                showLayoutGuides={showGuides}
              />
            </div>

            {/* Test Slide Switcher Strip */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">
                Preview Dish:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {items.map((it, idx) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setPreviewItemIdx(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      previewItemIdx === idx
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-[#0f172a] text-gray-400 hover:text-white border border-gray-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{it.itemNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive 2D Wireframe Blueprint Map of Current Proportions */}
          <div className={`p-2.5 rounded-xl border space-y-1.5 flex-shrink-0 ${subSurface}`}>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span>Active Layout Matrix (100% × 100%)</span>
              <span className="text-emerald-400 font-mono">
                Footer: {showDateTime ? `Time ${effFooterDT}% · ` : ''}
                {showTemperature ? `Temp ${effFooterTemp}% · ` : ''}
                Logo {effFooterLogo}%
              </span>
            </div>

            {/* Mini Visual Wireframe Box */}
            <div className="w-full h-24 rounded-lg border border-gray-700/80 bg-[#070b14] overflow-hidden flex flex-col text-[9px] font-mono font-bold text-white/90">
              {/* Wireframe Header */}
              {displayLayout.showHeader !== false && (
                <div
                  style={{ height: `${displayLayout.vertical.headerPercent}%` }}
                  className="w-full bg-emerald-500/20 border-b border-emerald-500/40 flex items-center justify-center text-emerald-300 truncate px-2 transition-all duration-150"
                >
                  HEADER ({displayLayout.vertical.headerPercent}%)
                </div>
              )}

              {/* Wireframe Content 3 Columns */}
              <div
                style={{
                  height: `${
                    displayLayout.showHeader !== false
                      ? displayLayout.vertical.contentPercent
                      : displayLayout.vertical.contentPercent +
                        displayLayout.vertical.headerPercent
                  }%`
                }}
                className="w-full flex border-b border-gray-700/80 overflow-hidden transition-all duration-150"
              >
                <div
                  style={{ width: `${displayLayout.contentHorizontal.productImagePercent}%` }}
                  className="h-full bg-sky-500/20 border-r border-sky-500/40 flex items-center justify-center text-sky-300 truncate px-1 transition-all duration-150"
                >
                  IMG {displayLayout.contentHorizontal.productImagePercent}%
                </div>
                <div
                  style={{ width: `${displayLayout.contentHorizontal.itemDetailsPercent}%` }}
                  className="h-full bg-amber-500/20 border-r border-amber-500/40 flex items-center justify-center text-amber-300 truncate px-1 transition-all duration-150"
                >
                  #{previewItem?.itemNumber} {displayLayout.contentHorizontal.itemDetailsPercent}%
                </div>
                <div
                  style={{ width: `${displayLayout.contentHorizontal.qrCodePercent}%` }}
                  className="h-full bg-rose-500/20 flex items-center justify-center text-rose-300 truncate px-1 transition-all duration-150"
                >
                  QR {displayLayout.contentHorizontal.qrCodePercent}%
                </div>
              </div>

              {/* Wireframe Footer (Auto-expands when Date/Time or Temp is OFF) */}
              <div
                style={{ height: `${displayLayout.vertical.footerPercent}%` }}
                className="w-full flex overflow-hidden transition-all duration-150"
              >
                {showDateTime && effFooterDT > 0 && (
                  <div
                    style={{ width: `${effFooterDT}%` }}
                    className="h-full bg-emerald-500/15 border-r border-gray-700 flex items-center justify-center text-emerald-300 truncate transition-all duration-150"
                  >
                    TIME {effFooterDT}%
                  </div>
                )}
                {showTemperature && effFooterTemp > 0 && (
                  <div
                    style={{ width: `${effFooterTemp}%` }}
                    className="h-full bg-sky-500/15 border-r border-gray-700 flex items-center justify-center text-sky-300 truncate transition-all duration-150"
                  >
                    TEMP {effFooterTemp}%
                  </div>
                )}
                <div
                  style={{ width: `${effFooterLogo}%` }}
                  className="h-full bg-amber-500/15 flex items-center justify-center text-amber-300 truncate px-1 transition-all duration-150"
                >
                  SARAVANAA LOGO ({effFooterLogo}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
