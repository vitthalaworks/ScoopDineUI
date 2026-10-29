import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  X,
  Tv,
  QrCode,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  AppConfig,
  RestaurantBranding,
  TVBannerConfig,
  TVScreenDesignConfig,
  TVPlaylistConfig,
  TVItem,
  TVDisplayDevice,
  RestaurantLocation,
  TeamUser,
  MenuItemRow,
  CustomerPhoto,
  CustomerMenuOptions,
  DisplayLayoutConfig,
  ItemBadgeConfig,
  SequenceBadgeConfig
} from './types/tvConfig';
import { INITIAL_CONFIG, PRESET_THEMES } from './data/defaultConfig';
import { HeaderNav } from './components/HeaderNav';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MenuManager } from './components/MenuManager';
import { PhotosManager } from './components/PhotosManager';
import { TVContentManager } from './components/TVContentManager';
import { AnalyticsManager } from './components/AnalyticsManager';
import { SettingsManager } from './components/SettingsManager';
import { FullScreenTVModal } from './components/FullScreenTVModal';
import { PosterPrintModal } from './components/PosterPrintModal';
import { MenuPreviewModal } from './components/MenuPreviewModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';

const STORAGE_KEY = 'scoopdine_unified_hub_v6';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          displays: parsed.displays || INITIAL_CONFIG.displays,
          locations: parsed.locations || INITIAL_CONFIG.locations,
          users: parsed.users || INITIAL_CONFIG.users,
          analytics: parsed.analytics || INITIAL_CONFIG.analytics,
          menuOptions: parsed.menuOptions || INITIAL_CONFIG.menuOptions,
          menuUploadSheet: parsed.menuUploadSheet || INITIAL_CONFIG.menuUploadSheet,
          menuItems: parsed.menuItems || INITIAL_CONFIG.menuItems,
          customerPhotos: parsed.customerPhotos || INITIAL_CONFIG.customerPhotos,
          displayLayout: parsed.displayLayout || INITIAL_CONFIG.displayLayout,
          itemBadgeStyle: parsed.itemBadgeStyle || INITIAL_CONFIG.itemBadgeStyle,
          sequenceBadgeStyle: parsed.sequenceBadgeStyle || INITIAL_CONFIG.sequenceBadgeStyle,
          theme: parsed.theme || 'dark'
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_CONFIG;
  });

  // Top navigation tabs: overview | tv_content | analytics | settings
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [settingsSubTab, setSettingsSubTab] = useState<
    | 'qr'
    | 'displays_locations'
    | 'users'
    | 'account'
    | 'contract'
    | 'wallet'
  >('qr');
  const [showSaveAlert, setShowSaveAlert] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isTVModalOpen, setIsTVModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // storage error
    }
  }, [config]);

  // Global toast trigger helper
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = config.theme === 'dark' ? 'light' : 'dark';
    setConfig((prev) => ({
      ...prev,
      theme: nextTheme
    }));
    notify(`Switched to ${nextTheme === 'dark' ? 'Dark Navy' : 'Light'} Mode`);
  };

  // Centralized tab routing helper
  const handleNavigate = (tab: string, subTab?: string) => {
    if (tab === 'qr' || tab === 'qr_settings') {
      setSettingsSubTab('qr');
      setActiveTab('settings');
    } else if (tab === 'playlist') {
      setActiveTab('tv_content');
    } else if (tab === 'displays' || tab === 'locations' || tab === 'displays_locations') {
      setSettingsSubTab('displays_locations');
      setActiveTab('settings');
    } else if (tab === 'users') {
      setSettingsSubTab('users');
      setActiveTab('settings');
    } else if (tab === 'settings') {
      if (subTab) {
        if (subTab === 'displays' || subTab === 'locations' || subTab === 'displays_locations') {
          setSettingsSubTab('displays_locations');
        } else if (subTab === 'playlist') {
          setActiveTab('tv_content');
          return;
        } else if (
          subTab === 'qr' ||
          subTab === 'users' ||
          subTab === 'account' ||
          subTab === 'contract' ||
          subTab === 'wallet'
        ) {
          setSettingsSubTab(subTab);
        }
      }
      setActiveTab('settings');
    } else {
      setActiveTab(tab);
    }
  };

  const handleUpdateBranding = (updated: Partial<RestaurantBranding>) => {
    setConfig((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...updated }
    }));
  };

  const handleUpdateBanner = (updated: Partial<TVBannerConfig>) => {
    setConfig((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...updated }
    }));
  };

  const handleUpdateScreenDesign = (updated: Partial<TVScreenDesignConfig>) => {
    setConfig((prev) => ({
      ...prev,
      screenDesign: { ...prev.screenDesign, ...updated }
    }));
  };

  const handleUpdatePlaylist = (updated: Partial<TVPlaylistConfig>) => {
    setConfig((prev) => ({
      ...prev,
      playlist: { ...prev.playlist, ...updated }
    }));
  };

  const handleUpdateItem = (id: string, updated: Partial<TVItem>) => {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...updated } : it))
    }));
  };

  const handleAddItem = (newItem: TVItem) => {
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleDeleteItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
      playlist: {
        ...prev.playlist,
        activeItemIndex: 0
      }
    }));
  };

  const handleReorderItem = (index: number, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const items = [...prev.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return {
        ...prev,
        items,
        playlist: {
          ...prev.playlist,
          activeItemIndex: targetIndex
        }
      };
    });
  };

  const handleSelectActiveItem = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      playlist: {
        ...prev.playlist,
        activeItemIndex: index
      }
    }));
  };

  // Displays mutations
  const handleUpdateDisplay = (id: string, updated: Partial<TVDisplayDevice>) => {
    setConfig((prev) => ({
      ...prev,
      displays: prev.displays.map((d) => (d.id === id ? { ...d, ...updated } : d))
    }));
  };

  const handleAddDisplay = (newDisplay: TVDisplayDevice) => {
    setConfig((prev) => ({
      ...prev,
      displays: [...prev.displays, newDisplay]
    }));
  };

  // Fleet batch push (covers "Push to all TV" when clicking Broadcast)
  const handlePushToAllDisplays = (dishId?: string) => {
    const targetDish = dishId
      ? config.items.find((i) => i.id === dishId) || config.items[0]
      : config.items[config.playlist.activeItemIndex] || config.items[0];

    setConfig((prev) => ({
      ...prev,
      displays: prev.displays.map((d) => ({
        ...d,
        assignedSlideId: targetDish.id,
        status: 'online',
        heartbeat: 'active',
        lastPing: 'Just now'
      }))
    }));
    notify(`Pushed #${targetDish.itemNumber} ${targetDish.name} to all ${config.displays.length} displays`);
  };

  // Broadcast function: covers Push to all TVs and launches fullscreen broadcast
  const handleLaunchBroadcast = (dishId?: string) => {
    handlePushToAllDisplays(dishId);
    setIsTVModalOpen(true);
  };

  const handleConnectAllDisplays = () => {
    setConfig((prev) => ({
      ...prev,
      displays: prev.displays.map((d) => ({
        ...d,
        status: 'online',
        heartbeat: 'active',
        lastPing: 'Just now'
      }))
    }));
    notify(`Connected all ${config.displays.length} TV displays to live stream`);
  };

  // Locations mutations
  const handleUpdateLocation = (id: string, updated: Partial<RestaurantLocation>) => {
    setConfig((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? { ...l, ...updated } : l))
    }));
  };

  const handleAddLocation = (newLocation: RestaurantLocation) => {
    setConfig((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
  };

  // Users mutations
  const handleAddUser = (user: TeamUser) => {
    setConfig((prev) => ({
      ...prev,
      users: [...prev.users, user]
    }));
    notify(`Created user ${user.name}`);
  };

  const handleDeleteUser = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id)
    }));
    notify('Removed user profile');
  };

  // Menu mutations
  const handleUpdateMenuOptions = (updated: Partial<CustomerMenuOptions>) => {
    setConfig((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, ...updated }
    }));
  };

  const handleUpdateMenuItems = (items: MenuItemRow[]) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: items
    }));
  };

  const handleAddMenuItem = (item: MenuItemRow) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, item]
    }));
  };

  const handleApproveMenuSheet = () => {
    setConfig((prev) => ({
      ...prev,
      menuUploadSheet: {
        ...prev.menuUploadSheet,
        status: 'approved'
      }
    }));
    notify('Approved menu sheet: items are now live');
  };

  const handleDiscardMenuSheet = () => {
    setConfig((prev) => ({
      ...prev,
      menuUploadSheet: {
        ...prev.menuUploadSheet,
        status: 'waiting_for_approval'
      }
    }));
    notify('Discarded upload draft');
  };

  // Photos mutations
  const handleUpdatePhotos = (photos: CustomerPhoto[]) => {
    setConfig((prev) => ({
      ...prev,
      customerPhotos: photos
    }));
  };

  const handleAddPhoto = (photo: CustomerPhoto) => {
    setConfig((prev) => ({
      ...prev,
      customerPhotos: [photo, ...prev.customerPhotos]
    }));
  };

  const handlePushPhotoToDisplay = (photo: CustomerPhoto) => {
    const newSlide: TVItem = {
      id: `slide-${photo.id}`,
      itemNumber: photo.itemNumber || `${100 + config.items.length}`,
      name: photo.dishName || photo.customerName,
      subtitle: photo.caption ? `Shared by ${photo.customerName}` : 'Customer Photo',
      description: photo.caption,
      imageUrl: photo.imageUrl,
      badgeLabel: 'Item #',
      badgeColor: '#F91515',
      dietary: 'veg'
    };

    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newSlide],
      playlist: {
        ...prev.playlist,
        activeItemIndex: prev.items.length
      }
    }));
    notify(`Pushed #${newSlide.itemNumber} ${newSlide.name} to Display Schedule`);
  };

  const handleUpdateDisplayLayout = (layout: Partial<DisplayLayoutConfig>) => {
    setConfig((prev) => ({
      ...prev,
      displayLayout: {
        ...prev.displayLayout,
        ...layout
      }
    }));
    triggerSaveAlert();
  };

  const handleUpdateItemBadgeStyle = (style: Partial<ItemBadgeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      itemBadgeStyle: {
        ...prev.itemBadgeStyle,
        ...style
      }
    }));
    triggerSaveAlert();
  };

  const handleUpdateSequenceBadgeStyle = (style: Partial<SequenceBadgeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      sequenceBadgeStyle: {
        ...prev.sequenceBadgeStyle,
        ...style
      }
    }));
    triggerSaveAlert();
  };

  const handleResetLayoutToDefault = () => {
    setConfig((prev) => ({
      ...prev,
      displayLayout: INITIAL_CONFIG.displayLayout,
      itemBadgeStyle: INITIAL_CONFIG.itemBadgeStyle,
      sequenceBadgeStyle: INITIAL_CONFIG.sequenceBadgeStyle
    }));
    triggerSaveAlert();
    notify('Reset Display layout and badge styles to default (80/10/10 ratio)');
  };

  const handleResetToDefault = () => {
    setConfig(INITIAL_CONFIG);
    triggerSaveAlert();
    notify('Restored default Saravanaa Bhavan configuration');
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESET_THEMES[presetKey];
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        ...preset,
        branding: {
          ...prev.branding,
          ...(preset.branding || {})
        },
        screenDesign: {
          ...prev.screenDesign,
          ...(preset.screenDesign || {})
        }
      }));
      triggerSaveAlert();
      notify(`Applied ${presetKey.replace('_', ' ')} design preset`);
    }
  };

  const triggerSaveAlert = () => {
    setShowSaveAlert(true);
  };

  const isDark = config.theme === 'dark';

  return (
    <div
      className={`h-screen w-screen overflow-hidden font-sans antialiased flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#0c1322] text-white' : 'bg-[#f8fafc] text-gray-900'
      }`}
    >
      {/* Top Header & Navigation Bar: Overview, Menu, Photos, Display Schedule, Analytics, Settings */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={handleNavigate}
        restaurantName={config.branding.name}
        theme={config.theme}
        displays={config.displays}
        onToggleTheme={toggleTheme}
        onLaunchTV={() => handleLaunchBroadcast()}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onApplyPreset={handleApplyPreset}
      />

      {/* Main Viewport Container - Exactly fits full screen with zero page vertical scroll */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 overflow-hidden flex flex-col">
        {/* Design Saved Alert Banner */}
        {showSaveAlert && activeTab === 'settings' && (
          <div
            className={`mb-2 p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs transition-all flex-shrink-0 ${
              isDark
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Display design saved. Connected displays synchronize automatically.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSaveAlert(false)}
              className="p-1 rounded-md transition-colors hover:text-white cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            config={config}
            onNavigateToTab={handleNavigate}
            onOpenFullscreenTV={() => handleLaunchBroadcast()}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onPushToAllDisplays={handlePushToAllDisplays}
            onConnectAllDisplays={handleConnectAllDisplays}
            onUpdateDisplay={handleUpdateDisplay}
            onSelectActiveItem={handleSelectActiveItem}
          />
        )}

        {/* 2. MENU (Image 1: Excel sheet upload, customer options, dish table) */}
        {activeTab === 'menu' && (
          <MenuManager
            config={config}
            onUpdateMenuOptions={handleUpdateMenuOptions}
            onUpdateMenuItems={handleUpdateMenuItems}
            onAddMenuItem={handleAddMenuItem}
            onApproveMenuSheet={handleApproveMenuSheet}
            onDiscardMenuSheet={handleDiscardMenuSheet}
            onNotify={notify}
          />
        )}

        {/* 3. PHOTOS (Customer photo upload and approval) */}
        {activeTab === 'photos' && (
          <PhotosManager
            config={config}
            onUpdatePhotos={handleUpdatePhotos}
            onAddPhoto={handleAddPhoto}
            onPushPhotoToTV={handlePushPhotoToDisplay}
            onNotify={notify}
          />
        )}

        {/* 4. DISPLAY SCHEDULE & DISPLAY LAYOUT CONFIG */}
        {activeTab === 'tv_content' && (
          <div className="h-full min-h-0 overflow-hidden flex flex-col">
            <TVContentManager
              items={config.items}
              playlist={config.playlist}
              accentColor={config.branding.accentColor}
              config={config}
              onUpdateItem={handleUpdateItem}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onReorderItem={handleReorderItem}
              onUpdatePlaylist={handleUpdatePlaylist}
              onSelectActiveItem={handleSelectActiveItem}
              onPushToDisplays={handlePushToAllDisplays}
              onOpenFullscreenTV={() => handleLaunchBroadcast()}
              onNotify={notify}
              onUpdateDisplayLayout={handleUpdateDisplayLayout}
              onUpdateItemBadgeStyle={handleUpdateItemBadgeStyle}
              onUpdateSequenceBadgeStyle={handleUpdateSequenceBadgeStyle}
              onResetLayoutToDefault={handleResetLayoutToDefault}
            />
          </div>
        )}

        {/* 3. ANALYTICS CONSOLE */}
        {activeTab === 'analytics' && (
          <AnalyticsManager config={config} onNotify={notify} />
        )}

        {/* 4. SETTINGS CONSOLE (Houses QR & Branding, Displays & Locations, Users, Account, Contract, Wallet) */}
        {activeTab === 'settings' && (
          <SettingsManager
            config={config}
            initialTab={settingsSubTab}
            onNavigateToTab={handleNavigate}
            onUpdateBranding={handleUpdateBranding}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onOpenMenuPreview={() => setIsMenuModalOpen(true)}
            onUpdateDisplay={handleUpdateDisplay}
            onAddDisplay={handleAddDisplay}
            onUpdateBanner={handleUpdateBanner}
            onUpdateScreenDesign={handleUpdateScreenDesign}
            onResetToDefault={handleResetToDefault}
            onSaveDesign={triggerSaveAlert}
            onSelectActiveItem={handleSelectActiveItem}
            onOpenFullscreenTV={() => handleLaunchBroadcast()}
            onUpdateLocation={handleUpdateLocation}
            onAddLocation={handleAddLocation}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onNotify={notify}
          />
        )}
      </main>

      {/* Floating Operational Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Global Interactive Modals */}
      <FullScreenTVModal
        config={config}
        isOpen={isTVModalOpen}
        onClose={() => setIsTVModalOpen(false)}
      />

      <PosterPrintModal
        config={config}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <MenuPreviewModal
        config={config}
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        config={config}
        onNavigateToTab={handleNavigate}
        onOpenFullscreenTV={() => handleLaunchBroadcast()}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onPushToAllDisplays={handlePushToAllDisplays}
        onConnectAllDisplays={handleConnectAllDisplays}
        onToggleTheme={toggleTheme}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  );
}
