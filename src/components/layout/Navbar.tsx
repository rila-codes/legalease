import React, { useState } from 'react';
import {
  Scale,
  PlusCircle,
  Bell,
  User as UserIcon,
  Menu,
  X,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { UserProfile } from '../../types/legal';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onNewDocument: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onNewDocument,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isWorkspace = ![
    'landing',
    'privacy',
    'terms',
  ].includes(currentView);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center text-amber-400 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl text-slate-900 tracking-tight font-serif">
                    LegalEase
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                  Document Drafting Platform
                </p>
              </div>
            </button>

            {/* In-app navigation links if on Landing */}
            {!isWorkspace && (
              <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <button
                  onClick={() => onNavigate('landing')}
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Home
                </button>
                <a
                  href="#features"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#document-types"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Document Types
                </a>
                <a
                  href="#how-it-works"
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  How It Works
                </a>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Knowledge Hub
                </button>
              </nav>
            )}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            {isWorkspace ? (
              <>
                <button
                  onClick={onNewDocument}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-blue-950 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Create Document</span>
                </button>

                {/* Notifications button */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                          Notifications
                        </span>
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          2 Updates
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="p-3 hover:bg-slate-50 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">
                              Draft Ready: Mutual NDA
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              AI completed structuring clauses with California jurisdiction.
                            </p>
                            <span className="text-[10px] text-slate-400">10m ago</span>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-slate-50 flex items-start gap-2.5">
                          <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">
                              Jurisdiction Rules Updated
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              New statutory notes added for UK IR35 and New York housing code.
                            </p>
                            <span className="text-[10px] text-slate-400">1h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                {user ? (
                  <button
                    onClick={() => onNavigate('settings')}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {user.role}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </>
            ) : (
              // Landing Page Right Nav
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('wizard')}
                  className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-blue-950 text-white shadow-sm transition-all hover:shadow active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('wizard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg bg-slate-900 text-white font-medium"
            >
              Create New Document
            </button>
            <button
              onClick={() => {
                onNavigate('documents');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              My Documents
            </button>
            <button
              onClick={() => {
                onNavigate('templates');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Document Templates
            </button>
            <button
              onClick={() => {
                onNavigate('checker');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Document Checker
            </button>
            <button
              onClick={() => {
                onNavigate('assistant');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              AI Legal Assistant
            </button>
            <button
              onClick={() => {
                onNavigate('knowledge');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Legal Knowledge Hub
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Profile & Settings
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
