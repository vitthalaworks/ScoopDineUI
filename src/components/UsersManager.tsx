import React, { useState } from 'react';
import {
  Users,
  Key,
  FileText,
  Wallet,
  CreditCard,
  Plus,
  Trash2,
  Check,
  X,
  Mail,
  Shield,
  Clock
} from 'lucide-react';
import { TeamUser, AppConfig } from '../types/tvConfig';

interface UsersManagerProps {
  config: AppConfig;
  onAddUser: (user: TeamUser) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersManager: React.FC<UsersManagerProps> = ({
  config,
  onAddUser,
  onDeleteUser
}) => {
  const { users, locations, theme } = config;
  const isDark = theme === 'dark';

  const [activeSubTab, setActiveSubTab] = useState<'account' | 'location_managers' | 'contract' | 'wallet'>('location_managers');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamUser['role']>('Location Manager');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.name || 'HSB Croydon');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: TeamUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      location: selectedLocation,
      role,
      passwordActiveDuration: '90 days remaining',
      status: 'active'
    };

    onAddUser(newUser);
    setName('');
    setEmail('');
    setIsCreateModalOpen(false);
  };

  const locationManagers = users.filter((u) => u.role === 'Location Manager');

  return (
    <div className="space-y-6">
      {/* Title & Description matching Image 644641e1.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Settings
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Your account, Location Managers, contract, payments and wallet
          </p>
        </div>

        {/* Top Right Action: Payment Button */}
        <button
          type="button"
          onClick={() => setPaymentModalOpen(true)}
          className="px-4 py-2 border border-emerald-500/80 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <CreditCard className="w-4 h-4" />
          Payment
        </button>
      </div>

      {/* Sub-Tabs: Account, Location Managers, Contract, Wallet */}
      <div className="flex items-center space-x-6 border-b border-gray-800/80 text-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('account')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'account'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Key className="w-4 h-4" />
          Account
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('location_managers')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'location_managers'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Location Managers
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('contract')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'contract'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Contract
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('wallet')}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'wallet'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Wallet
        </button>
      </div>

      {/* SubTab 1: Location Managers view matching Image 644641e1.png */}
      {activeSubTab === 'location_managers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </div>

          {/* Table Container */}
          <div
            className={`rounded-2xl border overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#11192b] border-[#1e2a44]'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {/* Table Header */}
            <div
              className={`grid grid-cols-12 px-6 py-3.5 text-[11px] font-bold tracking-wider uppercase border-b ${
                isDark
                  ? 'bg-[#0f1728] border-gray-800 text-gray-400'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-3">Password Active Duration</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {/* Table Content or Empty State */}
            {locationManagers.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-400">
                No Location Managers yet — create your first one
              </div>
            ) : (
              <div>
                {locationManagers.map((mgr) => (
                  <div
                    key={mgr.id}
                    className={`grid grid-cols-12 px-6 py-4 items-center border-b border-gray-800/40 text-xs transition-colors ${
                      isDark ? 'hover:bg-[#151f35]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="col-span-3 font-semibold text-white">
                      {mgr.name}
                    </div>
                    <div className="col-span-3 text-gray-400 font-mono">
                      {mgr.email}
                    </div>
                    <div className="col-span-2 text-gray-300">
                      {mgr.location}
                    </div>
                    <div className="col-span-3 text-gray-400">
                      {mgr.passwordActiveDuration}
                    </div>
                    <div className="col-span-1 text-right flex items-center justify-end gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {mgr.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteUser(mgr.id)}
                        className="text-gray-500 hover:text-red-400"
                        title="Remove user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubTab 2: Account View */}
      {activeSubTab === 'account' && (
        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11192b] border-[#1e2a44]' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-bold text-base text-white mb-1">
            Account Credentials
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Logged in as DEV Admin 06 Croydon (Client Admin)
          </p>

          <div className="space-y-3 max-w-md text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Email Address</label>
              <input
                type="text"
                readOnly
                value="dev_admin_06_croydon@scoopify.co.uk"
                className="w-full px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Primary Role</label>
              <input
                type="text"
                readOnly
                value="Client Admin (Full Fleet Control)"
                className="w-full px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Contract View */}
      {activeSubTab === 'contract' && (
        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11192b] border-[#1e2a44]' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-bold text-base text-white mb-1">
            Digital Signage Contract &amp; Service Level Agreement
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            ScoopDine Enterprise Agreement #SCP-2026-CR01
          </p>
          <div className="p-4 bg-[#18233a] rounded-xl border border-[#293959] text-xs text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>Licensed TV Displays:</span>
              <span className="font-bold text-white">3 Displays active</span>
            </div>
            <div className="flex justify-between">
              <span>Network Uptime SLA:</span>
              <span className="font-bold text-emerald-400">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Next Renewal Date:</span>
              <span className="font-bold text-white">October 2027</span>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Wallet View */}
      {activeSubTab === 'wallet' && (
        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11192b] border-[#1e2a44]' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-bold text-base text-white mb-1">
            Prepaid Advertising &amp; Player Credits Wallet
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Balance used for sponsored screen placements and SMS menu promos.
          </p>
          <div className="text-3xl font-black text-white tabular-nums mb-3">
            £150.00
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
          >
            Top up Wallet
          </button>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className={`rounded-2xl max-w-md w-full border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-base">Create Location Manager</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul.sharma@scoopify.co.uk"
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Assigned Restaurant Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#18233a] border border-[#2b3a5a] text-white focus:outline-none"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-md w-full border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'bg-[#11192b] border-[#22304d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Payment &amp; Billing
              </h3>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Direct debit and credit card on file for 3 TV screen player licences (£45/month).
            </p>

            <div className="p-3 bg-[#18233a] rounded-xl border border-[#2b3a5a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold">Visa ending in 4242</span>
              </div>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
