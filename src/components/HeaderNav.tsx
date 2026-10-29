import React from 'react';
import {
  BarChart3,
  Settings,
  Sun,
  Moon,
  LayoutDashboard,
  BookOpen,
  Camera,
  Calendar
} from 'lucide-react';
import { ThemeMode, TVDisplayDevice } from '../types/tvConfig';

interface HeaderNavProps {
  activeTab: string;
  onTabChange: (tab: string, subTab?: string) => void;
  restaurantName: string;
  theme: ThemeMode;
  displays: TVDisplayDevice[];
  onToggleTheme: () => void;
  onLaunchTV: () => void;
  onOpenCommandPalette: () => void;
  onApplyPreset: (presetKey: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  // Navigation tabs next to ScoopDine logo: Overview, Menu, Photos, Display Schedule, Analytics, Settings
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'tv_content', label: 'Display Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors ${
        isDark
          ? 'bg-[#0c1322] border-gray-800/90 text-white'
          : 'bg-white border-gray-200 text-gray-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Brand + Navigation links directly adjacent */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1 overflow-x-auto scrollbar-none">
            {/* ScoopDine logo lockup */}
            <button
              type="button"
              onClick={() => onTabChange('overview')}
              className="flex items-center gap-2.5 flex-shrink-0 text-left cursor-pointer group"
              title="ScoopDine Home"
            >
              <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:scale-105">
                S
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base whitespace-nowrap">
                  ScoopDine
                </span>
                <span className="text-gray-400 text-xs hidden sm:inline">·</span>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline whitespace-nowrap">
                  HSB Croydon
                </span>
              </div>
            </button>

            {/* Navigation links directly next to ScoopDine logo */}
            <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-xs'
                        : isDark
                        ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? 'text-emerald-400'
                          : isDark
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Switch Mode directly next to profile */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Switch Mode (Sun / Moon) button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-gray-700 bg-[#162035] text-amber-300 hover:bg-[#1f2d4a]'
                  : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Navy Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile matching reference */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-700/60">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold leading-tight whitespace-nowrap">
                  DEV Admin 06 Croydon
                </span>
                <span className="text-[10px] text-gray-400">Admin</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#1e2a44] border border-gray-700 text-gray-300 flex items-center justify-center text-xs font-bold">
                DA
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
