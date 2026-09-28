import React, { useState } from 'react';
import {
  Save,
  Eye,
  Download,
  Sparkles,
  Bot,
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Search,
  RotateCcw,
  RotateCw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Send,
  Loader2,
  Scale,
  Copy,
  Check,
  FileDown,
  Printer,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LegalDocument,
  LegalSection,
  LegalClause,
  ClauseExplanation,
} from '../../types/legal';
import { api } from '../../services/api';
import { downloadAsDocx, downloadAsText } from '../../utils/exportUtils';

interface Props {
  document: LegalDocument;
  onSave: (doc: LegalDocument) => Promise<void>;
  onClose: () => void;
  onOpenPreview: (doc: LegalDocument) => void;
}

export const DocumentEditor: React.FC<Props> = ({
  document: initialDoc,
  onSave,
  onClose,
  onOpenPreview,
}) => {
  const [doc, setDoc] = useState<LegalDocument>(initialDoc);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialDoc.sections[0]?.id || '',
  );
  const [selectedClause, setSelectedClause] = useState<LegalClause | null>(
    initialDoc.sections[0]?.clauses[0] || null,
  );

  // Tab on right panel: 'explainer' | 'assistant' | 'readiness'
  const [activeRightTab, setActiveRightTab] = useState<'explainer' | 'assistant' | 'readiness'>('explainer');

  // Clause explainer state
  const [clauseExplanation, setClauseExplanation] = useState<ClauseExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Clause rewrite state
  const [rewriteInstruction, setRewriteInstruction] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);

  // AI Assistant chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello! I am **LegalEase AI Assistant**. I can help you analyze clauses, review risks, suggest missing terms, or simplify phrasing for **"${doc.title}"**. How can I help you refine this draft?`,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Find & Replace state
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Explain selected clause automatically or on-demand
  const handleExplainClause = async (clause: LegalClause) => {
    setSelectedClause(clause);
    setIsExplaining(true);
    setActiveRightTab('explainer');

    try {
      const exp = await api.explainClause({
        clauseText: clause.text,
        clauseTitle: clause.title,
        documentType: doc.documentType,
        jurisdiction: doc.jurisdiction,
      });
      setClauseExplanation(exp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  // Rewrite selected clause
  const handleRewriteClause = async (instruction: string) => {
    if (!selectedClause) return;
    setIsRewriting(true);

    try {
      const result = await api.rewriteClause({
        clauseText: selectedClause.text,
        instruction: instruction || 'Make this clause clearer and balanced',
        jurisdiction: doc.jurisdiction,
      });

      // Update clause in doc state
      const updatedSections = doc.sections.map((sec) => ({
        ...sec,
        clauses: sec.clauses.map((c) =>
          c.id === selectedClause.id ? { ...c, text: result.rewrittenText } : c,
        ),
      }));

      const updatedDoc = { ...doc, sections: updatedSections };
      setDoc(updatedDoc);
      setSelectedClause({ ...selectedClause, text: result.rewrittenText });
      setRewriteInstruction('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  // Chat message send
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || userInput;
    if (!textToSend.trim() || isChatLoading) return;

    const newMsgs = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMsgs);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const res = await api.assistantChat({
        messages: newMsgs,
        documentContext: {
          title: doc.title,
          documentType: doc.documentType,
          jurisdiction: doc.jurisdiction,
        },
        currentClause: selectedClause,
      });

      setMessages([...newMsgs, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Unable to communicate with LegalEase AI service. Please verify your connection or review the Knowledge Hub for standard guidance.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(doc);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2000);
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Find & Replace
  const handleExecuteReplace = () => {
    if (!findText.trim()) return;
    const regex = new RegExp(findText, 'gi');

    const updatedSections = doc.sections.map((sec) => ({
      ...sec,
      clauses: sec.clauses.map((c) => ({
        ...c,
        text: c.text.replace(regex, replaceText),
      })),
    }));

    setDoc({ ...doc, sections: updatedSections });
  };

  // Add new clause to current section
  const handleAddClause = (sectionId: string) => {
    const section = doc.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newNumber = `${section.number}.${section.clauses.length + 1}`;
    const newClause: LegalClause = {
      id: `c-${Date.now()}`,
      number: newNumber,
      title: 'Additional Provision',
      text: 'The parties agree that all further terms shall be construed in accordance with applicable statutory covenants.',
      isCustom: true,
    };

    const updatedSections = doc.sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, clauses: [...sec.clauses, newClause] }
        : sec,
    );

    setDoc({ ...doc, sections: updatedSections });
    setSelectedClause(newClause);
  };

  // Remove clause
  const handleDeleteClause = (clauseId: string) => {
    const updatedSections = doc.sections.map((sec) => ({
      ...sec,
      clauses: sec.clauses.filter((c) => c.id !== clauseId),
    }));
    setDoc({ ...doc, sections: updatedSections });
    if (selectedClause?.id === clauseId) {
      setSelectedClause(null);
    }
  };

  // Update clause text directly
  const handleClauseTextChange = (clauseId: string, newText: string) => {
    const updatedSections = doc.sections.map((sec) => ({
      ...sec,
      clauses: sec.clauses.map((c) =>
        c.id === clauseId ? { ...c, text: newText } : c,
      ),
    }));
    setDoc({ ...doc, sections: updatedSections });
    if (selectedClause?.id === clauseId) {
      setSelectedClause({ ...selectedClause, text: newText });
    }
  };

  // Update clause title
  const handleClauseTitleChange = (clauseId: string, newTitle: string) => {
    const updatedSections = doc.sections.map((sec) => ({
      ...sec,
      clauses: sec.clauses.map((c) =>
        c.id === clauseId ? { ...c, title: newTitle } : c,
      ),
    }));
    setDoc({ ...doc, sections: updatedSections });
    if (selectedClause?.id === clauseId) {
      setSelectedClause({ ...selectedClause, title: newTitle });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Document Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Documents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={doc.title}
                onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                className="font-bold text-sm sm:text-base text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-900 focus:outline-none"
              />
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                {doc.jurisdiction.country}
                {doc.jurisdiction.state ? ` (${doc.jurisdiction.state})` : ''}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Last saved: {new Date(doc.updatedAt).toLocaleTimeString()} • v{doc.version}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className="p-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:inline-flex items-center gap-1.5"
            title="Find & Replace"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find</span>
          </button>

          <button
            onClick={() => onOpenPreview(doc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-700" />
            <span>Formal Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all ${
              hasSaved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-900 hover:bg-blue-950'
            }`}
          >
            {hasSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={() => downloadAsDocx(doc)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Download DOCX"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Find & Replace Bar */}
      {showFindReplace && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Find text..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="px-2.5 py-1 rounded border border-slate-300 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="px-2.5 py-1 rounded border border-slate-300 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
          <button
            onClick={handleExecuteReplace}
            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-blue-950"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowFindReplace(false)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace (3-Column Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Document Outline & Readiness */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto no-print">
          <div className="p-3 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Document Outline
            </span>
          </div>

          <div className="p-2 space-y-1 flex-1">
            {/* Preamble / Recitals link */}
            <div className="p-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100">
              Preamble & Parties
            </div>

            {/* Sections */}
            {doc.sections.map((sec) => (
              <div key={sec.id} className="space-y-1">
                <button
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    activeSectionId === sec.id
                      ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">
                    {sec.number}. {sec.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {sec.clauses.length}
                  </span>
                </button>

                {/* Clause list under section */}
                {sec.clauses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      setSelectedClause(c);
                    }}
                    className={`w-full text-left pl-6 pr-2 py-1 rounded text-[11px] truncate transition-colors ${
                      selectedClause?.id === c.id
                        ? 'text-blue-900 font-semibold bg-amber-50/80 border-l-2 border-amber-500'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {c.number} {c.title}
                  </button>
                ))}
              </div>
            ))}

            {/* Signatures link */}
            <div className="p-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100">
              Execution & Signatures
            </div>
          </div>

          {/* Quick Readiness Scorecard (Section 16) */}
          <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Readiness Score</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                {doc.readinessScore}%
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Basic Info & Parties</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dates & Duration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Required Sections</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Signature Block</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Document Legal Editor */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/80">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 sm:p-12 space-y-8 legal-document-paper">
            {/* Formal Document Title */}
            <div className="text-center pb-6 border-b border-slate-200 space-y-2">
              <h1 className="text-2xl font-bold text-slate-950 uppercase tracking-tight font-serif">
                {doc.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Governing Jurisdiction: {doc.jurisdiction.country}
                {doc.jurisdiction.state ? ` (${doc.jurisdiction.state})` : ''} • Effective Date: {doc.effectiveDate}
              </p>
            </div>

            {/* Preamble */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preamble
              </span>
              <textarea
                rows={3}
                value={doc.preamble}
                onChange={(e) => setDoc({ ...doc, preamble: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif focus:ring-1 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Recitals */}
            {doc.recitals && doc.recitals.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recitals
                </span>
                <div className="space-y-2">
                  {doc.recitals.map((recital, rIdx) => (
                    <textarea
                      key={rIdx}
                      rows={2}
                      value={recital}
                      onChange={(e) => {
                        const newRecitals = [...doc.recitals];
                        newRecitals[rIdx] = e.target.value;
                        setDoc({ ...doc, recitals: newRecitals });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 italic font-serif leading-relaxed focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sections and Clauses */}
            <div className="space-y-8">
              {doc.sections.map((section) => (
                <div
                  key={section.id}
                  className="space-y-4 pt-4 border-t border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-blue-950 font-serif">
                        SECTION {section.number}.
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = doc.sections.map((s) =>
                            s.id === section.id
                              ? { ...s, title: e.target.value }
                              : s,
                          );
                          setDoc({ ...doc, sections: updated });
                        }}
                        className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleAddClause(section.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:text-blue-950 p-1 rounded hover:bg-blue-50"
                      title="Add Clause"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Clause</span>
                    </button>
                  </div>

                  {/* Clauses */}
                  <div className="space-y-4">
                    {section.clauses.map((clause) => {
                      const isSelected = selectedClause?.id === clause.id;
                      return (
                        <div
                          key={clause.id}
                          onClick={() => setSelectedClause(clause)}
                          className={`p-4 rounded-xl border transition-all cursor-text ${
                            isSelected
                              ? 'border-blue-900 bg-blue-50/20 shadow-sm ring-1 ring-blue-900/10'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-800">
                                {clause.number}
                              </span>
                              <input
                                type="text"
                                value={clause.title}
                                onChange={(e) =>
                                  handleClauseTitleChange(
                                    clause.id,
                                    e.target.value,
                                  )
                                }
                                className="font-semibold text-xs text-slate-900 bg-transparent focus:outline-none border-b border-transparent hover:border-slate-300"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExplainClause(clause);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>Explain</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClause(clause.id);
                                }}
                                className="text-slate-400 hover:text-red-600 p-0.5"
                                title="Delete Clause"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            value={clause.text}
                            onChange={(e) =>
                              handleClauseTextChange(clause.id, e.target.value)
                            }
                            className="w-full text-xs text-slate-800 leading-relaxed font-serif bg-transparent resize-y focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Block */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <p className="text-xs text-slate-600 font-serif italic">
                IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {doc.signatures.map((sig, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                      {sig.role}
                    </span>
                    <div className="pt-6 border-b border-slate-400 font-serif text-slate-800 italic">
                      {sig.signature || sig.name}
                    </div>
                    <p className="font-semibold text-slate-900">{sig.name}</p>
                    <p className="text-slate-500">{sig.title}</p>
                    <p className="text-[11px] text-slate-400">
                      Date: {sig.date || doc.effectiveDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Assistant / Clause Explainer Panel */}
        <div className="w-80 sm:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden no-print">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
            <button
              onClick={() => setActiveRightTab('explainer')}
              className={`flex-1 py-3 px-2 font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeRightTab === 'explainer'
                  ? 'border-blue-900 text-blue-950 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Clause Explainer</span>
            </button>
            <button
              onClick={() => setActiveRightTab('assistant')}
              className={`flex-1 py-3 px-2 font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeRightTab === 'assistant'
                  ? 'border-blue-900 text-blue-950 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-700" />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => setActiveRightTab('readiness')}
              className={`flex-1 py-3 px-2 font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeRightTab === 'readiness'
                  ? 'border-blue-900 text-blue-950 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Readiness</span>
            </button>
          </div>

          {/* TAB 1: CLAUSE EXPLAINER (Section 8) */}
          {activeRightTab === 'explainer' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {selectedClause ? (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Selected Clause {selectedClause.number}
                    </span>
                    <h3 className="font-bold text-slate-900 mt-0.5">
                      {selectedClause.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 text-[11px] mt-1 font-serif">
                      "{selectedClause.text}"
                    </p>
                  </div>

                  {isExplaining ? (
                    <div className="p-6 text-center space-y-2">
                      <Loader2 className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
                      <p className="text-xs font-medium text-slate-600">
                        Analyzing clause in plain English...
                      </p>
                    </div>
                  ) : clauseExplanation ? (
                    <div className="space-y-3">
                      {/* Simple Explanation */}
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Simple Plain English
                        </span>
                        <p className="text-xs leading-relaxed">
                          {clauseExplanation.simpleExplanation}
                        </p>
                      </div>

                      {/* Purpose */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Purpose
                        </span>
                        <p className="text-slate-700 text-xs mt-0.5">
                          {clauseExplanation.purpose}
                        </p>
                      </div>

                      {/* Key Obligations */}
                      {clauseExplanation.keyObligations && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Key Obligations
                          </span>
                          <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-700 text-[11px]">
                            {clauseExplanation.keyObligations.map((ob, i) => (
                              <li key={i}>{ob}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Potential Concerns */}
                      {clauseExplanation.potentialConcerns && (
                        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                            Potential Concerns to Watch
                          </span>
                          <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                            {clauseExplanation.potentialConcerns.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <button
                        onClick={() => handleExplainClause(selectedClause)}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Explain Selected Clause</span>
                      </button>
                    </div>
                  )}

                  {/* AI Rewrite Assistant */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                      Rewrite or Adjust Clause
                    </span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Make it mutual, simplify words..."
                        value={rewriteInstruction}
                        onChange={(e) => setRewriteInstruction(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRewriteClause(rewriteInstruction)}
                        disabled={isRewriting}
                        className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-950 disabled:opacity-50"
                      >
                        {isRewriting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Rewrite'}
                      </button>
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => handleRewriteClause('Simplify language into plain English')}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Simplify Wording
                      </button>
                      <button
                        onClick={() => handleRewriteClause('Make obligations mutual for both parties')}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Make Mutual
                      </button>
                      <button
                        onClick={() => handleRewriteClause('Add 14 days cure period')}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Add 14-Day Cure
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p>Click on any clause in the editor to see its plain-English explanation.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI LEGAL ASSISTANT (Section 7) */}
          {activeRightTab === 'assistant' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-900 text-white ml-6'
                        : 'bg-slate-100 text-slate-800 mr-2 border border-slate-200/80'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-500 mr-6 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>LegalEase AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() => handleSendMessage('What essential clauses are missing from this draft?')}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                >
                  Missing clauses?
                </button>
                <button
                  onClick={() => handleSendMessage('Summarize the primary obligations of each party.')}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                >
                  Summarize duties
                </button>
                <button
                  onClick={() => handleSendMessage('How does termination work under this agreement?')}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                >
                  Termination rules?
                </button>
              </div>

              {/* Input field */}
              <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask LegalEase AI about this draft..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!userInput.trim() || isChatLoading}
                  className="p-2 rounded-xl bg-slate-900 text-white hover:bg-blue-950 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: READINESS & RECOMMENDATIONS (Section 16) */}
          {activeRightTab === 'readiness' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Document Readiness</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded text-xs">
                    {doc.readinessScore}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${doc.readinessScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Readiness measures party completeness, dated covenants, statutory choices, and signature blocks.
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Readiness Criteria
                </span>
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Basic Information</span>
                    <span className="text-emerald-600 font-bold">✓ Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Parties & Entities</span>
                    <span className="text-emerald-600 font-bold">✓ Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Dates & Terms</span>
                    <span className="text-emerald-600 font-bold">✓ Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Governing Law Set</span>
                    <span className="text-emerald-600 font-bold">✓ {doc.jurisdiction.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Execution Block</span>
                    <span className="text-emerald-600 font-bold">✓ Signatures Included</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {doc.readinessCheck?.recommendations && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    AI Recommendations Before Use
                  </span>
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2">
                    {doc.readinessCheck.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
