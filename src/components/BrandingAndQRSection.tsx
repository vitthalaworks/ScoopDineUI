import React, { useRef, useState } from 'react';
import {
  QrCode,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Upload,
  Trash2,
  Check,
  Building2,
  Sparkles
} from 'lucide-react';
import { AppConfig, RestaurantBranding } from '../types/tvConfig';
import { QRCodeRenderer } from './QRCodeRenderer';

interface BrandingAndQRSectionProps {
  config: AppConfig;
  onUpdateBranding: (branding: Partial<RestaurantBranding>) => void;
  onSave: () => void;
  onOpenPrintModal: () => void;
  onOpenMenuPreview: () => void;
}

export const BrandingAndQRSection: React.FC<BrandingAndQRSectionProps> = ({
  config,
  onUpdateBranding,
  onSave,
  onOpenPrintModal,
  onOpenMenuPreview
}) => {
  const { branding, screenDesign } = config;
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const qrLogoInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(branding.menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'branding' | 'qr'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onUpdateBranding({ logoUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQR = () => {
    // Generate a downloadable PNG via a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Use an SVG data url to draw
    img.onload = () => {
      ctx.drawImage(img, 100, 100, 800, 800);
      const link = document.createElement('a');
      link.download = `${branding.menuAddressSlug || 'menu'}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(
      branding.menuUrl
    )}&color=000000`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* LEFT CARD: Menu QR code (takes 5 cols on lg) */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Menu QR code
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Put it on tables and the printed menu. The TVs show it too.
          </p>

          {/* Large Center QR Code Preview */}
          <div className="flex items-center justify-center p-4 bg-gray-50/70 rounded-xl border border-gray-100 mb-4">
            <QRCodeRenderer
              value={branding.menuUrl}
              pattern={screenDesign.qrCode.pattern}
              dotColor={screenDesign.qrCode.dotColor}
              cardColor="#ffffff"
              isTransparent={false}
              effect={screenDesign.qrCode.effect}
              centerLogoUrl={branding.logoUrl}
              showCenterLogo={true}
              size={180}
            />
          </div>

          {/* URL Input with copy & external buttons */}
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <input
              type="text"
              readOnly
              value={branding.menuUrl}
              className="w-full text-xs text-gray-700 bg-transparent px-2 font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1.5 hover:bg-gray-200 text-gray-600 rounded transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onOpenMenuPreview}
              className="p-1.5 hover:bg-gray-200 text-gray-600 rounded transition-colors"
              title="Open menu"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Logo in the QR code box */}
          <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-lg mb-5">
            <h4 className="text-xs font-semibold text-gray-900 mb-0.5">
              Logo in the QR code
            </h4>
            <p className="text-[11px] text-gray-500 mb-3 leading-tight">
              Upload an image and crop it; it's placed in the center of the code
              here, on posters, and on the TV.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gray-300 p-0.5 bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <img
                  src={branding.logoUrl}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <input
                type="file"
                ref={qrLogoInputRef}
                onChange={(e) => handleLogoUpload(e, 'qr')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => qrLogoInputRef.current?.click()}
                className="px-3 py-1.5 border border-gray-300 hover:bg-white text-xs font-medium text-gray-700 rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onUpdateBranding({ logoUrl: '' })}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                title="Remove logo from QR"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex-1 py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            PNG
          </button>
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="flex-1 py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            Print poster
          </button>
          <button
            type="button"
            onClick={onOpenMenuPreview}
            className="flex-1 py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            Open menu
          </button>
        </div>
      </div>

      {/* RIGHT CARD: Restaurant branding (takes 8 cols on lg) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant branding
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                Live on TV
              </span>
            </div>
          </div>

          {/* Logo replacement row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-gray-200 p-0.5 bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={branding.logoUrl}
                alt="Restaurant Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <input
              type="file"
              ref={logoInputRef}
              onChange={(e) => handleLogoUpload(e, 'branding')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-500" />
              Replace logo
            </button>
            <button
              type="button"
              onClick={() => onUpdateBranding({ logoUrl: '' })}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              title="Remove branding logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Restaurant name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Restaurant name
              </label>
              <input
                type="text"
                value={branding.name}
                onChange={(e) => onUpdateBranding({ name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                placeholder="e.g. HSB Croydon"
              />
              <p className="text-xs text-gray-400 mt-1">
                Shown on the menu and the TVs.
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => onUpdateBranding({ tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                placeholder="Optional, shown under the name on the menu"
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional, shown under the name on the menu.
              </p>
            </div>

            {/* Accent colour */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Accent colour
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) =>
                      onUpdateBranding({ accentColor: e.target.value })
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer overflow-hidden p-0"
                  />
                </div>
                <div className="relative w-40">
                  <input
                    type="text"
                    value={branding.accentColor.toUpperCase()}
                    onChange={(e) =>
                      onUpdateBranding({ accentColor: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Used for item numbers on the menu and the TVs.
              </p>
            </div>

            {/* Menu address slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Menu address
              </label>
              <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-xs border-r border-gray-300">
                  https://orders.scoopdine.co.uk/dine/in/
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
                  className="w-full px-3 py-2 bg-white text-sm text-gray-900 focus:outline-none"
                  placeholder="hsb-croydon"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {branding.menuUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSaveClick}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer"
          >
            {justSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
