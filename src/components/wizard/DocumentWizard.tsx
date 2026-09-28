import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Building,
  User,
  Calendar,
  FileText,
  Shield,
  Loader2,
  Info,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../data/templates';
import { SUPPORTED_JURISDICTIONS } from '../../data/jurisdictions';
import { DocumentTemplate, LegalDocument } from '../../types/legal';
import { api } from '../../services/api';

interface Props {
  initialTemplateId?: string;
  onDocumentCreated: (doc: LegalDocument) => void;
  onCancel: () => void;
}

export const DocumentWizard: React.FC<Props> = ({
  initialTemplateId,
  onDocumentCreated,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(
    () => DOCUMENT_TEMPLATES.find((t) => t.id === initialTemplateId) || DOCUMENT_TEMPLATES[0],
  );

  // Step 2: Jurisdiction
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [selectedState, setSelectedState] = useState<string>('California');
  const [city, setCity] = useState<string>('San Francisco');

  // Step 3: Basic Info
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [party1Name, setParty1Name] = useState<string>('Apex Innovations Inc.');
  const [party1Type, setParty1Type] = useState<string>('corporation');
  const [party1Address, setParty1Address] = useState<string>(
    '100 Market Street, Suite 400, San Francisco, CA 94105',
  );
  const [party1Signatory, setParty1Signatory] = useState<string>('Elena Vance');
  const [party1Title, setParty1Title] = useState<string>('Chief Executive Officer');

  const [party2Name, setParty2Name] = useState<string>('Vanguard Media LLC');
  const [party2Type, setParty2Type] = useState<string>('llc');
  const [party2Address, setParty2Address] = useState<string>(
    '500 Broadway, 12th Floor, New York, NY 10012',
  );
  const [party2Signatory, setParty2Signatory] = useState<string>('Marcus Sterling');
  const [party2Title, setParty2Title] = useState<string>('Managing Director');

  // Step 4: Custom Answers
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Step 5: Generation State & Progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Initialize defaults when template changes
  useEffect(() => {
    const defaults: Record<string, any> = {};
    selectedTemplate.questions.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        }
      });
    });
    setCustomAnswers(defaults);
  }, [selectedTemplate]);

  // Handle template selection change if passed from props
  useEffect(() => {
    if (initialTemplateId) {
      const found = DOCUMENT_TEMPLATES.find((t) => t.id === initialTemplateId);
      if (found) {
        setSelectedTemplate(found);
      }
    }
  }, [initialTemplateId]);

  const jurisdictionData = SUPPORTED_JURISDICTIONS[selectedCountry] || SUPPORTED_JURISDICTIONS['United States'];
  const currentStateInfo = jurisdictionData.states.find((s) => s.name === selectedState);

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setCurrentStep(5);
    setGenerationError(null);
    setGenerationPhase(0);

    // Progress animation milestones
    const timers = [
      setTimeout(() => setGenerationPhase(1), 600),
      setTimeout(() => setGenerationPhase(2), 1400),
      setTimeout(() => setGenerationPhase(3), 2200),
      setTimeout(() => setGenerationPhase(4), 3000),
    ];

    try {
      const response = await api.generateDocument({
        documentType: selectedTemplate.name,
        category: selectedTemplate.category,
        jurisdiction: {
          country: selectedCountry,
          state: selectedState,
          city,
        },
        basicInfo: {
          effectiveDate,
          party1Name,
          party1Type,
          party1Address,
          party1Signatory,
          party1Title,
          party2Name,
          party2Type,
          party2Address,
          party2Signatory,
          party2Title,
        },
        customAnswers,
        additionalNotes,
      });

      // Clear any pending timers
      timers.forEach((t) => clearTimeout(t));
      setGenerationPhase(5);

      setTimeout(() => {
        setIsGenerating(false);
        onDocumentCreated(response.document);
      }, 700);
    } catch (err: any) {
      timers.forEach((t) => clearTimeout(t));
      setIsGenerating(false);
      setGenerationError(err.message || 'Something went wrong while generating your document.');
    }
  };

  const stepsList = [
    { number: 1, title: 'Document' },
    { number: 2, title: 'Jurisdiction' },
    { number: 3, title: 'Parties' },
    { number: 4, title: 'Details' },
    { number: 5, title: 'Draft' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Wizard Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">
              New Legal Document Draft
            </h1>
            <p className="text-xs text-slate-500">
              Step {currentStep} of 5 — {stepsList[currentStep - 1]?.title}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Cancel & Exit
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {stepsList.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-emerald-600'
                      : isCurrent
                      ? 'bg-slate-900'
                      : 'bg-slate-200'
                  }`}
                />
                <p
                  className={`text-[11px] font-medium hidden sm:block ${
                    isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {step.number}. {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT DOCUMENT */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Select Document Type
            </h2>
            <p className="text-xs text-slate-600">
              Choose the agreement or notice template that fits your legal goal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
            {DOCUMENT_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/40 ring-2 ring-blue-900/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tmpl.category}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-900" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tmpl.shortDescription}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Next: Jurisdiction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: JURISDICTION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Designate Governing Jurisdiction
            </h2>
            <p className="text-xs text-slate-600">
              Contract requirements, mandatory disclosures, and court forums depend strictly on location.
            </p>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Legal requirements can vary depending on jurisdiction. LegalEase will incorporate governing law clauses tailored to your choice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  setSelectedCountry(newCountry);
                  const states = SUPPORTED_JURISDICTIONS[newCountry]?.states || [];
                  setSelectedState(states[0]?.name || 'General');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {Object.keys(SUPPORTED_JURISDICTIONS).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State / Province / Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {jurisdictionData.states.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City / County (Optional)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., San Francisco, London, Toronto, Brooklyn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* State Specific Legal Note */}
          {currentStateInfo?.legalNote && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                {selectedState} Legal Context:
              </span>{' '}
              {currentStateInfo.legalNote}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Next: Parties & Dates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BASIC INFORMATION */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Parties and Effective Date
            </h2>
            <p className="text-xs text-slate-600">
              Only enter the parties and signatories required for this {selectedTemplate.name}.
            </p>
          </div>

          {/* Effective Date */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-800" />
              Effective Agreement Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* Party 1 */}
          <div className="p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Party One (Disclosing Party / Landlord / Client)
              </span>
              <span className="text-[11px] text-slate-400">First Signatory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Legal Name / Entity
                </label>
                <input
                  type="text"
                  value={party1Name}
                  onChange={(e) => setParty1Name(e.target.value)}
                  placeholder="e.g., Apex Horizon Inc. or John Doe"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Entity Classification
                </label>
                <select
                  value={party1Type}
                  onChange={(e) => setParty1Type(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="corporation">Corporation (Inc. / Corp)</option>
                  <option value="llc">Limited Liability Company (LLC / Ltd)</option>
                  <option value="individual">Individual / Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Business / Residential Address
                </label>
                <input
                  type="text"
                  value={party1Address}
                  onChange={(e) => setParty1Address(e.target.value)}
                  placeholder="Street address, Suite/Apt, City, State/Postal Code"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Authorized Signatory Name
                </label>
                <input
                  type="text"
                  value={party1Signatory}
                  onChange={(e) => setParty1Signatory(e.target.value)}
                  placeholder="e.g., Elena Vance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Signatory Title
                </label>
                <input
                  type="text"
                  value={party1Title}
                  onChange={(e) => setParty1Title(e.target.value)}
                  placeholder="e.g., CEO, Managing Member, Property Owner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          </div>

          {/* Party 2 */}
          <div className="p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Party Two (Receiving Party / Tenant / Contractor)
              </span>
              <span className="text-[11px] text-slate-400">Second Signatory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Legal Name / Entity
                </label>
                <input
                  type="text"
                  value={party2Name}
                  onChange={(e) => setParty2Name(e.target.value)}
                  placeholder="e.g., Vanguard Labs LLC or Jane Smith"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Entity Classification
                </label>
                <select
                  value={party2Type}
                  onChange={(e) => setParty2Type(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="llc">Limited Liability Company (LLC / Ltd)</option>
                  <option value="corporation">Corporation (Inc. / Corp)</option>
                  <option value="individual">Individual / Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Official Business / Residential Address
                </label>
                <input
                  type="text"
                  value={party2Address}
                  onChange={(e) => setParty2Address(e.target.value)}
                  placeholder="Street address, Suite/Apt, City, State/Postal Code"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Authorized Signatory Name
                </label>
                <input
                  type="text"
                  value={party2Signatory}
                  onChange={(e) => setParty2Signatory(e.target.value)}
                  placeholder="e.g., Marcus Sterling"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Signatory Title
                </label>
                <input
                  type="text"
                  value={party2Title}
                  onChange={(e) => setParty2Title(e.target.value)}
                  placeholder="e.g., Managing Partner, Contractor, Tenant"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Next: Document Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENT-SPECIFIC QUESTIONS */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedTemplate.name} Specifics
            </h2>
            <p className="text-xs text-slate-600">
              Answer targeted questions to ensure clauses reflect your exact commercial terms.
            </p>
          </div>

          {/* Dynamic Template Questions */}
          <div className="space-y-5">
            {selectedTemplate.questions.map((step) => (
              <div key={step.id} className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    {step.stepTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">{step.stepDescription}</p>
                </div>

                <div className="space-y-4">
                  {step.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={customAnswers[field.id] || ''}
                          onChange={(e) =>
                            setCustomAnswers({
                              ...customAnswers,
                              [field.id]: e.target.value,
                            })
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={customAnswers[field.id] || field.defaultValue || ''}
                          onChange={(e) =>
                            setCustomAnswers({
                              ...customAnswers,
                              [field.id]: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={customAnswers[field.id] || ''}
                          onChange={(e) =>
                            setCustomAnswers({
                              ...customAnswers,
                              [field.id]: e.target.value,
                            })
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      )}

                      {field.helperText && (
                        <p className="text-[11px] text-slate-400 mt-1">{field.helperText}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Additional custom notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Additional Instructions or Specific Clauses (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g., Include strict confidentiality for customer databases, require mediation before litigation..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartGeneration}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Document with AI</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AI GENERATION LOADING SCREEN (Section 6 Step 5) */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-lg text-center space-y-8">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Scale className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 font-serif">
              LegalEase AI is drafting your document...
            </h2>
            <p className="text-xs text-slate-500">
              Structuring formal clauses, applying {selectedState}, {selectedCountry} law, and validating completeness.
            </p>
          </div>

          {/* Progress Indicators as requested:
              ✓ Understanding requirements
              ✓ Structuring clauses
              ✓ Applying selected jurisdiction
              ✓ Reviewing document structure
              ✓ Preparing final draft */}
          <div className="max-w-sm mx-auto space-y-3 text-left">
            {[
              'Understanding requirements',
              'Structuring clauses',
              'Applying selected jurisdiction',
              'Reviewing document structure',
              'Preparing final draft',
            ].map((milestone, idx) => {
              const isDone = generationPhase > idx;
              const isCurrent = generationPhase === idx;

              return (
                <div
                  key={milestone}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                      : isCurrent
                      ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-800 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className="text-xs">{milestone}</span>
                </div>
              );
            })}
          </div>

          {generationError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2">
              <p className="font-semibold">{generationError}</p>
              <button
                onClick={handleStartGeneration}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700"
              >
                Retry Generation
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 max-w-lg mx-auto">
            LegalEase generates a draft instrument for review and modification. It does not provide legal representation.
          </div>
        </div>
      )}
    </div>
  );
};
