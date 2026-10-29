import React, { useState } from 'react';
import {
  Tv,
  RotateCcw,
  Check,
  Maximize2,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import {
  AppConfig,
  TVScreenDesignConfig,
  QRStylePattern,
  QREffect,
  BackgroundStyle,
  BannerBorder,
  BannerShadow
} from '../types/tvConfig';
import { COLOR_PALETTE } from '../data/defaultConfig';
import { TVDisplayPreview } from './TVDisplayPreview';

interface TVScreenDesignEditorProps {
  config: AppConfig;
  onUpdateScreenDesign: (design: Partial<TVScreenDesignConfig>) => void;
  onResetToDefault: () => void;
  onSaveDesign: () => void;
  onOpenFullscreenTV: () => void;
  onSelectActiveItem: (index: number) => void;
}

export const TVScreenDesignEditor: React.FC<TVScreenDesignEditorProps> = ({
  config,
  onUpdateScreenDesign,
  onResetToDefault,
  onSaveDesign,
  onOpenFullscreenTV,
  onSelectActiveItem
}) => {
  const { screenDesign, items, playlist } = config;
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSaveDesign();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const updateBackground = (
    updated: Partial<TVScreenDesignConfig['background']>
  ) => {
    onUpdateScreenDesign({
      background: { ...screenDesign.background, ...updated }
    });
  };

  const updateQR = (updated: Partial<TVScreenDesignConfig['qrCode']>) => {
    onUpdateScreenDesign({
      qrCode: { ...screenDesign.qrCode, ...updated }
    });
  };

  const updateBannerFrame = (
    updated: Partial<TVScreenDesignConfig['bannerFrame']>
  ) => {
    onUpdateScreenDesign({
      bannerFrame: { ...screenDesign.bannerFrame, ...updated }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 mb-6">
      {/* Header with Title, Default & Save Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tv className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              TV screen design
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            The screen's background, the menu QR and the banner's frame. Left as
            they are, the TVs use a clean dark design.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetToDefault}
            className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {justSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved
              </>
            ) : (
              'Save design'
            )}
          </button>
        </div>
      </div>

      {/* Main 2-column layout: Left Controls, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Controls Column (takes 6 cols) */}
        <div className="lg:col-span-6 space-y-7">
          {/* SECTION 1: BACKGROUND */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Background
            </h3>

            {/* Style Segmented Buttons */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Style
              </label>
              <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200 w-full sm:w-auto">
                {(
                  [
                    { id: 'solid', label: 'Solid' },
                    { id: 'moving_gradient', label: 'Moving gradient' },
                    { id: 'ambient', label: 'Ambient' }
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateBackground({ style: s.id })}
                    className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      screenDesign.background.style === s.id
                        ? 'bg-white text-gray-900 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Palette & Custom Hex */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Colour
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => updateBackground({ color: c.hex })}
                    className={`w-7 h-7 rounded-md border transition-transform cursor-pointer ${
                      screenDesign.background.color.toLowerCase() ===
                      c.hex.toLowerCase()
                        ? 'ring-2 ring-emerald-500 scale-110 shadow-sm'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}

                {/* Custom Hex input */}
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 ml-2">
                  <div
                    className="w-3.5 h-3.5 rounded-sm border border-gray-300"
                    style={{ backgroundColor: screenDesign.background.color }}
                  />
                  <input
                    type="text"
                    value={screenDesign.background.color}
                    onChange={(e) => updateBackground({ color: e.target.value })}
                    className="w-20 text-xs font-mono uppercase bg-transparent focus:outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Ambient Glow customizer if in Ambient or Moving Gradient mode */}
              {screenDesign.background.style !== 'solid' && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200/80 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-600 font-medium">
                    Glow Accent:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={screenDesign.background.ambientGlowColor}
                      onChange={(e) =>
                        updateBackground({ ambientGlowColor: e.target.value })
                      }
                      className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                    />
                    <span className="text-xs font-mono text-gray-600">
                      {screenDesign.background.ambientGlowColor}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: MENU QR CODE */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Menu QR Code
            </h3>

            {/* Pattern Selectors with mini visual previews */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Pattern
              </label>
              <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                {(
                  [
                    { id: 'rounded', label: 'Rounded' },
                    { id: 'square', label: 'Square' },
                    { id: 'dotted', label: 'Dotted' },
                    { id: 'dashed', label: 'Dashed' }
                  ] as const
                ).map((p) => {
                  const isSelected = screenDesign.qrCode.pattern === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateQR({ pattern: p.id })}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Mini visual QR pattern sketch */}
                      <div className="w-10 h-10 mb-1.5 flex items-center justify-center">
                        <svg viewBox="0 0 20 20" className="w-8 h-8">
                          {p.id === 'rounded' && (
                            <>
                              <rect
                                x="2"
                                y="2"
                                width="5"
                                height="5"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="13"
                                y="2"
                                width="5"
                                height="5"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="2"
                                y="13"
                                width="5"
                                height="5"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <circle
                                cx="11"
                                cy="11"
                                r="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="14"
                                y="14"
                                width="3"
                                height="3"
                                rx="1"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                            </>
                          )}
                          {p.id === 'square' && (
                            <>
                              <rect
                                x="2"
                                y="2"
                                width="5"
                                height="5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="13"
                                y="2"
                                width="5"
                                height="5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="2"
                                y="13"
                                width="5"
                                height="5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="10"
                                y="10"
                                width="3"
                                height="3"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="14"
                                y="14"
                                width="3"
                                height="3"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                            </>
                          )}
                          {p.id === 'dotted' && (
                            <>
                              <circle
                                cx="4.5"
                                cy="4.5"
                                r="2.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <circle
                                cx="15.5"
                                cy="4.5"
                                r="2.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <circle
                                cx="4.5"
                                cy="15.5"
                                r="2.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <circle
                                cx="11"
                                cy="11"
                                r="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <circle
                                cx="15"
                                cy="15"
                                r="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                            </>
                          )}
                          {p.id === 'dashed' && (
                            <>
                              <rect
                                x="2"
                                y="3"
                                width="6"
                                height="3"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="12"
                                y="3"
                                width="6"
                                height="3"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="2"
                                y="14"
                                width="6"
                                height="3"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="10"
                                y="10"
                                width="5"
                                height="2"
                                rx="1"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                              <rect
                                x="12"
                                y="14"
                                width="6"
                                height="3"
                                rx="1.5"
                                fill={isSelected ? '#059669' : '#374151'}
                              />
                            </>
                          )}
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium text-gray-700">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dot Colour */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Dot colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={screenDesign.qrCode.dotColor}
                  onChange={(e) => updateQR({ dotColor: e.target.value })}
                  className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={screenDesign.qrCode.dotColor.toUpperCase()}
                  onChange={(e) => updateQR({ dotColor: e.target.value })}
                  className="w-28 px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs font-mono uppercase text-gray-800"
                />
              </div>
            </div>

            {/* Card (Behind the code) */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Card <span className="text-gray-400 font-normal">Behind the code</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screenDesign.qrCode.isTransparent}
                    onChange={(e) =>
                      updateQR({ isTransparent: e.target.checked })
                    }
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Transparent
                </label>

                {!screenDesign.qrCode.isTransparent && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={screenDesign.qrCode.cardColor}
                      onChange={(e) => updateQR({ cardColor: e.target.value })}
                      className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={screenDesign.qrCode.cardColor.toUpperCase()}
                      onChange={(e) => updateQR({ cardColor: e.target.value })}
                      className="w-24 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs font-mono uppercase text-gray-800"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Effect */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Effect
              </label>
              <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200">
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'shadow', label: 'Shadow' },
                    { id: 'glow', label: 'Glow' },
                    { id: 'neon', label: 'Neon light' }
                  ] as const
                ).map((ef) => (
                  <button
                    key={ef.id}
                    type="button"
                    onClick={() => updateQR({ effect: ef.id })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      screenDesign.qrCode.effect === ef.id
                        ? 'bg-white text-gray-900 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {ef.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: BANNER FRAME */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Banner Frame
            </h3>

            {/* Border Options */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Border
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200 max-w-md">
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'solid', label: 'Solid' },
                    { id: 'dashed', label: 'Dashed' },
                    { id: 'dotted', label: 'Dotted' },
                    { id: 'double', label: 'Double' },
                    { id: 'neon', label: 'Neon' },
                    { id: 'gold', label: 'Gold' }
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateBannerFrame({ border: b.id })}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all text-center cursor-pointer ${
                      screenDesign.bannerFrame.border === b.id
                        ? 'bg-white text-gray-900 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow Options */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shadow
              </label>
              <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200">
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'soft', label: 'Soft' },
                    { id: 'lifted', label: 'Lifted' },
                    { id: 'glow', label: 'Glow' },
                    { id: 'neon', label: 'Neon' }
                  ] as const
                ).map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => updateBannerFrame({ shadow: sh.id })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      screenDesign.bannerFrame.shadow === sh.id
                        ? 'bg-white text-gray-900 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corners Radius Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Corners
                </label>
                <span className="text-xs font-mono font-semibold text-gray-600">
                  {screenDesign.bannerFrame.corners}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={screenDesign.bannerFrame.corners}
                onChange={(e) =>
                  updateBannerFrame({ corners: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Right Preview Column (takes 6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                Preview
              </span>

              {/* Item Carousel Switcher in Preview */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      (playlist.activeItemIndex - 1 + items.length) %
                      items.length;
                    onSelectActiveItem(next);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Previous Dish"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-gray-600 px-1">
                  {playlist.activeItemIndex + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      (playlist.activeItemIndex + 1) % items.length;
                    onSelectActiveItem(next);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Next Dish"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenFullscreenTV}
                  className="ml-2 p-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-1 font-medium transition-colors"
                  title="Open simulated TV screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Full TV
                </button>
              </div>
            </div>

            {/* The Live TV Display Preview Window */}
            <div className="relative group">
              <TVDisplayPreview
                config={config}
                mode="preview"
                sequenceNumber={playlist.activeItemIndex + 1}
              />
            </div>

            <p className="text-[11px] text-gray-400 mt-3 text-center italic">
              A sketch of a landscape TV. Open a TV from the TV schedule page to
              see it with your real slides.
            </p>
          </div>

          {/* Quick Active Slide Picker & Feature Pills */}
          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/70 p-3 rounded-lg border border-gray-200/60">
            <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Switch preview slide:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onSelectActiveItem(idx)}
                  className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                    playlist.activeItemIndex === idx
                      ? 'bg-emerald-600 text-white font-medium shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  #{it.itemNumber} {it.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
