import React from 'react';
import { X, ExternalLink, ShoppingBag, ArrowLeft, Star } from 'lucide-react';
import { AppConfig } from '../types/tvConfig';

interface MenuPreviewModalProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const MenuPreviewModal: React.FC<MenuPreviewModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const { branding, items } = config;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border-8 border-gray-900 flex flex-col h-[700px] max-h-[90vh]">
        {/* Simulated Mobile Device Notch */}
        <div className="bg-gray-900 h-6 w-full flex items-center justify-center">
          <div className="w-24 h-4 bg-black rounded-b-xl" />
        </div>

        {/* Mobile Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {branding.name}
              </h3>
              <p className="text-[10px] text-gray-500">{branding.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Featured on TV Displays
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Synchronized
            </span>
          </div>

          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-black text-white"
                    style={{ backgroundColor: it.badgeColor || branding.accentColor }}
                  >
                    #{it.itemNumber}
                  </span>
                  <h5 className="text-xs font-bold text-gray-900">{it.name}</h5>
                </div>
                {it.subtitle && (
                  <p className="text-[11px] text-gray-500 leading-tight mb-1">
                    {it.subtitle}
                  </p>
                )}
                {it.price && (
                  <span className="text-xs font-black text-emerald-700">
                    {it.price}
                  </span>
                )}
              </div>

              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={it.imageUrl}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Sticky Order Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Table order mode enabled
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Order Menu
          </button>
        </div>
      </div>
    </div>
  );
};
