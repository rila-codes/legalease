/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LegalDisclaimerBanner } from './components/common/LegalDisclaimerBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { DocumentWizard } from './components/wizard/DocumentWizard';
import { DocumentEditor } from './components/editor/DocumentEditor';
import { DocumentPreviewModal } from './components/preview/DocumentPreviewModal';
import { MyDocumentsView } from './components/documents/MyDocumentsView';
import { TemplatesView } from './components/templates/TemplatesView';
import { DocumentChecker } from './components/checker/DocumentChecker';
import { AIAssistantView } from './components/assistant/AIAssistantView';
import { KnowledgeHubView } from './components/knowledge/KnowledgeHubView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { TermsModal } from './components/common/TermsModal';
import { LegalDocument, UserProfile } from './types/legal';
import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<LegalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);
  const [wizardTemplateId, setWizardTemplateId] = useState<string | undefined>(undefined);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'user-demo-1',
    name: 'Elena Vance',
    email: 'elena.vance@apexhorizons.com',
    organization: 'Apex Horizon Technologies Inc.',
    role: 'Chief Executive Officer',
    preferredLanguage: 'English (US)',
    defaultCountry: 'United States',
    defaultState: 'California',
    autoSave: true,
    createdAt: new Date().toISOString(),
  });

  // Load initial documents
  useEffect(() => {
    async function loadDocs() {
      try {
        const fetched = await api.getDocuments();
        if (fetched && fetched.length > 0) {
          setDocuments(fetched);
          localStorage.setItem('legalease_documents_cache', JSON.stringify(fetched));
        }
      } catch (err) {
        console.warn('Using local document store:', err);
      }
    }
    loadDocs();
  }, []);

  // Handlers
  const handleStartDraft = (templateId?: string) => {
    setWizardTemplateId(templateId);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDocumentCreated = (newDoc: LegalDocument) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    localStorage.setItem(
      'legalease_documents_cache',
      JSON.stringify([newDoc, ...documents]),
    );
    setActiveDocument(newDoc);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDocument = (doc: LegalDocument) => {
    setActiveDocument(doc);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDocument = async (updatedDoc: LegalDocument) => {
    try {
      const saved = await api.updateDocument(updatedDoc.id, updatedDoc);
      setDocuments((prev) =>
        prev.map((d) => (d.id === saved.id ? saved : d)),
      );
      setActiveDocument(saved);
      localStorage.setItem(
        'legalease_documents_cache',
        JSON.stringify(documents.map((d) => (d.id === saved.id ? saved : d))),
      );
    } catch (err) {
      console.warn('Saved locally in-memory:', err);
      setDocuments((prev) =>
        prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)),
      );
      setActiveDocument(updatedDoc);
    }
  };

  const handleDuplicateDocument = async (doc: LegalDocument) => {
    try {
      const duplicated = await api.duplicateDocument(doc.id);
      setDocuments((prev) => [duplicated, ...prev]);
    } catch (err) {
      const cloned: LegalDocument = {
        ...doc,
        id: `doc-${Date.now()}`,
        title: `${doc.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };
      setDocuments((prev) => [cloned, ...prev]);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await api.deleteDocument(id);
    } catch (err) {
      console.warn('Deleted locally:', err);
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDocument?.id === id) {
      setActiveDocument(null);
      setCurrentView('dashboard');
    }
  };

  const handleRenameDocument = async (id: string, newTitle: string) => {
    try {
      await api.updateDocument(id, { title: newTitle });
    } catch (err) {
      console.warn('Renamed locally:', err);
    }
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title: newTitle } : d)),
    );
  };

  const handleClearAllDocuments = () => {
    setDocuments([]);
    localStorage.removeItem('legalease_documents_cache');
    setActiveDocument(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: string) => {
    if (view === 'terms' || view === 'privacy') {
      setTermsModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine layout mode
  const isLandingView = currentView === 'landing';
  const isEditorView = currentView === 'editor' && activeDocument;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Persistent Legal Disclaimer Banner across application */}
      <LegalDisclaimerBanner
        variant="banner"
        onLearnMore={() => setTermsModalOpen(true)}
      />

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNewDocument={() => handleStartDraft()}
      />

      {/* Main Body View */}
      {isLandingView ? (
        <main className="flex-1">
          <LandingPage
            onStartDraft={(templateId) => handleStartDraft(templateId)}
            onExploreFeatures={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onNavigate={handleNavigate}
          />
        </main>
      ) : isEditorView ? (
        <main className="flex-1">
          <DocumentEditor
            document={activeDocument}
            onSave={handleSaveDocument}
            onClose={() => setCurrentView('dashboard')}
            onOpenPreview={(doc) => setPreviewDoc(doc)}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Left Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            documentCount={documents.length}
          />

          {/* Main Dashboard / Workspace Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50">
            {currentView === 'dashboard' && (
              <DashboardView
                user={currentUser}
                documents={documents}
                onNewDocument={() => handleStartDraft()}
                onOpenDocument={handleOpenDocument}
                onDuplicateDocument={handleDuplicateDocument}
                onDeleteDocument={handleDeleteDocument}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'wizard' && (
              <DocumentWizard
                initialTemplateId={wizardTemplateId}
                onDocumentCreated={handleDocumentCreated}
                onCancel={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'documents' && (
              <MyDocumentsView
                documents={documents}
                onNewDocument={() => handleStartDraft()}
                onOpenDocument={handleOpenDocument}
                onDuplicateDocument={handleDuplicateDocument}
                onDeleteDocument={handleDeleteDocument}
                onRenameDocument={handleRenameDocument}
              />
            )}

            {currentView === 'templates' && (
              <TemplatesView
                onSelectTemplate={(templateId) => handleStartDraft(templateId)}
              />
            )}

            {currentView === 'checker' && <DocumentChecker />}

            {currentView === 'assistant' && (
              <AIAssistantView documents={documents} />
            )}

            {currentView === 'knowledge' && <KnowledgeHubView />}

            {currentView === 'settings' && currentUser && (
              <ProfileSettingsView
                user={currentUser}
                onUpdateUser={(updated) => setCurrentUser(updated)}
                onClearAllDocuments={handleClearAllDocuments}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Formal Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          onEdit={() => {
            setActiveDocument(previewDoc);
            setPreviewDoc(null);
            setCurrentView('editor');
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
        }}
      />

      {/* Terms & Legal Disclaimer Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      {/* Footer on landing and non-editor pages */}
      {!isEditorView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
