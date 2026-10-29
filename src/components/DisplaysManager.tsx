import React, { useState } from 'react';
import {
  Tv,
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Play,
  Layers,
  Sparkles,
  Wifi,
  WifiOff,
  Sliders,
  Send,
  X,
  Plus,
  Filter,
  CheckCheck,
  SlidersHorizontal,
  Monitor
} from 'lucide-react';
import {
  TVDisplayDevice,
  RestaurantLocation,
  AppConfig,
  TVItem,
  TVBannerConfig,
  TVScreenDesignConfig
} from '../types/tvConfig';
import { TVDisplayPreview } from './TVDisplayPreview';
import { TVBannerEditor } from './TVBannerEditor';
import { TVScreenDesignEditor } from './TVScreenDesignEditor';
import { LocationsManager } from './LocationsManager';

interface DisplaysManagerProps {
  config: AppConfig;
  initialSubTab?: 'display_settings' | 'connected_screens' | 'locations';
  onUpdateDisplay: (id: string, updated: Partial<TVDisplayDevice>) => void;
  onAddDisplay: (newDisplay: TVDisplayDevice) => void;
  onUpdateBanner: (updated: Partial<TVBannerConfig>) => void;
  onUpdateScreenDesign: (updated: Partial<TVScreenDesignConfig>) => void;
  onResetToDefault: () => void;
  onSaveDesign: () => void;
  onSelectActiveItem: (index: number) => void;
  onOpenFullscreenTV: () => void;
  onUpdateLocation?: (id: string, updated: Partial<RestaurantLocation>) => void;
  onAddLocation?: (newLocation: RestaurantLocation) => void;
  onNotify?: (message: string) => void;
}

export const DisplaysManager: React.FC<DisplaysManagerProps> = ({
  config,
  initialSubTab = 'connected_screens',
  onUpdateDisplay,
  onAddDisplay,
  onUpdateBanner,
  onUpdateScreenDesign,
  onResetToDefault,
  onSaveDesign,
  onSelectActiveItem,
  onOpenFullscreenTV,
  onUpdateLocation,
  onAddLocation,
  onNotify
}) => {
  const { displays, locations, theme, items, playlist, banner, branding, screenDesign } = config;
  const isDark = theme === 'dark';

  // Sub-tab: "connected_screens" (Displays by Location), "display_settings" (TV banner + Screen Design), or "locations" (Locations Directory)
  const [activeSubTab, setActiveSubTab] = useState<'display_settings' | 'connected_screens' | 'locations'>(initialSubTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'provisioning'>('all');
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({
    'loc-croydon': true
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingDevice, setInspectingDevice] = useState<TVDisplayDevice | null>(null);
  const [pushSuccessId, setPushSuccessId] = useState<string | null>(null);
  const [isAddDisplayModalOpen, setIsAddDisplayModalOpen] = useState(false);

  // New display form state
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDisplaySerial, setNewDisplaySerial] = useState('');
  const [newDisplayResolution, setNewDisplayResolution] = useState('1920 × 1080 (FHD)');

  const onlineCount = displays.filter((d) => d.status === 'online').length;

  const toggleLocationExpand = (locId: string) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [locId]: !prev[locId]
    }));
  };

  const handleCopyLink = (device: TVDisplayDevice) => {
    navigator.clipboard.writeText(device.playerUrl);
    setCopiedId(device.id);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify?.(`Copied player URL for ${device.serial}`);
  };

  const toggleHeartbeat = (device: TVDisplayDevice) => {
    const isCurrentlyOnline = device.status === 'online';
    const updated: Partial<TVDisplayDevice> = isCurrentlyOnline
      ? { status: 'provisioning', heartbeat: 'no_heartbeat' }
      : { status: 'online', heartbeat: 'active', lastPing: 'Just now' };

    onUpdateDisplay(device.id, updated);
    if (inspectingDevice?.id === device.id) {
      setInspectingDevice((prev) => (prev ? { ...prev, ...updated } : null));
    }
    onNotify?.(`${device.serial} is now ${isCurrentlyOnline ? 'Provisioning' : 'Online'}`);
  };

  const handleConnectAll = () => {
    displays.forEach((d) => {
      onUpdateDisplay(d.id, {
        status: 'online',
        heartbeat: 'active',
        lastPing: 'Just now'
      });
    });
    onNotify?.('All displays connected and streaming');
  };

  const handleDisconnectAll = () => {
    displays.forEach((d) => {
      onUpdateDisplay(d.id, {
        status: 'provisioning',
        heartbeat: 'no_heartbeat'
      });
    });
    onNotify?.('All displays reset to provisioning mode');
  };

  const handlePushToAllDisplays = () => {
    const activeItem = items[playlist.activeItemIndex] || items[0];
    displays.forEach((d) => {
      onUpdateDisplay(d.id, {
        assignedSlideId: activeItem.id,
        status: 'online',
        heartbeat: 'active',
        lastPing: 'Just now'
      });
    });
    onNotify?.(`Pushed "${activeItem.name}" to all ${displays.length} displays`);
  };

  const handlePushToDisplay = (device: TVDisplayDevice, slideId?: string) => {
    const targetSlide = items.find((i) => i.id === (slideId || device.assignedSlideId)) || items[0];
    onUpdateDisplay(device.id, {
      assignedSlideId: targetSlide.id,
      status: 'online',
      heartbeat: 'active',
      lastPing: 'Just now'
    });
    setPushSuccessId(device.id);
    setTimeout(() => setPushSuccessId(null), 3000);
    onNotify?.(`Pushed "${targetSlide.name}" to ${device.serial}`);
  };

  const handleCreateDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) return;

    const nextIndex = displays.length + 1;
    const serial =
      newDisplaySerial.trim() || `HSB-CRY-TV-${String(nextIndex).padStart(2, '0')}`;
    const newDev: TVDisplayDevice = {
      id: `disp-${Date.now()}`,
      name: `HSB Croydon — ${serial}`,
      serial,
      locationId: 'loc-croydon',
      locationName: 'HSB Croydon',
      orientation: 'landscape',
      playerUrl: `https://newdev.scoopify.co.uk/player/${Math.random().toString(36).substring(2, 10)}`,
      status: 'online',
      heartbeat: 'active',
      lastPing: 'Just now',
      resolution: newDisplayResolution,
      assignedSlideId: items[0]?.id
    };

    onAddDisplay(newDev);
    setNewDisplayName('');
    setNewDisplaySerial('');
    setIsAddDisplayModalOpen(false);
    onNotify?.(`Registered new display ${serial}`);
  };

  // Filter displays by search and status
  const filteredDisplays = displays.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.locationName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'online') return d.status === 'online';
    if (statusFilter === 'provisioning') return d.status === 'provisioning';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Sub-Navigation between Display Settings (Banner + Screen Design) and Connected Screens */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Displays &amp; Signage
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Configure your TV banner, screen design styling, and manage hardware display fleet.
          </p>
        </div>

        {/* Global Broadcast Trigger */}
        <button
          type="button"
          onClick={onOpenFullscreenTV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Tv className="w-4 h-4 text-emerald-200" />
          <span>Launch TV Broadcast</span>
        </button>
      </div>

      {/* Sub-Tabs: Displays by Location vs Display Settings vs Locations Directory */}
      <div className="flex items-center space-x-4 sm:space-x-6 border-b border-gray-800/80 text-xs sm:text-sm overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('connected_screens')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeSubTab === 'connected_screens'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          Displays by Location ({displays.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('display_settings')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeSubTab === 'display_settings'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Display Settings (Banner &amp; Screen Design)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('locations')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeSubTab === 'locations'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Locations Directory ({locations.length})
        </button>
      </div>

      {/* VIEW 1: DISPLAY SETTINGS (TV Banner & TV Screen Design as requested) */}
      {activeSubTab === 'display_settings' && (
        <div className="space-y-6">
          {/* 1. TV Banner Editor (2560x1440 YouTube safe strip 2560x423) */}
          <TVBannerEditor
            banner={banner}
            branding={branding}
            onChange={onUpdateBanner}
          />

          {/* 2. TV Screen Design Editor (Backgrounds, QR pattern, Banner frame, Live Preview) */}
          <TVScreenDesignEditor
            config={config}
            onUpdateScreenDesign={onUpdateScreenDesign}
            onResetToDefault={onResetToDefault}
            onSaveDesign={onSaveDesign}
            onOpenFullscreenTV={onOpenFullscreenTV}
            onSelectActiveItem={onSelectActiveItem}
          />
        </div>
      )}

      {/* VIEW 2: CONNECTED SCREENS FLEET (Physical Devices) */}
      {activeSubTab === 'connected_screens' && (
        <div className="space-y-6">
          {/* Fleet Batch Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-[#151f35] p-4 rounded-2xl border border-gray-200 dark:border-[#22304d]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Fleet Status:
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {onlineCount} Online
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs font-bold text-blue-300">
                {displays.length - onlineCount} Provisioning
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePushToAllDisplays}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Push Active Slide to All
              </button>

              <button
                type="button"
                onClick={onlineCount === displays.length ? handleDisconnectAll : handleConnectAll}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  onlineCount === displays.length
                    ? 'bg-[#18233a] border-gray-700 text-gray-300 hover:text-white'
                    : 'bg-blue-950/40 border-blue-700 text-blue-300 hover:bg-blue-900/50'
                }`}
              >
                {onlineCount === displays.length ? 'Disconnect All' : 'Connect All Displays'}
              </button>

              <button
                type="button"
                onClick={() => setIsAddDisplayModalOpen(true)}
                className="px-3.5 py-1.5 border border-gray-700 hover:border-gray-500 text-gray-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Screen
              </button>
            </div>
          </div>

          {/* Main Table Container: Displays by Location */}
          <div
            className={`rounded-2xl border overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#11192b] border-[#1e2a44]'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {/* Table Header Bar with Status Filter and Search */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/40">
              <div>
                <h3
                  className={`text-base font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Displays by location
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Expand a location to see its devices; click a device to configure it.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter pills */}
                <div className="inline-flex p-1 rounded-xl bg-[#151f35] border border-[#253452]">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All ({displays.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('online')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'online'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('provisioning')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'provisioning'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Provisioning ({displays.length - onlineCount})
                  </button>
                </div>

                {/* Search location or device */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search location or device"
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#18233a] border-[#293859] text-white placeholder-gray-500 focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Table Column Labels */}
            <div
              className={`grid grid-cols-12 px-6 py-3 text-[11px] font-bold tracking-wider uppercase border-b ${
                isDark
                  ? 'bg-[#0f1728] border-gray-800/80 text-gray-400'
                  : 'bg-gray-50/80 border-gray-200 text-gray-500'
              }`}
            >
              <div className="col-span-6">Location</div>
              <div className="col-span-3">City</div>
              <div className="col-span-2 text-center">Devices</div>
              <div className="col-span-1 text-right">Online</div>
            </div>

            {/* Location Row (HSB Croydon) */}
            {locations.map((loc) => {
              const isExpanded = expandedLocations[loc.id] ?? true;
              const locDisplays = filteredDisplays.filter(
                (d) => d.locationId === loc.id
              );
              const locOnline = locDisplays.filter((d) => d.status === 'online').length;

              return (
                <div key={loc.id} className="border-b border-gray-800/40 last:border-b-0">
                  {/* Location Main Row */}
                  <div
                    onClick={() => toggleLocationExpand(loc.id)}
                    className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors ${
                      isDark
                        ? 'hover:bg-[#18233a]/50 text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <span className="text-gray-400">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                          isDark
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm">{loc.name}</span>
                    </div>

                    <div
                      className={`col-span-3 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {loc.city}
                    </div>

                    <div className="col-span-2 text-center font-bold text-sm tabular-nums">
                      {locDisplays.length}
                    </div>

                    <div
                      className={`col-span-1 text-right font-bold text-sm tabular-nums ${
                        locOnline > 0 ? 'text-emerald-400' : 'text-gray-400'
                      }`}
                    >
                      {locOnline}
                    </div>
                  </div>

                  {/* Sub-Rows: The Physical Displays */}
                  {isExpanded && (
                    <div
                      className={`pl-10 pr-6 py-2 space-y-2 ${
                        isDark ? 'bg-[#0d1424]/80' : 'bg-gray-50/50'
                      }`}
                    >
                      {locDisplays.length === 0 ? (
                        <div className="py-6 text-center text-xs text-gray-500">
                          No displays match the current filter.
                        </div>
                      ) : (
                        locDisplays.map((disp) => {
                          const isOnline = disp.status === 'online';
                          const assignedDish =
                            items.find((i) => i.id === disp.assignedSlideId) || items[0];

                          return (
                            <div
                              key={disp.id}
                              onClick={() => setInspectingDevice(disp)}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group ${
                                isDark
                                  ? 'bg-[#151f35] border-[#22304f] hover:border-emerald-500/50 hover:bg-[#1a2640]'
                                  : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xs'
                              }`}
                            >
                              {/* Device Info + Live Dish Thumbnail */}
                              <div className="flex items-center gap-3">
                                <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-gray-700 shadow-sm">
                                  <img
                                    src={assignedDish.imageUrl}
                                    alt={assignedDish.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div
                                    className="absolute bottom-0 right-0 px-1 text-[8px] font-black text-white"
                                    style={{ backgroundColor: assignedDish.badgeColor }}
                                  >
                                    #{assignedDish.itemNumber}
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4
                                      className={`text-xs md:text-sm font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                      }`}
                                    >
                                      {disp.name}
                                    </h4>
                                    {isOnline && (
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    )}
                                  </div>

                                  <p
                                    className={`text-[11px] font-mono mt-0.5 ${
                                      isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                  >
                                    Serial {disp.serial} · {disp.orientation} · {disp.resolution}
                                  </p>

                                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                                    Playing: #{assignedDish.itemNumber} {assignedDish.name}
                                  </p>
                                </div>
                              </div>

                              {/* Controls & Badges */}
                              <div
                                className="flex items-center gap-2.5 self-end md:self-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="text-right">
                                  <span
                                    className={`text-xs font-semibold block ${
                                      isOnline ? 'text-emerald-400' : 'text-gray-400'
                                    }`}
                                  >
                                    {isOnline ? 'Heartbeat active' : 'No heartbeat'}
                                  </span>
                                  <span className="text-[10px] text-gray-500">
                                    {disp.lastPing || 'Pending ping'}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleHeartbeat(disp)}
                                  className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                                    isOnline
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                      : isDark
                                      ? 'bg-[#1e2a44] text-blue-300 hover:bg-[#28385a]'
                                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                  }`}
                                  title="Toggle heartbeat status"
                                >
                                  {isOnline ? 'Online' : 'Provisioning'}
                                </button>

                                <select
                                  value={disp.assignedSlideId || items[0].id}
                                  onChange={(e) => handlePushToDisplay(disp, e.target.value)}
                                  className={`text-[11px] px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                                    isDark
                                      ? 'bg-[#18233a] border-gray-700 text-gray-300'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  }`}
                                  title="Assign dish to this screen"
                                >
                                  {items.map((it) => (
                                    <option key={it.id} value={it.id}>
                                      #{it.itemNumber} {it.name}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handlePushToDisplay(disp)}
                                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                                    pushSuccessId === disp.id
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : isDark
                                      ? 'bg-[#1e2a44] border-gray-700 text-gray-300 hover:text-white hover:bg-[#28385a]'
                                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  title="Push current active slide"
                                >
                                  {pushSuccessId === disp.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Pushed</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Push</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyLink(disp)}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    isDark
                                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                  }`}
                                  title="Copy player link"
                                >
                                  {copiedId === disp.id ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setInspectingDevice(disp)}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    isDark
                                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                  }`}
                                  title="Inspect device details"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: LOCATIONS DIRECTORY (Combined into Displays & Locations) */}
      {activeSubTab === 'locations' && (
        <div className="space-y-6">
          <LocationsManager
            config={config}
            onUpdateLocation={onUpdateLocation || (() => {})}
            onAddLocation={onAddLocation || (() => {})}
            onNavigateToDisplays={() => setActiveSubTab('connected_screens')}
            onNotify={onNotify}
          />
        </div>
      )}

      {/* ADD DISPLAY MODAL */}
      {isAddDisplayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDisplay}
            className={`rounded-2xl max-w-md w-full border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Tv className="w-5 h-5 text-emerald-400" />
                Register New TV Display
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDisplayModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Display Location / Placement
              </label>
              <input
                type="text"
                required
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g. Dining Area Screen 4 or Bar Display"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Hardware Serial Number
              </label>
              <input
                type="text"
                value={newDisplaySerial}
                onChange={(e) => setNewDisplaySerial(e.target.value)}
                placeholder="e.g. HSB-CRY-TV-04 (Auto-assigned if blank)"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Display Resolution
              </label>
              <select
                value={newDisplayResolution}
                onChange={(e) => setNewDisplayResolution(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none"
              >
                <option value="3840 × 2160 (4K UHD)">3840 × 2160 (4K UHD)</option>
                <option value="1920 × 1080 (FHD)">1920 × 1080 (FHD 1080p)</option>
                <option value="2560 × 1440 (QHD)">2560 × 1440 (QHD 2K)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddDisplayModalOpen(false)}
                className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow"
              >
                Register Screen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEVICE INSPECTOR DRAWER / MODAL */}
      {inspectingDevice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {inspectingDevice.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Serial {inspectingDevice.serial} · {inspectingDevice.locationName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingDevice(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Live Preview on this Display */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                    Live Output on this Screen (Image 2 Render)
                  </span>
                  <button
                    type="button"
                    onClick={onOpenFullscreenTV}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    Open Full Broadcast
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                  <TVDisplayPreview
                    config={config}
                    currentItem={
                      items.find((i) => i.id === inspectingDevice.assignedSlideId) ||
                      items[0]
                    }
                    mode="preview"
                    sequenceNumber={3}
                  />
                </div>
              </div>

              {/* Hardware & Streaming Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-[#151f35] border-[#22304f]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Hardware Status
                  </span>
                  <span
                    className={`font-semibold ${
                      inspectingDevice.status === 'online'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {inspectingDevice.status === 'online' ? 'Online & Streaming' : 'Provisioning Mode'}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-[#151f35] border-[#22304f]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Resolution
                  </span>
                  <span className="font-semibold text-white">
                    {inspectingDevice.resolution || '1920 × 1080 (FHD)'}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-[#151f35] border-[#22304f]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Last Ping
                  </span>
                  <span className="font-semibold text-white">
                    {inspectingDevice.lastPing || 'Never'}
                  </span>
                </div>
              </div>

              {/* Assign Active Dish Slide to this TV */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Assign Featured Dish Slide to this Display
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((it) => {
                    const isAssigned =
                      inspectingDevice.assignedSlideId === it.id;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() =>
                          handlePushToDisplay(inspectingDevice, it.id)
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isAssigned
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                            : isDark
                            ? 'bg-[#151f35] border-[#22304f] hover:border-gray-600 text-gray-300'
                            : 'bg-white border-gray-200 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="px-1.5 py-0.2 rounded text-[10px] font-black text-white"
                            style={{ backgroundColor: it.badgeColor }}
                          >
                            #{it.itemNumber}
                          </span>
                          <span className="text-xs font-bold truncate">
                            {it.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate block">
                          {it.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Device Player URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Player URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inspectingDevice.playerUrl}
                    className={`w-full text-xs font-mono px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark
                        ? 'bg-[#0f1728] border-gray-700 text-gray-300'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(inspectingDevice)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    title="Copy player URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-gray-800/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleHeartbeat(inspectingDevice)}
                className={`text-xs px-3.5 py-2 rounded-lg font-semibold border flex items-center gap-1.5 cursor-pointer ${
                  inspectingDevice.status === 'online'
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300 hover:bg-amber-900/60'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                }`}
              >
                {inspectingDevice.status === 'online' ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    Simulate Disconnect
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    Simulate Heartbeat Ping
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingDevice(null)}
                  className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-medium rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePushToDisplay(inspectingDevice);
                    setInspectingDevice(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Push to Display
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
