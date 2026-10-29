export type QRStylePattern = 'rounded' | 'square' | 'dotted' | 'dashed';
export type QREffect = 'none' | 'shadow' | 'glow' | 'neon';

export type BackgroundStyle = 'solid' | 'moving_gradient' | 'ambient';

export type BannerBorder = 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'neon' | 'gold';
export type BannerShadow = 'none' | 'soft' | 'lifted' | 'glow' | 'neon';

export type ThemeMode = 'dark' | 'light';

export type TransitionStyle = 'fade' | 'slide' | 'zoom' | 'flip' | 'ken_burns' | 'instant';

export interface TVItem {
  id: string;
  itemNumber: string; // e.g. "095"
  name: string; // e.g. "Bottled Water"
  subtitle: string; // e.g. "(Still / Sparkling)"
  description?: string;
  price?: string; // e.g. "£2.95"
  dietary?: 'veg' | 'non-veg' | 'vegan' | 'spicy' | 'special';
  imageUrl: string;
  badgeLabel: string; // e.g. "Item #"
  badgeColor?: string; // override or uses global accent
  accentGlowColor?: string;
  durationSeconds?: number;
  transitionStyle?: TransitionStyle;
}

export interface TVScreenDesignConfig {
  background: {
    style: BackgroundStyle;
    color: string; // hex, e.g. "#000000"
    secondaryColor?: string;
    ambientGlowColor: string;
    ambientIntensity: number; // 0 to 100
  };
  qrCode: {
    pattern: QRStylePattern;
    dotColor: string; // e.g. "#F91515"
    isTransparent: boolean;
    cardColor: string; // e.g. "#FFFFFF"
    effect: QREffect;
    headerText: string; // e.g. "SCAN HERE" or "SCAN ME"
    headerColor: string;
    footerTextPrefix: string; // e.g. "SEQ - #"
    showCenterLogo: boolean;
    centerLogoUrl?: string;
  };
  bannerFrame: {
    border: BannerBorder;
    borderColor: string;
    shadow: BannerShadow;
    corners: number; // in pixels, e.g. 40
    borderWidth: number; // 1, 2, 3
  };
}

export interface RestaurantBranding {
  name: string; // e.g. "HSB Croydon"
  tagline: string; // e.g. "World's Most Loved Indian Vegetarian Restaurant Chain"
  accentColor: string; // e.g. "#F91515"
  menuAddressSlug: string; // e.g. "hsb-croydon"
  menuUrl: string; // full URL e.g. "https://orders.scoopdine.co.uk/dine/in/hsb-croydon"
  logoUrl: string; // data url or path
  branchName: string; // e.g. "Croydon"
}

export interface TVBannerConfig {
  imageUrl?: string;
  textTitle: string; // e.g. "SARAVANAA BHAVAN"
  textSubtitle: string; // e.g. "WORLD'S NO. 1 INDIAN VEGETARIAN RESTAURANT CHAIN"
  locationText: string; // e.g. "Croydon"
  textColor: string; // e.g. "#FFFFFF"
  titleColor: string; // e.g. "#F91515"
  backgroundColor: string; // e.g. "#000000"
  showGuides: boolean;
}

export interface TVPlaylistConfig {
  autoCycle: boolean;
  cycleIntervalSeconds: number; // e.g. 8
  transitionEffect: TransitionStyle;
  showItemNumber: boolean;
  showSubtitle: boolean;
  showPrice: boolean;
  showSequenceNumber: boolean;
  activeItemIndex: number;
}

export interface TVDisplayDevice {
  id: string;
  name: string; // e.g. "HSB Croydon — HSB-CRY-TV-03"
  serial: string; // e.g. "HSB-CRY-TV-03"
  locationId: string;
  locationName: string;
  orientation: 'landscape' | 'portrait';
  playerUrl: string;
  status: 'provisioning' | 'online' | 'offline';
  heartbeat: 'active' | 'no_heartbeat';
  lastPing?: string;
  resolution?: string;
  assignedSlideId?: string;
}

export interface RestaurantLocation {
  id: string;
  name: string; // e.g. "HSB Croydon"
  address: string; // e.g. "100 High Street, Croydon, Greater London, CR0 1NA, United Kingdom"
  city: string; // e.g. "Croydon"
  displayCount: number;
  managers: string[];
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'Client Admin' | 'Location Manager' | 'Display Operator';
  passwordActiveDuration: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface AdPerformanceItem {
  id: string;
  adName: string;
  location: string;
  source: string;
  status: 'Active' | 'Scheduled' | 'Paused';
  displayViews: number;
  mobileViews: number;
  ctaClicks: number;
  ctaRate: string;
  likes: number;
  calls: number;
  emails: number;
  websiteVisits: number;
  saves: number;
  reports: number;
}

export interface AnalyticsSummary {
  submittedAds: number;
  displayViews: number;
  mobileViews: number;
  ctaClicks: number;
  period: 'All time' | 'Last 90 days' | 'Last 30 days' | 'Last 7 days';
  adList: AdPerformanceItem[];
}

export interface MenuItemRow {
  id: string;
  rowNumber: number;
  itemNumber: string;
  itemName: string;
  imageName: string;
  imageUrl?: string;
  hasImage: boolean;
  category: string;
  price: string;
  dietary: ('veg' | 'jain' | 'spicy' | 'most_popular' | 'chef_choice')[];
  status: 'ready' | 'missing_image';
}

export interface MenuSheetUpload {
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  totalDishes: number;
  status: 'waiting_for_approval' | 'approved';
}

export interface CustomerMenuOptions {
  photoSharingEnabled: boolean;
  showItemNumbers: boolean;
  showSequenceNumbers: boolean;
}

export interface CustomerPhoto {
  id: string;
  imageUrl: string;
  customerName: string;
  uploadedAt: string;
  location: string;
  dishId?: string;
  dishName?: string;
  itemNumber?: string;
  caption?: string;
  status: 'waiting_for_review' | 'approved' | 'rejected';
  addedToSchedule: boolean;
  likes?: number;
}

export type TypographyLetterSpacing = 'tight' | 'normal' | 'wide' | 'expanded';
export type TypographyShadowEffect = 'none' | 'soft' | 'glow' | 'neon';

export interface DisplayLayoutConfig {
  vertical: {
    headerPercent: number; // default 10
    contentPercent: number; // default 80
    footerPercent: number; // default 10
  };
  contentHorizontal: {
    productImagePercent: number; // default 80 (or 50-80)
    itemDetailsPercent: number; // default 10 (or 10-25)
    qrCodePercent: number; // default 10 (or 10-25)
  };
  footerHorizontal: {
    dateTimePercent: number; // default 10
    temperaturePercent: number; // default 10
    logoPercent: number; // default 80
  };
  headerText: string;
  showHeader: boolean;
  showFooter: boolean;
  showDateTime?: boolean;
  showTemperature?: boolean;
}

export interface ItemBadgeConfig {
  fontSize: number; // size in px (e.g. 24 - 72)
  backgroundColor: string; // e.g. "#F91515"
  textColor: string; // e.g. "#FFFFFF"
  borderRadius: number; // e.g. 16
  fontWeight: 'normal' | 'semibold' | 'bold' | 'bolder' | 'black';
  fontFamily: 'sans' | 'serif' | 'mono' | 'impact';
  label: string; // e.g. "Item #"
  labelFontSize: number;
  labelColor: string;
  titleFontSize: number;
  subtitleFontSize: number;
  titleColor: string;
  subtitleColor: string;
  borderWidth?: number; // 0 - 6px stroke around item badge
  borderColor?: string; // e.g. "#FFFFFF"
  letterSpacing?: TypographyLetterSpacing;
  textShadow?: TypographyShadowEffect;
  titleFontFamily?: 'sans' | 'serif' | 'mono' | 'impact';
}

export interface SequenceBadgeConfig {
  fontSize: number; // size in px (e.g. 10 - 24)
  backgroundColor: string; // e.g. "#F91515"
  textColor: string; // e.g. "#FFFFFF"
  borderRadius: number; // e.g. 8
  fontWeight: 'normal' | 'semibold' | 'bold' | 'bolder' | 'black';
  fontFamily: 'sans' | 'serif' | 'mono' | 'impact';
  prefix: string; // e.g. "SEQ - #"
  showBadge: boolean;
  borderWidth?: number; // 0 - 4px
  borderColor?: string; // e.g. "#FFFFFF"
  letterSpacing?: TypographyLetterSpacing;
}

export interface AppConfig {
  branding: RestaurantBranding;
  banner: TVBannerConfig;
  screenDesign: TVScreenDesignConfig;
  playlist: TVPlaylistConfig;
  items: TVItem[];
  displays: TVDisplayDevice[];
  locations: RestaurantLocation[];
  users: TeamUser[];
  analytics: AnalyticsSummary;
  theme: ThemeMode;
  menuOptions: CustomerMenuOptions;
  menuUploadSheet: MenuSheetUpload;
  menuItems: MenuItemRow[];
  customerPhotos: CustomerPhoto[];
  displayLayout: DisplayLayoutConfig;
  itemBadgeStyle: ItemBadgeConfig;
  sequenceBadgeStyle: SequenceBadgeConfig;
}


