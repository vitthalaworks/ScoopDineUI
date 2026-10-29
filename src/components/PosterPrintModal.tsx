import React from 'react';
import { X, Printer, Download, Sparkles } from 'lucide-react';
import { AppConfig } from '../types/tvConfig';
import { QRCodeRenderer } from './QRCodeRenderer';

interface PosterPrintModalProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const PosterPrintModal: React.FC<PosterPrintModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const { branding, screenDesign } = config;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-base">
              Tabletop &amp; Poster QR Code
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Printable Card Preview */}
        <div className="p-6 overflow-y-auto flex items-center justify-center bg-gray-100">
          <div
            id="printable-poster"
            className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl border-4 border-gray-900 p-6 flex flex-col items-center text-center"
          >
            {/* Top Brand */}
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 p-1 mb-3 bg-white shadow-sm flex items-center justify-center">
              <img
                src={branding.logoUrl}
                alt={branding.name}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
              {branding.name}
            </h2>
            <p className="text-xs text-gray-500 mb-5 max-w-[240px]">
              {branding.tagline || 'Scan to view our digital menu and order'}
            </p>

            {/* QR Code */}
            <div className="p-3 bg-white rounded-xl shadow-md border border-gray-200 mb-4">
              <QRCodeRenderer
                value={branding.menuUrl}
                pattern={screenDesign.qrCode.pattern}
                dotColor={screenDesign.qrCode.dotColor}
                cardColor="#ffffff"
                isTransparent={false}
                effect="none"
                centerLogoUrl={branding.logoUrl}
                showCenterLogo={true}
                headerText="SCAN TO ORDER"
                headerColor={branding.accentColor}
                size={200}
              />
            </div>

            <p className="text-xs font-bold text-gray-800 tracking-wider uppercase mb-1">
              Table Order &amp; Contactless Menu
            </p>
            <p className="text-[11px] text-gray-400 font-mono">
              {branding.menuUrl}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            A5 &amp; Table Stand Size Ready
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-xs font-semibold text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
