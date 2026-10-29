import React, { useState } from 'react';
import {
  BarChart3,
  Tv,
  Smartphone,
  MousePointerClick,
  Megaphone,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { AnalyticsSummary, AppConfig, AdPerformanceItem } from '../types/tvConfig';

interface AnalyticsManagerProps {
  config: AppConfig;
  onNotify?: (msg: string) => void;
}

const DEMO_CAMPAIGN_ADS: AdPerformanceItem[] = [
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
];

export const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ config, onNotify }) => {
  const { theme, displays, locations } = config;
  const isDark = theme === 'dark';

  const [selectedLocation, setSelectedLocation] = useState('All locations');
  const [selectedDevice, setSelectedDevice] = useState('All devices');
  const [selectedPeriod, setSelectedPeriod] = useState('All time');
  const [searchQuery, setSearchQuery] = useState('');
  const [useDemoData, setUseDemoData] = useState(true);

  const adsList = useDemoData
    ? DEMO_CAMPAIGN_ADS
    : config.analytics.adList && config.analytics.adList.length > 0
    ? config.analytics.adList
    : DEMO_CAMPAIGN_ADS;

  const totalSubmitted = adsList.length;
  const totalDisplayViews = adsList.reduce((acc, a) => acc + a.displayViews, 0);
  const totalMobileViews = adsList.reduce((acc, a) => acc + a.mobileViews, 0);
  const totalCtaClicks = adsList.reduce((acc, a) => acc + a.ctaClicks, 0);

  const filteredAds = adsList.filter(
    (a) =>
      a.adName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filteredAds.length === 0) {
      onNotify?.('No data to export. Try enabling Demo Data first.');
      return;
    }

    const headers = [
      'Ad Name',
      'Location',
      'Source',
      'Status',
      'Display Views',
      'Mobile Views',
      'CTA Clicks',
      'CTA Rate',
      'Website Visits'
    ];

    const rows = filteredAds.map((ad) => [
      `"${ad.adName}"`,
      `"${ad.location}"`,
      `"${ad.source}"`,
      `"${ad.status}"`,
      ad.displayViews,
      ad.mobileViews,
      ad.ctaClicks,
      `"${ad.ctaRate}"`,
      ad.websiteVisits
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scoopdine-analytics-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify?.('Downloaded CSV analytics report');
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-2 overflow-hidden">
      {/* Title & Description matching Image b3528c01.png */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-800/80 flex-shrink-0">
        <div>
          <h1
            className={`text-lg font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Analytics
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            How the ads at your locations are doing — on the screens and on phones
          </p>
        </div>

        {/* Action Controls & Filters compact row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={`text-xs px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-[#151f35] border-[#293859] text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="All locations">All locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Period Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`text-xs px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-[#151f35] border-[#293859] text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="All time">All time</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 7 days">Last 7 days</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#18233a] border-gray-700 text-gray-300 hover:text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onNotify?.('Telemetry metrics synchronized with all active displays')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#18233a] border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching Image b3528c01.png */}
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-shrink-0">
        {/* Card 1: Submitted Ads */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#131b2e] border-[#202d48]' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] font-semibold block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Submitted ads
            </span>
            <div className={`text-xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalSubmitted}
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-teal-950/60 text-teal-400 flex items-center justify-center border border-teal-800/40">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Display views */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#131b2e] border-[#202d48]' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Display views
              </span>
            </div>
            <div className={`text-xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalDisplayViews.toLocaleString()}
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center border border-blue-800/40">
            <Tv className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Mobile views */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#131b2e] border-[#202d48]' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Mobile views
              </span>
            </div>
            <div className={`text-xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalMobileViews.toLocaleString()}
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-orange-950/60 text-orange-400 flex items-center justify-center border border-orange-800/40">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: CTA clicks */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#131b2e] border-[#202d48]' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                CTA clicks
              </span>
            </div>
            <div className={`text-xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalCtaClicks.toLocaleString()}
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
            <MousePointerClick className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Ads Performance Table */}
      <div
        className={`flex-1 min-h-0 rounded-2xl border overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#11192b] border-[#1e2a44]'
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        {/* Table Controls */}
        <div className="px-3.5 py-2 flex items-center justify-between gap-3 border-b border-gray-800/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-xs ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Ads Performance · {filteredAds.length} items
            </span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ad, location..."
              className={`w-full text-xs pl-8 pr-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#18233a] border-[#293859] text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Table Container with Internal Vertical Scroll and Horizontal Scroll */}
        <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
          {/* Table Columns matching Image b3528c01.png */}
          <div
            className={`grid grid-cols-12 min-w-[900px] px-4 py-2 text-[10px] font-bold tracking-wider uppercase border-b flex-shrink-0 ${
              isDark
                ? 'bg-[#0f1728] border-gray-800 text-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <div className="col-span-3">Ad</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Display views ↓</div>
            <div className="col-span-1 text-right">Mobile views</div>
            <div className="col-span-1 text-right">CTA clicks</div>
            <div className="col-span-1 text-right">CTA rate</div>
            <div className="col-span-1 text-right">Likes</div>
            <div className="col-span-1 text-right">Visits</div>
          </div>

          {filteredAds.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              No submitted ads for this selection.
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin divide-y divide-gray-800/40 min-w-[900px]">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className={`grid grid-cols-12 px-4 py-2.5 items-center text-xs transition-colors ${
                    isDark ? 'hover:bg-[#151f35]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-3 font-semibold text-white truncate">
                    {ad.adName}
                  </div>
                  <div className="col-span-2 text-gray-400 truncate">{ad.location}</div>
                  <div className="col-span-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ad.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-right font-mono font-bold text-white tabular-nums">
                    {ad.displayViews.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right font-mono text-gray-300 tabular-nums">
                    {ad.mobileViews.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right font-mono text-gray-300 tabular-nums">
                    {ad.ctaClicks.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right font-mono text-emerald-400 font-bold">
                    {ad.ctaRate}
                  </div>
                  <div className="col-span-1 text-right font-mono text-gray-400 tabular-nums">
                    {ad.likes}
                  </div>
                  <div className="col-span-1 text-right font-mono text-gray-400 tabular-nums">
                    {ad.websiteVisits}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
