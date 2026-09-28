import React, { useState } from 'react';
import { AlertCircle, X, ChevronRight, Scale } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'card' | 'inline';
  onLearnMore?: () => void;
}

export const LegalDisclaimerBanner: React.FC<Props> = ({ variant = 'banner', onLearnMore }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && variant === 'banner') {
    return null;
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
        <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Legal Notice: </span>
          Drafting assistance only. AI-generated clauses do not constitute legal representation. Consult a qualified attorney in your jurisdiction.
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="Legal Notice" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4 no-print relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Scale className="w-3.5 h-3.5" />
            Legal Notice
          </span>
          <p className="line-clamp-1 sm:line-clamp-none text-slate-300">
            LegalEase provides AI-assisted document drafting and general legal information. It is not a law firm and does not provide legal representation.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-0.5 text-xs transition-colors"
            >
              Learn more
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
