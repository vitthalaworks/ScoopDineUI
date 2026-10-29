import React from 'react';
import { TVBannerConfig, RestaurantBranding, TVScreenDesignConfig } from '../types/tvConfig';

interface TVBannerPreviewProps {
  banner: TVBannerConfig;
  branding: RestaurantBranding;
  bannerFrame: TVScreenDesignConfig['bannerFrame'];
  className?: string;
  isCompact?: boolean;
}

export const TVBannerPreview: React.FC<TVBannerPreviewProps> = ({
  banner,
  branding,
  bannerFrame,
  className = '',
  isCompact = false
}) => {
  // Compute frame border style
  const getBorderStyle = () => {
    const width = bannerFrame.borderWidth || 1;
    switch (bannerFrame.border) {
      case 'solid':
        return `${width}px solid ${bannerFrame.borderColor || '#475569'}`;
      case 'dashed':
        return `${width}px dashed ${bannerFrame.borderColor || '#475569'}`;
      case 'dotted':
        return `${width}px dotted ${bannerFrame.borderColor || '#475569'}`;
      case 'double':
        return `${width * 2}px double ${bannerFrame.borderColor || '#475569'}`;
      case 'neon':
        return `${width + 1}px solid #38bdf8`;
      case 'gold':
        return `${width + 1}px solid #f59e0b`;
      case 'none':
      default:
        return 'none';
    }
  };

  const getShadowStyle = () => {
    switch (bannerFrame.shadow) {
      case 'soft':
        return '0 4px 14px rgba(0, 0, 0, 0.4)';
      case 'lifted':
        return '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6)';
      case 'glow':
        return '0 0 20px rgba(234, 179, 8, 0.4)';
      case 'neon':
        return '0 0 22px rgba(56, 189, 248, 0.7)';
      case 'none':
      default:
        return 'none';
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden transition-all duration-200 select-none ${className}`}
      style={{
        borderRadius: `${bannerFrame.corners}px`,
        border: getBorderStyle(),
        boxShadow: getShadowStyle(),
        backgroundColor: banner.backgroundColor || '#000000',
        padding: isCompact ? '6px 14px' : '10px 24px'
      }}
    >
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-between gap-4">
          {/* Left Brand Unit: Logo + Title + Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src={branding.logoUrl}
                alt="Logo"
                className={`object-contain rounded-full ${
                  isCompact ? 'w-7 h-7' : 'w-10 h-10'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black tracking-wider uppercase font-serif ${
                    isCompact ? 'text-xs' : 'text-base md:text-lg'
                  }`}
                  style={{ color: banner.titleColor || branding.accentColor }}
                >
                  {banner.textTitle || 'SARAVANAA BHAVAN'}
                </span>
                <span className="text-[10px] text-red-500 font-bold self-start">
                  ®
                </span>
              </div>
              <span
                className={`font-semibold tracking-wide text-gray-300 uppercase ${
                  isCompact ? 'text-[8px]' : 'text-[10px] md:text-xs'
                }`}
              >
                {banner.textSubtitle ||
                  "WORLD'S NO. 1 INDIAN VEGETARIAN RESTAURANT CHAIN"}
              </span>
            </div>
          </div>

          {/* Right Location Tag with vertical separator */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-600/60">
            <span
              className={`font-bold tracking-wide text-white uppercase ${
                isCompact ? 'text-xs' : 'text-sm md:text-base'
              }`}
            >
              {banner.locationText || branding.branchName || 'Croydon'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
