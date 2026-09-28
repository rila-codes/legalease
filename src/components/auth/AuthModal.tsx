import React, { useState } from 'react';
import {
  X,
  Scale,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { UserProfile } from '../../types/legal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');

  if (!isOpen) return null;

  const handleDemoSignIn = (role: 'business' | 'freelancer' | 'landlord') => {
    let profile: UserProfile;
    if (role === 'business') {
      profile = {
        id: 'user-biz-1',
        name: 'Elena Vance',
        email: 'elena.vance@apexhorizons.com',
        organization: 'Apex Horizon Technologies Inc.',
        role: 'Chief Executive Officer',
        preferredLanguage: 'English (US)',
        defaultCountry: 'United States',
        defaultState: 'California',
        autoSave: true,
        createdAt: new Date().toISOString(),
      };
    } else if (role === 'freelancer') {
      profile = {
        id: 'user-free-2',
        name: 'Maya Patel',
        email: 'maya@pateldesigns.co.uk',
        organization: 'Maya Patel Design Studio Ltd',
        role: 'Independent UX Consultant',
        preferredLanguage: 'English (UK)',
        defaultCountry: 'United Kingdom',
        defaultState: 'England & Wales',
        autoSave: true,
        createdAt: new Date().toISOString(),
      };
    } else {
      profile = {
        id: 'user-land-3',
        name: 'Arthur Pendelton',
        email: 'arthur@hudsonproperties.nyc',
        organization: 'Hudson Heritage Properties LLC',
        role: 'Real Estate Manager',
        preferredLanguage: 'English (US)',
        defaultCountry: 'United States',
        defaultState: 'New York',
        autoSave: true,
        createdAt: new Date().toISOString(),
      };
    }

    onLogin(profile);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0] || 'User',
      email: email || 'user@legalease.app',
      organization: org || 'Commercial Venture LLC',
      role: 'Member',
      preferredLanguage: 'English (US)',
      defaultCountry: 'United States',
      defaultState: 'California',
      autoSave: true,
      createdAt: new Date().toISOString(),
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            {mode === 'login' && 'Sign in to LegalEase'}
            {mode === 'register' && 'Create your LegalEase Account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500">
            Secure legal drafting with jurisdiction-aware templates.
          </p>
        </div>

        {/* Quick Demo Personas */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Instant Demo Logins:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              onClick={() => handleDemoSignIn('business')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-800 text-left transition-colors shadow-2xs"
            >
              🏢 Tech CEO
            </button>
            <button
              onClick={() => handleDemoSignIn('freelancer')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-800 text-left transition-colors shadow-2xs"
            >
              💼 Contractor
            </button>
            <button
              onClick={() => handleDemoSignIn('landlord')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-800 text-left transition-colors shadow-2xs"
            >
              🏠 Landlord
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
            or continue with credentials
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-800 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer switcher */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-semibold text-blue-800 hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-semibold text-blue-800 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
