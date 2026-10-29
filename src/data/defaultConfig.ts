import {
  AppConfig,
  TVItem,
  TVDisplayDevice,
  RestaurantLocation,
  TeamUser,
  AnalyticsSummary,
  CustomerMenuOptions,
  MenuSheetUpload,
  MenuItemRow,
  CustomerPhoto,
  DisplayLayoutConfig,
  ItemBadgeConfig,
  SequenceBadgeConfig
} from '../types/tvConfig';

// High quality SVG for the Saravanaa Bhavan / HSB green leaf logo badge
export const HSB_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="47" fill="#22c55e" stroke="#16a34a" stroke-width="3"/>
  <path d="M50 12 C68 28 82 45 74 72 C68 85 55 90 50 88 C45 90 32 85 26 72 C18 45 32 28 50 12 Z" fill="#ffffff"/>
  <path d="M50 16 C65 30 77 46 70 70 C65 80 54 85 50 84 C46 85 35 80 30 70 C23 46 35 30 50 16 Z" fill="#22c55e"/>
  <text x="50" y="56" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="-1">HSB</text>
  <path d="M50 20 L50 80" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
</svg>
`)}`;

export const SAMPLE_TV_ITEMS: TVItem[] = [
  {
    id: 'item-095',
    itemNumber: '095',
    name: 'Bottled Water',
    subtitle: '(Still / Sparkling)',
    description: 'Refreshing natural mineral water served chilled with ice cubes and lemon slice.',
    price: '£2.75',
    dietary: 'vegan',
    imageUrl: '/assets/aistudio/image_5c97a408.png', // The exact photo from user image 2
    badgeLabel: 'Item #',
    badgeColor: '#F91515',
    accentGlowColor: '#0ea5e9'
  },
  {
    id: 'item-024',
    itemNumber: '024',
    name: 'Paneer Tikka',
    subtitle: 'Smoky Tandoori Marinated',
    description: 'Char-grilled cottage cheese cubes, peppers, and red onions in a smoky spiced yoghurt marinade.',
    price: '£8.50',
    dietary: 'veg',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    badgeLabel: 'Item #',
    badgeColor: '#F91515',
    accentGlowColor: '#f97316'
  },
  {
    id: 'item-012',
    itemNumber: '012',
    name: 'Ghee Roast Dosa',
    subtitle: 'Crispy Golden Crêpe with Chutneys',
    description: 'Golden fermented rice-lentil crêpe roasted in clarified pure ghee, served with 3 coconut chutneys and hot sambar.',
    price: '£7.95',
    dietary: 'veg',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
    badgeLabel: 'Item #',
    badgeColor: '#F91515',
    accentGlowColor: '#eab308'
  },
  {
    id: 'item-038',
    itemNumber: '038',
    name: 'Mango Lassi',
    subtitle: 'Alphonso Mango & Sweet Yoghurt',
    description: 'Rich, creamy blended sweet yoghurt infused with pure ratnagiri Alphonso mango pulp and fragrant green cardamom.',
    price: '£4.25',
    dietary: 'veg',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80',
    badgeLabel: 'Item #',
    badgeColor: '#F91515',
    accentGlowColor: '#f59e0b'
  },
  {
    id: 'item-001',
    itemNumber: '001',
    name: 'South Indian Thali',
    subtitle: 'Grand Feast of 12 Traditional Dishes',
    description: 'Steamed rice, poori, sambar, rasam, kootu, poriyal, avial, curd, pickle, appalam, and warm payasam.',
    price: '£12.95',
    dietary: 'veg',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    badgeLabel: 'Item #',
    badgeColor: '#F91515',
    accentGlowColor: '#10b981'
  }
];

export const SAMPLE_DISPLAYS: TVDisplayDevice[] = [
  {
    id: 'disp-03',
    name: 'HSB Croydon — HSB-CRY-TV-03',
    serial: 'HSB-CRY-TV-03',
    locationId: 'loc-croydon',
    locationName: 'HSB Croydon',
    orientation: 'landscape',
    playerUrl:
      'https://newdev.scoopify.co.uk/player/c3389d9c-0873-4f8c-a401-1230b40a0266',
    status: 'provisioning',
    heartbeat: 'no_heartbeat',
    lastPing: '2 mins ago',
    resolution: '3840 × 2160 (4K UHD)',
    assignedSlideId: 'item-095'
  },
  {
    id: 'disp-02',
    name: 'HSB Croydon — HSB-CRY-TV-02',
    serial: 'HSB-CRY-TV-02',
    locationId: 'loc-croydon',
    locationName: 'HSB Croydon',
    orientation: 'landscape',
    playerUrl:
      'https://newdev.scoopify.co.uk/player/65e08950-485e-4a84-b1e1-fd23dc61c9f7',
    status: 'provisioning',
    heartbeat: 'no_heartbeat',
    lastPing: '4 mins ago',
    resolution: '1920 × 1080 (FHD)',
    assignedSlideId: 'item-024'
  },
  {
    id: 'disp-01',
    name: 'HSB Croydon — HSB-CRY-TV-01',
    serial: 'HSB-CRY-TV-01',
    locationId: 'loc-croydon',
    locationName: 'HSB Croydon',
    orientation: 'landscape',
    playerUrl:
      'https://newdev.scoopify.co.uk/player/02437e30-d242-4193-ab37-fe4ef9216c09',
    status: 'provisioning',
    heartbeat: 'no_heartbeat',
    lastPing: '1 min ago',
    resolution: '1920 × 1080 (FHD)',
    assignedSlideId: 'item-095'
  }
];

export const SAMPLE_LOCATIONS: RestaurantLocation[] = [
  {
    id: 'loc-croydon',
    name: 'HSB Croydon',
    address: '100 High Street, Croydon, Greater London, CR0 1NA, United Kingdom',
    city: 'Croydon',
    displayCount: 3,
    managers: ['DEV Admin 06 Croydon', 'Karthik Sundaram']
  }
];

export const SAMPLE_USERS: TeamUser[] = [
  {
    id: 'usr-01',
    name: 'DEV Admin 06 Croydon',
    email: 'dev_admin_06_croydon@scoopify.co.uk',
    location: 'HSB Croydon',
    role: 'Client Admin',
    passwordActiveDuration: '90 days remaining',
    status: 'active'
  },
  {
    id: 'usr-02',
    name: 'Karthik Sundaram',
    email: 'karthik.croydon@saravanaabhavan.co.uk',
    location: 'HSB Croydon',
    role: 'Location Manager',
    passwordActiveDuration: '74 days remaining',
    status: 'active'
  },
  {
    id: 'usr-03',
    name: 'Meera Krishnan',
    email: 'meera.ops@saravanaabhavan.co.uk',
    location: 'HSB Croydon',
    role: 'Display Operator',
    passwordActiveDuration: '82 days remaining',
    status: 'active'
  }
];

export const SAMPLE_ANALYTICS: AnalyticsSummary = {
  submittedAds: 6,
  displayViews: 18450,
  mobileViews: 6376,
  ctaClicks: 1649,
  period: 'All time',
  adList: [
    {
      id: 'ad-01',
      adName: 'Item #095 Bottled Water Summer Special',
      location: 'HSB Croydon',
      source: 'In-House TV Signage',
      status: 'Active',
      displayViews: 1420,
      mobileViews: 384,
      ctaClicks: 89,
      ctaRate: '23.1%',
      likes: 42,
      calls: 6,
      emails: 1,
      websiteVisits: 74,
      saves: 28,
      reports: 0
    },
    {
      id: 'ad-02',
      adName: 'Item #024 Paneer Tikka Tandoori Night',
      location: 'HSB Croydon',
      source: 'ScoopDine Mobile Feed',
      status: 'Active',
      displayViews: 2180,
      mobileViews: 912,
      ctaClicks: 215,
      ctaRate: '23.5%',
      likes: 110,
      calls: 14,
      emails: 3,
      websiteVisits: 180,
      saves: 65,
      reports: 0
    },
    {
      id: 'ad-03',
      adName: 'Ghee Roast Dosa Weekend Brunch',
      location: 'HSB Croydon',
      source: 'TV Schedule & QR Stand',
      status: 'Active',
      displayViews: 3450,
      mobileViews: 1240,
      ctaClicks: 340,
      ctaRate: '27.4%',
      likes: 215,
      calls: 22,
      emails: 5,
      websiteVisits: 290,
      saves: 112,
      reports: 0
    },
    {
      id: 'ad-04',
      adName: 'Item #008 Special South Indian Thali Feast',
      location: 'HSB Croydon',
      source: 'In-House TV Signage',
      status: 'Active',
      displayViews: 4820,
      mobileViews: 1840,
      ctaClicks: 495,
      ctaRate: '26.9%',
      likes: 310,
      calls: 38,
      emails: 8,
      websiteVisits: 412,
      saves: 164,
      reports: 0
    },
    {
      id: 'ad-05',
      adName: 'Item #015 Mango Lassi Summer Refreshment',
      location: 'HSB Croydon',
      source: 'ScoopDine Mobile Feed',
      status: 'Active',
      displayViews: 3110,
      mobileViews: 1020,
      ctaClicks: 265,
      ctaRate: '25.9%',
      likes: 184,
      calls: 16,
      emails: 2,
      websiteVisits: 220,
      saves: 88,
      reports: 0
    },
    {
      id: 'ad-06',
      adName: 'Item #032 Medu Vada Morning Breakfast Special',
      location: 'HSB Croydon',
      source: 'TV Schedule & QR Stand',
      status: 'Active',
      displayViews: 3470,
      mobileViews: 980,
      ctaClicks: 245,
      ctaRate: '25.0%',
      likes: 160,
      calls: 12,
      emails: 3,
      websiteVisits: 195,
      saves: 72,
      reports: 0
    }
  ]
};

export const SAMPLE_MENU_OPTIONS: CustomerMenuOptions = {
  photoSharingEnabled: false,
  showItemNumbers: true,
  showSequenceNumbers: true
};

export const SAMPLE_MENU_UPLOAD_SHEET: MenuSheetUpload = {
  fileName: 'saravanaa_bhavan_menu_all_available.xlsx',
  uploadedBy: 'DEV Admin 06 Croydon',
  uploadedAt: '26/10/2026, 17:09:59',
  totalDishes: 219,
  status: 'waiting_for_approval'
};

export const SAMPLE_MENU_ITEMS: MenuItemRow[] = [
  {
    id: 'm-101',
    rowNumber: 1,
    itemNumber: '101',
    itemName: 'Schezwan Paneer',
    imageName: 'D23.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'spicy'],
    status: 'missing_image'
  },
  {
    id: 'm-102',
    rowNumber: 2,
    itemNumber: '102',
    itemName: 'Chilli Paneer',
    imageName: 'D24.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'spicy'],
    status: 'missing_image'
  },
  {
    id: 'm-103',
    rowNumber: 3,
    itemNumber: '103',
    itemName: 'Chilli Mushroom',
    imageName: 'D25.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'spicy'],
    status: 'missing_image'
  },
  {
    id: 'm-104',
    rowNumber: 4,
    itemNumber: '104',
    itemName: 'Paneer 65',
    imageName: 'D26.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'most_popular'],
    status: 'missing_image'
  },
  {
    id: 'm-107',
    rowNumber: 5,
    itemNumber: '107',
    itemName: 'Gobi 65',
    imageName: 'D27.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'most_popular'],
    status: 'missing_image'
  },
  {
    id: 'm-108',
    rowNumber: 6,
    itemNumber: '108',
    itemName: 'Chilli Gobi',
    imageName: 'D28.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg', 'spicy'],
    status: 'missing_image'
  },
  {
    id: 'm-109',
    rowNumber: 7,
    itemNumber: '109',
    itemName: 'Crispy Baby Corn',
    imageName: 'D29.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.95',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-110',
    rowNumber: 8,
    itemNumber: '110',
    itemName: 'Veg Spring Roll (2 Pcs)',
    imageName: 'D30.jpg',
    hasImage: false,
    category: 'Starters',
    price: '6.75',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-114',
    rowNumber: 9,
    itemNumber: '114',
    itemName: 'Tea',
    imageName: 'D31.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.85 / 3.25',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-115',
    rowNumber: 10,
    itemNumber: '115',
    itemName: 'Masala Tea',
    imageName: 'D32.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.95 / 3.35',
    dietary: ['veg', 'most_popular'],
    status: 'missing_image'
  },
  {
    id: 'm-116',
    rowNumber: 11,
    itemNumber: '116',
    itemName: 'Filter Coffee',
    imageName: 'D33.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.85 / 3.25',
    dietary: ['veg', 'chef_choice'],
    status: 'missing_image'
  },
  {
    id: 'm-116A',
    rowNumber: 12,
    itemNumber: '116A',
    itemName: 'Masala Coffee',
    imageName: 'D34.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.95 / 3.35',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-116B',
    rowNumber: 13,
    itemNumber: '116B',
    itemName: 'Hot Chocolate',
    imageName: 'D35.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.85 / 3.25',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-116C',
    rowNumber: 14,
    itemNumber: '116C',
    itemName: 'Horlicks',
    imageName: 'D36.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.95 / 3.35',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-117',
    rowNumber: 15,
    itemNumber: '117',
    itemName: 'Bournvita',
    imageName: 'D37.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '2.95 / 3.35',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-117A',
    rowNumber: 16,
    itemNumber: '117A',
    itemName: 'Coffee Flask',
    imageName: 'D38.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '5.65',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-117B',
    rowNumber: 17,
    itemNumber: '117B',
    itemName: 'Tea Flask',
    imageName: 'D39.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '5.65',
    dietary: ['veg'],
    status: 'missing_image'
  },
  {
    id: 'm-118',
    rowNumber: 18,
    itemNumber: '118',
    itemName: 'Buttermilk',
    imageName: 'D40.jpg',
    hasImage: false,
    category: 'Hot Beverages',
    price: '3.75',
    dietary: ['veg', 'jain'],
    status: 'missing_image'
  },
  {
    id: 'm-141',
    rowNumber: 19,
    itemNumber: '141',
    itemName: 'Beer 1 Pint / Bottle',
    imageName: 'D41.jpg',
    hasImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1608270144670-428a1c97a5b3?auto=format&fit=crop&w=200&q=80',
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'ready'
  },
  {
    id: 'm-142',
    rowNumber: 20,
    itemNumber: '142',
    itemName: 'White Wine',
    imageName: 'D42.jpg',
    hasImage: false,
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'missing_image'
  },
  {
    id: 'm-143',
    rowNumber: 21,
    itemNumber: '143',
    itemName: 'Red Wine',
    imageName: 'D43.jpg',
    hasImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=200&q=80',
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'ready'
  },
  {
    id: 'm-144',
    rowNumber: 22,
    itemNumber: '144',
    itemName: 'Rose Wine',
    imageName: 'D44.jpg',
    hasImage: true,
    imageUrl: 'https://images.unsplash.com/photo-1558001373-4b93b9549f42?auto=format&fit=crop&w=200&q=80',
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'ready'
  },
  {
    id: 'm-145',
    rowNumber: 23,
    itemNumber: '145',
    itemName: 'Prosecco',
    imageName: 'D45.jpg',
    hasImage: false,
    category: 'Beer / Wine',
    price: '7.25 / 13.50',
    dietary: [],
    status: 'missing_image'
  },
  {
    id: 'm-146',
    rowNumber: 24,
    itemNumber: '146',
    itemName: 'House White / Red Wine 1 Pint / Bottle',
    imageName: 'D46.jpg',
    hasImage: false,
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'missing_image'
  },
  {
    id: 'm-147',
    rowNumber: 25,
    itemNumber: '147',
    itemName: 'Sauvignon Blanc - Chile - Sparkling Wine 1 Pint / Bottle',
    imageName: 'D47.jpg',
    hasImage: false,
    category: 'Beer / Wine',
    price: '6.75 / 12.50',
    dietary: [],
    status: 'missing_image'
  }
];

export const SAMPLE_CUSTOMER_PHOTOS: CustomerPhoto[] = [
  {
    id: 'c-photo-01',
    customerName: 'Priya Sharma',
    uploadedAt: '12 mins ago',
    location: 'HSB Croydon',
    dishId: 'item-024',
    dishName: 'Paneer Tikka',
    itemNumber: '024',
    caption: 'The smokiest tandoori paneer in Croydon! Amazing crisp edges and fresh mint chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    status: 'waiting_for_review',
    addedToSchedule: false,
    likes: 4
  },
  {
    id: 'c-photo-02',
    customerName: 'Arun Patel',
    uploadedAt: '45 mins ago',
    location: 'HSB Croydon',
    dishId: 'item-012',
    dishName: 'Ghee Roast Dosa',
    itemNumber: '012',
    caption: 'Golden, paper-thin, dripping in authentic desi ghee. The sambar is piping hot!',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    status: 'waiting_for_review',
    addedToSchedule: false,
    likes: 9
  },
  {
    id: 'c-photo-03',
    customerName: 'Rohan Mehta',
    uploadedAt: '2 hours ago',
    location: 'HSB Croydon',
    dishId: 'item-038',
    dishName: 'Mango Lassi',
    itemNumber: '038',
    caption: 'Thick and chilled Alphonso mango goodness!',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    status: 'approved',
    addedToSchedule: true,
    likes: 18
  },
  {
    id: 'c-photo-04',
    customerName: 'Kavita Sundaram',
    uploadedAt: 'Yesterday',
    location: 'HSB Croydon',
    caption: 'Blurry table setting photo from family dinner',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    status: 'rejected',
    addedToSchedule: false,
    likes: 1
  }
];

export const DEFAULT_DISPLAY_LAYOUT: DisplayLayoutConfig = {
  vertical: {
    headerPercent: 10,
    contentPercent: 80,
    footerPercent: 10
  },
  contentHorizontal: {
    productImagePercent: 80,
    itemDetailsPercent: 10,
    qrCodePercent: 10
  },
  footerHorizontal: {
    dateTimePercent: 10,
    temperaturePercent: 10,
    logoPercent: 80
  },
  headerText: 'SARAVANAA BHAVAN · SPECIAL RECOMMENDATIONS',
  showHeader: true,
  showFooter: true,
  showDateTime: true,
  showTemperature: true
};

export const DEFAULT_ITEM_BADGE_STYLE: ItemBadgeConfig = {
  fontSize: 54,
  backgroundColor: '#F91515',
  textColor: '#FFFFFF',
  borderRadius: 16,
  fontWeight: 'black',
  fontFamily: 'sans',
  label: 'Item #',
  labelFontSize: 16,
  labelColor: '#FFFFFF',
  titleFontSize: 44,
  subtitleFontSize: 22,
  titleColor: '#FFFFFF',
  subtitleColor: '#FFFFFF',
  borderWidth: 0,
  borderColor: '#FFFFFF',
  letterSpacing: 'normal',
  textShadow: 'glow',
  titleFontFamily: 'sans'
};

export const DEFAULT_SEQUENCE_BADGE_STYLE: SequenceBadgeConfig = {
  fontSize: 14,
  backgroundColor: '#F91515',
  textColor: '#FFFFFF',
  borderRadius: 8,
  fontWeight: 'black',
  fontFamily: 'sans',
  prefix: 'SEQ - #',
  showBadge: true,
  borderWidth: 0,
  borderColor: '#FFFFFF',
  letterSpacing: 'normal'
};

export const INITIAL_CONFIG: AppConfig = {
  theme: 'dark', // default to dark navy matching the admin screenshots
  branding: {
    name: 'HSB Croydon',
    tagline: "World's Most Loved Indian Vegetarian Restaurant Chain",
    accentColor: '#F91515',
    menuAddressSlug: 'hsb-croydon',
    menuUrl: 'https://orders.scoopdine.co.uk/dine/in/hsb-croydon',
    logoUrl: HSB_LOGO_SVG,
    branchName: 'Croydon'
  },
  banner: {
    textTitle: 'SARAVANAA BHAVAN',
    textSubtitle: "WORLD'S NO. 1 INDIAN VEGETARIAN RESTAURANT CHAIN",
    locationText: 'Croydon',
    textColor: '#FFFFFF',
    titleColor: '#F91515',
    backgroundColor: '#000000',
    showGuides: true
  },
  screenDesign: {
    background: {
      style: 'solid',
      color: '#000000',
      secondaryColor: '#1e1b4b',
      ambientGlowColor: '#e11d48',
      ambientIntensity: 65
    },
    qrCode: {
      pattern: 'rounded',
      dotColor: '#F91515',
      isTransparent: false,
      cardColor: '#FFFFFF',
      effect: 'shadow',
      headerText: 'SCAN HERE',
      headerColor: '#F91515',
      footerTextPrefix: 'SEQ - #',
      showCenterLogo: true,
      centerLogoUrl: HSB_LOGO_SVG
    },
    bannerFrame: {
      border: 'solid',
      borderColor: '#475569',
      shadow: 'lifted',
      corners: 40,
      borderWidth: 1
    }
  },
  playlist: {
    autoCycle: true,
    cycleIntervalSeconds: 8,
    transitionEffect: 'fade',
    showItemNumber: true,
    showSubtitle: true,
    showPrice: false,
    showSequenceNumber: true,
    activeItemIndex: 0
  },
  items: SAMPLE_TV_ITEMS,
  displays: SAMPLE_DISPLAYS,
  locations: SAMPLE_LOCATIONS,
  users: SAMPLE_USERS,
  analytics: SAMPLE_ANALYTICS,
  menuOptions: SAMPLE_MENU_OPTIONS,
  menuUploadSheet: SAMPLE_MENU_UPLOAD_SHEET,
  menuItems: SAMPLE_MENU_ITEMS,
  customerPhotos: SAMPLE_CUSTOMER_PHOTOS,
  displayLayout: DEFAULT_DISPLAY_LAYOUT,
  itemBadgeStyle: DEFAULT_ITEM_BADGE_STYLE,
  sequenceBadgeStyle: DEFAULT_SEQUENCE_BADGE_STYLE
};

export const COLOR_PALETTE = [
  { name: 'Black', hex: '#000000' },
  { name: 'Pitch Dark', hex: '#0a0a0a' },
  { name: 'Dark Navy', hex: '#0f172a' },
  { name: 'Deep Purple', hex: '#1a0b2e' },
  { name: 'Slate Gray', hex: '#1e293b' },
  { name: 'Off White', hex: '#f8fafc' }
];

export const PRESET_THEMES: Record<string, Partial<AppConfig>> = {
  saravanaa_classic: {
    branding: {
      name: 'HSB Croydon',
      tagline: "World's Most Loved Indian Vegetarian Restaurant Chain",
      accentColor: '#F91515',
      menuAddressSlug: 'hsb-croydon',
      menuUrl: 'https://orders.scoopdine.co.uk/dine/in/hsb-croydon',
      logoUrl: HSB_LOGO_SVG,
      branchName: 'Croydon'
    },
    screenDesign: {
      background: {
        style: 'solid',
        color: '#000000',
        ambientGlowColor: '#b91c1c',
        ambientIntensity: 50
      },
      qrCode: {
        pattern: 'rounded',
        dotColor: '#F91515',
        isTransparent: false,
        cardColor: '#FFFFFF',
        effect: 'shadow',
        headerText: 'SCAN HERE',
        headerColor: '#F91515',
        footerTextPrefix: 'SEQ - #',
        showCenterLogo: true,
        centerLogoUrl: HSB_LOGO_SVG
      },
      bannerFrame: {
        border: 'solid',
        borderColor: '#475569',
        shadow: 'lifted',
        corners: 40,
        borderWidth: 1
      }
    }
  },
  neon_cyber: {
    branding: {
      name: 'HSB Croydon',
      tagline: 'Modern Indian Cuisine & Grill',
      accentColor: '#06b6d4',
      menuAddressSlug: 'hsb-croydon',
      menuUrl: 'https://orders.scoopdine.co.uk/dine/in/hsb-croydon',
      logoUrl: HSB_LOGO_SVG,
      branchName: 'Croydon'
    },
    screenDesign: {
      background: {
        style: 'moving_gradient',
        color: '#030712',
        secondaryColor: '#083344',
        ambientGlowColor: '#06b6d4',
        ambientIntensity: 85
      },
      qrCode: {
        pattern: 'dashed',
        dotColor: '#06b6d4',
        isTransparent: false,
        cardColor: '#0f172a',
        effect: 'neon',
        headerText: 'SCAN ME',
        headerColor: '#06b6d4',
        footerTextPrefix: 'SEQ - #',
        showCenterLogo: true,
        centerLogoUrl: HSB_LOGO_SVG
      },
      bannerFrame: {
        border: 'neon',
        borderColor: '#06b6d4',
        shadow: 'neon',
        corners: 20,
        borderWidth: 2
      }
    }
  },
  luxury_gold: {
    branding: {
      name: 'HSB Croydon Royal',
      tagline: 'Authentic Royal Flavors',
      accentColor: '#eab308',
      menuAddressSlug: 'hsb-croydon',
      menuUrl: 'https://orders.scoopdine.co.uk/dine/in/hsb-croydon',
      logoUrl: HSB_LOGO_SVG,
      branchName: 'Croydon'
    },
    screenDesign: {
      background: {
        style: 'ambient',
        color: '#120f08',
        ambientGlowColor: '#ca8a04',
        ambientIntensity: 70
      },
      qrCode: {
        pattern: 'dotted',
        dotColor: '#ca8a04',
        isTransparent: false,
        cardColor: '#1c1917',
        effect: 'glow',
        headerText: 'ORDER HERE',
        headerColor: '#ca8a04',
        footerTextPrefix: 'TABLE - #',
        showCenterLogo: true,
        centerLogoUrl: HSB_LOGO_SVG
      },
      bannerFrame: {
        border: 'gold',
        borderColor: '#eab308',
        shadow: 'glow',
        corners: 30,
        borderWidth: 2
      }
    }
  }
};
