import React, { useState } from 'react';
import {
  MapPin,
  Tv,
  Search,
  Grid,
  List,
  UserPlus,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Users,
  Building2
} from 'lucide-react';
import { RestaurantLocation, AppConfig } from '../types/tvConfig';

interface LocationsManagerProps {
  config: AppConfig;
  onUpdateLocation: (id: string, updated: Partial<RestaurantLocation>) => void;
  onAddLocation: (newLocation: RestaurantLocation) => void;
  onNavigateToDisplays: () => void;
  onNotify?: (msg: string) => void;
}

export const LocationsManager: React.FC<LocationsManagerProps> = ({
  config,
  onUpdateLocation,
  onAddLocation,
  onNavigateToDisplays,
  onNotify
}) => {
  const { locations, displays, theme } = config;
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState<string | null>(null);
  const [managerInput, setManagerInput] = useState('');

  // Form for new location
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocCity, setNewLocCity] = useState('');

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignManager = () => {
    if (!selectedLocId || !managerInput.trim()) return;
    const targetLoc = locations.find((l) => l.id === selectedLocId);
    if (!targetLoc) return;

    onUpdateLocation(selectedLocId, {
      managers: [...targetLoc.managers, managerInput.trim()]
    });
    setManagerInput('');
    setIsAssignModalOpen(false);
    onNotify?.(`Assigned manager to ${targetLoc.name}`);
  };

  const handleRemoveManager = (locId: string, managerName: string) => {
    const targetLoc = locations.find((l) => l.id === locId);
    if (!targetLoc) return;
    onUpdateLocation(locId, {
      managers: targetLoc.managers.filter((m) => m !== managerName)
    });
    onNotify?.(`Removed manager ${managerName}`);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocAddress.trim()) return;

    const newLoc: RestaurantLocation = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      address: newLocAddress.trim(),
      city: newLocCity.trim() || 'London',
      displayCount: 0,
      managers: []
    };

    onAddLocation(newLoc);
    setNewLocName('');
    setNewLocAddress('');
    setNewLocCity('');
    setIsAddLocationModalOpen(false);
    onNotify?.(`Added new location: ${newLoc.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Good evening, DEV
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Your locations and their displays.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddLocationModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant Location
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div
          className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? 'bg-[#151e32] border-[#22304d]'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div
              className={`text-2xl font-black tabular-nums tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {displays.length}
            </div>
            <div
              className={`text-xs font-semibold ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Displays
            </div>
            <div className="text-[11px] text-gray-400">
              {displays.filter((d) => d.status === 'online').length} online
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? 'bg-[#151e32] border-[#22304d]'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div
              className={`text-2xl font-black tabular-nums tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {locations.length}
            </div>
            <div
              className={`text-xs font-semibold ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Locations
            </div>
            <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {locations.length} active location
            </div>
          </div>
        </div>
      </div>

      {/* Your Locations Section Header & Search/View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2
            className={`text-base font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Your locations
          </h2>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {locations.length} location with their Location Managers. Click a display count to see that location's displays.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedLocId(locations[0]?.id || null);
            setIsAssignModalOpen(true);
          }}
          className={`text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto ${
            isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Manage Location Managers
        </button>
      </div>

      {/* Search & Grid/List View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location or Location Manager"
            className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border focus:outline-none transition-colors ${
              isDark
                ? 'bg-[#151f35] border-[#253452] text-white placeholder-gray-500 focus:border-emerald-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-600'
            }`}
          />
        </div>

        {/* View Toggle */}
        <div
          className={`inline-flex p-1 rounded-lg border ${
            isDark ? 'bg-[#151f35] border-[#253452]' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Locations Display */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-3'
        }
      >
        {filteredLocations.map((loc) => {
          const locDisplays = displays.filter((d) => d.locationId === loc.id);

          return (
            <div
              key={loc.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#131b2e] border-[#202d48] hover:border-emerald-500/40'
                  : 'bg-white border-gray-200 shadow-sm hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 ${
                      isDark
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={`text-base font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {loc.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {loc.address}
                    </p>
                  </div>
                </div>

                {/* Display Count Badge (Click to see displays) */}
                <button
                  type="button"
                  onClick={onNavigateToDisplays}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 ${
                    isDark
                      ? 'bg-[#1a253d] border-[#293a5e] text-white hover:bg-emerald-600 hover:border-emerald-600'
                      : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  title="View this location's displays"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{locDisplays.length}</span>
                </button>
              </div>

              {/* Location Managers Section */}
              <div
                className={`pt-3 border-t mt-4 ${
                  isDark ? 'border-gray-800/70' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    Location Managers
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocId(loc.id);
                      setIsAssignModalOpen(true);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    + Assign
                  </button>
                </div>

                {loc.managers.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {loc.managers.map((m) => (
                      <span
                        key={m}
                        className={`text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1.5 ${
                          isDark
                            ? 'bg-[#1c2742] text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {m}
                        <button
                          type="button"
                          onClick={() => handleRemoveManager(loc.id, m)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    No Location Manager assigned.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Location Modal */}
      {isAddLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLocation}
            className={`rounded-2xl max-w-md w-full border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Add Restaurant Location
              </h3>
              <button
                type="button"
                onClick={() => setIsAddLocationModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Branch / Location Name
              </label>
              <input
                type="text"
                required
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                placeholder="e.g. HSB Wembley or HSB London Central"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                required
                value={newLocAddress}
                onChange={(e) => setNewLocAddress(e.target.value)}
                placeholder="e.g. 45 High Road, Wembley, HA9 7AQ, UK"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={newLocCity}
                onChange={(e) => setNewLocCity(e.target.value)}
                placeholder="e.g. London"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddLocationModalOpen(false)}
                className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow"
              >
                Save Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Location Manager Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-md w-full border p-6 shadow-2xl ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Assign Location Manager</h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Enter manager email or full name to authorize management of TV screens at this location.
            </p>

            <input
              type="text"
              value={managerInput}
              onChange={(e) => setManagerInput(e.target.value)}
              placeholder="e.g. manager_croydon@scoopify.co.uk"
              className={`w-full text-xs px-3 py-2.5 rounded-lg border mb-5 focus:outline-none ${
                isDark
                  ? 'bg-[#18233a] border-[#2b3a5a] text-white placeholder-gray-500 focus:border-emerald-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-600'
              }`}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignManager}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Assign Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
