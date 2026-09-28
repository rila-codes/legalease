import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Scale,
  ShieldAlert,
  Loader2,
  FileText,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { LegalDocument } from '../../types/legal';
import { api } from '../../services/api';

interface Props {
  documents: LegalDocument[];
}

export const AIAssistantView: React.FC<Props> = ({ documents }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    documents[0]?.id || '',
  );
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello! I am **LegalEase AI Assistant**.\n\nI can help you review draft clauses, explain contract terms in plain English, identify missing provisions, or clarify statutory rules across jurisdictions.\n\n*Notice: I provide legal drafting assistance and educational legal information. I am an AI tool, not an attorney, and do not provide legal representation.*`,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeDoc = documents.find((d) => d.id === selectedDocId);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim() || isLoading) return;

    const newMsgs = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMsgs);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await api.assistantChat({
        messages: newMsgs,
        documentContext: activeDoc
          ? {
              title: activeDoc.title,
              documentType: activeDoc.documentType,
              jurisdiction: activeDoc.jurisdiction,
            }
          : undefined,
      });

      setMessages([...newMsgs, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Unable to reach LegalEase AI assistant. Please check your internet connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">
              AI Legal Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Ask questions about contracts, clauses, statutory rights, or draft improvements.
          </p>
        </div>

        {/* Document Context Selector */}
        {documents.length > 0 && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
            <span className="font-semibold text-slate-500">Context:</span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-none"
            >
              <option value="">General (No document attached)</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-blue-950 text-amber-400'
                    : 'bg-slate-900 text-amber-400'
                }`}
              >
                {m.role === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-4 rounded-2xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line prose-xs">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-3">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>LegalEase AI is formulating drafting advice...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleSendMessage('Explain the difference between an employee and an independent contractor.')}
            className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px]"
          >
            Employee vs Contractor?
          </button>
          <button
            onClick={() => handleSendMessage('What does an indemnification clause do and why is it risky?')}
            className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px]"
          >
            What is indemnification?
          </button>
          <button
            onClick={() => handleSendMessage('How should I choose governing law if parties live in different states?')}
            className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px]"
          >
            Multi-state governing law?
          </button>
          <button
            onClick={() => handleSendMessage('What is a liquidated damages clause and when is it unenforceable?')}
            className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px]"
          >
            Liquidated damages?
          </button>
        </div>

        {/* Input box */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask LegalEase AI any question about drafting, clauses, or contract terms..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!userInput.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
