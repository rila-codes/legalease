import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Trash2,
  Download,
  Check,
  Globe2,
  Bell,
  Scale,
} from 'lucide-react';
import { UserProfile } from '../../types/legal';
import { SUPPORTED_JURISDICTIONS } from '../../data/jurisdictions';

interface Props {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onClearAllDocuments: () => void;
}

export const ProfileSettingsView: React.FC<Props> = ({
  user,
  onUpdateUser,
  onClearAllDocuments,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organization, setOrganization] = useState(user.organization);
  const [defaultCountry, setDefaultCountry] = useState(user.defaultCountry);
  const [defaultState, setDefaultState] = useState(user.defaultState);
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage);
  const [autoSave, setAutoSave] = useState(user.autoSave);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      organization,
      defaultCountry,
      defaultState,
      preferredLanguage,
      autoSave,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">
          Account Profile & Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your personal credentials, default legal jurisdiction, and privacy controls.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 font-extrabold text-xl flex items-center justify-center">
              {name.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{email} • {user.role}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Organization / Law Practice / Company
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Preferred Interface Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Country
              </label>
              <select
                value={defaultCountry}
                onChange={(e) => {
                  setDefaultCountry(e.target.value);
                  const states = SUPPORTED_JURISDICTIONS[e.target.value]?.states || [];
                  setDefaultState(states[0]?.name || 'General');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                {Object.keys(SUPPORTED_JURISDICTIONS).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default State / Region
              </label>
              <select
                value={defaultState}
                onChange={(e) => setDefaultState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                {SUPPORTED_JURISDICTIONS[defaultCountry]?.states.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-900"
            />
            <label htmlFor="autoSave" className="text-xs text-slate-700 font-medium">
              Enable continuous draft auto-saving while editing clauses
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Settings successfully updated!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Privacy & Data Management (Section 18 & 19) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Privacy & Data Management</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          LegalEase treats your agreements with confidentiality. Documents are stored in secure memory and can be downloaded or purged at any time.
        </p>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              const data = JSON.stringify(user, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'legalease_profile_export.json';
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Account Data</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Documents</span>
          </button>
        </div>

        {showClearConfirm && (
          <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 text-xs text-red-900 space-y-3 mt-4">
            <p className="font-bold">Are you sure you want to delete all saved drafts?</p>
            <p className="text-[11px]">This action is irreversible and clears your active document cache.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClearAllDocuments();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-800"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
