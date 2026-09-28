import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  Scale,
  ShieldAlert,
  FileText,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DocumentAuditResult } from '../../types/legal';
import { api } from '../../services/api';

export const DocumentChecker: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [docType, setDocType] = useState('Non-Disclosure Agreement');
  const [jurisdiction, setJurisdiction] = useState('United States (California)');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<DocumentAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Sample document filler for fast testing
  const handleLoadSample = () => {
    setDocumentText(`CONFIDENTIALITY AGREEMENT

This Agreement is made between TechCorp Inc. and John Smith.

1. Confidential Information: John agrees to keep company secrets confidential.
2. Term: This agreement shall last until terminated.
3. Governing Law: This contract shall be governed by California law.

Signatures:
TechCorp Inc.
John Smith`);
  };

  const handleAudit = async () => {
    if (!documentText.trim() || documentText.trim().length < 20) {
      setAuditError('Please enter at least 20 characters of document text to audit.');
      return;
    }

    setIsAuditing(true);
    setAuditError(null);

    try {
      const result = await api.checkDocument({
        text: documentText,
        documentType: docType,
        jurisdiction,
      });
      setAuditResult(result);
    } catch (err: any) {
      setAuditError(err.message || 'Audit failed. Please try again.');
    } finally {
      setIsAuditing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'looks_complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Looks Complete
          </span>
        );
      case 'review_recommended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Review Recommended
          </span>
        );
      case 'missing_info':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-4 h-4 text-rose-600" />
            Missing Critical Information
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileCheck2 className="w-6 h-6 text-blue-800" />
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            AI Document Checker & Audit
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Upload or paste any existing contract to detect missing clauses, ambiguities, and potential inconsistencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Document Text to Review
              </span>
              <button
                onClick={handleLoadSample}
                className="text-[11px] font-semibold text-blue-800 hover:text-blue-950 underline"
              >
                Load Sample Text
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Document Type
                </label>
                <input
                  type="text"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  placeholder="e.g. Non-Disclosure Agreement"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. California, US"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <textarea
                rows={12}
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                placeholder="Paste contract clauses, terms, or full text here for AI diagnostic audit..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono leading-relaxed focus:ring-1 focus:ring-blue-900 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {documentText.length} characters entered.
              </p>
            </div>

            {auditError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {auditError}
              </div>
            )}

            <button
              onClick={handleAudit}
              disabled={isAuditing || !documentText.trim()}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Auditing Document with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Run AI Document Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Disclaimer callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              LegalEase AI Document Checker is an assistive diagnostic review tool. It does not replace a comprehensive human legal audit by a licensed attorney.
            </p>
          </div>
        </div>

        {/* Right Column: Audit Results */}
        <div className="lg:col-span-6 space-y-4">
          {auditResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
              {/* Overall Status Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Audit Assessment
                  </span>
                  {getStatusBadge(auditResult.overallStatus)}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Readiness Score</span>
                  <span className="text-2xl font-extrabold text-slate-900 font-serif">
                    {auditResult.readinessScore}%
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">Executive Summary</span>
                {auditResult.summary}
              </div>

              {/* Identified Issues */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Identified Clauses & Recommendations ({auditResult.issues.length})
                </span>

                <div className="space-y-2.5">
                  {auditResult.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        issue.severity === 'red'
                          ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                          : issue.severity === 'yellow'
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                          : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          {issue.severity === 'red' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {issue.severity === 'yellow' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {issue.severity === 'green' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {issue.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                          {issue.severity === 'red' ? 'High Concern' : issue.severity === 'yellow' ? 'Caution' : 'Good'}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {issue.description}
                      </p>
                      {issue.suggestion && (
                        <p className="text-[11px] font-medium pt-1 border-t border-slate-200/50">
                          <strong>Suggestion:</strong> {issue.suggestion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Clauses */}
              {auditResult.missingClauses && auditResult.missingClauses.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">
                    Common Clauses Not Detected
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.missingClauses.map((clause, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-white text-slate-700 border border-slate-200 text-[11px]"
                      >
                        + {clause}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No audit run yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Paste your document text on the left and click "Run AI Document Audit" to see a full diagnostic breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
