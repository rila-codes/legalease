import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  FileEdit,
  Check,
  Scale,
  AlertCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { LegalDocument } from '../../types/legal';
import { downloadAsDocx, downloadAsText } from '../../utils/exportUtils';

interface Props {
  document: LegalDocument;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const DocumentPreviewModal: React.FC<Props> = ({
  document: doc,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreDownloadWarning, setShowPreDownloadWarning] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<'docx' | 'text' | 'print' | null>(null);

  if (!isOpen) return null;

  const triggerDownloadAction = (action: 'docx' | 'text' | 'print') => {
    setPendingDownloadAction(action);
    setShowPreDownloadWarning(true);
  };

  const handleConfirmDownload = () => {
    setShowPreDownloadWarning(false);
    if (pendingDownloadAction === 'docx') {
      downloadAsDocx(doc);
    } else if (pendingDownloadAction === 'text') {
      downloadAsText(doc);
    } else if (pendingDownloadAction === 'print') {
      window.print();
    }
    setPendingDownloadAction(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-sm text-slate-100 font-serif">
                {doc.title} — Formal Legal Preview
              </h2>
              <p className="text-[11px] text-slate-400">
                Jurisdiction: {doc.jurisdiction.country}
                {doc.jurisdiction.state ? ` (${doc.jurisdiction.state})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Document</span>
            </button>

            <button
              onClick={() => triggerDownloadAction('docx')}
              className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download DOCX</span>
            </button>

            <button
              onClick={() => triggerDownloadAction('print')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Parchment View */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-slate-100/70">
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-16 rounded-xl shadow-lg border border-slate-200 font-legal-serif text-slate-900 leading-relaxed text-sm space-y-6 legal-document-paper">
            {/* Header / Seal */}
            <div className="text-center pb-6 border-b border-slate-300 space-y-2">
              <h1 className="text-2xl font-bold font-legal-heading tracking-wide uppercase text-slate-950">
                {doc.title}
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-sans">
                Dated as of {doc.effectiveDate}
              </p>
              <p className="text-[11px] text-slate-400 font-sans">
                Governing Law: {doc.jurisdiction.country}
                {doc.jurisdiction.state ? `, State of ${doc.jurisdiction.state}` : ''}
              </p>
            </div>

            {/* Preamble */}
            <p className="text-justify font-normal text-slate-900">
              {doc.preamble}
            </p>

            {/* Recitals */}
            {doc.recitals && doc.recitals.length > 0 && (
              <div className="space-y-3 pt-2">
                {doc.recitals.map((recital, i) => (
                  <p key={i} className="text-justify italic text-slate-800">
                    {recital}
                  </p>
                ))}
              </div>
            )}

            {/* Sections & Clauses */}
            <div className="space-y-6 pt-4">
              {doc.sections.map((section) => (
                <div key={section.id} className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider font-legal-heading border-b border-slate-200 pb-1 text-slate-900">
                    SECTION {section.number}. {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.clauses.map((clause) => (
                      <div key={clause.id} className="text-justify">
                        <span className="font-bold text-slate-900 mr-1.5 font-sans text-xs">
                          {clause.number} {clause.title}.
                        </span>
                        <span className="text-slate-800">{clause.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Witness and Signatures */}
            <div className="pt-8 border-t border-slate-300 space-y-6">
              <p className="text-justify italic">
                IN WITNESS WHEREOF, the Parties hereto have caused this instrument to be executed by their respective duly authorized officers as of the day and year first above written.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                {doc.signatures.map((sig, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="font-bold text-xs uppercase font-sans text-slate-700">
                      {sig.role}:
                    </p>
                    <div className="pt-10 border-b border-slate-800 text-sm font-serif italic">
                      {sig.signature || sig.name}
                    </div>
                    <div className="font-sans text-xs space-y-0.5 text-slate-800">
                      <p className="font-bold">{sig.name}</p>
                      <p className="text-slate-500">{sig.title}</p>
                      {sig.address && <p className="text-slate-500 text-[11px]">{sig.address}</p>}
                      <p className="text-slate-400 text-[11px]">
                        Date: {sig.date || doc.effectiveDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Footer Note */}
            <div className="pt-12 text-center text-[10px] text-slate-400 font-sans border-t border-slate-100">
              Draft prepared with LegalEase AI • Page 1 of 1 • For formal legal enforceability, consult independent legal counsel.
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Document Readiness Score: {doc.readinessScore}%</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerDownloadAction('text')}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Export Plain Text (.txt)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Download Review Notice Modal (Section 10 Requirement) */}
      {showPreDownloadWarning && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Please Review Carefully Before Use
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-amber-950">
              "Please review this document carefully. AI-generated drafts may contain errors and may not satisfy all legal requirements in your specific jurisdiction."
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Verify all legal names, addresses, and dates match official records.</p>
              <p>• Consult with a qualified legal professional for high-risk agreements.</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPreDownloadWarning(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to Review
              </button>
              <button
                onClick={handleConfirmDownload}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-bold shadow-sm"
              >
                I Understand, Continue Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
