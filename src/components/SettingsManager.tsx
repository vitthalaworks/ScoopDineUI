import React, { useState, useEffect, useRef } from 'react';
import {
  Key,
  Users,
  FileText,
  Wallet,
  CreditCard,
  Mail,
  CheckCircle,
  ShieldCheck,
  Monitor,
  MapPin,
  QrCode,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Upload,
  Trash2,
  Check,
  Plus,
  Search,
  Send,
  Tv,
  Wifi,
  WifiOff,
  X,
  Sparkles,
  Building2,
  Clock,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import {
  AppConfig,
  TVDisplayDevice,
  RestaurantLocation,
  TeamUser,
  TVBannerConfig,
  TVScreenDesignConfig,
  RestaurantBranding
} from '../types/tvConfig';
import { QRCodeRenderer } from './QRCodeRenderer';
import { TVDisplayPreview } from './TVDisplayPreview';

export type ConsolidatedSettingsTab = 'qr' | 'displays_locations' | 'account_billing';

interface SettingsManagerProps {
  config: AppConfig;
  initialTab?:
    | 'qr'
    | 'displays_locations'
    | 'displays'
    | 'locations'
    | 'users'
    | 'account'
    | 'contract'
    | 'wallet'
    | 'account_billing';
  onNavigateToTab: (tab: string, subTab?: string) => void;
  onUpdateBranding: (branding: Partial<RestaurantBranding>) => void;
  onOpenPrintModal: () => void;
  onOpenMenuPreview: () => void;
  onUpdateDisplay: (id: string, updated: Partial<TVDisplayDevice>) => void;
  onAddDisplay: (newDisplay: TVDisplayDevice) => void;
  onUpdateBanner: (updated: Partial<TVBannerConfig>) => void;
  onUpdateScreenDesign: (updated: Partial<TVScreenDesignConfig>) => void;
  onResetToDefault: () => void;
  onSaveDesign: () => void;
  onSelectActiveItem: (index: number) => void;
  onOpenFullscreenTV: () => void;
  onUpdateLocation: (id: string, updated: Partial<RestaurantLocation>) => void;
  onAddLocation: (newLocation: RestaurantLocation) => void;
  onAddUser: (user: TeamUser) => void;
  onDeleteUser: (id: string) => void;
  onNotify?: (msg: string) => void;
}

const ACCENT_SWATCHES = ['#E11D48', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

const SCREEN_STYLE_PRESETS = [
  {
    id: 'saravanaa',
    label: 'Saravanaa Classic',
    desc: 'Deep pitch black + crimson item badge',
    bg: '#050505',
    bannerBg: '#090d16',
    accent: '#E11D48',
    qrDot: '#DC2626'
  },
  {
    id: 'emerald',
    label: 'Emerald Dark',
    desc: 'Carbon slate + emerald signage accents',
    bg: '#0b132b',
    bannerBg: '#0f172a',
    accent: '#10B981',
    qrDot: '#059669'
  },
  {
    id: 'gold',
    label: 'Royal Gold',
    desc: 'Warm obsidian + saffron gold highlights',
    bg: '#14110b',
    bannerBg: '#1c170d',
    accent: '#D97706',
    qrDot: '#B45309'
  },
  {
    id: 'light',
    label: 'Daylight Crisp',
    desc: 'High-key alabaster + navy contrast',
    bg: '#f8fafc',
    bannerBg: '#0f172a',
    accent: '#2563EB',
    qrDot: '#1E293B'
  }
];

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  config,
  initialTab = 'qr',
  onUpdateBranding,
  onOpenPrintModal,
  onOpenMenuPreview,
  onUpdateDisplay,
  onAddDisplay,
  onUpdateBanner,
  onUpdateScreenDesign,
  onSaveDesign,
  onOpenFullscreenTV,
  onAddLocation,
  onAddUser,
  onDeleteUser,
  onNotify
}) => {
  const { theme, branding, displays, locations, users, banner, screenDesign, items, playlist } = config;
  const isDark = theme === 'dark';

  const normalizeTab = (tab: string | undefined): ConsolidatedSettingsTab => {
    if (tab === 'displays' || tab === 'locations' || tab === 'displays_locations') {
      return 'displays_locations';
    }
    if (
      tab === 'users' ||
      tab === 'account' ||
      tab === 'contract' ||
      tab === 'wallet' ||
      tab === 'account_billing'
    ) {
      return 'account_billing';
    }
    return 'qr';
  };

  const [activeTab, setActiveTab] = useState<ConsolidatedSettingsTab>(normalizeTab(initialTab));

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  // --- TAB 1: QR & BRANDING STATE ---
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [justSavedBrand, setJustSavedBrand] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const qrLogoInputRef = useRef<HTMLInputElement>(null);

  const handleCopyMenuUrl = () => {
    navigator.clipboard.writeText(branding.menuUrl);
    setCopiedUrl(true);
    onNotify?.('Copied digital menu link to clipboard');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveBrandSettings = () => {
    onSaveDesign();
    setJustSavedBrand(true);
    onNotify?.('Branding & QR configuration saved and synced to displays');
    setTimeout(() => setJustSavedBrand(false), 2200);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onUpdateBranding({ logoUrl: dataUrl });
        onNotify?.('Updated restaurant logo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 100, 100, 800, 800);
      const link = document.createElement('a');
      link.download = `${branding.menuAddressSlug || 'menu'}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onNotify?.('Downloaded high-resolution QR PNG');
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(
      branding.menuUrl
    )}&color=000000`;
  };

  // --- TAB 2: DISPLAYS & LOCATIONS STATE ---
  const [displaySearch, setDisplaySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'provisioning'>('all');
  const [copiedDeviceId, setCopiedDeviceId] = useState<string | null>(null);
  const [pushSuccessId, setPushSuccessId] = useState<string | null>(null);
  const [inspectingDevice, setInspectingDevice] = useState<TVDisplayDevice | null>(null);
  const [isAddDisplayModalOpen, setIsAddDisplayModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDisplaySerial, setNewDisplaySerial] = useState('');
  const [newDisplayResolution, setNewDisplayResolution] = useState('3840 × 2160 (4K UHD)');

  const [newLocName, setNewLocName] = useState('');
  const [newLocCity, setNewLocCity] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocManager, setNewLocManager] = useState('');

  const onlineCount = displays.filter((d) => d.status === 'online').length;

  const filteredDisplays = displays.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(displaySearch.toLowerCase()) ||
      d.serial.toLowerCase().includes(displaySearch.toLowerCase()) ||
      d.locationName.toLowerCase().includes(displaySearch.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'online') return d.status === 'online';
    if (statusFilter === 'provisioning') return d.status === 'provisioning';
    return true;
  });

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

  const handlePushToDisplay = (device: TVDisplayDevice, slideId?: string) => {
    const targetSlide = items.find((i) => i.id === (slideId || device.assignedSlideId)) || items[0];
    onUpdateDisplay(device.id, {
      assignedSlideId: targetSlide.id,
      status: 'online',
      heartbeat: 'active',
      lastPing: 'Just now'
    });
    setPushSuccessId(device.id);
    setTimeout(() => setPushSuccessId(null), 2000);
    onNotify?.(`Pushed "#${targetSlide.itemNumber} ${targetSlide.name}" to ${device.serial}`);
  };

  const handlePushActiveSlideToAll = () => {
    const activeItem = items[playlist.activeItemIndex] || items[0];
    displays.forEach((d) => {
      onUpdateDisplay(d.id, {
        assignedSlideId: activeItem.id,
        status: 'online',
        heartbeat: 'active',
        lastPing: 'Just now'
      });
    });
    onNotify?.(`Broadcasted "#${activeItem.itemNumber} ${activeItem.name}" to all ${displays.length} displays`);
  };

  const handleCopyPlayerLink = (device: TVDisplayDevice) => {
    navigator.clipboard.writeText(device.playerUrl);
    setCopiedDeviceId(device.id);
    setTimeout(() => setCopiedDeviceId(null), 2000);
    onNotify?.(`Copied player stream URL for ${device.serial}`);
  };

  const handleCreateDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) return;
    const nextIndex = displays.length + 1;
    const serial = newDisplaySerial.trim() || `${19129120 + nextIndex}`;
    const newDev: TVDisplayDevice = {
      id: `disp-${Date.now()}`,
      name: `${locations[0]?.name || 'HSB Croydon'} — ${newDisplayName.trim()}`,
      serial,
      locationId: locations[0]?.id || 'loc-croydon',
      locationName: locations[0]?.name || 'HSB Croydon',
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
    onNotify?.(`Registered display ${serial}`);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocCity.trim()) return;
    const newLoc: RestaurantLocation = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      city: newLocCity.trim(),
      address: newLocAddress.trim() || 'High Street, United Kingdom',
      displayCount: 0,
      managers: newLocManager.trim() ? [newLocManager.trim()] : ['DEV Admin 06 Croydon']
    };
    onAddLocation(newLoc);
    setNewLocName('');
    setNewLocCity('');
    setNewLocAddress('');
    setNewLocManager('');
    setIsAddLocationModalOpen(false);
    onNotify?.(`Added branch location ${newLoc.name}`);
  };

  // --- TAB 3: ACCOUNT & BILLING STATE ---
  const [walletBalance, setWalletBalance] = useState<number>(150.0);
  const [autoRenewEnabled, setAutoRenewEnabled] = useState<boolean>(true);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<TeamUser['role']>('Location Manager');
  const [userLocation, setUserLocation] = useState(locations[0]?.name || 'HSB Croydon');

  const handleTopUpWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    onNotify?.(`Added £${amount.toFixed(2)} credit to prepaid wallet`);
  };

  const handleSendResetEmail = () => {
    setIsSendingReset(true);
    setTimeout(() => {
      setIsSendingReset(false);
      setResetEmailSent(true);
      onNotify?.('Password reset link sent to dev_admin_06_croydon@scoopify.co.uk');
    }, 450);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    const newUser: TeamUser = {
      id: `usr-${Date.now()}`,
      name: userName.trim(),
      email: userEmail.trim(),
      location: userLocation,
      role: userRole,
      passwordActiveDuration: '90 days remaining',
      status: 'active'
    };
    onAddUser(newUser);
    setUserName('');
    setUserEmail('');
    setIsCreateUserModalOpen(false);
    onNotify?.(`Invited ${newUser.name} (${newUser.role})`);
  };

  // Card surface helpers
  const cardSurface = isDark
    ? 'bg-[#151f35] border-[#22304f] text-white'
    : 'bg-white border-gray-200 text-gray-900 shadow-xs';
  const subSurface = isDark
    ? 'bg-[#0f172a] border-[#1e293b]'
    : 'bg-gray-50 border-gray-200';
  const inputSurface = isDark
    ? 'bg-[#0f172a] border-[#263554] text-white placeholder-gray-500 focus:border-emerald-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-600';

  return (
    <div className="h-full min-h-0 flex flex-col gap-2.5 overflow-hidden select-none">
      {/* TOP CONSOLIDATED BAR: 3 Tabs + Operational Telemetry Chips */}
      <div
        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border flex-shrink-0 ${cardSurface}`}
      >
        {/* Left: Title + 3 Consolidated Segmented Tabs */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-gray-700/50">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-extrabold tracking-tight uppercase">
              Settings
            </span>
          </div>

          <div
            className={`inline-flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-[#0b1120] border-[#1e293b]' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR &amp; Branding</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('displays_locations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'displays_locations'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Displays &amp; Locations</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  activeTab === 'displays_locations'
                    ? 'bg-emerald-800/80 text-emerald-100'
                    : isDark
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {displays.length}·{locations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('account_billing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'account_billing'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Account &amp; Billing</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  activeTab === 'account_billing'
                    ? 'bg-emerald-800/80 text-emerald-100'
                    : isDark
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {users.length}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Quick Status & Action Bar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            onClick={() => setActiveTab('displays_locations')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${subSurface}`}
            title="View connected displays"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono tabular-nums text-emerald-400 font-bold">
              {onlineCount}/{displays.length}
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Displays Online</span>
          </div>

          <div
            onClick={() => setActiveTab('account_billing')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${subSurface}`}
            title="Manage Prepaid Wallet"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Wallet:</span>
            <span className="font-mono tabular-nums font-bold text-emerald-400">
              £{walletBalance.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenFullscreenTV}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Broadcast</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: QR & BRANDING (5 COLS LEFT / 7 COLS RIGHT, NO SCROLLBARS)       */}
      {/* ===================================================================== */}
      {activeTab === 'qr' && (
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
          {/* LEFT PANEL (5 COLS): Table Menu QR Code Studio */}
          <div
            className={`col-span-12 lg:col-span-5 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
          >
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    Table Menu QR Code &amp; Posters
                  </h2>
                  <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Synced across table tent cards, posters &amp; display slides
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active QR
              </span>
            </div>

            {/* Center QR Preview Container */}
            <div
              className={`my-auto py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 ${subSurface}`}
            >
              <div className="p-2.5 bg-white rounded-xl shadow-md border border-gray-200">
                <QRCodeRenderer
                  value={branding.menuUrl}
                  pattern={screenDesign.qrCode.pattern}
                  dotColor={screenDesign.qrCode.dotColor}
                  cardColor="#ffffff"
                  isTransparent={false}
                  effect={screenDesign.qrCode.effect}
                  centerLogoUrl={branding.logoUrl}
                  showCenterLogo={true}
                  size={142}
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold block">{branding.name}</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Scan to view live menu &amp; order at table
                </span>
              </div>
            </div>

            {/* Digital Menu URL + Center Logo Controls */}
            <div className="space-y-2 flex-shrink-0">
              {/* Copyable URL Bar */}
              <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${subSurface}`}>
                <input
                  type="text"
                  readOnly
                  value={branding.menuUrl}
                  className="w-full text-[11px] bg-transparent px-2 font-mono truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyMenuUrl}
                  className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    copiedUrl
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMenuPreview}
                  className={`p-1.5 rounded cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Preview Customer Menu"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center QR Logo Strip */}
              <div className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${subSurface}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full border border-gray-400/40 bg-white p-0.5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {branding.logoUrl ? (
                      <img
                        src={branding.logoUrl}
                        alt="QR Center Logo"
                        className="w-full h-full object-contain rounded-full"
                      />
                    ) : (
                      <QrCode className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">Center QR Badge Logo</span>
                    <span className={`text-[10px] block truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Embedded inside QR on posters &amp; displays
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <input
                    type="file"
                    ref={qrLogoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrLogoInputRef.current?.click()}
                    className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-[#151f35] border-gray-700 hover:border-gray-500 text-gray-200'
                        : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBranding({ logoUrl: '' })}
                    className="p-1 text-gray-400 hover:text-red-400 rounded cursor-pointer"
                    title="Remove center logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#0f172a] border-[#263554] hover:border-gray-500 text-gray-200'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>QR PNG</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenPrintModal}
                  className="py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Posters</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMenuPreview}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#0f172a] border-[#263554] hover:border-gray-500 text-gray-200'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Menu</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (7 COLS): Restaurant Branding & Display Theme */}
          <div
            className={`col-span-12 lg:col-span-7 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-800/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    Restaurant Identity &amp; Display Styling
                  </h2>
                  <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Configure brand identity, item badge colours, and display footer banner
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveBrandSettings}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {justSavedBrand ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-12 gap-3 my-auto py-2">
              {/* Row 1: Brand Logo Upload + Accent Colour Picker */}
              <div className={`col-span-12 sm:col-span-6 p-2.5 rounded-xl border flex items-center justify-between gap-2 ${subSurface}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 rounded-full border border-gray-500/40 bg-white p-0.5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={branding.logoUrl}
                      alt="Brand Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">Restaurant Logo</span>
                    <span className={`text-[10px] block truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Header &amp; display footer
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div className={`col-span-12 sm:col-span-6 p-2.5 rounded-xl border flex flex-col justify-center ${subSurface}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Primary Brand Accent
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">
                    {branding.accentColor}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => onUpdateBranding({ accentColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0 flex-shrink-0"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    {ACCENT_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => onUpdateBranding({ accentColor: swatch })}
                        className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                          branding.accentColor.toLowerCase() === swatch.toLowerCase()
                            ? 'scale-110 ring-2 ring-white border-transparent'
                            : 'border-white/20 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: swatch }}
                        title={swatch}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Restaurant Name & Branch Name */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={branding.name}
                  onChange={(e) => onUpdateBranding({ name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold focus:outline-none ${inputSurface}`}
                  placeholder="e.g. HSB Croydon"
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Display Branch Label
                </label>
                <input
                  type="text"
                  value={banner.locationText}
                  onChange={(e) => {
                    onUpdateBanner({ locationText: e.target.value });
                    onUpdateBranding({ branchName: e.target.value });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold focus:outline-none ${inputSurface}`}
                  placeholder="e.g. Croydon"
                />
              </div>

              {/* Row 3: Tagline & Menu Address Slug */}
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Menu &amp; Display Tagline
                </label>
                <input
                  type="text"
                  value={branding.tagline}
                  onChange={(e) => {
                    onUpdateBranding({ tagline: e.target.value });
                    onUpdateBanner({ textSubtitle: e.target.value });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${inputSurface}`}
                  placeholder="World's No.1 Indian Vegetarian Restaurant Chain"
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Digital Menu URL Slug
                </label>
                <div className={`flex items-center rounded-lg border overflow-hidden ${inputSurface}`}>
                  <span className="px-2 py-2 text-[10px] font-mono text-gray-400 bg-black/20 border-r border-gray-700/50 select-none">
                    /dine/in/
                  </span>
                  <input
                    type="text"
                    value={branding.menuAddressSlug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                      onUpdateBranding({
                        menuAddressSlug: slug,
                        menuUrl: `https://orders.scoopdine.co.uk/dine/in/${slug}`
                      });
                    }}
                    className="w-full px-2.5 py-2 bg-transparent text-xs font-mono focus:outline-none"
                    placeholder="hsb-croydon"
                  />
                </div>
              </div>

              {/* Row 4: Display Footer Banner & QR Theme Presets */}
              <div className={`col-span-12 p-3 rounded-xl border ${subSurface}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    One-Click Display &amp; QR Theme Presets
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-gray-400">QR Dots:</span>
                      <input
                        type="color"
                        value={screenDesign.qrCode.dotColor}
                        onChange={(e) =>
                          onUpdateScreenDesign({
                            qrCode: { ...screenDesign.qrCode, dotColor: e.target.value }
                          })
                        }
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-gray-400">Banner Bg:</span>
                      <input
                        type="color"
                        value={banner.backgroundColor}
                        onChange={(e) => onUpdateBanner({ backgroundColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SCREEN_STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onUpdateBranding({ accentColor: preset.accent });
                        onUpdateBanner({ backgroundColor: preset.bannerBg });
                        onUpdateScreenDesign({
                          background: {
                            ...screenDesign.background,
                            color: preset.bg
                          },
                          qrCode: {
                            ...screenDesign.qrCode,
                            dotColor: preset.qrDot
                          }
                        });
                        onNotify?.(`Applied "${preset.label}" theme preset`);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#151f35] border-[#263554] hover:border-emerald-500/60'
                          : 'bg-white border-gray-200 hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: preset.bg }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                        <span className="text-[11px] font-bold truncate">{preset.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {preset.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400 flex-shrink-0">
              <span>
                Footer Strip: <strong className="text-emerald-400">{banner.textTitle}</strong> ·{' '}
                {banner.locationText}
              </span>
              <span className="font-mono">2560 × 1440 UHD Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: DISPLAYS & LOCATIONS (7 COLS LEFT / 5 COLS RIGHT, NO SCROLL)   */}
      {/* ===================================================================== */}
      {activeTab === 'displays_locations' && (
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
          {/* LEFT PANEL (7 COLS): Connected Hardware Display Fleet */}
          <div
            className={`col-span-12 lg:col-span-7 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
          >
            {/* Header & Fleet Batch Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-800/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    Connected Hardware Displays ({displays.length})
                  </h2>
                  <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Assign active dishes, monitor heartbeat telemetry &amp; copy player stream links
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePushActiveSlideToAll}
                  className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Sync All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDisplayModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Display</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Strip */}
            <div className="flex items-center justify-between gap-2 py-2 flex-shrink-0">
              <div className={`inline-flex p-0.5 rounded-lg border ${subSurface}`}>
                {(['all', 'online', 'provisioning'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize cursor-pointer transition-colors ${
                      statusFilter === status
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {status === 'all'
                      ? `All (${displays.length})`
                      : status === 'online'
                      ? `Online (${onlineCount})`
                      : `Provisioning (${displays.length - onlineCount})`}
                  </button>
                ))}
              </div>

              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displaySearch}
                  onChange={(e) => setDisplaySearch(e.target.value)}
                  placeholder="Filter serial or name..."
                  className={`w-full text-[11px] pl-8 pr-2.5 py-1.5 rounded-lg border focus:outline-none ${inputSurface}`}
                />
              </div>
            </div>

            {/* Displays Table List */}
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 overflow-hidden">
              <div className="space-y-2 my-auto">
                {filteredDisplays.map((disp) => {
                  const isOnline = disp.status === 'online';
                  const assignedDish =
                    items.find((i) => i.id === disp.assignedSlideId) || items[0];

                  return (
                    <div
                      key={disp.id}
                      onClick={() => setInspectingDevice(disp)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isDark
                          ? 'bg-[#0f172a] border-[#1e293b] hover:border-emerald-500/50'
                          : 'bg-gray-50 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      {/* Left: Dish Preview + Serial Info */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-gray-700">
                          <img
                            src={assignedDish.imageUrl}
                            alt={assignedDish.name}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className="absolute bottom-0 right-0 px-1 text-[8px] font-black text-white font-mono"
                            style={{ backgroundColor: assignedDish.badgeColor }}
                          >
                            #{assignedDish.itemNumber}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">{disp.name}</span>
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <span>SN: #{disp.serial}</span>
                            <span>·</span>
                            <span>{disp.resolution?.split(' ')[0] || '1080p'}</span>
                            <span>·</span>
                            <span className="text-emerald-400 truncate">
                              #{assignedDish.itemNumber} {assignedDish.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Controls */}
                      <div
                        className="flex items-center gap-1.5 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => toggleHeartbeat(disp)}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            isOnline
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isOnline ? 'Online' : 'Provision'}
                        </button>

                        <select
                          value={disp.assignedSlideId || items[0].id}
                          onChange={(e) => handlePushToDisplay(disp, e.target.value)}
                          className={`text-[11px] px-2 py-1 rounded-md border focus:outline-none cursor-pointer max-w-[130px] truncate ${inputSurface}`}
                          title="Assigned dish slide"
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
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            pushSuccessId === disp.id
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isDark
                              ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white'
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
                          title="Push slide now"
                        >
                          {pushSuccessId === disp.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyPlayerLink(disp)}
                          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                            isDark
                              ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white'
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
                          title="Copy player URL"
                        >
                          {copiedDeviceId === disp.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Telemetry */}
              <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400 flex-shrink-0">
                <span>Click any display row to open live output preview &amp; diagnostics</span>
                <span className="font-mono tabular-nums text-emerald-400">
                  Heartbeat Interval: 15s
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (5 COLS): Branch Locations Directory & Screen Frame Options */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 h-full min-h-0 overflow-hidden">
            {/* Top Card: Restaurant Branch Locations */}
            <div
              className={`flex-1 min-h-0 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-800/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Restaurant Locations ({locations.length})
                    </h3>
                    <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active branches &amp; regional timezone routing
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddLocationModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Branch</span>
                </button>
              </div>

              <div className="my-auto space-y-2 py-2">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`p-3 rounded-xl border flex flex-col gap-2 ${subSurface}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{loc.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {loc.city}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-emerald-400 font-bold">
                        {onlineCount}/{displays.length} Screens Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                      <div>
                        <span className="text-[10px] uppercase font-bold block text-gray-500">
                          Address
                        </span>
                        <span className={`truncate block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {loc.address || '100 High Street, Croydon CR0 1NA'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold block text-gray-500">
                          Timezone &amp; Manager
                        </span>
                        <span className={`truncate block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          Europe/London · {loc.managers?.[0] || 'DEV Admin'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400 flex-shrink-0">
                <span>Primary Branch: HSB Croydon</span>
                <span className="text-emerald-400 font-semibold">Auto-Sync Enabled</span>
              </div>
            </div>

            {/* Bottom Card: Display Layout & QR Frame Quick Toggles */}
            <div className={`rounded-xl border p-3.5 flex-shrink-0 ${cardSurface}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Display Frame &amp; Overlay Controls
                </span>
                <span className="text-[10px] font-mono text-gray-400">Real-Time</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateScreenDesign({
                      qrCode: {
                        ...screenDesign.qrCode,
                        showCenterLogo: !screenDesign.qrCode.showCenterLogo
                      }
                    })
                  }
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${subSurface}`}
                >
                  <span className="font-semibold text-[11px]">QR Center Logo</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      screenDesign.qrCode.showCenterLogo
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {screenDesign.qrCode.showCenterLogo ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateBanner({
                      showGuides: !banner.showGuides
                    })
                  }
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${subSurface}`}
                >
                  <span className="font-semibold text-[11px]">Safe-Zone Guides</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      banner.showGuides
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {banner.showGuides ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ACCOUNT & BILLING (USERS + ACCOUNT + WALLET + CONTRACT)        */}
      {/* ===================================================================== */}
      {activeTab === 'account_billing' && (
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
          {/* LEFT PANEL (7 COLS): Team Users Directory + Account Security */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-3 h-full min-h-0 overflow-hidden">
            {/* Top Card: Team & Location Managers */}
            <div
              className={`flex-1 min-h-0 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-800/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider">
                      Team &amp; Location Managers ({users.length})
                    </h2>
                    <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Role-based access control for branch menus, photos &amp; display schedules
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateUserModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create User</span>
                </button>
              </div>

              {/* Table Header */}
              <div
                className={`grid grid-cols-12 px-3 py-2 rounded-t-lg text-[10px] font-bold uppercase tracking-wider border-b flex-shrink-0 ${
                  isDark
                    ? 'bg-[#0f172a] border-gray-800 text-gray-400'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}
              >
                <div className="col-span-3">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Branch</div>
                <div className="col-span-2">Password</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Users List */}
              <div className="flex-1 min-h-0 flex flex-col justify-center divide-y divide-gray-800/40 overflow-hidden">
                {users.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No Location Managers registered yet — click Create User to invite staff.
                  </div>
                ) : (
                  users.slice(0, 4).map((usr) => (
                    <div
                      key={usr.id}
                      className="grid grid-cols-12 px-3 py-2.5 items-center text-xs"
                    >
                      <div className="col-span-3 font-bold truncate pr-2">
                        {usr.name}
                        <span className="block text-[10px] font-normal text-emerald-400">
                          {usr.role}
                        </span>
                      </div>
                      <div className="col-span-4 text-[11px] font-mono text-gray-400 truncate pr-2">
                        {usr.email}
                      </div>
                      <div className="col-span-2 text-[11px] truncate">{usr.location}</div>
                      <div className="col-span-2 text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{usr.passwordActiveDuration}</span>
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteUser(usr.id);
                            onNotify?.(`Removed user ${usr.name}`);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 rounded cursor-pointer"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Card: Account Security & Password Reset */}
            <div className={`rounded-xl border p-3.5 flex-shrink-0 ${cardSurface}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Account Security &amp; Password Reset
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Client Admin
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Signed in as{' '}
                      <strong className={isDark ? 'text-white font-mono' : 'text-gray-900 font-mono'}>
                        dev_admin_06_croydon@scoopify.co.uk
                      </strong>
                    </p>
                  </div>
                </div>

                {resetEmailSent ? (
                  <div className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-700/80 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reset link emailed</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    disabled={isSendingReset}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isSendingReset ? 'Sending...' : 'Send Password Reset Link'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (5 COLS): Prepaid Wallet & Active Contract Licences */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 h-full min-h-0 overflow-hidden">
            {/* Top Card: Prepaid Wallet & Payment */}
            <div className={`rounded-xl border p-3.5 flex-shrink-0 ${cardSurface}`}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Prepaid Wallet &amp; Billing
                    </h3>
                    <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Display player credits &amp; automated top-up
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoRenewEnabled((v) => !v)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                    autoRenewEnabled
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  Auto-Renew: {autoRenewEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Available Balance
                  </span>
                  <div className="text-2xl font-black font-mono tabular-nums text-emerald-400">
                    £{walletBalance.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Auto-renews £50.00 when balance drops below £25.00
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleTopUpWallet(amt)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      +£{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-2 rounded-lg border flex items-center justify-between text-xs ${subSurface}`}>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Visa ending in 4242</span>
                  <span className="text-[10px] text-gray-400">· £45/mo (3 displays)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Verified</span>
              </div>
            </div>

            {/* Bottom Card: Active Digital Screen Contract */}
            <div
              className={`flex-1 min-h-0 rounded-xl border p-3.5 flex flex-col justify-between overflow-hidden ${cardSurface}`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-800/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Active Screen Contract
                    </h3>
                    <p className={`text-[11px] font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Agreement #SCP-2026-CR01 · ScoopDine UK Ltd
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  99.9% SLA
                </span>
              </div>

              <div className="my-auto space-y-1.5 py-2">
                {displays.map((disp) => (
                  <div
                    key={disp.id}
                    className={`px-3 py-2 rounded-lg border flex items-center justify-between text-xs ${subSurface}`}
                  >
                    <div className="min-w-0">
                      <span className="font-bold font-mono text-[11px] text-emerald-400">
                        #{disp.serial}
                      </span>
                      <span className="mx-1.5 text-gray-500">·</span>
                      <span className="font-semibold truncate">{disp.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-300 flex-shrink-0">
                      Licensed ({disp.resolution?.split(' ')[0] || '4K'})
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-gray-400 flex-shrink-0">
                <span>Term: Annual Enterprise Fleet</span>
                <span className="font-mono text-gray-300">Renewal: Oct 2027</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS: REGISTER DISPLAY, ADD LOCATION, CREATE USER, INSPECT DEVICE   */}
      {/* ===================================================================== */}
      {isAddDisplayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDisplay}
            className={`rounded-2xl max-w-md w-full border p-5 shadow-2xl space-y-3.5 ${cardSurface}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-400" />
                Register New Display
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDisplayModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Display Placement Name
              </label>
              <input
                type="text"
                required
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g. Main Dining Hall North"
                className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
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
                placeholder="Auto-assigned if left blank"
                className={`w-full text-xs px-3 py-2 rounded-lg border font-mono focus:outline-none ${inputSurface}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Resolution Profile
              </label>
              <select
                value={newDisplayResolution}
                onChange={(e) => setNewDisplayResolution(e.target.value)}
                className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
              >
                <option value="3840 × 2160 (4K UHD)">3840 × 2160 (4K UHD)</option>
                <option value="1920 × 1080 (FHD)">1920 × 1080 (FHD 1080p)</option>
                <option value="2560 × 1440 (QHD)">2560 × 1440 (QHD 2K)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddDisplayModalOpen(false)}
                className="px-3.5 py-1.5 border border-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Register Display
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLocation}
            className={`rounded-2xl max-w-md w-full border p-5 shadow-2xl space-y-3.5 ${cardSurface}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Add Restaurant Branch Location
              </h3>
              <button
                type="button"
                onClick={() => setIsAddLocationModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. HSB Wembley"
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={newLocCity}
                  onChange={(e) => setNewLocCity(e.target.value)}
                  placeholder="e.g. London"
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={newLocAddress}
                onChange={(e) => setNewLocAddress(e.target.value)}
                placeholder="e.g. 555 High Road, Wembley HA0 2DW"
                className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Branch Manager
              </label>
              <input
                type="text"
                value={newLocManager}
                onChange={(e) => setNewLocManager(e.target.value)}
                placeholder="e.g. Karthik Sundar"
                className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddLocationModalOpen(false)}
                className="px-3.5 py-1.5 border border-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Branch
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className={`rounded-2xl max-w-md w-full border p-5 shadow-2xl space-y-3.5 ${cardSurface}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Invite Team Member / Location Manager
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateUserModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="rahul.sharma@scoopify.co.uk"
                className={`w-full text-xs px-3 py-2 rounded-lg border font-mono focus:outline-none ${inputSurface}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Role
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as TeamUser['role'])}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
                >
                  <option value="Location Manager">Location Manager</option>
                  <option value="Client Admin">Client Admin</option>
                  <option value="Display Operator">Display Operator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Assigned Location
                </label>
                <select
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${inputSurface}`}
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsCreateUserModalOpen(false)}
                className="px-3.5 py-1.5 border border-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {inspectingDevice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-xl w-full border p-5 shadow-2xl space-y-4 ${cardSurface}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div>
                <h3 className="font-bold text-sm">{inspectingDevice.name}</h3>
                <p className="text-[11px] font-mono text-gray-400">
                  Serial #{inspectingDevice.serial} · {inspectingDevice.resolution}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDevice(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-800">
              <TVDisplayPreview
                config={config}
                currentItem={
                  items.find((i) => i.id === inspectingDevice.assignedSlideId) || items[0]
                }
                mode="preview"
                sequenceNumber={1}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => toggleHeartbeat(inspectingDevice)}
                className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {inspectingDevice.status === 'online' ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Set Provisioning</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Set Online</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenFullscreenTV}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Open Broadcast View
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingDevice(null)}
                  className="px-3.5 py-1.5 border border-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
