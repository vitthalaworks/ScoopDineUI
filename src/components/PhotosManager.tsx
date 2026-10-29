import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Trash2,
  RotateCcw,
  Sparkles,
  MapPin,
  User,
  Utensils,
  Maximize2,
  CheckSquare,
  Square
} from 'lucide-react';
import { AppConfig, CustomerPhoto } from '../types/tvConfig';

interface PhotosManagerProps {
  config: AppConfig;
  onUpdatePhotos: (photos: CustomerPhoto[]) => void;
  onAddPhoto: (photo: CustomerPhoto) => void;
  onPushPhotoToTV: (photo: CustomerPhoto) => void;
  onNotify?: (msg: string) => void;
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({
  config,
  onUpdatePhotos,
  onAddPhoto,
  onNotify
}) => {
  const { theme, customerPhotos, items, branding } = config;
  const isDark = theme === 'dark';

  // Tabs: 'waiting_for_review' | 'approved' | 'rejected'
  const [filterTab, setFilterTab] = useState<'waiting_for_review' | 'approved' | 'rejected'>(
    'waiting_for_review'
  );

  // Bulk selection state
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('Priya Sharma');
  const [newSelectedDishId, setNewSelectedDishId] = useState(items[0]?.id || '');
  const [newCaption, setNewCaption] = useState('Delicious meal served hot at our table!');

  // Lightbox Zoom Modal
  const [lightboxPhoto, setLightboxPhoto] = useState<CustomerPhoto | null>(null);

  // Counts
  const waitingCount = customerPhotos.filter((p) => p.status === 'waiting_for_review').length;
  const approvedCount = customerPhotos.filter((p) => p.status === 'approved').length;
  const rejectedCount = customerPhotos.filter((p) => p.status === 'rejected').length;

  // Filtered Photos
  const visiblePhotos = customerPhotos.filter((p) => p.status === filterTab);
  const visibleIds = visiblePhotos.map((p) => p.id);
  const activeSelectedIds = selectedPhotoIds.filter((id) => visibleIds.includes(id));
  const isAllVisibleSelected =
    visiblePhotos.length > 0 && activeSelectedIds.length === visiblePhotos.length;

  const toggleSelectAll = () => {
    if (isAllVisibleSelected) {
      setSelectedPhotoIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedPhotoIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleSelectPhoto = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleBulkApprove = () => {
    const targetIds = activeSelectedIds.length > 0 ? activeSelectedIds : visibleIds;
    if (targetIds.length === 0) return;
    const updated = customerPhotos.map((p) =>
      targetIds.includes(p.id) ? { ...p, status: 'approved' as const } : p
    );
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => !targetIds.includes(id)));
    onNotify?.(`Bulk approved ${targetIds.length} photo(s)`);
  };

  const handleBulkReject = () => {
    const targetIds = activeSelectedIds.length > 0 ? activeSelectedIds : visibleIds;
    if (targetIds.length === 0) return;
    const updated = customerPhotos.map((p) =>
      targetIds.includes(p.id) ? { ...p, status: 'rejected' as const } : p
    );
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => !targetIds.includes(id)));
    onNotify?.(`Bulk rejected ${targetIds.length} photo(s)`);
  };

  const handleApprove = (photo: CustomerPhoto) => {
    const updated = customerPhotos.map((p) =>
      p.id === photo.id ? { ...p, status: 'approved' as const } : p
    );
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photo.id));
    onNotify?.(`Approved photo from ${photo.customerName}`);
  };

  const handleReject = (photo: CustomerPhoto) => {
    const updated = customerPhotos.map((p) =>
      p.id === photo.id ? { ...p, status: 'rejected' as const } : p
    );
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photo.id));
    onNotify?.(`Rejected photo from ${photo.customerName}`);
  };

  const handleRestore = (photo: CustomerPhoto) => {
    const updated = customerPhotos.map((p) =>
      p.id === photo.id ? { ...p, status: 'waiting_for_review' as const } : p
    );
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photo.id));
    onNotify?.(`Restored photo to Waiting for review`);
  };

  const handleDelete = (photoId: string) => {
    const updated = customerPhotos.filter((p) => p.id !== photoId);
    onUpdatePhotos(updated);
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photoId));
    onNotify?.('Photo removed permanently');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDish = items.find((i) => i.id === newSelectedDishId) || items[0];

    const photoUrl =
      newPhotoUrl.trim() ||
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80';

    const newPhoto: CustomerPhoto = {
      id: `c-photo-${Date.now()}`,
      imageUrl: photoUrl,
      customerName: newCustomerName.trim() || 'Guest Customer',
      uploadedAt: 'Just now',
      location: branding.name,
      dishId: targetDish?.id,
      dishName: targetDish?.name,
      itemNumber: targetDish?.itemNumber,
      caption: newCaption.trim(),
      status: 'waiting_for_review',
      addedToSchedule: false,
      likes: 1
    };

    onAddPhoto(newPhoto);
    setIsUploadModalOpen(false);
    setNewPhotoUrl('');
    setNewCaption('');
    setFilterTab('waiting_for_review');
    onNotify?.(`Uploaded photo from ${newPhoto.customerName} for review`);
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-2.5 overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-800/80 flex-shrink-0">
        <div>
          <h1
            className={`text-lg font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Photos
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Customers can share food and dining photos from the digital menu. Nothing appears on a Display until you approve it.
          </p>
        </div>

        {/* Top Right Action: [Upload a photo] Button */}
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#007063] hover:bg-[#005a50] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer flex-shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload a photo</span>
        </button>
      </div>

      {/* 2. Status Filter Tabs + Select All & Bulk Approve / Reject Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setFilterTab('waiting_for_review');
              setSelectedPhotoIds([]);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              filterTab === 'waiting_for_review'
                ? 'bg-[#007063] border-[#007063] text-white shadow-sm'
                : isDark
                ? 'bg-[#151f35] border-gray-700/70 text-gray-400 hover:text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Waiting for review ({waitingCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterTab('approved');
              setSelectedPhotoIds([]);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              filterTab === 'approved'
                ? 'bg-[#007063] border-[#007063] text-white shadow-sm'
                : isDark
                ? 'bg-[#151f35] border-gray-700/70 text-gray-400 hover:text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterTab('rejected');
              setSelectedPhotoIds([]);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              filterTab === 'rejected'
                ? 'bg-[#007063] border-[#007063] text-white shadow-sm'
                : isDark
                ? 'bg-[#151f35] border-gray-700/70 text-gray-400 hover:text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Bulk Controls: Select All, Bulk Approve, Bulk Reject */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            disabled={visiblePhotos.length === 0}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
              isAllVisibleSelected
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : activeSelectedIds.length > 0
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                : isDark
                ? 'bg-[#151f35] border-gray-700 text-gray-300 hover:text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isAllVisibleSelected ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>{isAllVisibleSelected ? 'All Selected' : 'Select All'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/25">
              {activeSelectedIds.length}/{visiblePhotos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={handleBulkApprove}
            disabled={visiblePhotos.length === 0 || filterTab === 'approved'}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              Bulk Approve
              {activeSelectedIds.length > 0 ? ` (${activeSelectedIds.length})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={handleBulkReject}
            disabled={visiblePhotos.length === 0 || filterTab === 'rejected'}
            className="px-3 py-1.5 rounded-xl border border-rose-700/70 bg-rose-950/40 hover:bg-rose-900/60 disabled:opacity-40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>
              Bulk Reject
              {activeSelectedIds.length > 0 ? ` (${activeSelectedIds.length})` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Scrollable Grid Area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none pr-1">
        {/* Empty State when no photos */}
        {visiblePhotos.length === 0 ? (
          <div
            className={`p-12 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
              isDark
                ? 'bg-[#12192b] border-[#1e2a44]'
                : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-800/40 text-gray-400 flex items-center justify-center mb-3 border border-gray-700/50">
              <Camera className="w-6 h-6" />
            </div>
            <h3
              className={`text-base font-bold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Nothing to review
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              New photos from customers will appear here.
            </p>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 border border-gray-700 hover:border-gray-500 rounded-xl text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
            >
              Upload a test photo
            </button>
          </div>
        ) : (
          /* Photo Grid of uploaded customer items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePhotos.map((photo) => {
              const isSelected = activeSelectedIds.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => toggleSelectPhoto(photo.id)}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20'
                      : isDark
                      ? 'bg-[#12192b] border-[#1e2a44] hover:border-gray-700'
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Photo Image preview with zoom & selection checkbox */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden group">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || photo.customerName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Selection Checkbox Badge */}
                      <button
                        type="button"
                        onClick={(e) => toggleSelectPhoto(photo.id, e)}
                        className={`absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-black/70 text-gray-200 hover:bg-black/90 border border-white/20'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-300" />
                        )}
                        <span>{isSelected ? 'Selected' : 'Select'}</span>
                      </button>

                      {/* Enlarge button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxPhoto(photo);
                        }}
                        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white transition-opacity cursor-pointer"
                        title="View Enlarge"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {photo.itemNumber && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F91515] text-white shadow-sm">
                          Item #{photo.itemNumber}
                        </div>
                      )}
                    </div>

                    {/* Details info */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{photo.customerName}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {photo.uploadedAt}
                        </span>
                      </div>

                      {photo.dishName && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-semibold text-emerald-400">
                            {photo.dishName}
                          </span>
                        </div>
                      )}

                      {photo.caption && (
                        <p className="text-xs text-gray-300 italic line-clamp-1">
                          &ldquo;{photo.caption}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-0.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          {photo.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons based on status (Push to TV removed) */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`p-2.5 border-t flex items-center justify-between gap-2 text-xs ${
                      isDark ? 'bg-[#151f35] border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {filterTab === 'waiting_for_review' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(photo)}
                          className="px-3 py-1.5 rounded-lg border border-rose-800/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Reject photo"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(photo)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Approve photo"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </>
                    )}

                    {filterTab === 'approved' && (
                      <>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>

                        <button
                          type="button"
                          onClick={() => handleReject(photo)}
                          className="px-3 py-1 rounded-lg border border-rose-800/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {filterTab === 'rejected' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDelete(photo.id)}
                          className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRestore(photo)}
                          className="px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore to Review</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Photo Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#12192b] border-[#22304d] text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#007063]" />
                Upload Customer Photo for Approval
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Photo Source / Preset selection */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Photo URL or Image Link
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-gray-400">Sample Photos:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewPhotoUrl(
                        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Masala Dosa
                  </button>
                  <span className="text-gray-600">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewPhotoUrl(
                        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Samosa Plate
                  </button>
                  <span className="text-gray-600">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewPhotoUrl(
                        'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Mango Lassi
                  </button>
                </div>
              </div>

              {/* Link to Menu Dish */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Tag Corresponding Menu Dish
                </label>
                <select
                  value={newSelectedDishId}
                  onChange={(e) => setNewSelectedDishId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none"
                >
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      Item #{it.itemNumber} {it.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Customer / Guest Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Customer Caption or Dining Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Best dosas in South London, golden crispy perfection!"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-700 bg-[#162035] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-700 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007063] hover:bg-[#005a50] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-[#12192b] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.customerName}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">
                  {lightboxPhoto.customerName} · {lightboxPhoto.dishName || 'Food Photo'}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">{lightboxPhoto.caption}</p>
              </div>
              {lightboxPhoto.status === 'waiting_for_review' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleReject(lightboxPhoto);
                      setLightboxPhoto(null);
                    }}
                    className="px-3 py-1.5 border border-rose-800/60 bg-rose-950/30 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(lightboxPhoto);
                      setLightboxPhoto(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
