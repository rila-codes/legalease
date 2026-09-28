export type DocumentCategory =
  | 'Personal & Family'
  | 'Business'
  | 'Property'
  | 'Legal Notices'
  | 'Custom';

export interface LegalClause {
  id: string;
  number: string;
  title: string;
  text: string;
  explanation?: string;
  isCustom?: boolean;
}

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  clauses: LegalClause[];
}

export interface LegalParty {
  role: string;
  name: string;
  type: 'individual' | 'corporation' | 'llc' | 'partnership' | 'other';
  address: string;
  email?: string;
  phone?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}

export interface LegalSignature {
  role: string;
  name: string;
  title: string;
  address?: string;
  date?: string;
  signature?: string;
}

export interface ReadinessCheck {
  basicInfo: boolean;
  parties: boolean;
  dates: boolean;
  requiredSections: boolean;
  signatureSection: boolean;
  score: number;
  recommendations: string[];
}

export interface LegalDocument {
  id: string;
  userId: string;
  title: string;
  documentType: string;
  category: DocumentCategory;
  jurisdiction: {
    country: string;
    state?: string;
    city?: string;
  };
  effectiveDate: string;
  parties: LegalParty[];
  preamble: string;
  recitals: string[];
  sections: LegalSection[];
  signatures: LegalSignature[];
  status: 'draft' | 'completed' | 'in_review';
  readinessScore: number;
  readinessCheck: ReadinessCheck;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  shortDescription: string;
  longDescription: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  popular?: boolean;
  recommendedJurisdictions: string[];
  sampleClausesCount: number;
  standardSections: string[];
  questions: QuestionnaireStep[];
}

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'radio' | 'currency';
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
  required?: boolean;
  helperText?: string;
}

export interface QuestionnaireStep {
  id: string;
  stepTitle: string;
  stepDescription: string;
  fields: QuestionnaireField[];
}

export interface ClauseExplanation {
  simpleExplanation: string;
  purpose: string;
  keyObligations: string[];
  potentialConcerns: string[];
  relatedSections: string[];
}

export interface AuditIssue {
  id: string;
  severity: 'green' | 'yellow' | 'red';
  title: string;
  description: string;
  suggestion: string;
  clauseText?: string;
}

export interface DocumentAuditResult {
  overallStatus: 'looks_complete' | 'review_recommended' | 'missing_info';
  readinessScore: number;
  summary: string;
  issues: AuditIssue[];
  partiesIdentified: string[];
  keyDates: string[];
  missingClauses: string[];
  disclaimer: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'terms' | 'basics' | 'guides' | 'checklists' | 'faqs';
  summary: string;
  content: string;
  practicalExample?: string;
  warningNote?: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  preferredLanguage: string;
  defaultCountry: string;
  defaultState: string;
  autoSave: boolean;
  createdAt: string;
}
