import React, { useState } from 'react';
import {
  Monitor,
  Calendar,
  Clock,
  ChevronRight,
  QrCode,
  Printer,
  ExternalLink
} from 'lucide-react';
import {
  AppConfig,
  TVItem
} from '../types/tvConfig';
import { QRCodeRenderer } from './QRCodeRenderer';

interface OverviewSummaryRowProps {
  config: AppConfig;
  onNavigateToTab: (tab: string, subTab?: string) => void;
  onOpenFullscreenTV: () => void;
  onOpenPrintModal?: () => void;
}

export const OverviewSummaryRow: React.FC<OverviewSummaryRowProps> = ({
  config,
  onNavigateToTab,
  onOpenFullscreenTV,
  onOpenPrintModal
}) => {
  const { displays, items, playlist, branding, screenDesign, theme } = config;
  const isDark = theme === 'dark';

  const onlineCount = displays.filter((d) => d.status === 'online').length;
  const totalDisplays = displays.length;
  const activePercentage =
    totalDisplays > 0 ? Math.round((onlineCount / totalDisplays) * 100) : 0;

  const currentItem = items[playlist.activeItemIndex] || items[0];
  const totalLoopSeconds = items.length * playlist.cycleIntervalSeconds;

  const [hoveredSlide, setHoveredSlide] = useState<TVItem | null>(null);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (activePercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 flex-shrink-0">
      {/* CARD 1: ACTIVE DISPLAYS (Donut Radial Chart + Fleet Breakdown) */}
      <div
        className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
          isDark
            ? 'bg-[#11192b] border-[#1e2a44] hover:border-emerald-500/40'
            : 'bg-white border-gray-200 shadow-xs hover:border-emerald-400'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <Monitor className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Active Displays
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('settings', 'displays_locations')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Metric & Radial Gauge Layout */}
          <div className="flex items-center justify-between gap-3 my-1">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                  {onlineCount}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  / {totalDisplays} Displays
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    onlineCount === totalDisplays
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      onlineCount === totalDisplays
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  {activePercentage}% Live
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400 truncate">Croydon Fleet</span>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke={isDark ? '#1e293b' : '#e2e8f0'}
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-white font-mono">
                  {activePercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fleet Status Indicator Pills */}
        <div
          className={`pt-1.5 border-t mt-1 ${
            isDark ? 'border-gray-800/80' : 'border-gray-100'
          }`}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {displays.map((disp, idx) => {
              const isOnline = disp.status === 'online';
              return (
                <div
                  key={disp.id}
                  onClick={() => onNavigateToTab('settings', 'displays_locations')}
                  className={`py-0.5 px-1.5 rounded-md border text-center transition-all cursor-pointer ${
                    isOnline
                      ? isDark
                        ? 'bg-[#151f35] border-emerald-900/60 hover:border-emerald-500'
                        : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400'
                      : isDark
                      ? 'bg-[#151f35] border-gray-800 text-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                  title={`${disp.serial} - ${disp.name}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                      }`}
                    />
                    <span className="text-[10px] font-bold font-mono text-gray-200">
                      D-0{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD 2: DISPLAY SCHEDULE PLAYLIST */}
      <div
        className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
          isDark
            ? 'bg-[#11192b] border-[#1e2a44] hover:border-emerald-500/40'
            : 'bg-white border-gray-200 shadow-xs hover:border-emerald-400'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Display Schedule
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('tv_content')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Schedule</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Metric & Total Loop Duration */}
          <div className="flex items-center justify-between gap-2 my-1">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                  {items.length}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Slides
                </span>
              </div>

              <div className="flex items-center gap-1 mt-0.5 text-[11px]">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span className="text-gray-400 font-medium font-mono">
                  {totalLoopSeconds}s Loop
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-emerald-400 font-mono">
                  {playlist.cycleIntervalSeconds}s / slide
                </span>
              </div>
            </div>

            {/* Currently Active Playing Dish Pill */}
            <div
              onClick={onOpenFullscreenTV}
              className={`p-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-102 ${
                isDark
                  ? 'bg-[#151f35] border-[#22304d]'
                  : 'bg-gray-50 border-gray-200'
              }`}
              title="Click to view live broadcast simulation"
            >
              <div className="w-7 h-7 rounded-md overflow-hidden bg-black flex-shrink-0 border border-gray-700">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 pr-1">
                <span className="text-[8px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">
                  On Air
                </span>
                <span className="text-[11px] font-bold text-white truncate block max-w-[80px]">
                  #{currentItem.itemNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Timeline Bar Chart: Slides duration & order */}
        <div
          className={`pt-1.5 border-t mt-1 space-y-1 ${
            isDark ? 'border-gray-800/80' : 'border-gray-100'
          }`}
        >
          {/* Segmented Timeline Bar Chart */}
          <div className="h-5 w-full rounded-lg overflow-hidden flex bg-gray-900 border border-gray-800 p-0.5 gap-0.5 shadow-inner">
            {items.map((item, idx) => {
              const isPlaying = playlist.activeItemIndex === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredSlide(item)}
                  onMouseLeave={() => setHoveredSlide(null)}
                  className={`h-full flex-1 rounded transition-all duration-200 relative group cursor-pointer flex items-center justify-center text-[8px] font-bold font-mono text-white ${
                    isPlaying
                      ? 'ring-1 ring-white shadow-xs brightness-110 z-10'
                      : 'hover:brightness-125 opacity-85'
                  }`}
                  style={{
                    backgroundColor: item.badgeColor || '#10b981'
                  }}
                  title={`Slide #${item.itemNumber} ${item.name} (${playlist.cycleIntervalSeconds}s)`}
                >
                  <span className="truncate px-0.5">#{item.itemNumber}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD 3: TABLE MENU QR CODE & POSTERS */}
      <div
        className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
          isDark
            ? 'bg-[#11192b] border-[#1e2a44] hover:border-emerald-500/40'
            : 'bg-white border-gray-200 shadow-xs hover:border-emerald-400'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Table Menu QR Code
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('settings', 'qr')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* QR Code and Details */}
          <div className="flex items-center gap-2.5 my-1">
            <div className="p-1 bg-white rounded-lg shadow-xs border border-gray-200 flex-shrink-0">
              <QRCodeRenderer
                value={branding.menuUrl}
                pattern={screenDesign.qrCode.pattern}
                dotColor={screenDesign.qrCode.dotColor}
                cardColor="#ffffff"
                isTransparent={false}
                effect="none"
                centerLogoUrl={branding.logoUrl}
                showCenterLogo={true}
                size={48}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="text-xs font-bold text-white block truncate">
                {branding.name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block truncate">
                {branding.menuUrl}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Menu Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div
          className={`pt-1.5 border-t mt-1 flex items-center justify-between gap-1.5 ${
            isDark ? 'border-gray-800/80' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPrintModal}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>Print Poster</span>
            </button>

            <a
              href={branding.menuUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg border flex items-center gap-1 transition-colors ${
                isDark
                  ? 'border-gray-700 bg-[#162035] text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>Open</span>
              <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
            </a>
          </div>

          <span className="text-[9px] text-gray-500 font-mono hidden sm:inline">
            A4 / A5
          </span>
        </div>
      </div>
    </div>
  );
};
