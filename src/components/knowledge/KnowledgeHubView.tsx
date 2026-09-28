import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scale,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { KNOWLEDGE_ITEMS } from '../../data/knowledgeHub';
import { KnowledgeItem } from '../../types/legal';

export const KnowledgeHubView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'terms' | 'basics' | 'guides' | 'checklists' | 'faqs'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(KNOWLEDGE_ITEMS[0]?.id || null);

  const filtered = KNOWLEDGE_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'terms', label: 'Legal Terms Glossary' },
    { id: 'basics', label: 'Contract Basics' },
    { id: 'guides', label: 'Agreement Guides' },
    { id: 'checklists', label: 'Signing Checklists' },
    { id: 'faqs', label: 'FAQs' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-blue-800" />
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Legal Knowledge Hub
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Plain-English guides, essential contract principles, clause definitions, and pre-execution checklists.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <p>
          <strong>Educational Reference:</strong> Content in the Knowledge Hub provides general legal information and does not constitute formal legal representation or personalized legal advice.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search legal terms or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles / Accordion List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedItemId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-100">
                      {item.category}
                    </span>
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.summary}</p>
                </div>

                <div className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    {item.content}
                  </div>

                  {item.practicalExample && (
                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-blue-900 block mb-1">
                        Practical Real-World Example
                      </span>
                      <p className="italic text-xs leading-relaxed">{item.practicalExample}</p>
                    </div>
                  )}

                  {item.warningNote && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[11px] block">Caution / Watch Out:</span>
                        <p className="text-xs">{item.warningNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
