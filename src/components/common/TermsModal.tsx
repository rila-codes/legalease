import React from 'react';
import { X, Scale, ShieldAlert, CheckCircle, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                LegalEase Terms of Use & Legal Disclaimer
              </h2>
              <p className="text-[11px] text-slate-500">
                Last updated: March 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Disclaimer Box */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Not a Law Firm / No Legal Representation</span>
          </div>
          <p className="text-xs">
            "LegalEase provides AI-assisted legal document drafting and general legal information. It is not a law firm and does not provide legal representation or guaranteed legal advice. AI-generated content may contain errors or omissions and may not comply with the laws of every jurisdiction. Review documents carefully and consult a qualified legal professional when appropriate."
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              1. Drafting Assistance & Informational Purpose
            </h3>
            <p>
              LegalEase is designed strictly as a workflow drafting tool. Using this service does not establish an attorney-client relationship, a fiduciary duty, or a privileged communication channel. The templates, AI-generated clauses, and clause explanations represent general commercial drafting practices.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              2. Jurisdiction Limitations & Statutory Variation
            </h3>
            <p>
              Legal requirements, mandatory statutory disclosures, filing formalities, and judicial interpretation vary across countries, states, provinces, and municipal jurisdictions. LegalEase does not warrant or guarantee that an instrument generated through this platform will be universally enforceable in all courts or arbitration venues.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              3. Independent Counsel Strongly Recommended
            </h3>
            <p>
              Before executing, filing, or serving any agreement or legal notice, you are strongly advised to retain a qualified attorney licensed in your relevant jurisdiction to review the specific legal implications of your transaction.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              4. Data Privacy & Confidentiality
            </h3>
            <p>
              LegalEase does not sell your document contents or questionnaire entries to third-party data brokers. You retain ownership of all inputs and generated drafts created in your account workspace.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-blue-950"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
