import React, { useState, useEffect } from 'react';
import {
  Search,
  Tv,
  LayoutDashboard,
  QrCode,
  UtensilsCrossed,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Send,
  Printer,
  Moon,
  Sun,
  Sparkles,
  ExternalLink,
  X,
  BookOpen,
  Camera
} from 'lucide-react';
import { AppConfig } from '../types/tvConfig';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onNavigateToTab: (tab: string) => void;
  onOpenFullscreenTV: () => void;
  onOpenPrintModal: () => void;
  onPushToAllDisplays: () => void;
  onConnectAllDisplays: () => void;
  onToggleTheme: () => void;
  onApplyPreset: (preset: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  config,
  onNavigateToTab,
  onOpenFullscreenTV,
  onOpenPrintModal,
  onPushToAllDisplays,
  onConnectAllDisplays,
  onToggleTheme,
  onApplyPreset
}) => {
  const [search, setSearch] = useState('');
  const isDark = config.theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'tab-overview',
      title: 'Go to Overview Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        onNavigateToTab('overview');
        onClose();
      }
    },
    {
      id: 'tab-menu',
      title: 'Go to Menu (Excel upload, dish table, dietary icons)',
      category: 'Navigation',
      icon: BookOpen,
      action: () => {
        onNavigateToTab('menu');
        onClose();
      }
    },
    {
      id: 'tab-photos',
      title: 'Go to Photos (Customer upload & review approval)',
      category: 'Navigation',
      icon: Camera,
      action: () => {
        onNavigateToTab('photos');
        onClose();
      }
    },
    {
      id: 'tab-qr',
      title: 'Go to QR Code & Branding (under Settings)',
      category: 'Navigation',
      icon: QrCode,
      action: () => {
        onNavigateToTab('qr');
        onClose();
      }
    },
    {
      id: 'tab-slides',
      title: 'Go to TV Display Slides',
      category: 'Navigation',
      icon: UtensilsCrossed,
      action: () => {
        onNavigateToTab('tv_content');
        onClose();
      }
    },
    {
      id: 'tab-displays',
      title: 'Go to Displays & Screen Design (under Settings)',
      category: 'Navigation',
      icon: Tv,
      action: () => {
        onNavigateToTab('displays');
        onClose();
      }
    },
    {
      id: 'tab-locations',
      title: 'Go to Locations (under Settings)',
      category: 'Navigation',
      icon: MapPin,
      action: () => {
        onNavigateToTab('locations');
        onClose();
      }
    },
    {
      id: 'tab-users',
      title: 'Go to Users & Permissions (under Settings)',
      category: 'Navigation',
      icon: Users,
      action: () => {
        onNavigateToTab('users');
        onClose();
      }
    },
    {
      id: 'tab-analytics',
      title: 'Go to Analytics Console',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        onNavigateToTab('analytics');
        onClose();
      }
    },
    {
      id: 'tab-settings',
      title: 'Go to Settings Console (QR, Displays, Locations, Users)',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        onNavigateToTab('settings');
        onClose();
      }
    },
    {
      id: 'broadcast-tv',
      title: 'Broadcast Live Output to All TV Displays',
      category: 'Hardware & Streaming',
      icon: Tv,
      action: () => {
        onOpenFullscreenTV();
        onClose();
      }
    },
    {
      id: 'connect-all',
      title: 'Simulate Heartbeat for All Displays (Set Online)',
      category: 'Hardware & Streaming',
      icon: Sparkles,
      action: () => {
        onConnectAllDisplays();
        onClose();
      }
    },
    {
      id: 'print-poster',
      title: 'Print Tabletop QR Poster (A5 Format)',
      category: 'Print & Export',
      icon: Printer,
      action: () => {
        onOpenPrintModal();
        onClose();
      }
    },
    {
      id: 'toggle-theme',
      title: `Switch Theme (${isDark ? 'Light Mode' : 'Dark Navy Mode'})`,
      category: 'System',
      icon: isDark ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'preset-classic',
      title: 'Apply Theme Preset: Saravanaa Bhavan Classic (Image 2)',
      category: 'Design Presets',
      icon: Sparkles,
      action: () => {
        onApplyPreset('saravanaa_classic');
        onClose();
      }
    },
    {
      id: 'preset-neon',
      title: 'Apply Theme Preset: Cyber Neon Blue',
      category: 'Design Presets',
      icon: Sparkles,
      action: () => {
        onApplyPreset('neon_cyber');
        onClose();
      }
    }
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div
        className={`rounded-2xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
          isDark
            ? 'bg-[#11192b] border-[#22304d] text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-800/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search modules... (e.g. push, tv, qr, displays)"
            className="w-full text-sm bg-transparent focus:outline-none placeholder-gray-500 font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-3 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No matching actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'hover:bg-[#18233a] text-gray-200 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? 'bg-[#1a253e] text-emerald-400' : 'bg-gray-100 text-emerald-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 bg-black/20 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with 1-click or search</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
