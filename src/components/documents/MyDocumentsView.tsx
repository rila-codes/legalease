import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Edit2,
  FilePlus2,
  Eye,
  FileEdit,
} from 'lucide-react';
import { LegalDocument } from '../../types/legal';
import { downloadAsDocx, downloadAsText } from '../../utils/exportUtils';

interface Props {
  documents: LegalDocument[];
  onNewDocument: () => void;
  onOpenDocument: (doc: LegalDocument) => void;
  onDuplicateDocument: (doc: LegalDocument) => void;
  onDeleteDocument: (id: string) => void;
  onRenameDocument: (id: string, newTitle: string) => void;
}

export const MyDocumentsView: React.FC<Props> = ({
  documents,
  onNewDocument,
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onRenameDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'draft' | 'completed'>('All');
  const [renamingDocId, setRenamingDocId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.jurisdiction.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStartRename = (doc: LegalDocument) => {
    setRenamingDocId(doc.id);
    setRenameValue(doc.title);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameDocument(id, renameValue.trim());
    }
    setRenamingDocId(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            My Documents & History
          </h1>
          <p className="text-xs text-slate-500">
            Manage your legal drafts, review versions, and export files.
          </p>
        </div>

        <button
          onClick={onNewDocument}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
        >
          <FilePlus2 className="w-4 h-4 text-amber-400" />
          <span>New Document</span>
        </button>
      </div>

      {/* Filter and Search Bar (Section 12) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'draft', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'All' ? 'All Documents' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards List / Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No documents found.</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or create a new document draft.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {doc.documentType}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      doc.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {renamingDocId === doc.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(doc.id)}
                      autoFocus
                      className="px-2 py-1 rounded border border-blue-900 text-xs w-full font-bold text-slate-900"
                    />
                    <button
                      onClick={() => handleSaveRename(doc.id)}
                      className="px-2 py-1 bg-slate-900 text-white rounded text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h3
                    onClick={() => onOpenDocument(doc)}
                    className="font-bold text-slate-900 text-sm hover:text-blue-900 cursor-pointer line-clamp-1"
                  >
                    {doc.title}
                  </h3>
                )}

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>
                    <strong>Jurisdiction:</strong> {doc.jurisdiction.country}
                    {doc.jurisdiction.state ? `, ${doc.jurisdiction.state}` : ''}
                  </p>
                  <p>
                    <strong>Effective Date:</strong> {doc.effectiveDate}
                  </p>
                  <p className="text-slate-400">
                    Created: {new Date(doc.createdAt).toLocaleDateString()} • v{doc.version}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenDocument(doc)}
                  className="inline-flex items-center gap-1 font-semibold text-blue-800 hover:text-blue-950"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Open & Edit</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartRename(doc)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => downloadAsDocx(doc)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Download DOCX"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDuplicateDocument(doc)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
