import React, { useState } from 'react';
import {
  FilePlus2,
  FileText,
  Clock,
  CheckCircle2,
  Bot,
  FileStack,
  FileCheck2,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Scale,
  Sparkles,
  ArrowRight,
  Shield,
  FileEdit,
} from 'lucide-react';
import { LegalDocument, UserProfile } from '../../types/legal';
import { downloadAsDocx } from '../../utils/exportUtils';

interface Props {
  user: UserProfile | null;
  documents: LegalDocument[];
  onNewDocument: () => void;
  onOpenDocument: (doc: LegalDocument) => void;
  onDuplicateDocument: (doc: LegalDocument) => void;
  onDeleteDocument: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  user,
  documents,
  onNewDocument,
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onNavigate,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const completedCount = documents.filter((d) => d.status === 'completed').length;
  const draftCount = documents.filter((d) => d.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>AI Legal Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
            Welcome back, {user?.name || 'Counselor'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Draft, review, and structure legal agreements with plain-English clause explanations tailored to your governing jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onNewDocument}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <FilePlus2 className="w-4 h-4 text-slate-950" />
            <span>Create New Document</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (Section 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Documents Created
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            {documents.length}
          </p>
          <p className="text-[11px] text-slate-400">Total drafted in LegalEase</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Draft Documents
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            {draftCount}
          </p>
          <p className="text-[11px] text-slate-400">In-progress revisions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            {completedCount}
          </p>
          <p className="text-[11px] text-slate-400">Ready for review & execution</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Templates
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileStack className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            14
          </p>
          <p className="text-[11px] text-slate-400">Covering 5 major categories</p>
        </div>
      </div>

      {/* Quick Actions (Section 11) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={onNewDocument}
            className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm hover:shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-900/10 text-blue-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FilePlus2 className="w-5 h-5 text-blue-900" />
            </div>
            <p className="text-xs font-bold text-slate-900">Create Document</p>
            <p className="text-[11px] text-slate-500">Guided AI wizard</p>
          </button>

          <button
            onClick={() => onNavigate('documents')}
            className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm hover:shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-xs font-bold text-slate-900">My Documents</p>
            <p className="text-[11px] text-slate-500">Saved agreements & drafts</p>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm hover:shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-xs font-bold text-slate-900">AI Legal Assistant</p>
            <p className="text-[11px] text-slate-500">Ask questions & analyze</p>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm hover:shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileStack className="w-5 h-5 text-purple-700" />
            </div>
            <p className="text-xs font-bold text-slate-900">Template Library</p>
            <p className="text-[11px] text-slate-500">Explore standard contracts</p>
          </button>
        </div>
      </div>

      {/* Recent Documents Table (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-3">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Documents</h2>
            <p className="text-xs text-slate-500">Previously drafted instruments and active files</p>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            <span>View All ({documents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No documents yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first legal document draft with LegalEase AI guided wizard.
            </p>
            <button
              onClick={onNewDocument}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-950"
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="px-5 py-3">Document Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Jurisdiction</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.slice(0, 6).map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onOpenDocument(doc)}
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-800 shrink-0" />
                      <span className="group-hover:text-blue-900 transition-colors">
                        {doc.title}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{doc.documentType}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {doc.jurisdiction.country}
                      {doc.jurisdiction.state ? `, ${doc.jurisdiction.state}` : ''}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          doc.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status === 'completed' ? 'Completed' : 'Draft'}
                      </span>
                    </td>
                    <td
                      className="px-5 py-3.5 text-right space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                        title="Edit / Open"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => downloadAsDocx(doc)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                        title="Download DOCX"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateDocument(doc)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
