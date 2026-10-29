import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Tv,
  Clock
} from 'lucide-react';
import { AppConfig } from '../types/tvConfig';
import { TVDisplayPreview } from './TVDisplayPreview';

interface FullScreenTVModalProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenTVModal: React.FC<FullScreenTVModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(config.playlist.autoCycle);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const items = config.items;
  const currentItem = items[currentIndex] || items[0];
  const intervalMs = (config.playlist.cycleIntervalSeconds || 8) * 1000;

  // Slideshow auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying || items.length <= 1) return;

    const tickMs = 100;
    const increment = (tickMs / intervalMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % items.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, items.length, intervalMs]);

  // Handle keyboard shortcuts (Esc, Left, Right, Space)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((idx) => (idx + 1) % items.length);
        setProgress(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((idx) => (idx - 1 + items.length) % items.length);
        setProgress(0);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length, onClose]);

  const toggleNativeFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Floating Control Bar (auto-hides or subtle) */}
      <div className="absolute top-0 inset-x-0 p-4 z-40 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur rounded-full border border-white/20 text-white text-xs font-medium">
            <Tv className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Digital Signage Live Display Broadcast</span>
          </div>

          <span className="text-white/60 text-xs font-mono">
            Slide {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((idx) => (idx - 1 + items.length) % items.length);
              setProgress(0);
            }}
            className="p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Previous Slide (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors"
            title={isPlaying ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentIndex((idx) => (idx + 1) % items.length);
              setProgress(0);
            }}
            className="p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Next Slide (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors ml-2"
            title="Toggle Native Display Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors ml-2"
            title="Close Display Broadcast Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar across top of screen */}
      {isPlaying && (
        <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-50">
          <div
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Fullscreen TV Canvas */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-0">
        <TVDisplayPreview
          config={config}
          currentItem={currentItem}
          mode="fullscreen"
          sequenceNumber={currentIndex + 1}
        />
      </div>
    </div>
  );
};
