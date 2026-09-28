import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  FileCheck2,
  HelpCircle,
  FileEdit,
  Download,
  Clock,
  Globe2,
  ShieldCheck,
  ChevronRight,
  CheckCircle,
  FileText,
  Building2,
  Home,
  AlertTriangle,
  Briefcase,
  Users,
  Compass,
  Layers,
  Search,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../data/templates';
import { DocumentCategory } from '../../types/legal';

interface Props {
  onStartDraft: (templateId?: string) => void;
  onExploreFeatures: () => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<Props> = ({
  onStartDraft,
  onExploreFeatures,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [activeClauseDemo, setActiveClauseDemo] = useState<'nda' | 'termination' | 'indemnity'>('nda');

  const filteredTemplates = selectedCategory === 'All'
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const clauseDemos = {
    nda: {
      title: 'Confidentiality & Non-Disclosure Clause',
      original:
        'The Receiving Party shall hold and maintain the Disclosing Party’s Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party, using at least the same degree of care as it utilizes with its own proprietary data of like character, but in no case less than a reasonable degree of care.',
      simple:
        'The person receiving the secret information agrees to protect it carefully and not share it with unauthorized people or use it for their own gain.',
      purpose: 'Prevents trade secrets and business strategies from being leaked to competitors.',
      obligations: [
        'Keep information secured and private',
        'Limit access only to employees on a strict need-to-know basis',
      ],
      watchOut: 'Make sure standard exceptions (like information already public) are included.',
    },
    termination: {
      title: 'Termination for Cause with Cure Period',
      original:
        'Either Party may terminate this Agreement immediately upon written notice if the other Party commits a material breach hereof and fails to cure such material breach within thirty (30) consecutive calendar days of receipt of written notice specifying the nature of such default.',
      simple:
        'If one side seriously breaks the rules, the other side must give them a written 30-day chance to fix the problem before canceling the contract completely.',
      purpose: 'Gives parties a fair grace period to resolve disputes before contract cancellation.',
      obligations: [
        'Must deliver written notice specifying the exact problem',
        'Must wait the full 30 days before terminating',
      ],
      watchOut: 'Ensure the notice period gives you adequate time to fix technical issues.',
    },
    indemnity: {
      title: 'Mutual Indemnification Clause',
      original:
        'Each Party agrees to defend, indemnify, and hold harmless the other Party, its officers, and affiliates from and against any third-party claims, liabilities, losses, and reasonable attorney fees arising directly out of a material breach of representations or gross negligence.',
      simple:
        'If one party gets sued by an outsider because of the other party’s gross misconduct or copyright breach, the responsible party pays the legal bills and damages.',
      purpose: 'Shifts financial risk to whichever party caused the third-party legal trouble.',
      obligations: [
        'Reimburse valid third-party lawsuit damages and legal defense costs',
        'Cooperate in good faith during legal defense',
      ],
      watchOut: 'Beware of one-way indemnities that make you pay without reciprocal protection.',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen Legal Drafting Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15] font-serif">
                Legal Documents, <br />
                <span className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
                  Simplified by AI.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                Create professional legal document drafts in minutes with AI-powered assistance, guided forms, and simple legal explanations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => onStartDraft()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-base shadow-lg shadow-slate-900/15 hover:shadow-xl transition-all active:scale-95 group"
                >
                  <Scale className="w-5 h-5 text-amber-400" />
                  <span>Generate a Document</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onExploreFeatures}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-sm transition-all"
                >
                  Explore Features
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>14+ Structured Templates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  <span>Multi-Jurisdiction Aware</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Plain-English Explanations</span>
                </div>
              </div>
            </div>

            {/* Right Hero Diagram: AI -> Form -> Legal Document */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glass Card Container */}
                <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-slate-300/60 border border-slate-200/90 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                      Drafting Pipeline
                    </span>
                  </div>

                  {/* Flow Diagram: Form -> AI Processing -> Legal Document */}
                  <div className="space-y-4">
                    {/* Step 1: Guided Form */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          1
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Smart Guided Form</p>
                          <p className="text-[11px] text-slate-500">Non-Disclosure Agreement • California</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Input
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center text-slate-400">
                      <div className="w-0.5 h-4 bg-slate-300"></div>
                    </div>

                    {/* Step 2: AI Engine */}
                    <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">LegalEase AI Engine</p>
                          <p className="text-[11px] text-slate-400">Structuring clauses & recitals</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        Processing
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center text-slate-400">
                      <div className="w-0.5 h-4 bg-slate-300"></div>
                    </div>

                    {/* Step 3: Formal Legal Document */}
                    <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-800" />
                          <span className="text-xs font-bold text-slate-900 font-serif">
                            Formal Legal Document Draft
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Complete
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 font-mono leading-relaxed">
                        <span className="text-slate-400">1.1</span> "Confidential Information" shall include all proprietary source code, commercial disclosures, and trade secrets...
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Readiness: 96%</span>
                        <span className="text-blue-700 font-semibold cursor-pointer hover:underline" onClick={() => onStartDraft('template-nda')}>
                          Preview Draft →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>State & Country Specific</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JURISDICTION NOTICE CALLOUT */}
      <section className="bg-slate-100/80 py-4 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <Globe2 className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-semibold text-slate-900">Jurisdiction Matters:</span>
            <span>Statutory requirements vary across US states, the UK, Canada, Australia, and international bodies.</span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Templates adapt according to your designated governing law.
          </span>
        </div>
      </section>

      {/* FEATURES SECTION (Section 4) */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Complete Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
              Built for Clarity, Accuracy, and Speed
            </p>
            <p className="text-base text-slate-600">
              Everything required to go from plain-English requirements to structured, exportable legal document drafts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Document Generation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate structured legal document drafts based on user requirements and standard commercial norms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Guided Forms</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask users simple questions instead of requiring them to know convoluted legal terminology or statutes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legal Clause Explanation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explain complicated legal clauses in simple language, highlighting key duties and potential pitfalls.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileEdit className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Professional Document Editor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Allow users to review, format, add, remove, and rewrite specific clauses with real-time AI assistance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Formal Document Preview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Show documents in formal parchment presentation with numbered sections, recitals, and signature blocks.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-500/10 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Document History & Versions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Store previously drafted agreements safely, manage multiple versions, and duplicate past templates.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Download className="w-6 h-6 text-sky-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Download & Export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download formatted documents in DOCX and print-ready PDF format with clean legal page breaks.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Globe2 className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Language Architecture</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed to support localized agreements across English, Spanish, French, and international commerce terms.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Jurisdiction Awareness</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Specify country, state, or province, tailoring governing law and noting statutory distinctions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CLAUSE EXPLAINER DEMO (Section 8) */}
      <section className="py-20 bg-slate-100 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Interactive Demo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
              See How Clause Explainer Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Click through real legal clauses to see how LegalEase translates complex legalese into crystal-clear plain English.
            </p>

            <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveClauseDemo('nda')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeClauseDemo === 'nda'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confidentiality (NDA)
              </button>
              <button
                onClick={() => setActiveClauseDemo('termination')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeClauseDemo === 'termination'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Termination & Cure
              </button>
              <button
                onClick={() => setActiveClauseDemo('indemnity')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeClauseDemo === 'indemnity'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Indemnification
              </button>
            </div>
          </div>

          {/* Interactive Clause Card Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Original Legalese */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Original Legal Clause
                </span>
                <span className="text-xs font-medium text-slate-500">Formal Contract</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {clauseDemos[activeClauseDemo].title}
              </h4>
              <p className="text-xs text-slate-700 font-serif leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                "{clauseDemos[activeClauseDemo].original}"
              </p>
              <div className="text-[11px] text-slate-400">
                Dense statutory wording can lead to costly misunderstandings without legal advice.
              </div>
            </div>

            {/* AI Plain-English Explanation */}
            <div className="rounded-2xl bg-slate-900 text-slate-100 p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  LegalEase Plain Explanation
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                  AI Simplified
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1">In Plain English:</p>
                <p className="text-sm font-medium text-slate-100 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                  {clauseDemos[activeClauseDemo].simple}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <p className="text-[11px] font-bold text-slate-300 uppercase mb-1">Purpose</p>
                  <p className="text-[11px] text-slate-400">{clauseDemos[activeClauseDemo].purpose}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <p className="text-[11px] font-bold text-amber-400 uppercase mb-1">Watch Out For</p>
                  <p className="text-[11px] text-slate-400">{clauseDemos[activeClauseDemo].watchOut}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT TYPES SECTION (Section 5) */}
      <section id="document-types" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Template Library
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
              Choose Your Document
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Select a specialized template or craft a custom agreement draft tailored to your jurisdiction.
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Available document templates may vary by jurisdiction.</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {(['All', 'Business', 'Property', 'Personal & Family', 'Legal Notices', 'Custom'] as const).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {template.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ⏱ {template.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {template.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {template.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{template.sampleClausesCount} Standard Clauses</span>
                    <span className="text-slate-400">Difficulty: {template.difficulty}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4">
                  <button
                    onClick={() => onStartDraft(template.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-sm transition-all active:scale-98"
                  >
                    <span>Use Template</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Section 6) */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Clear Multi-Step Workflow
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
              From Inquiry to Executable Draft
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              LegalEase guides you seamlessly through requirements without confusing legalese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'Select Document',
                desc: 'Choose from 14+ templates or describe your custom agreement.',
              },
              {
                step: '02',
                title: 'Jurisdiction',
                desc: 'Select country and state/region. Applicable statutory rules apply.',
              },
              {
                step: '03',
                title: 'Basic Info',
                desc: 'Enter parties, addresses, entity types, and effective dates.',
              },
              {
                step: '04',
                title: 'Smart Questions',
                desc: 'Answer targeted questions about terms, payments, and durations.',
              },
              {
                step: '05',
                title: 'AI Drafting',
                desc: 'LegalEase AI structures formal clauses and recitals.',
              },
              {
                step: '06',
                title: 'Review & Export',
                desc: 'Explain clauses, make edits, and download DOCX or PDF.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 relative"
              >
                <span className="text-2xl font-extrabold text-slate-300 font-serif block">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Ready in under 5 minutes</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif">
            Draft Your First Agreement Today
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate legal ambiguity. Generate structured drafts with clear clause explanations and jurisdiction-aware provisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStartDraft()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base shadow-lg shadow-amber-400/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Create New Document</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
