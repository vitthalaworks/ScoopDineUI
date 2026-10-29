import React from 'react';
import {
  Monitor,
  ChevronRight
} from 'lucide-react';
import { AppConfig, TVDisplayDevice } from '../types/tvConfig';
import { TVDisplayPreview } from './TVDisplayPreview';
import { OverviewSummaryRow } from './OverviewSummaryRow';

interface OverviewDashboardProps {
  config: AppConfig;
  onNavigateToTab: (tab: string, subTab?: string) => void;
  onOpenFullscreenTV: () => void;
  onOpenPrintModal: () => void;
  onOpenCommandPalette: () => void;
  onPushToAllDisplays: () => void;
  onConnectAllDisplays: () => void;
  onUpdateDisplay: (id: string, updated: Partial<TVDisplayDevice>) => void;
  onSelectActiveItem: (index: number) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  config,
  onNavigateToTab,
  onOpenFullscreenTV,
  onOpenPrintModal,
  onUpdateDisplay
}) => {
  const { displays, items, playlist, theme } = config;
  const isDark = theme === 'dark';

  return (
    <div className="h-full min-h-0 flex flex-col gap-2 overflow-hidden">
      {/* SUMMARY ROW WITH INTERACTIVE CHARTS: Total Active Displays, Current Playlist Item Count, Table Menu QR Code & Posters */}
      <OverviewSummaryRow
        config={config}
        onNavigateToTab={onNavigateToTab}
        onOpenFullscreenTV={onOpenFullscreenTV}
        onOpenPrintModal={onOpenPrintModal}
      />

      {/* Main 2-Column Modular Widgets Grid - Fills remaining height exactly with zero overflow */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden">
        {/* LEFT COLUMN: LIVE DISPLAY SIGNAGE MONITOR (8 cols) */}
        <div
          className={`lg:col-span-8 h-full flex flex-col p-3 rounded-2xl border overflow-hidden ${
            isDark
              ? 'bg-[#11192b] border-[#1e2a44]'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3
                className={`text-xs font-bold tracking-tight uppercase ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Live Display Signage Output (Image 2 Render)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('tv_content')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Configure Schedule
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* The Live Display Canvas Container: scales to fill height perfectly */}
          <div className="flex-1 min-h-0 flex items-center justify-center rounded-xl overflow-hidden border border-gray-800 shadow-xl bg-black/60 p-1">
            <div className="w-full h-full max-h-full flex items-center justify-center">
              <TVDisplayPreview
                config={config}
                mode="preview"
                sequenceNumber={playlist.activeItemIndex + 1}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HARDWARE DISPLAYS STATUS (4 cols) */}
        <div
          className={`lg:col-span-4 h-full flex flex-col p-3 rounded-2xl border overflow-hidden ${
            isDark
              ? 'bg-[#11192b] border-[#1e2a44]'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <h3
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Hardware Displays ({displays.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('settings', 'displays_locations')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Manage
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of screens with live assigned dish previews - Internal scroll if needed */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-2 pr-1">
            {displays.map((disp) => {
              const isOnline = disp.status === 'online';
              const assignedDish =
                items.find((i) => i.id === disp.assignedSlideId) || items[0];

              return (
                <div
                  key={disp.id}
                  onClick={() => onNavigateToTab('settings', 'displays_locations')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#151f35] border-[#202d48] hover:border-emerald-500/50'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-9 h-7 rounded-md overflow-hidden bg-black flex-shrink-0 border border-gray-700">
                      <img
                        src={assignedDish.imageUrl}
                        alt={assignedDish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold block truncate ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {disp.serial}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block max-w-[130px]">
                        Playing: #{assignedDish.itemNumber} {assignedDish.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        isOnline
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-[#1c2742] text-blue-300'
                      }`}
                    >
                      {isOnline ? 'Online' : 'Pending'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateDisplay(disp.id, {
                          status: isOnline ? 'provisioning' : 'online',
                          heartbeat: isOnline ? 'no_heartbeat' : 'active'
                        });
                      }}
                      className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      {isOnline ? 'Off' : 'On'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
