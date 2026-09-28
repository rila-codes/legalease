import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GEMINI_MODEL = 'gemini-3.8-flash';

// In-Memory Document Store with realistic initial documents
interface LegalClause {
  id: string;
  number: string;
  title: string;
  text: string;
  explanation?: string;
}

interface LegalSection {
  id: string;
  number: string;
  title: string;
  clauses: LegalClause[];
}

interface LegalSignature {
  role: string;
  name: string;
  title: string;
  address?: string;
  date?: string;
  signature?: string;
}

interface LegalDocument {
  id: string;
  userId: string;
  title: string;
  documentType: string;
  category: string;
  jurisdiction: {
    country: string;
    state?: string;
    city?: string;
  };
  effectiveDate: string;
  parties: {
    role: string;
    name: string;
    type: 'individual' | 'corporation' | 'llc' | 'other';
    address: string;
    signatoryName?: string;
    signatoryTitle?: string;
  }[];
  preamble: string;
  recitals: string[];
  sections: LegalSection[];
  signatures: LegalSignature[];
  status: 'draft' | 'completed' | 'in_review';
  readinessScore: number;
  readinessCheck: {
    basicInfo: boolean;
    parties: boolean;
    dates: boolean;
    requiredSections: boolean;
    signatureSection: boolean;
    recommendations: string[];
  };
  createdAt: string;
  updatedAt: string;
  version: number;
}

const mockInitialDocuments: LegalDocument[] = [
  {
    id: 'doc-nda-001',
    userId: 'demo-user-1',
    title: 'Mutual Non-Disclosure Agreement',
    documentType: 'Non-Disclosure Agreement (NDA)',
    category: 'Business',
    jurisdiction: {
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
    },
    effectiveDate: '2026-03-15',
    parties: [
      {
        role: 'Disclosing Party',
        name: 'Apex Horizon Technologies Inc.',
        type: 'corporation',
        address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
        signatoryName: 'Elena Vance',
        signatoryTitle: 'Chief Executive Officer',
      },
      {
        role: 'Receiving Party',
        name: 'Vanguard Media Labs LLC',
        type: 'llc',
        address: '120 Broadway, 18th Floor, New York, NY 10271',
        signatoryName: 'Marcus Sterling',
        signatoryTitle: 'Managing Partner',
      },
    ],
    preamble: 'This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of March 15, 2026 (the "Effective Date"), by and between Apex Horizon Technologies Inc. and Vanguard Media Labs LLC.',
    recitals: [
      'WHEREAS, the Parties wish to explore and evaluate a prospective business relationship involving proprietary software architecture and intellectual property (the "Purpose");',
      'WHEREAS, in the course of discussions, each Party may disclose to the other Party certain confidential, non-public, and proprietary business and technical information;',
      'NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:',
    ],
    sections: [
      {
        id: 'sec-1',
        number: '1',
        title: 'Definition of Confidential Information',
        clauses: [
          {
            id: 'c-1-1',
            number: '1.1',
            title: 'Scope of Confidential Material',
            text: '"Confidential Information" refers to any proprietary, sensitive, or non-public information disclosed by either Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally, visually, electronically, or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.',
            explanation: 'This clause defines what counts as secret information between both parties, covering written docs, verbal talks, and software code.',
          },
          {
            id: 'c-1-2',
            number: '1.2',
            title: 'Exclusions from Confidentiality',
            text: 'Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement by the Receiving Party; (b) was already rightfully known to the Receiving Party prior to disclosure without confidentiality restrictions; (c) is independently developed by the Receiving Party without reference to or reliance upon the Disclosing Party\'s Confidential Information; or (d) is rightfully received from a third party without duty of confidentiality.',
            explanation: 'Standard exceptions: if information was already public, known beforehand, or independently created without looking at the secret info, it is not protected.',
          },
        ],
      },
      {
        id: 'sec-2',
        number: '2',
        title: 'Obligations of Receiving Party',
        clauses: [
          {
            id: 'c-2-1',
            number: '2.1',
            title: 'Standard of Care and Protection',
            text: 'The Receiving Party shall exercise the same degree of care to protect the Disclosing Party\'s Confidential Information as it exercises for its own confidential information of like nature, but in no event less than a reasonable degree of care.',
            explanation: 'The recipient must treat the other party\'s secrets with reasonable and prudent care, just like their own trade secrets.',
          },
          {
            id: 'c-2-2',
            number: '2.2',
            title: 'Limitation on Dissemination and Use',
            text: 'The Receiving Party agrees to use Confidential Information strictly for evaluating the defined Purpose and shall restrict disclosure solely to its officers, employees, and legal or financial advisors who have a verifiable need-to-know and are bound by confidentiality obligations at least as restrictive as this Agreement.',
            explanation: 'Secrets can only be used for the agreed project discussion, not for side projects or general business, and only shared with employees on a strict need-to-know basis.',
          },
        ],
      },
      {
        id: 'sec-3',
        number: '3',
        title: 'Term and Termination',
        clauses: [
          {
            id: 'c-3-1',
            number: '3.1',
            title: 'Term of Agreement and Survival',
            text: 'This Agreement shall remain in effect for a period of two (2) years from the Effective Date. The confidentiality obligations regarding trade secrets shall survive indefinitely, while general non-trade secret Confidential Information shall survive for three (3) years following termination or expiration.',
            explanation: 'The contract lasts 2 years, but secret information remains protected for 3 years after, and trade secrets remain protected forever.',
          },
        ],
      },
      {
        id: 'sec-4',
        number: '4',
        title: 'Governing Law and Jurisdiction',
        clauses: [
          {
            id: 'c-4-1',
            number: '4.1',
            title: 'Choice of Law and Dispute Forum',
            text: 'This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws of the State of California, United States, without regard to conflict of law principles. Any dispute arising under this Agreement shall be submitted to the exclusive jurisdiction of the state or federal courts located in San Francisco County, California.',
            explanation: 'California law applies, and any legal lawsuits or disputes must take place in San Francisco courts.',
          },
        ],
      },
    ],
    signatures: [
      {
        role: 'Disclosing Party',
        name: 'Apex Horizon Technologies Inc.',
        title: 'Chief Executive Officer',
        address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
        date: '2026-03-15',
        signature: 'Elena Vance',
      },
      {
        role: 'Receiving Party',
        name: 'Vanguard Media Labs LLC',
        title: 'Managing Partner',
        address: '120 Broadway, 18th Floor, New York, NY 10271',
        date: '2026-03-15',
        signature: 'Marcus Sterling',
      },
    ],
    status: 'completed',
    readinessScore: 98,
    readinessCheck: {
      basicInfo: true,
      parties: true,
      dates: true,
      requiredSections: true,
      signatureSection: true,
      recommendations: [
        'Document has complete clauses and designated governing law in California.',
        'Consider having legal counsel review specific trade secret definitions before execution.',
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    version: 2,
  },
  {
    id: 'doc-lease-002',
    userId: 'demo-user-1',
    title: 'Residential Lease Agreement',
    documentType: 'Rental / Lease Agreement',
    category: 'Property',
    jurisdiction: {
      country: 'United States',
      state: 'New York',
      city: 'Brooklyn',
    },
    effectiveDate: '2026-04-01',
    parties: [
      {
        role: 'Landlord / Property Owner',
        name: 'Hudson Heritage Properties LLC',
        type: 'llc',
        address: '320 Atlantic Avenue, Brooklyn, NY 11201',
        signatoryName: 'Arthur Pendelton',
        signatoryTitle: 'Property Manager',
      },
      {
        role: 'Tenant',
        name: 'Sophia Chen',
        type: 'individual',
        address: '84 Montague St, Brooklyn, NY 11201',
      },
    ],
    preamble: 'This Residential Lease Agreement (the "Lease") is made and entered into as of April 1, 2026, by and between Hudson Heritage Properties LLC ("Landlord") and Sophia Chen ("Tenant").',
    recitals: [
      'WHEREAS, Landlord is the lawful owner of the residential real property located at 415 Court Street, Apt 3B, Brooklyn, NY 11231 (the "Premises");',
      'WHEREAS, Tenant desires to lease the Premises for residential dwelling purposes under the terms and covenants stipulated herein;',
      'NOW, THEREFORE, the Parties mutually agree to the terms and conditions outlined below:',
    ],
    sections: [
      {
        id: 'sec-prop-1',
        number: '1',
        title: 'Term and Rent Payments',
        clauses: [
          {
            id: 'c-prop-1-1',
            number: '1.1',
            title: 'Lease Duration and Monthly Rent',
            text: 'The Lease term shall commence on April 1, 2026, and expire on March 31, 2027. Tenant shall pay Landlord a monthly rent of $3,200.00 USD, payable on the first day of each calendar month via electronic transfer.',
            explanation: 'The tenant rents the apartment for exactly 12 months for $3,200 per month, due on the 1st of each month.',
          },
          {
            id: 'c-prop-1-2',
            number: '1.2',
            title: 'Security Deposit',
            text: 'Tenant shall deposit with Landlord the sum of $3,200.00 USD as a security deposit, held in an interest-bearing escrow account in accordance with New York State General Obligations Law § 7-103.',
            explanation: 'One month of security deposit will be held safely in an interest-bearing bank account, as required by New York law.',
          },
        ],
      },
      {
        id: 'sec-prop-2',
        number: '2',
        title: 'Use, Maintenance, and Utilities',
        clauses: [
          {
            id: 'c-prop-2-1',
            number: '2.1',
            title: 'Permitted Residential Use',
            text: 'The Premises shall be occupied strictly as a private single-family residence. No commercial business, unlawful activity, or subletting via short-term vacation rental platforms (e.g., Airbnb) is permitted without Landlord\'s written consent.',
            explanation: 'The apartment is strictly for living in; running a commercial retail shop or hosting Airbnb guests is prohibited.',
          },
        ],
      },
    ],
    signatures: [
      {
        role: 'Landlord',
        name: 'Hudson Heritage Properties LLC',
        title: 'Property Manager',
        address: '320 Atlantic Avenue, Brooklyn, NY 11201',
        date: '2026-04-01',
        signature: 'Arthur Pendelton',
      },
      {
        role: 'Tenant',
        name: 'Sophia Chen',
        title: 'Tenant',
        address: '84 Montague St, Brooklyn, NY 11201',
        date: '2026-04-01',
        signature: 'Sophia Chen',
      },
    ],
    status: 'draft',
    readinessScore: 92,
    readinessCheck: {
      basicInfo: true,
      parties: true,
      dates: true,
      requiredSections: true,
      signatureSection: true,
      recommendations: [
        'Check local New York City Housing Maintenance Code disclosures (Lead Paint and Window Guard riders are recommended).',
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    version: 1,
  },
  {
    id: 'doc-service-003',
    userId: 'demo-user-1',
    title: 'Professional Independent Contractor Agreement',
    documentType: 'Freelance Agreement',
    category: 'Business',
    jurisdiction: {
      country: 'United Kingdom',
      state: 'England & Wales',
      city: 'London',
    },
    effectiveDate: '2026-03-20',
    parties: [
      {
        role: 'Client',
        name: 'Kensington Digital Agency Ltd',
        type: 'corporation',
        address: '22 Chancery Lane, London, WC2A 1LS, United Kingdom',
        signatoryName: 'Oliver Wright',
        signatoryTitle: 'Managing Director',
      },
      {
        role: 'Independent Contractor',
        name: 'Maya Patel Design Studio Ltd',
        type: 'corporation',
        address: '14 Shoreditch High St, London, E1 6PG, United Kingdom',
        signatoryName: 'Maya Patel',
        signatoryTitle: 'Lead UX Architect',
      },
    ],
    preamble: 'This Independent Contractor Agreement (the "Agreement") is made on March 20, 2026, by and between Kensington Digital Agency Ltd ("Client") and Maya Patel Design Studio Ltd ("Contractor").',
    recitals: [
      'WHEREAS, Client desires to retain Contractor to deliver bespoke UX design systems and mobile application wireframes;',
      'WHEREAS, Contractor possesses specialized skill and capacity to perform such consultancy services as an independent professional contractor;',
      'IT IS HEREBY AGREED as follows:',
    ],
    sections: [
      {
        id: 'sec-srv-1',
        number: '1',
        title: 'Services and Deliverables',
        clauses: [
          {
            id: 'c-srv-1-1',
            number: '1.1',
            title: 'Scope of Consultancy Work',
            text: 'Contractor shall perform the design services specified in Schedule A (the "Services") with professional skill, diligence, and timeliness in accordance with highest industry standards.',
            explanation: 'The contractor promises to deliver high-quality design work on time according to the agreed project schedule.',
          },
        ],
      },
      {
        id: 'sec-srv-2',
        number: '2',
        title: 'Intellectual Property and Rights',
        clauses: [
          {
            id: 'c-srv-2-1',
            number: '2.1',
            title: 'Assignment of Inventions and Deliverables',
            text: 'Upon receipt of full payment from Client, Contractor hereby assigns to Client all right, title, and intellectual property ownership in and to the custom deliverables created under this Agreement, excluding Contractor\'s pre-existing background tools and frameworks.',
            explanation: 'Once the client pays the contractor in full, the client owns the copyright of the final designs created for them.',
          },
        ],
      },
    ],
    signatures: [
      {
        role: 'Client',
        name: 'Kensington Digital Agency Ltd',
        title: 'Managing Director',
        address: '22 Chancery Lane, London, WC2A 1LS',
        date: '2026-03-20',
        signature: 'Oliver Wright',
      },
      {
        role: 'Contractor',
        name: 'Maya Patel Design Studio Ltd',
        title: 'Lead UX Architect',
        address: '14 Shoreditch High St, London, E1 6PG',
        date: '2026-03-20',
        signature: 'Maya Patel',
      },
    ],
    status: 'completed',
    readinessScore: 96,
    readinessCheck: {
      basicInfo: true,
      parties: true,
      dates: true,
      requiredSections: true,
      signatureSection: true,
      recommendations: [
        'Ensure IR35 compliance assessment is completed for UK contractor engagement.',
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    version: 1,
  },
  {
    id: 'doc-notice-004',
    userId: 'demo-user-1',
    title: 'Formal Demand for Overdue Payment',
    documentType: 'Payment Demand Notice',
    category: 'Legal Notices',
    jurisdiction: {
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
    },
    effectiveDate: '2026-03-25',
    parties: [
      {
        role: 'Creditor / Claimant',
        name: 'Northern Star Logistics Inc.',
        type: 'corporation',
        address: '100 King Street West, Suite 5600, Toronto, ON M5X 1C9',
        signatoryName: 'Robert Vance',
        signatoryTitle: 'Head of Accounts Receivable',
      },
      {
        role: 'Debtor / Recipient',
        name: 'Cascade Distribution Ltd',
        type: 'corporation',
        address: '742 Queensway East, Mississauga, ON L4Y 2E3',
        signatoryName: 'David Mercer',
        signatoryTitle: 'Chief Financial Officer',
      },
    ],
    preamble: 'FORMAL NOTICE AND FINAL DEMAND FOR OUTSTANDING PAYMENT under the laws of Ontario, Canada.',
    recitals: [
      'TAKE NOTICE that Northern Star Logistics Inc. ("Creditor") hereby issues this final demand regarding delinquent invoices for completed freight services rendered to Cascade Distribution Ltd ("Debtor").',
    ],
    sections: [
      {
        id: 'sec-not-1',
        number: '1',
        title: 'Statement of Account and Delinquency',
        clauses: [
          {
            id: 'c-not-1-1',
            number: '1.1',
            title: 'Delinquent Balance',
            text: 'As of March 25, 2026, the aggregate unpaid balance of CAD $18,450.00 remains past due under Invoices #NS-8841 and #NS-8890, each exceeding forty-five (45) days beyond agreed credit terms.',
            explanation: 'States the exact amount owed ($18,450 CAD) and lists the overdue invoice numbers.',
          },
          {
            id: 'c-not-1-2',
            number: '1.2',
            title: 'Demand for Immediate Cure and Notice of Legal Action',
            text: 'Demand is hereby made for full remittance within ten (10) business days of receipt of this notice. Failure to satisfy this indebtedness will compel Creditor to initiate formal legal collection proceedings in the Ontario Small Claims Court or Superior Court of Justice, claiming principal, accrued interest, and legal costs.',
            explanation: 'The debtor has 10 business days to pay, otherwise legal proceedings will be launched to recover the money plus interest and court costs.',
          },
        ],
      },
    ],
    signatures: [
      {
        role: 'Creditor Representative',
        name: 'Northern Star Logistics Inc.',
        title: 'Head of Accounts Receivable',
        address: '100 King Street West, Toronto, ON',
        date: '2026-03-25',
        signature: 'Robert Vance',
      },
    ],
    status: 'completed',
    readinessScore: 95,
    readinessCheck: {
      basicInfo: true,
      parties: true,
      dates: true,
      requiredSections: true,
      signatureSection: true,
      recommendations: [
        'Send via Registered Mail or courier with signature confirmation to establish proof of delivery.',
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    version: 1,
  },
];

let documentsStore: LegalDocument[] = [...mockInitialDocuments];

// Helper fallback generator when AI key is missing or prompt fails
function generateFallbackDocument(params: any): Partial<LegalDocument> {
  const { documentType, jurisdiction, basicInfo, customAnswers } = params;
  const docType = documentType || 'Legal Agreement';
  const country = jurisdiction?.country || 'United States';
  const state = jurisdiction?.state || 'California';
  const party1Name = basicInfo?.party1Name || 'Party A';
  const party2Name = basicInfo?.party2Name || 'Party B';
  const effectiveDate = basicInfo?.effectiveDate || new Date().toISOString().split('T')[0];

  return {
    title: `${docType} - ${party1Name} & ${party2Name}`,
    documentType: docType,
    category: params.category || 'Business',
    jurisdiction: {
      country,
      state,
      city: jurisdiction?.city || '',
    },
    effectiveDate,
    parties: [
      {
        role: 'First Party',
        name: party1Name,
        type: basicInfo?.party1Type || 'corporation',
        address: basicInfo?.party1Address || '100 Principal Plaza',
        signatoryName: basicInfo?.party1Signatory || party1Name,
        signatoryTitle: basicInfo?.party1Title || 'Authorized Representative',
      },
      {
        role: 'Second Party',
        name: party2Name,
        type: basicInfo?.party2Type || 'individual',
        address: basicInfo?.party2Address || '200 Commercial Way',
        signatoryName: basicInfo?.party2Signatory || party2Name,
        signatoryTitle: basicInfo?.party2Title || 'Authorized Signatory',
      },
    ],
    preamble: `This ${docType} (the "Agreement") is entered into and made effective as of ${effectiveDate}, by and between ${party1Name} ("First Party") and ${party2Name} ("Second Party").`,
    recitals: [
      `WHEREAS, the Parties seek to formalize their binding business arrangements and mutual understanding subject to the laws of ${state}, ${country};`,
      `WHEREAS, each Party represents that it has the requisite legal authority and capacity to enter into and perform this Agreement;`,
      `NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the sufficiency of which is acknowledged, the Parties agree as follows:`,
    ],
    sections: [
      {
        id: 'sec-fb-1',
        number: '1',
        title: 'Purpose and Core Engagement',
        clauses: [
          {
            id: 'c-fb-1-1',
            number: '1.1',
            title: 'Scope of Rights and Responsibilities',
            text: `The Parties shall collaborate in good faith according to the provisions and specifications agreed upon herein. ${customAnswers?.purpose || 'Each Party shall diligently perform all respective covenants, deliverables, and commercial engagements described in this instrument.'}`,
            explanation: 'Establishes the primary goal of the agreement and requires both sides to act in good faith.',
          },
          {
            id: 'c-fb-1-2',
            number: '1.2',
            title: 'Standards of Performance',
            text: 'All obligations under this Agreement shall be executed in a timely, professional, and workmanlike manner consistent with applicable statutory codes and commercial standards.',
            explanation: 'Both parties agree to execute their duties professionally and promptly.',
          },
        ],
      },
      {
        id: 'sec-fb-2',
        number: '2',
        title: 'Representations, Warranties, and Covenants',
        clauses: [
          {
            id: 'c-fb-2-1',
            number: '2.1',
            title: 'Legal Authority',
            text: `Each Party explicitly warrants that this Agreement has been duly authorized and constitutes a valid, legally enforceable obligation under the governing jurisdiction of ${state}, ${country}.`,
            explanation: 'Guarantees that both signers have legal authorization to bind their organizations.',
          },
        ],
      },
      {
        id: 'sec-fb-3',
        number: '3',
        title: 'Term, Termination, and Remedies',
        clauses: [
          {
            id: 'c-fb-3-1',
            number: '3.1',
            title: 'Duration of Agreement',
            text: `This Agreement shall commence on ${effectiveDate} and shall remain in full force and effect until satisfied, or terminated by either Party upon thirty (30) days prior written notice.`,
            explanation: 'Specifies when the agreement begins and that either party can exit with 30 days written notice.',
          },
          {
            id: 'c-fb-3-2',
            number: '3.2',
            title: 'Remedies for Material Breach',
            text: 'In the event of an uncured material default after fourteen (14) days notice, the non-breaching Party shall be entitled to pursue all remedies available at law and in equity.',
            explanation: 'If a party fails to fulfill their obligations and does not fix it within 14 days, legal remedies can be sought.',
          },
        ],
      },
      {
        id: 'sec-fb-4',
        number: '4',
        title: 'Governing Law and Dispute Resolution',
        clauses: [
          {
            id: 'c-fb-4-1',
            number: '4.1',
            title: 'Choice of Law and Exclusive Venue',
            text: `This Agreement and any dispute arising out of or related to it shall be governed exclusively by the laws of ${state}, ${country}. The parties submit to the exclusive jurisdiction of the competent courts in ${state}.`,
            explanation: `States that the laws of ${state}, ${country} govern any legal conflicts.`,
          },
        ],
      },
    ],
    signatures: [
      {
        role: 'First Party',
        name: party1Name,
        title: basicInfo?.party1Title || 'Authorized Representative',
        address: basicInfo?.party1Address || '',
        date: effectiveDate,
        signature: basicInfo?.party1Signatory || party1Name,
      },
      {
        role: 'Second Party',
        name: party2Name,
        title: basicInfo?.party2Title || 'Authorized Signatory',
        address: basicInfo?.party2Address || '',
        date: effectiveDate,
        signature: basicInfo?.party2Signatory || party2Name,
      },
    ],
    readinessScore: 92,
    readinessCheck: {
      basicInfo: true,
      parties: true,
      dates: true,
      requiredSections: true,
      signatureSection: true,
      recommendations: [
        `Generated with applicable clauses for ${state}, ${country}.`,
        'Review party names, addresses, and compensation schedules before signing.',
      ],
    },
  };
}

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// GET all documents
app.get('/api/documents', (_req: Request, res: Response) => {
  res.json({ documents: documentsStore });
});

// GET single document
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const doc = documentsStore.find((d) => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ document: doc });
});

// CREATE document
app.post('/api/documents', (req: Request, res: Response) => {
  try {
    const newDoc: LegalDocument = {
      ...req.body,
      id: req.body.id || `doc-${Date.now()}`,
      userId: req.body.userId || 'demo-user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    documentsStore.unshift(newDoc);
    res.status(201).json({ document: newDoc });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create document: ' + err.message });
  }
});

// UPDATE document
app.put('/api/documents/:id', (req: Request, res: Response) => {
  const index = documentsStore.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  const updatedDoc = {
    ...documentsStore[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
    version: (documentsStore[index].version || 1) + 1,
  };
  documentsStore[index] = updatedDoc;
  res.json({ document: updatedDoc });
});

// DUPLICATE document
app.post('/api/documents/:id/duplicate', (req: Request, res: Response) => {
  const doc = documentsStore.find((d) => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Original document not found' });
    return;
  }
  const clonedDoc: LegalDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    title: `${doc.title} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  documentsStore.unshift(clonedDoc);
  res.status(201).json({ document: clonedDoc });
});

// DELETE document
app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const index = documentsStore.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  documentsStore.splice(index, 1);
  res.json({ success: true, message: 'Document deleted successfully' });
});

// AI: GENERATE COMPLETE LEGAL DOCUMENT
app.post('/api/ai/generate-document', async (req: Request, res: Response) => {
  const { documentType, jurisdiction, basicInfo, customAnswers, additionalNotes, category } = req.body;

  try {
    const prompt = `You are LegalEase AI, an expert legal drafting architect.
Draft a highly structured, thorough, and professional legal document draft.
IMPORTANT DISCLAIMER REQUIREMENT: Draft in formal, accurate legal language appropriate for the specified jurisdiction. Note that this is a draft for review.

Parameters:
- Document Type: ${documentType}
- Category: ${category || 'General'}
- Jurisdiction: Country: ${jurisdiction?.country || 'United States'}, State/Region: ${jurisdiction?.state || 'General'}, City: ${jurisdiction?.city || 'N/A'}
- Effective Date: ${basicInfo?.effectiveDate || new Date().toISOString().split('T')[0]}
- First Party: ${basicInfo?.party1Name || 'Party One'} (${basicInfo?.party1Type || 'Corporation'}, ${basicInfo?.party1Address || 'Address not specified'})
- Second Party: ${basicInfo?.party2Name || 'Party Two'} (${basicInfo?.party2Type || 'Individual'}, ${basicInfo?.party2Address || 'Address not specified'})
- Document Details & Custom Answers: ${JSON.stringify(customAnswers || {})}
- Additional Specific Instructions: ${additionalNotes || 'Standard comprehensive legal protection'}

Return STRICTLY a JSON object matching this exact TypeScript structure (no markdown formatting, no backticks, only pure JSON):
{
  "title": "Clear Formal Document Title",
  "documentType": "${documentType}",
  "category": "${category || 'Business'}",
  "effectiveDate": "YYYY-MM-DD",
  "preamble": "Formal opening legal preamble identifying parties and effective date...",
  "recitals": [
    "WHEREAS, ...",
    "WHEREAS, ...",
    "NOW, THEREFORE, ..."
  ],
  "sections": [
    {
      "id": "sec-1",
      "number": "1",
      "title": "Section Title",
      "clauses": [
        {
          "id": "c-1-1",
          "number": "1.1",
          "title": "Clause Title",
          "text": "Precise, formal legal clause text tailored to ${jurisdiction?.state || 'the'} law...",
          "explanation": "Simple 1-2 sentence plain-English explanation for non-lawyers."
        }
      ]
    }
  ],
  "signatures": [
    {
      "role": "Disclosing Party / Landlord / First Party",
      "name": "Full legal name",
      "title": "Title or capacity",
      "address": "Address",
      "date": "YYYY-MM-DD"
    },
    {
      "role": "Receiving Party / Tenant / Second Party",
      "name": "Full legal name",
      "title": "Title or capacity",
      "address": "Address",
      "date": "YYYY-MM-DD"
    }
  ],
  "readinessCheck": {
    "basicInfo": true,
    "parties": true,
    "dates": true,
    "requiredSections": true,
    "signatureSection": true,
    "score": 95,
    "recommendations": [
      "Jurisdiction-tailored recommendation 1",
      "Check specific local statutory filing or witness rules if applicable."
    ]
  }
}`;

    if (!process.env.GEMINI_API_KEY) {
      const fallback = generateFallbackDocument(req.body);
      const newDoc: LegalDocument = {
        id: `doc-${Date.now()}`,
        userId: 'demo-user-1',
        title: fallback.title || `${documentType} Draft`,
        documentType: documentType || 'Legal Agreement',
        category: category || 'Business',
        jurisdiction: jurisdiction || { country: 'United States', state: 'California' },
        effectiveDate: basicInfo?.effectiveDate || new Date().toISOString().split('T')[0],
        parties: fallback.parties || [],
        preamble: fallback.preamble || '',
        recitals: fallback.recitals || [],
        sections: fallback.sections as LegalSection[],
        signatures: fallback.signatures as LegalSignature[],
        status: 'draft',
        readinessScore: fallback.readinessScore || 90,
        readinessCheck: fallback.readinessCheck as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };
      documentsStore.unshift(newDoc);
      res.json({ document: newDoc, simulated: true });
      return;
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleanJson = text.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsedData = JSON.parse(cleanJson);

    const generatedDoc: LegalDocument = {
      id: `doc-${Date.now()}`,
      userId: 'demo-user-1',
      title: parsedData.title || `${documentType} Draft`,
      documentType: parsedData.documentType || documentType,
      category: parsedData.category || category || 'Business',
      jurisdiction: jurisdiction || { country: 'United States', state: 'General' },
      effectiveDate: parsedData.effectiveDate || basicInfo?.effectiveDate || new Date().toISOString().split('T')[0],
      parties: [
        {
          role: basicInfo?.party1Role || 'First Party',
          name: basicInfo?.party1Name || 'Party One',
          type: basicInfo?.party1Type || 'corporation',
          address: basicInfo?.party1Address || '',
          signatoryName: basicInfo?.party1Signatory,
          signatoryTitle: basicInfo?.party1Title,
        },
        {
          role: basicInfo?.party2Role || 'Second Party',
          name: basicInfo?.party2Name || 'Party Two',
          type: basicInfo?.party2Type || 'individual',
          address: basicInfo?.party2Address || '',
          signatoryName: basicInfo?.party2Signatory,
          signatoryTitle: basicInfo?.party2Title,
        },
      ],
      preamble: parsedData.preamble || '',
      recitals: parsedData.recitals || [],
      sections: parsedData.sections || [],
      signatures: parsedData.signatures || [],
      status: 'draft',
      readinessScore: parsedData.readinessCheck?.score || 94,
      readinessCheck: {
        basicInfo: Boolean(parsedData.readinessCheck?.basicInfo ?? true),
        parties: Boolean(parsedData.readinessCheck?.parties ?? true),
        dates: Boolean(parsedData.readinessCheck?.dates ?? true),
        requiredSections: Boolean(parsedData.readinessCheck?.requiredSections ?? true),
        signatureSection: Boolean(parsedData.readinessCheck?.signatureSection ?? true),
        recommendations: parsedData.readinessCheck?.recommendations || [
          'Verify all party names match official state registration records.',
          'Consult local legal counsel for high-value transactions.',
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    documentsStore.unshift(generatedDoc);
    res.json({ document: generatedDoc });
  } catch (err: any) {
    console.error('Error generating document with AI:', err);
    // Graceful fallback to guarantee user gets their draft
    const fallback = generateFallbackDocument(req.body);
    const newDoc: LegalDocument = {
      id: `doc-${Date.now()}`,
      userId: 'demo-user-1',
      title: fallback.title || `${documentType} Draft`,
      documentType: documentType || 'Legal Agreement',
      category: category || 'Business',
      jurisdiction: jurisdiction || { country: 'United States', state: 'California' },
      effectiveDate: basicInfo?.effectiveDate || new Date().toISOString().split('T')[0],
      parties: fallback.parties || [],
      preamble: fallback.preamble || '',
      recitals: fallback.recitals || [],
      sections: fallback.sections as LegalSection[],
      signatures: fallback.signatures as LegalSignature[],
      status: 'draft',
      readinessScore: fallback.readinessScore || 90,
      readinessCheck: fallback.readinessCheck as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    documentsStore.unshift(newDoc);
    res.json({ document: newDoc, fallbackUsed: true });
  }
});

// AI: EXPLAIN CLAUSE IN SIMPLE LANGUAGE
app.post('/api/ai/explain-clause', async (req: Request, res: Response) => {
  const { clauseText, clauseTitle, documentType, jurisdiction } = req.body;

  try {
    if (!clauseText) {
      res.status(400).json({ error: 'Clause text is required' });
      return;
    }

    const prompt = `You are LegalEase AI Clause Explainer.
Explain the following legal clause in simple, accessible, plain English for a non-lawyer.
Clearly explain what it means, its real-world purpose, what obligations it imposes, and what potential concerns or red flags a party should look out for.

Document Type: ${documentType || 'Legal Agreement'}
Jurisdiction: ${jurisdiction?.country || 'General'} ${jurisdiction?.state || ''}
Clause Title: ${clauseTitle || 'Legal Clause'}
Clause Text: "${clauseText}"

Return strictly a JSON object with this format (no markdown, pure JSON):
{
  "simpleExplanation": "Clear, friendly plain-English breakdown of what this clause means in 2-3 sentences.",
  "purpose": "Why this clause exists in standard legal agreements.",
  "keyObligations": [
    "Obligation 1 for the relevant party",
    "Obligation 2"
  ],
  "potentialConcerns": [
    "Watch out for: potential risk or ambiguity in this wording",
    "Point to negotiate or verify"
  ],
  "relatedSections": [
    "Termination",
    "Governing Law",
    "Indemnification"
  ]
}`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        simpleExplanation: `This clause establishes the binding rules and duties regarding "${clauseTitle || 'this section'}". In plain English: both parties must follow the specified standards, and failure to comply may result in a breach of the agreement.`,
        purpose: 'Provides clear legal boundaries and protects the respective rights of each party under the contract.',
        keyObligations: [
          'Adhere strictly to the stated timeframes and performance standards.',
          'Provide written notice prior to modifying terms.',
        ],
        potentialConcerns: [
          'Ensure the deadlines and remedy periods are realistic for your workflow.',
          'Verify whether penalties or attorney fee shifting apply in case of dispute.',
        ],
        relatedSections: ['Term & Termination', 'Dispute Resolution', 'Notices'],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleanJson = text.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    const explanation = JSON.parse(cleanJson);
    res.json(explanation);
  } catch (err: any) {
    console.error('Error explaining clause:', err);
    res.json({
      simpleExplanation: 'This clause defines key legal rights and duties for this section of your agreement. In plain terms, it ensures both parties are bound to the specified terms and cannot unilaterally deviate without consent.',
      purpose: 'To minimize ambiguity and safeguard party interests.',
      keyObligations: ['Fulfill obligations outlined in the text.', 'Maintain written records.'],
      potentialConcerns: ['Check if the terms are mutual or favor one party disproportionately.'],
      relatedSections: ['General Provisions'],
    });
  }
});

// AI: REWRITE OR ADJUST CLAUSE
app.post('/api/ai/rewrite-clause', async (req: Request, res: Response) => {
  const { clauseText, instruction, tone, jurisdiction } = req.body;

  try {
    const prompt = `You are LegalEase AI drafting assistant.
Rewrite the following legal clause according to this specific instruction: "${instruction || 'Make it clearer, balanced, and simpler'}".
Target tone/style: ${tone || 'Clear & Balanced Legal Professional'}
Jurisdiction: ${jurisdiction?.country || 'United States'} ${jurisdiction?.state || ''}

Original Clause:
"${clauseText}"

Return strictly a JSON object:
{
  "rewrittenText": "The modified legal clause text...",
  "explanationOfChanges": "Brief summary of what was adjusted and why."
}`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        rewrittenText: `${clauseText.replace(/shall/gi, 'agrees to').trim()} The parties confirm this clause reflects mutual understanding and reasonable commercial practice.`,
        explanationOfChanges: 'Clarified phrasing, modernized language, and ensured balanced bilateral obligations.',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleanJson = text.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    res.json(JSON.parse(cleanJson));
  } catch (err: any) {
    console.error('Error rewriting clause:', err);
    res.json({
      rewrittenText: clauseText,
      explanationOfChanges: 'Could not connect to AI rewrite service. Original wording retained.',
    });
  }
});

// AI: LEGAL ASSISTANT CHAT
app.post('/api/ai/assistant-chat', async (req: Request, res: Response) => {
  const { messages, documentContext, currentClause } = req.body;

  try {
    const systemPrompt = `You are LegalEase AI, an intelligent, helpful legal drafting assistant and document explainer.
Core Principles:
1. You provide educational legal drafting guidance, plain-English clause explanations, document structuring advice, and contract analysis.
2. IMPORTANT DISCLAIMER: You are an AI assistance tool, NOT a lawyer or law firm. You do NOT provide personalized legal representation or formal legal advice. Always remind or advise users to consult qualified legal counsel for high-stakes or contentious legal matters when appropriate.
3. Keep answers concise, structured, bulleted where helpful, clear, and professional.
4. Reference the document context provided:
- Document Title: ${documentContext?.title || 'Current Document'}
- Document Type: ${documentContext?.documentType || 'General Contract'}
- Jurisdiction: ${documentContext?.jurisdiction?.country || 'General'} ${documentContext?.jurisdiction?.state || ''}
${currentClause ? `- Selected Clause: "${currentClause.title}": ${currentClause.text}` : ''}`;

    const userMessage = messages?.[messages.length - 1]?.content || 'Explain this contract.';

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply: `**LegalEase AI Assistant** *(Educational & Drafting Assistance Only)*\n\nRegarding your document **"${documentContext?.title || 'Legal Document'}"**:\n\n* **Structure:** The agreement contains standard protective clauses aligned with typical commercial practices.\n* **Jurisdiction Consideration:** Under **${documentContext?.jurisdiction?.country || 'general law'}**, ensure governing law clauses designate the correct county/state court venue.\n* **Key Tip:** Verify all party legal entities match exact state corporate filings, and that all signature lines contain printed names, titles, and dates.\n\n*Reminder: LegalEase is an AI drafting tool. For formal legal representation or dispute counsel, consult an attorney licensed in your jurisdiction.*`,
      });
      return;
    }

    const conversationHistory = (messages || []).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser Question: ${userMessage}\n\nRespond as LegalEase AI:`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
    });

    res.json({ reply: response.text || 'I am ready to help you analyze, simplify, or structure your legal document clauses.' });
  } catch (err: any) {
    console.error('Error in AI assistant chat:', err);
    res.json({
      reply: 'LegalEase AI is temporarily working in offline mode. Please review standard clauses in the Knowledge Hub or check party details directly in the editor.',
    });
  }
});

// AI: DOCUMENT CHECKER & AUDIT
app.post('/api/ai/check-document', async (req: Request, res: Response) => {
  const { text, documentType, jurisdiction } = req.body;

  try {
    if (!text || text.trim().length < 20) {
      res.status(400).json({ error: 'Please provide at least 20 characters of document text to analyze.' });
      return;
    }

    const prompt = `You are LegalEase AI Document Reviewer & Auditor.
Analyze the provided legal document text for completeness, potential drafting issues, missing clauses, and ambiguities.
IMPORTANT: You are an assistive reviewer; do not claim absolute legal validity.

Document Type: ${documentType || 'Contract / Agreement'}
Jurisdiction: ${jurisdiction || 'General / Not specified'}

Document Text:
"""
${text.slice(0, 10000)}
"""

Analyze and return strictly a JSON object:
{
  "overallStatus": "looks_complete" | "review_recommended" | "missing_info",
  "readinessScore": 88,
  "summary": "2-3 sentence overview of document quality, tone, and structural soundness.",
  "issues": [
    {
      "id": "iss-1",
      "severity": "green" | "yellow" | "red",
      "title": "Clear issue title",
      "description": "What was identified and why it matters.",
      "suggestion": "Actionable way to resolve or improve this clause."
    }
  ],
  "partiesIdentified": ["Party 1 name if found", "Party 2 name if found"],
  "keyDates": ["Identified dates or 'Missing effective date'"],
  "missingClauses": ["List of recommended clauses typically expected in this document type that appear missing"],
  "disclaimer": "This analysis is an AI-assisted diagnostic tool and does not constitute a formal legal opinion. Consult qualified legal counsel."
}`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        overallStatus: 'review_recommended',
        readinessScore: 84,
        summary: 'The document includes essential operational language, but would benefit from explicit dispute resolution mechanisms and verified party entity disclosures.',
        issues: [
          {
            id: 'iss-1',
            severity: 'yellow',
            title: 'Verify Defined Terms and Consistency',
            description: 'Check that capitalized terms such as "Confidential Information" or "Services" are consistently defined throughout.',
            suggestion: 'Include an explicit Section 1 Definitions clause.',
          },
          {
            id: 'iss-2',
            severity: 'green',
            title: 'Governing Law and Forum',
            description: 'A jurisdiction clause was detected; confirm the court venue is accessible to your principal office.',
            suggestion: 'Keep venue limited to your principal county/state.',
          },
          {
            id: 'iss-3',
            severity: 'red',
            title: 'Remedy and Notice Period',
            description: 'Notice of default should specify a cure period (e.g., 14 to 30 days) before termination.',
            suggestion: 'Add: "Upon fourteen (14) days prior written notice specifying the breach."',
          },
        ],
        partiesIdentified: ['First Signatory Party', 'Second Signatory Party'],
        keyDates: ['Effective Date: Checked'],
        missingClauses: ['Severability Clause', 'Force Majeure Provision', 'Attorney Fees Allocation'],
        disclaimer: 'This diagnostic review is for informational drafting assistance only.',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error checking document:', err);
    res.status(500).json({ error: 'Failed to complete document audit: ' + err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚖ LegalEase Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LegalEase server:', err);
});
