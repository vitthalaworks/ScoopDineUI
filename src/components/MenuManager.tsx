import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  FileText,
  FolderPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Filter,
  Layers,
  Image,
  Utensils,
  Check,
  Flame,
  Star,
  Award,
  Leaf,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  Trash2
} from 'lucide-react';
import { AppConfig, MenuItemRow, CustomerMenuOptions, MenuSheetUpload } from '../types/tvConfig';

interface MenuManagerProps {
  config: AppConfig;
  onUpdateMenuOptions: (options: Partial<CustomerMenuOptions>) => void;
  onUpdateMenuItems: (items: MenuItemRow[]) => void;
  onAddMenuItem: (item: MenuItemRow) => void;
  onApproveMenuSheet: () => void;
  onDiscardMenuSheet: () => void;
  onNotify?: (msg: string) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  config,
  onUpdateMenuOptions,
  onUpdateMenuItems,
  onAddMenuItem,
  onApproveMenuSheet,
  onDiscardMenuSheet,
  onNotify
}) => {
  const { theme, menuOptions, menuUploadSheet, menuItems } = config;
  const isDark = theme === 'dark';

  // Sub-tabs: Menu Configuration | Menu Library | Dietary Icons
  const [subTab, setSubTab] = useState<'config' | 'library' | 'dietary'>('config');

  // Sheet filter: 'uploaded' vs 'live'
  const [sheetFilter, setSheetFilter] = useState<'uploaded' | 'live'>('uploaded');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [itemStatusFilter, setItemStatusFilter] = useState<'all' | 'dishes' | 'ready'>('all');

  // Add Dish Modal
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishNumber, setNewDishNumber] = useState('');
  const [newDishName, setNewDishName] = useState('');
  const [newDishImageName, setNewDishImageName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Starters');
  const [newDishPrice, setNewDishPrice] = useState('6.95');
  const [newDishDietary, setNewDishDietary] = useState<('veg' | 'jain' | 'spicy' | 'most_popular' | 'chef_choice')[]>(['veg']);

  // Excel Upload simulation
  const [isUploading, setIsUploading] = useState(false);

  // Categories list
  const categories = ['All', 'Starters', 'Hot Beverages', 'Beer / Wine', 'South Indian', 'Desserts'];

  // Toggle dietary filters
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<string[]>(['veg', 'jain', 'spicy', 'most_popular', 'chef_choice']);

  const toggleDietaryFilter = (key: string) => {
    setActiveDietaryFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newItem: MenuItemRow = {
      id: `m-${Date.now()}`,
      rowNumber: menuItems.length + 1,
      itemNumber: newDishNumber.trim() || `${100 + menuItems.length}`,
      itemName: newDishName.trim(),
      imageName: newDishImageName.trim() || `D${menuItems.length + 10}.jpg`,
      hasImage: false,
      category: newDishCategory,
      price: newDishPrice.trim() || '6.95',
      dietary: newDishDietary,
      status: 'missing_image'
    };

    onAddMenuItem(newItem);
    setIsAddDishModalOpen(false);
    setNewDishNumber('');
    setNewDishName('');
    setNewDishImageName('');
    onNotify?.(`Added dish #${newItem.itemNumber} ${newItem.itemName}`);
  };

  const handleSimulateExcelUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onNotify?.('Successfully imported 219 dishes from saravanaa_bhavan_menu_all_available.xlsx');
    }, 800);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'item_number,item_name,image_name,category,price,dietary\n101,Schezwan Paneer,D23.jpg,Starters,6.95,veg;spicy\n102,Chilli Paneer,D24.jpg,Starters,6.95,veg;spicy\n114,Tea,D31.jpg,Hot Beverages,2.85,veg\n141,Beer 1 Pint / Bottle,D41.jpg,Beer / Wine,6.75,';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'scoopdine_menu_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify?.('Downloaded Excel Menu Template (.csv)');
  };

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.imageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    if (!matchesSearch || !matchesCategory) return false;

    if (itemStatusFilter === 'ready') return item.status === 'ready';
    return true;
  });

  const readyCount = menuItems.filter((i) => i.status === 'ready').length;

  return (
    <div className="h-full min-h-0 flex flex-col gap-2 overflow-hidden">
      {/* 1. Header + Sub-Tabs + Customer Options (single compact bar) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-gray-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1
            className={`text-lg font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Menu
          </h1>

          <div className="flex items-center space-x-1 pl-3 border-l border-gray-700/60">
            <button
              type="button"
              onClick={() => setSubTab('config')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                subTab === 'config'
                  ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Menu Configuration</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('library')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                subTab === 'library'
                  ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Menu Library</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('dietary')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                subTab === 'dietary'
                  ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Dietary Icons</span>
            </button>
          </div>
        </div>

        {/* Customer Menu Options Compact Toggles */}
        <div
          className={`flex items-center gap-3 px-3 py-1 rounded-xl border text-[11px] ${
            isDark ? 'bg-[#12192b] border-[#1e2a44]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">
            Options:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer" title="Allow customers to submit dining photos">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Photos</span>
            <button
              type="button"
              role="switch"
              aria-checked={menuOptions.photoSharingEnabled}
              onClick={() => {
                const nextVal = !menuOptions.photoSharingEnabled;
                onUpdateMenuOptions({ photoSharingEnabled: nextVal });
                onNotify?.(`Photo sharing ${nextVal ? 'Enabled' : 'Disabled'}`);
              }}
              className={`w-7 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                menuOptions.photoSharingEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </button>
          </label>

          <span className="text-gray-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer" title="Show item numbers on TV & digital menu">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Item #</span>
            <button
              type="button"
              role="switch"
              aria-checked={menuOptions.showItemNumbers}
              onClick={() => {
                const nextVal = !menuOptions.showItemNumbers;
                onUpdateMenuOptions({ showItemNumbers: nextVal });
                onNotify?.(`Item numbers ${nextVal ? 'Shown' : 'Hidden'}`);
              }}
              className={`w-7 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                menuOptions.showItemNumbers ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </button>
          </label>

          <span className="text-gray-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer" title="Show sequence numbers on television screens">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Seq #</span>
            <button
              type="button"
              role="switch"
              aria-checked={menuOptions.showSequenceNumbers}
              onClick={() => {
                const nextVal = !menuOptions.showSequenceNumbers;
                onUpdateMenuOptions({ showSequenceNumbers: nextVal });
                onNotify?.(`Sequence numbers ${nextVal ? 'Shown' : 'Hidden'}`);
              }}
              className={`w-7 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                menuOptions.showSequenceNumbers ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </button>
          </label>
        </div>
      </div>

      {/* TAB 1: MENU CONFIGURATION */}
      {subTab === 'config' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          {/* Action Buttons Toolbar: Upload Excel, Template, Report, Categories, Add dish */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Upload Excel Button */}
              <button
                type="button"
                onClick={handleSimulateExcelUpload}
                disabled={isUploading}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Importing Sheet...' : 'Upload Excel'}</span>
              </button>

              {/* Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                Template
              </button>

              {/* Report */}
              <button
                type="button"
                onClick={() => onNotify?.(`Menu health report: ${menuItems.length} dishes parsed, ${readyCount} photo matches ready, ${menuItems.length - readyCount} missing images.`)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                Report
              </button>

              {/* Categories */}
              <button
                type="button"
                onClick={() => onNotify?.('Categories: Starters, Hot Beverages, Beer / Wine, South Indian, Breads, Desserts')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                Categories
              </button>
            </div>

            {/* + Add Dish */}
            <button
              type="button"
              onClick={() => setIsAddDishModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add dish</span>
            </button>
          </div>

          {/* Uploaded Sheet Status Strip matching Image 09034fbd.png */}
          <div
            className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              menuUploadSheet.status === 'waiting_for_approval'
                ? isDark
                  ? 'bg-[#141b2c] border-amber-600/40'
                  : 'bg-amber-50/50 border-amber-300'
                : isDark
                ? 'bg-[#141b2c] border-emerald-600/40'
                : 'bg-emerald-50/50 border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {menuUploadSheet.fileName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      menuUploadSheet.status === 'waiting_for_approval'
                        ? 'bg-amber-950/70 border border-amber-800 text-amber-400'
                        : 'bg-emerald-950/70 border border-emerald-800 text-emerald-400'
                    }`}
                  >
                    {menuUploadSheet.status === 'waiting_for_approval'
                      ? 'waiting for approval'
                      : 'Live Menu Active'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Uploaded by {menuUploadSheet.uploadedBy} {menuUploadSheet.uploadedAt}. Ready: {menuItems.length} dish names. 0 dietary preferences.
                </p>

                {/* Sub-tab pills: Uploaded sheet (219) | Live menu (0) */}
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => setSheetFilter('uploaded')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border ${
                      sheetFilter === 'uploaded'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-transparent text-gray-400 border-gray-700/60 hover:text-white'
                    }`}
                  >
                    Uploaded sheet ({menuItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetFilter('live')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border ${
                      sheetFilter === 'live'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-transparent text-gray-400 border-gray-700/60 hover:text-white'
                    }`}
                  >
                    Live menu ({readyCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Right Action buttons: Approve Sheet vs Discard */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onApproveMenuSheet();
                  onNotify?.('Approved menu sheet! Dishes synchronized with live database.');
                }}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onDiscardMenuSheet();
                  onNotify?.('Discarded upload draft.');
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Discard
              </button>
            </div>
          </div>

          {/* Dietary Legend Checklist Filter matching Image 1 */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Dietary badges:
            </span>
            <button
              type="button"
              onClick={() => toggleDietaryFilter('veg')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                activeDietaryFilters.includes('veg')
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400'
                  : 'bg-transparent border-gray-700/50 text-gray-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Veg</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietaryFilter('jain')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                activeDietaryFilters.includes('jain')
                  ? 'bg-amber-950/70 border-amber-800 text-amber-400'
                  : 'bg-transparent border-gray-700/50 text-gray-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Jain</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietaryFilter('spicy')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                activeDietaryFilters.includes('spicy')
                  ? 'bg-red-950/70 border-red-800 text-red-400'
                  : 'bg-transparent border-gray-700/50 text-gray-500'
              }`}
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>Spicy</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietaryFilter('most_popular')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                activeDietaryFilters.includes('most_popular')
                  ? 'bg-yellow-950/70 border-yellow-800 text-yellow-400'
                  : 'bg-transparent border-gray-700/50 text-gray-500'
              }`}
            >
              <Star className="w-3 h-3 text-yellow-400" />
              <span>Most popular</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietaryFilter('chef_choice')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                activeDietaryFilters.includes('chef_choice')
                  ? 'bg-purple-950/70 border-purple-800 text-purple-400'
                  : 'bg-transparent border-gray-700/50 text-gray-500'
              }`}
            >
              <Award className="w-3 h-3 text-purple-400" />
              <span>Chef choice</span>
            </button>
          </div>

          {/* Filter Bar: [All items (219)] [Dishes (219)] [Ready (3)] & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setItemStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  itemStatusFilter === 'all'
                    ? 'bg-gray-800 text-white border-gray-600'
                    : 'bg-transparent text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                All items ({menuItems.length})
              </button>
              <button
                type="button"
                onClick={() => setItemStatusFilter('dishes')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  itemStatusFilter === 'dishes'
                    ? 'bg-gray-800 text-white border-gray-600'
                    : 'bg-transparent text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                Dishes ({menuItems.length})
              </button>
              <button
                type="button"
                onClick={() => setItemStatusFilter('ready')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  itemStatusFilter === 'ready'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-transparent text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                Ready with photo ({readyCount})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dish name, number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  isDark
                    ? 'bg-[#151f35] border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Table Container matching Image 1 - Fills remaining height with internal scroll */}
          <div
            className={`flex-1 min-h-0 rounded-2xl border overflow-hidden shadow-xs flex flex-col ${
              isDark ? 'bg-[#12192b] border-[#1e2a44]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 shadow-xs">
                  <tr
                    className={`border-b ${
                      isDark
                        ? 'bg-[#162035] border-gray-800 text-gray-300'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <th className="py-2.5 px-3 font-bold w-12 text-center">Row</th>
                    <th className="py-2.5 px-3 font-bold w-24">Item #</th>
                    <th className="py-2.5 px-4 font-bold min-w-[200px]">Item Name</th>
                    <th className="py-2.5 px-4 font-bold min-w-[260px]">Image Name &amp; Match</th>
                    <th className="py-2.5 px-4 font-bold w-36">Category</th>
                    <th className="py-2.5 px-4 font-bold w-28">Price (£)</th>
                    <th className="py-2.5 px-3 font-bold w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredItems.map((item, idx) => {
                    const isMissing = !item.hasImage;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-[#18233c]' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Row number / status tag */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono text-[10px] text-gray-400">
                            {idx + 1}
                          </span>
                        </td>

                        {/* Item number badge */}
                        <td className="py-3 px-3">
                          <span
                            className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs text-white"
                            style={{ backgroundColor: '#F91515' }}
                          >
                            {item.itemNumber}
                          </span>
                        </td>

                        {/* Item name + dietary icons */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {item.itemName}
                            </span>
                            {item.dietary.includes('spicy') && (
                              <span title="Spicy">
                                <Flame className="w-3 h-3 text-red-500" />
                              </span>
                            )}
                            {item.dietary.includes('most_popular') && (
                              <span title="Most Popular">
                                <Star className="w-3 h-3 text-amber-400" />
                              </span>
                            )}
                            {item.dietary.includes('chef_choice') && (
                              <span title="Chef's Choice">
                                <Award className="w-3 h-3 text-purple-400" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Image Name with Red Alert warning matching Image 1 */}
                        <td className="py-3 px-4">
                          {item.hasImage && item.imageUrl ? (
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="w-8 h-8 rounded-md object-cover border border-emerald-500/50"
                              />
                              <span className="font-mono text-emerald-400 text-[11px]">
                                {item.imageName}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                                Matched
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[11px] border ${
                                    isDark
                                      ? 'bg-rose-950/40 border-rose-800/70 text-rose-300'
                                      : 'bg-rose-50 border-rose-300 text-rose-700'
                                  }`}
                                >
                                  {item.imageName}
                                </span>
                              </div>
                              <p className="text-[10px] text-rose-400 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>
                                  image is missing &apos;{item.imageName}&apos; · add to Menu Library
                                </span>
                              </p>
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="text-gray-300 font-medium">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          £{item.price}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              // Simulate linking an image
                              const updated = menuItems.map((m) =>
                                m.id === item.id
                                  ? {
                                      ...m,
                                      hasImage: true,
                                      status: 'ready' as const,
                                      imageUrl:
                                        'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=200&q=80'
                                    }
                                  : m
                              );
                              onUpdateMenuItems(updated);
                              onNotify?.(`Linked photo to ${item.itemName}`);
                            }}
                            className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Attach Photo"
                          >
                            <Image className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Row controls matching Image 1: [+ Add row] and [Show more (194 left)] */}
            <div
              className={`p-3 border-t flex items-center justify-between text-xs ${
                isDark ? 'bg-[#151f35] border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 font-semibold flex items-center gap-1.5 text-gray-300 hover:text-white cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                Add row
              </button>

              <span className="text-gray-400 font-medium">
                Showing {filteredItems.length} of {menuItems.length} dishes in sheet
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU LIBRARY */}
      {subTab === 'library' && (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#12192b] border-[#1e2a44]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white mb-0.5">
                  Dish Photography Assets Library
                </h3>
                <p className="text-xs text-gray-400">
                  Drop image files named D01.jpg, D23.jpg, D41.jpg here to auto-match with the Excel sheet dishes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNotify?.('Opened bulk photo upload dialog')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center bg-[#151f35]/50 hover:border-emerald-500/60 transition-colors cursor-pointer">
              <Image className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white mb-1">
                Drag and drop your dish photo files here
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG, WebP up to 10MB each. File names will link automatically to sheet image names.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIETARY ICONS */}
      {subTab === 'dietary' && (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#12192b] border-[#1e2a44]' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-base font-bold text-white mb-1">
              Dietary Indicators &amp; Customer Badges
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Configure how dietary indicators are rendered on customer digital menus and on television slides.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-gray-800 bg-[#162035] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span>Pure Vegetarian</span>
                </div>
                <p className="text-xs text-gray-400">
                  Strictly 100% vegetarian Indian cuisine prepared in pure vegetarian kitchen.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-800 bg-[#162035] space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Jain Friendly</span>
                </div>
                <p className="text-xs text-gray-400">
                  Prepared without onions, garlic, or root vegetables.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-800 bg-[#162035] space-y-1.5">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Spicy Special</span>
                </div>
                <p className="text-xs text-gray-400">
                  Infused with fresh green chillies and traditional Chettinad spices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#12192b] border-[#22304d] text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                Add New Dish to Menu
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Item Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 148"
                  value={newDishNumber}
                  onChange={(e) => setNewDishNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mysore Masala Dosa"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none"
                  >
                    <option value="Starters">Starters</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Hot Beverages">Hot Beverages</option>
                    <option value="Beer / Wine">Beer / Wine</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Price (£)
                  </label>
                  <input
                    type="text"
                    placeholder="6.95"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Image Filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. D48.jpg"
                  value={newDishImageName}
                  onChange={(e) => setNewDishImageName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-700 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
