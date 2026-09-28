import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  FileStack,
  FolderKanban,
  FileCheck2,
  Bot,
  BookOpen,
  Settings,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  documentCount?: number;
}

export const Sidebar: React.FC<Props> = ({ currentView, onNavigate, documentCount = 0 }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'wizard',
      label: 'Create Document',
      icon: FilePlus2,
      badge: 'AI',
      highlight: true,
    },
    {
      id: 'templates',
      label: 'Templates Library',
      icon: FileStack,
      badge: '14+',
    },
    {
      id: 'documents',
      label: 'My Documents',
      icon: FolderKanban,
      badge: documentCount > 0 ? `${documentCount}` : null,
    },
    {
      id: 'checker',
      label: 'Document Checker',
      icon: FileCheck2,
      badge: 'Audit',
    },
    {
      id: 'assistant',
      label: 'AI Legal Assistant',
      icon: Bot,
      badge: 'Live',
    },
    {
      id: 'knowledge',
      label: 'Legal Knowledge',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] no-print">
      {/* Workspace Brand / Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Legal Drafting Studio</p>
            <p className="text-[10px] text-slate-400">Jurisdiction Aware</p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-900/60 text-white shadow-sm border border-blue-700/60'
                  : item.highlight
                  ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-amber-400'
                      : item.highlight
                      ? 'text-amber-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : item.highlight
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Safe AI Notice at bottom */}
      <div className="p-4 border-t border-slate-800 text-xs">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Assisted Drafting</span>
          </div>
          <p className="leading-relaxed">
            LegalEase structures standard clauses. Always review with a licensed legal practitioner.
          </p>
        </div>
      </div>
    </aside>
  );
};
