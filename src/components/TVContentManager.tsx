import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Upload,
  Copy,
  Maximize2,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Monitor,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import {
  TVItem,
  TVPlaylistConfig,
  AppConfig,
  TransitionStyle,
  DisplayLayoutConfig,
  ItemBadgeConfig,
  SequenceBadgeConfig
} from '../types/tvConfig';
import { TVDisplayPreview } from './TVDisplayPreview';
import { DisplayLayoutConfigEditor } from './DisplayLayoutConfigEditor';
import { INITIAL_CONFIG } from '../data/defaultConfig';

interface TVContentManagerProps {
  items: TVItem[];
  playlist: TVPlaylistConfig;
  accentColor: string;
  config?: AppConfig;
  onUpdateItem: (id: string, updated: Partial<TVItem>) => void;
  onAddItem: (newItem: TVItem) => void;
  onDeleteItem: (id: string) => void;
  onReorderItem: (index: number, direction: 'up' | 'down') => void;
  onUpdatePlaylist: (updated: Partial<TVPlaylistConfig>) => void;
  onSelectActiveItem: (index: number) => void;
  onPushToDisplays?: (dishId?: string) => void;
  onOpenFullscreenTV?: () => void;
  onNotify?: (msg: string) => void;
  onUpdateDisplayLayout?: (layout: Partial<DisplayLayoutConfig>) => void;
  onUpdateItemBadgeStyle?: (style: Partial<ItemBadgeConfig>) => void;
  onUpdateSequenceBadgeStyle?: (style: Partial<SequenceBadgeConfig>) => void;
  onResetLayoutToDefault?: () => void;
}

export const TVContentManager: React.FC<TVContentManagerProps> = ({
  items,
  playlist,
  accentColor,
  config,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onReorderItem,
  onUpdatePlaylist,
  onSelectActiveItem,
  onPushToDisplays,
  onOpenFullscreenTV,
  onNotify,
  onUpdateDisplayLayout,
  onUpdateItemBadgeStyle,
  onUpdateSequenceBadgeStyle,
  onResetLayoutToDefault
}) => {
  const [subTab, setSubTab] = useState<'slides' | 'layout_config'>('slides');
  const [editingItemId, setEditingItemId] = useState<string | null>(
    items[0]?.id || null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDuration, setBulkDuration] = useState<number>(
    playlist.cycleIntervalSeconds || 10
  );
  const [bulkTransition, setBulkTransition] = useState<TransitionStyle>(
    playlist.transitionEffect || 'fade'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeItem = items.find((i) => i.id === editingItemId) || items[0];
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeItem?.id)
  );

  // Broadcast action: pushes active slide to displays and opens fullscreen broadcast
  const handleBroadcast = () => {
    if (onPushToDisplays && activeItem) {
      onPushToDisplays(activeItem.id);
    }
    if (onOpenFullscreenTV) {
      onOpenFullscreenTV();
    }
    onNotify?.(
      `Broadcasting #${activeItem?.itemNumber || '001'} ${activeItem?.name || ''} to all displays`
    );
  };

  const handleCreateNewItem = () => {
    const nextSeqNumber = String(items.length + 1).padStart(3, '0');
    const newItem: TVItem = {
      id: `item-${Date.now()}`,
      itemNumber: nextSeqNumber,
      name: 'South Indian Filter Coffee',
      subtitle: 'Frothy Chicory Infused Decoction',
      description:
        'Slow-dripped chicory blend served piping hot in traditional dabarah and tumbler.',
      price: '£3.50',
      dietary: 'veg',
      imageUrl:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      badgeLabel: 'Item #',
      badgeColor: accentColor,
      accentGlowColor: '#b45309',
      durationSeconds: playlist.cycleIntervalSeconds,
      transitionStyle: playlist.transitionEffect
    };
    onAddItem(newItem);
    setEditingItemId(newItem.id);
    onNotify?.(`Created slide #${newItem.itemNumber} ${newItem.name}`);
  };

  const handleDuplicateItem = (itemToClone: TVItem) => {
    const cloned: TVItem = {
      ...itemToClone,
      id: `item-${Date.now()}`,
      itemNumber: String(Number(itemToClone.itemNumber || '10') + 1).padStart(
        3,
        '0'
      ),
      name: `${itemToClone.name} (Copy)`
    };
    onAddItem(cloned);
    setEditingItemId(cloned.id);
    onNotify?.(`Duplicated to #${cloned.itemNumber}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeItem) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateItem(activeItem.id, { imageUrl: reader.result as string });
        onNotify?.('Updated slide photograph');
      };
      reader.readAsDataURL(file);
    }
  };

  // Selection handlers for bulk updates
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((it) => it.id));
    }
  };

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Apply Duration
  const handleApplyBulkDuration = (seconds: number) => {
    const targetIds = selectedIds.length > 0 ? selectedIds : items.map((i) => i.id);
    targetIds.forEach((id) => {
      onUpdateItem(id, { durationSeconds: seconds });
    });
    onUpdatePlaylist({ cycleIntervalSeconds: seconds });
    onNotify?.(`Updated duration to ${seconds}s for ${targetIds.length} slides`);
  };

  // Bulk Apply Transition Style
  const handleApplyBulkTransition = (style: TransitionStyle) => {
    const targetIds = selectedIds.length > 0 ? selectedIds : items.map((i) => i.id);
    targetIds.forEach((id) => {
      onUpdateItem(id, { transitionStyle: style });
    });
    onUpdatePlaylist({ transitionEffect: style });
    onNotify?.(`Updated transition to "${style}" for ${targetIds.length} slides`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (items.length - selectedIds.length < 1) {
      onNotify?.('Must keep at least 1 slide in playlist');
      return;
    }
    selectedIds.forEach((id) => onDeleteItem(id));
    setSelectedIds([]);
    setEditingItemId(items[0]?.id || null);
    onNotify?.(`Removed ${selectedIds.length} slides`);
  };

  const transitionOptions: { id: TransitionStyle; label: string }[] = [
    { id: 'fade', label: 'Fade' },
    { id: 'slide', label: 'Slide' },
    { id: 'zoom', label: 'Zoom In' },
    { id: 'flip', label: 'Flip' },
    { id: 'ken_burns', label: 'Ken Burns' },
    { id: 'instant', label: 'Instant' }
  ];

  const resolvedConfig = config || {
    ...INITIAL_CONFIG,
    items,
    playlist
  };

  if (subTab === 'layout_config') {
    return (
      <div className="h-full min-h-0 overflow-hidden">
        <DisplayLayoutConfigEditor
          config={resolvedConfig}
          onUpdateDisplayLayout={onUpdateDisplayLayout}
          onUpdateItemBadgeStyle={onUpdateItemBadgeStyle}
          onUpdateSequenceBadgeStyle={onUpdateSequenceBadgeStyle}
          onResetToDefault={onResetLayoutToDefault}
          onOpenFullscreenDisplay={onOpenFullscreenTV}
          onBack={() => setSubTab('slides')}
          onNotify={onNotify}
        />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
      {/* LEFT COLUMN: Top = Live Display Preview, Bottom = Edit Section */}
      <div className="lg:col-span-5 h-full min-h-0 flex flex-col gap-2.5 overflow-hidden">
        {/* 1. LEFT TOP: LIVE DISPLAY PREVIEW */}
        <div className="p-3 bg-white dark:bg-[#11192b] rounded-2xl border border-gray-200 dark:border-[#1e2a44] shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Live Display Preview
              </span>
              {activeItem && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                  SEQ {String(activeIndex + 1).padStart(3, '0')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSubTab('layout_config')}
                className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#18233a] hover:border-emerald-500 text-gray-700 dark:text-gray-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Configure Display Layout & Proportions"
              >
                <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                <span>Layout Config</span>
              </button>

              <button
                type="button"
                onClick={handleBroadcast}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="Broadcast to all displays"
              >
                <Monitor className="w-3 h-3" />
                <span>Broadcast</span>
                <Maximize2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg">
            <TVDisplayPreview
              config={resolvedConfig}
              currentItem={activeItem}
              mode="preview"
              sequenceNumber={activeIndex + 1}
            />
          </div>
        </div>

        {/* 2. LEFT BOTTOM: EDIT SECTION FOR SELECTED SLIDE */}
        {activeItem && (
          <div className="flex-1 min-h-0 p-3 bg-white dark:bg-[#11192b] rounded-2xl border border-gray-200 dark:border-[#1e2a44] shadow-sm flex flex-col justify-between overflow-hidden">
            {/* Edit Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/80 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-black text-white flex-shrink-0"
                  style={{ backgroundColor: activeItem.badgeColor || accentColor }}
                >
                  #{activeItem.itemNumber}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  Edit Slide · {activeItem.name}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
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
                  className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#18233a] text-gray-700 dark:text-gray-200 hover:border-emerald-500 flex items-center gap-1 cursor-pointer"
                  title="Upload custom dish photo"
                >
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicateItem(activeItem)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Duplicate slide"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteItem(activeItem.id);
                      setEditingItemId(items[activeIndex === 0 ? 1 : activeIndex - 1]?.id);
                      onNotify?.(`Removed slide #${activeItem.itemNumber}`);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Compact Edit Form Fields (Fits without scrollbars) */}
            <div className="flex-1 min-h-0 flex flex-col justify-evenly py-1 gap-1.5 overflow-hidden">
              {/* Row 1: Badge Label, Item #, Dish Name */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={activeItem.badgeLabel}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { badgeLabel: e.target.value })
                    }
                    className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                    placeholder="Item #"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Item Number
                  </label>
                  <input
                    type="text"
                    value={activeItem.itemNumber}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { itemNumber: e.target.value })
                    }
                    className="w-full text-xs font-bold px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                    placeholder="095"
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Dish Name (Display Title)
                  </label>
                  <input
                    type="text"
                    value={activeItem.name}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { name: e.target.value })
                    }
                    className="w-full text-xs font-bold px-2.5 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                    placeholder="e.g. Bottled Water"
                  />
                </div>
              </div>

              {/* Row 2: Subtitle, Dietary, Duration */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Subtitle / Variations
                  </label>
                  <input
                    type="text"
                    value={activeItem.subtitle}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { subtitle: e.target.value })
                    }
                    className="w-full text-xs px-2.5 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                    placeholder="e.g. (Still / Sparkling)"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Dietary
                  </label>
                  <select
                    value={activeItem.dietary || 'veg'}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, {
                        dietary: e.target.value as TVItem['dietary']
                      })
                    }
                    className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="veg">Veg</option>
                    <option value="vegan">Vegan</option>
                    <option value="spicy">Spicy</option>
                    <option value="special">Special</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Duration
                  </label>
                  <select
                    value={activeItem.durationSeconds || playlist.cycleIntervalSeconds}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, {
                        durationSeconds: Number(e.target.value)
                      })
                    }
                    className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    {[5, 8, 10, 12, 15, 20, 30].map((s) => (
                      <option key={s} value={s}>
                        {s}s
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Transition, Image URL, Glow Color */}
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Transition
                  </label>
                  <select
                    value={activeItem.transitionStyle || playlist.transitionEffect || 'fade'}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, {
                        transitionStyle: e.target.value as TransitionStyle
                      })
                    }
                    className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    {transitionOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={activeItem.imageUrl}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { imageUrl: e.target.value })
                    }
                    className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white font-mono"
                    placeholder="Image URL..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">
                    Glow
                  </label>
                  <input
                    type="color"
                    value={activeItem.accentGlowColor || '#f97316'}
                    onChange={(e) =>
                      onUpdateItem(activeItem.id, { accentGlowColor: e.target.value })
                    }
                    className="w-full h-7 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: SCHEDULE DETAILS IN A TABULATED WAY */}
      <div className="lg:col-span-7 h-full min-h-0 bg-white dark:bg-[#11192b] rounded-2xl border border-gray-200 dark:border-[#1e2a44] shadow-sm flex flex-col overflow-hidden">
        {/* Table Top Bar: Title + Add Slide + Select All + Bulk Controls */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Schedule Details
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold">
              {items.length} slides
            </span>

            <button
              type="button"
              onClick={handleCreateNewItem}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-transform active:scale-95 shadow-xs cursor-pointer"
              title="Add new dish slide"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-900/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}
          </div>

          {/* Bulk Duration & Transition Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#162035] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-gray-400">Dur:</span>
              {[5, 8, 10, 15, 20].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setBulkDuration(sec);
                    handleApplyBulkDuration(sec);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    bulkDuration === sec
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-400'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#162035] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400">Trans:</span>
              <select
                value={bulkTransition}
                onChange={(e) => {
                  const style = e.target.value as TransitionStyle;
                  setBulkTransition(style);
                  handleApplyBulkTransition(style);
                }}
                className="text-[11px] bg-transparent text-gray-800 dark:text-gray-200 font-bold focus:outline-none cursor-pointer"
              >
                {transitionOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#11192b] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabulated Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f1728] text-gray-400 items-center flex-shrink-0">
          <div className="col-span-1 flex items-center">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
              title={isAllSelected ? 'Deselect All' : 'Select All'}
            >
              {isAllSelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="col-span-1">SEQ</div>
          <div className="col-span-1">Item #</div>
          <div className="col-span-4">Slide / Dish</div>
          <div className="col-span-1">Diet</div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-2">Transition</div>
          <div className="col-span-1 text-right">Order</div>
        </div>

        {/* Tabulated Rows (No Vertical or Horizontal Scrollbar) */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none divide-y divide-gray-200/60 dark:divide-gray-800/60">
          {items.map((item, index) => {
            const isSelectedForEdit = item.id === activeItem?.id;
            const isChecked = selectedIds.includes(item.id);
            const seqNumberString = String(index + 1).padStart(3, '0');

            return (
              <div
                key={item.id}
                onClick={() => {
                  setEditingItemId(item.id);
                  onSelectActiveItem(index);
                }}
                className={`grid grid-cols-12 gap-2 px-3 py-2 items-center text-xs transition-colors cursor-pointer ${
                  isSelectedForEdit
                    ? 'bg-emerald-950/35 border-l-2 border-l-emerald-500'
                    : isChecked
                    ? 'bg-emerald-950/15'
                    : 'hover:bg-gray-50 dark:hover:bg-[#151f35]'
                }`}
              >
                {/* Col 1: Checkbox */}
                <div className="col-span-1 flex items-center">
                  <button
                    type="button"
                    onClick={(e) => toggleSelectItem(item.id, e)}
                    className="text-gray-400 hover:text-emerald-400 cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Col 2: SEQ # */}
                <div className="col-span-1">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-black text-[11px]">
                    {seqNumberString}
                  </span>
                </div>

                {/* Col 3: Item # */}
                <div className="col-span-1">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-black text-white font-mono"
                    style={{ backgroundColor: item.badgeColor || accentColor }}
                  >
                    #{item.itemNumber}
                  </span>
                </div>

                {/* Col 4: Dish / Slide with Thumbnail */}
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-7 rounded object-cover bg-black border border-gray-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {item.subtitle || 'Standard'}
                    </div>
                  </div>
                </div>

                {/* Col 5: Dietary */}
                <div className="col-span-1">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                    {item.dietary || 'veg'}
                  </span>
                </div>

                {/* Col 6: Duration */}
                <div className="col-span-1 font-mono font-bold text-gray-700 dark:text-gray-200">
                  {item.durationSeconds || playlist.cycleIntervalSeconds}s
                </div>

                {/* Col 7: Transition */}
                <div className="col-span-2">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#18233a] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] capitalize">
                    {item.transitionStyle || playlist.transitionEffect || 'fade'}
                  </span>
                </div>

                {/* Col 8: Reorder Up/Down */}
                <div
                  className="col-span-1 flex items-center justify-end gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onReorderItem(index, 'up')}
                    className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700/60 disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => onReorderItem(index, 'down')}
                    className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700/60 disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
