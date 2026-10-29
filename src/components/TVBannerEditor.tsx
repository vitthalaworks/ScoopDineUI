import React, { useRef, useState } from 'react';
import { Tv, Upload, Trash2, Edit3, Check, Eye } from 'lucide-react';
import { TVBannerConfig, RestaurantBranding } from '../types/tvConfig';

interface TVBannerEditorProps {
  banner: TVBannerConfig;
  branding: RestaurantBranding;
  onChange: (updated: Partial<TVBannerConfig>) => void;
}

export const TVBannerEditor: React.FC<TVBannerEditorProps> = ({
  banner,
  branding,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingText, setIsEditingText] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBannerImage = () => {
    onChange({ imageUrl: undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">TV banner</h2>
        </div>
        <button
          type="button"
          onClick={() => onChange({ showGuides: !banner.showGuides })}
          className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5 transition-colors ${
            banner.showGuides
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {banner.showGuides ? 'Guides Active (2560×423)' : 'Show Safe Strip Guides'}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        Shown in the footer of your TV screens (its frame is set under TV screen design below). Use the YouTube channel-banner size,{' '}
        <span className="font-semibold text-gray-700">2560 × 1440 px</span>: the TVs show the middle strip (
        <span className="font-semibold text-gray-700">2560 × 423</span>), so keep text and logos inside the marked area.
      </p>

      {/* 2560 x 1440 Canvas Preview (16:9 ratio) */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#0c101c] rounded-lg overflow-hidden border border-gray-800 shadow-inner flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Custom banner image if uploaded */}
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt="Custom TV Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Safe strip middle area (2560 x 423 is ~29.3% height of 1440) */
          <div
            className={`w-full relative flex items-center justify-between px-8 md:px-16 transition-all duration-300 ${
              banner.showGuides
                ? 'border-y-2 border-dashed border-yellow-400 bg-black/60 shadow-[0_0_20px_rgba(250,204,21,0.15)]'
                : 'bg-black'
            }`}
            style={{
              height: '31%', // Exact ratio 423 / 1440
              backgroundColor: banner.backgroundColor || '#000000'
            }}
          >
            {/* Guide labels */}
            {banner.showGuides && (
              <span className="absolute top-1 right-3 text-[10px] text-yellow-400/90 font-mono tracking-widest uppercase">
                Safe TV Strip (2560 × 423)
              </span>
            )}

            {/* Left Brand Identity */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                <img
                  src={branding.logoUrl}
                  alt="HSB Logo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span
                    className="font-serif font-black tracking-wider text-xl md:text-3xl text-red-600 drop-shadow-sm uppercase"
                    style={{ color: banner.titleColor || branding.accentColor }}
                  >
                    {banner.textTitle || 'SARAVANAA BHAVAN'}
                  </span>
                  <span className="text-red-500 text-xs font-bold self-start -mt-1">
                    ®
                  </span>
                </div>
                <span className="text-[10px] md:text-sm font-semibold tracking-wider text-gray-300 uppercase">
                  {banner.textSubtitle ||
                    "WORLD'S NO. 1 INDIAN VEGETARIAN RESTAURANT CHAIN"}
                </span>
              </div>
            </div>

            {/* Right Branch Tag */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
              <span className="text-white font-bold text-base md:text-xl tracking-wide uppercase">
                {banner.locationText || branding.branchName || 'Croydon'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons & Editor Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-gray-500" />
            Replace banner
          </button>

          {banner.imageUrl && (
            <button
              type="button"
              onClick={handleRemoveBannerImage}
              className="p-2 border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              title="Remove custom image and use dynamic banner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditingText(!isEditingText)}
            className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
            {isEditingText ? 'Hide banner copy' : 'Edit banner text'}
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Tip: 2560 × 1440 PNG/JPG recommended
        </div>
      </div>

      {/* Expandable Text Customization Drawer */}
      {isEditingText && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Banner Brand Name
            </label>
            <input
              type="text"
              value={banner.textTitle}
              onChange={(e) => onChange({ textTitle: e.target.value })}
              className="w-full text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sub-tagline
            </label>
            <input
              type="text"
              value={banner.textSubtitle}
              onChange={(e) => onChange({ textSubtitle: e.target.value })}
              className="w-full text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Location / Branch
            </label>
            <input
              type="text"
              value={banner.locationText}
              onChange={(e) => onChange({ locationText: e.target.value })}
              className="w-full text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
