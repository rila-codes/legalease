import {
  LegalDocument,
  ClauseExplanation,
  DocumentAuditResult,
} from '../types/legal';

export const api = {
  // DOCUMENTS CRUD
  async getDocuments(): Promise<LegalDocument[]> {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      return data.documents || [];
    } catch (err) {
      console.warn('Network error fetching documents, checking localStorage fallback:', err);
      const cached = localStorage.getItem('legalease_documents_cache');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async getDocument(id: string): Promise<LegalDocument | null> {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error('Document not found');
      const data = await res.json();
      return data.document;
    } catch (err) {
      console.warn('Error fetching single document:', err);
      const docs = await this.getDocuments();
      return docs.find((d) => d.id === id) || null;
    }
  },

  async createDocument(doc: Partial<LegalDocument>): Promise<LegalDocument> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error('Failed to create document');
    const data = await res.json();
    return data.document;
  },

  async updateDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update document');
    const data = await res.json();
    return data.document;
  },

  async duplicateDocument(id: string): Promise<LegalDocument> {
    const res = await fetch(`/api/documents/${id}/duplicate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to duplicate document');
    const data = await res.json();
    return data.document;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return true;
  },

  // AI SERVICES
  async generateDocument(payload: {
    documentType: string;
    category?: string;
    jurisdiction: { country: string; state?: string; city?: string };
    basicInfo: any;
    customAnswers: any;
    additionalNotes?: string;
  }): Promise<{ document: LegalDocument; fallbackUsed?: boolean; simulated?: boolean }> {
    const res = await fetch('/api/ai/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'AI generation failed' }));
      throw new Error(err.error || 'Server error generating document');
    }
    return await res.json();
  },

  async explainClause(payload: {
    clauseText: string;
    clauseTitle?: string;
    documentType?: string;
    jurisdiction?: { country: string; state?: string };
  }): Promise<ClauseExplanation> {
    const res = await fetch('/api/ai/explain-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to explain clause');
    return await res.json();
  },

  async rewriteClause(payload: {
    clauseText: string;
    instruction: string;
    tone?: string;
    jurisdiction?: { country: string; state?: string };
  }): Promise<{ rewrittenText: string; explanationOfChanges: string }> {
    const res = await fetch('/api/ai/rewrite-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to rewrite clause');
    return await res.json();
  },

  async assistantChat(payload: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    documentContext?: any;
    currentClause?: any;
  }): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/assistant-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to get AI assistant response');
    return await res.json();
  },

  async checkDocument(payload: {
    text: string;
    documentType?: string;
    jurisdiction?: string;
  }): Promise<DocumentAuditResult> {
    const res = await fetch('/api/ai/check-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Audit failed' }));
      throw new Error(err.error || 'Failed to check document');
    }
    return await res.json();
  },
};
