import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileStack,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../data/templates';
import { DocumentCategory, DocumentTemplate } from '../../types/legal';

interface Props {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatesView: React.FC<Props> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = DOCUMENT_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">
          Legal Template Library
        </h1>
        <p className="text-xs text-slate-500">
          Standardized contracts, agreements, and notices tailored for fast AI drafting.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search templates (e.g. NDA, lease, freelance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Business', 'Property', 'Personal & Family', 'Legal Notices', 'Custom'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {tmpl.category}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  ⏱ {tmpl.estimatedTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                {tmpl.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {tmpl.shortDescription}
              </p>

              {/* Standard sections badge preview */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Includes Clauses:
                </span>
                <div className="flex flex-wrap gap-1">
                  {tmpl.standardSections.slice(0, 4).map((sec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200"
                    >
                      {sec}
                    </span>
                  ))}
                  {tmpl.standardSections.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                      +{tmpl.standardSections.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Difficulty: {tmpl.difficulty}
              </span>
              <button
                onClick={() => onSelectTemplate(tmpl.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <span>Use Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
