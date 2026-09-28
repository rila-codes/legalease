import React from 'react';
import { Scale, ShieldAlert, Globe, CheckCircle } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 no-print">
      {/* Legal Disclaimer Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Important Legal Disclaimer & Terms of Use</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            LegalEase provides AI-assisted legal document drafting and general legal information. It is not a law firm and does not provide legal representation or guaranteed legal advice. AI-generated content may contain errors or omissions and may not comply with the laws of every jurisdiction. Review documents carefully and consult a qualified legal professional when appropriate.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Available document templates and statutory validity vary by jurisdiction.
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Drafting assistance tool only.
            </span>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-b border-slate-800/70">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-amber-400">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white font-serif tracking-tight">
                LegalEase
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              AI-assisted legal drafting platform designed to help small businesses, freelancers, and individuals create structured document drafts with plain-English clause explanations.
            </p>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} LegalEase Technologies Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Business Documents
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Non-Disclosure Agreement (NDA)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Freelance Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Independent Contractor Contract
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Service Level Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Employment Agreement
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Property & Personal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Residential Lease Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Affidavit of Fact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Power of Attorney Draft
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Payment Demand Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Statutory Declaration
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Tools & Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('checker')} className="hover:text-white transition-colors">
                  AI Document Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-white transition-colors">
                  AI Legal Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('knowledge')} className="hover:text-white transition-colors">
                  Legal Terms Glossary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>Designed with zero-pill SaaS elegance. Formatted for worldwide jurisdictions.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300">
              Disclaimer
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300">
              Privacy & Data Safety
            </button>
            <button onClick={() => onNavigate('knowledge')} className="hover:text-slate-300">
              Contract Basics
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
