import { KnowledgeItem } from '../types/legal';

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  // LEGAL TERMS
  {
    id: 'term-indemnification',
    title: 'Indemnification ("Hold Harmless")',
    category: 'terms',
    summary: 'A contractual promise by one party to reimburse or protect the other party from specified financial losses, damages, or lawsuits.',
    content: 'An indemnification clause is a risk-shifting tool. If Party A indemnifies Party B against third-party copyright claims arising from Party A\'s software code, Party A agrees to pay for Party B\'s legal defense and any damages awarded by a court.',
    practicalExample: 'Example: "Contractor agrees to indemnify and hold harmless Client against any claims resulting from Contractor\'s gross negligence or infringement of third-party intellectual property."',
    warningNote: 'Watch out for unilateral (one-sided) indemnification clauses that require you to cover all legal expenses without any financial cap.',
    tags: ['Risk Allocation', 'Liability', 'Commercial Contracts'],
  },
  {
    id: 'term-severability',
    title: 'Severability ("Savings Clause")',
    category: 'terms',
    summary: 'Ensures that if one clause is found invalid or illegal by a judge, the rest of the contract remains in full legal effect.',
    content: 'Without a severability clause, if a court decides that a non-compete section is excessively broad or unenforceable under state law, the entire agreement could theoretically be thrown out. A severability provision instructs the court to "sever" or excise only the invalid clause.',
    practicalExample: 'Example: "If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be severed and the remaining provisions shall continue in full force and effect."',
    warningNote: 'Often includes "blue-penciling" language allowing a court to modify the clause to the maximum enforceable extent.',
    tags: ['Standard Clauses', 'Boilerplate', 'Enforceability'],
  },
  {
    id: 'term-force-majeure',
    title: 'Force Majeure ("Superior Force")',
    category: 'terms',
    summary: 'Excuses a party from performing their contractual duties due to extraordinary, unforeseeable events outside their control.',
    content: 'Covers catastrophic events such as wars, natural disasters (earthquakes, floods), pandemics, government embargoes, or widespread utility blackouts. It temporarily suspends performance without constituting a breach.',
    practicalExample: 'Example: "Neither party shall be liable for delay or failure in performance resulting from acts of God, strikes, pandemics, or government restrictions beyond reasonable control."',
    warningNote: 'Standard force majeure clauses generally do NOT excuse purely financial hardship or inability to pay money.',
    tags: ['Risk Allocation', 'Unforeseen Events', 'Performance'],
  },
  {
    id: 'term-governing-law',
    title: 'Governing Law and Choice of Forum',
    category: 'terms',
    summary: 'Identifies which country/state legal statutes interpret the contract and which court system will resolve disputes.',
    content: 'Because contract laws differ significantly across jurisdictions (e.g., California vs. New York vs. England), designating governing law prevents costly preliminary battles over which law applies.',
    practicalExample: 'Example: "This Agreement shall be governed by the laws of the State of Delaware, and the parties submit to the exclusive jurisdiction of the Delaware Court of Chancery."',
    warningNote: 'Always choose a jurisdiction with which at least one party has a genuine connection, or courts may refuse jurisdiction.',
    tags: ['Jurisdiction', 'Dispute Resolution', 'Courts'],
  },
  {
    id: 'term-consideration',
    title: 'Consideration ("Quid Pro Quo")',
    category: 'terms',
    summary: 'The item of value (money, services, goods, or a promise) exchanged between parties that makes a contract legally binding.',
    content: 'In common law jurisdictions, a contract is not legally enforceable without consideration. A one-sided promise to give a gift is usually not a binding contract unless executed as a formal deed under seal.',
    practicalExample: 'In an employment agreement, the consideration is the salary paid by the employer in exchange for the services and time provided by the employee.',
    warningNote: 'Past consideration (work already done before signing without prior agreement) generally does not count as valid consideration for a new contract.',
    tags: ['Contract Formation', 'Enforceability', 'Core Principles'],
  },
  {
    id: 'term-liquidated-damages',
    title: 'Liquidated Damages',
    category: 'terms',
    summary: 'A pre-agreed sum of money that a defaulting party agrees to pay if they breach a specific term.',
    content: 'Used when actual damages from a breach would be extremely difficult to quantify in advance (e.g., delay in completing a construction project or unauthorized disclosure of confidential data).',
    practicalExample: 'Example: "$500 per calendar day of delay past the agreed delivery deadline of November 1st."',
    warningNote: 'Liquidated damages must be a reasonable pre-estimate of loss. If a court considers the amount punitive (a "penalty"), it will strike down the clause as void.',
    tags: ['Remedies', 'Breach', 'Financial Terms'],
  },

  // CONTRACT BASICS
  {
    id: 'basic-elements',
    title: 'The 6 Essential Elements of a Valid Contract',
    category: 'basics',
    summary: 'Every binding legal agreement must satisfy six fundamental legal criteria across common law jurisdictions.',
    content: `To be enforceable in court, a contract must meet:
1. **Offer:** One party proposes clear, definite terms to another.
2. **Acceptance:** The other party unequivocally accepts those exact terms (without adding new conditions).
3. **Consideration:** Each party must exchange something of value (money, labor, promise to act).
4. **Intention to Create Legal Relations:** Both parties must intend for the agreement to have binding legal consequences.
5. **Capacity:** Both signers must be of legal age (usually 18+), mentally competent, and legally authorized (e.g. corporate officer).
6. **Legality of Object:** The agreement cannot involve illegal acts, criminal conduct, or violate public policy.`,
    practicalExample: 'An oral agreement to grab lunch is not a contract (no intent to create legal relations). A written signed agreement to build a website for $3,000 meets all 6 criteria.',
    tags: ['Fundamentals', 'Checklist', 'Contract Law'],
  },
  {
    id: 'basic-boilerplate',
    title: 'Understanding "Boilerplate" Clauses',
    category: 'basics',
    summary: 'Why the miscellaneous clauses at the end of a contract are critical for your protection.',
    content: `The sections labeled "Miscellaneous" or "General Provisions" are often overlooked, but they determine how the contract is enforced:
* **Entire Agreement / Integration:** Proves that previous oral talks or email threads are superseded by this written document.
* **Notices:** Specifies where and how official legal breach notices must be delivered (e.g. registered mail vs email).
* **Counterparts:** Allows each party to sign separate copies of the document, even electronically.
* **Waiver:** Clarifies that failing to enforce a rule once doesn't mean you forfeit the right to enforce it in the future.`,
    tags: ['Boilerplate', 'Drafting', 'Clauses'],
  },

  // GUIDES
  {
    id: 'guide-nda',
    title: 'How to Choose Between Mutual vs. Unilateral NDA',
    category: 'guides',
    summary: 'When should confidentiality obligations apply to both parties versus only one recipient?',
    content: `A **Unilateral (One-Way) NDA** is used when only one side is revealing secrets—such as an inventor showing proprietary code to an investor, or a business sharing customer lists with a subcontractor.

A **Mutual (Two-Way) NDA** is used when both companies are exploring a joint venture, merger, or co-development project where sensitive information flows in both directions.

**Best Practice:** Even if you think only one side is sharing, many commercial counterparties insist on mutual NDAs because they feel fairer and streamline negotiation.`,
    tags: ['NDA', 'Business', 'Negotiation'],
  },
  {
    id: 'guide-contractor-vs-employee',
    title: 'Independent Contractor vs. Employee Classification',
    category: 'guides',
    summary: 'Avoiding catastrophic misclassification fines under US IRS, California AB5, and UK IR35 rules.',
    content: `Misclassifying an employee as an independent contractor can result in severe retroactive tax penalties, overtime claims, and fines.
Key differentiators:
* **Control of Schedule & Method:** Contractors control *how* and *when* work is done; employers control specific working hours and methods.
* **Equipment & Tools:** Contractors supply their own computers, licenses, and tools.
* **Exclusivity:** Independent contractors typically have other clients and market their services openly to the public.`,
    warningNote: 'Simply labeling someone an "independent contractor" in a contract does not make it so if the practical working relationship mirrors an employee.',
    tags: ['Employment', 'Tax Compliance', 'Freelance'],
  },

  // CHECKLISTS
  {
    id: 'check-pre-execution',
    title: 'Pre-Execution Legal Document Checklist',
    category: 'checklists',
    summary: 'A 7-point verification routine to run through before signing any legal agreement.',
    content: `Check every item before signing or sending for signature:
1. [ ] **Exact Legal Names:** Confirm company names match official state or government registry filings (e.g., "Acme Tech, LLC" vs "Acme Technologies Inc.").
2. [ ] **Signatory Authority:** Is the person signing authorized to bind the company (e.g., Officer, Director, Managing Member)?
3. [ ] **Governing Jurisdiction:** Is the designated governing law and court venue acceptable and convenient?
4. [ ] **Dates & Deadlines:** Are all effective dates, milestones, and cure periods unambiguous?
5. [ ] **Payment & Tax Terms:** Is the currency, due date, and payment mechanism stated clearly?
6. [ ] **Exit / Termination:** Is there a clear, realistic path to terminate the agreement if things go wrong?
7. [ ] **Legal Review:** For high-liability or complex commitments, has a qualified attorney reviewed the draft?`,
    tags: ['Checklist', 'Execution', 'Best Practices'],
  },

  // FAQS
  {
    id: 'faq-binding',
    title: 'Are AI-Generated Documents Legally Binding?',
    category: 'faqs',
    summary: 'Understanding the legal status of an AI-generated draft once signed by the parties.',
    content: `An agreement becomes legally binding not because of who drafted it (whether a human lawyer, a template, or an AI system), but because the parties signed and executed it meeting statutory contract requirements.

However, **LegalEase provides drafting assistance, not formal legal advice**. If an AI draft contains an ambiguous phrase or omits a mandatory local statutory disclosure (such as specific rent control riders or state-specific non-compete limits), the affected clauses could be deemed unenforceable by a judge.

Always review the draft thoroughly and seek independent legal counsel when appropriate.`,
    tags: ['FAQ', 'Legal Status', 'Enforceability'],
  },
  {
    id: 'faq-electronic-signature',
    title: 'Are Electronic Signatures Valid in Court?',
    category: 'faqs',
    summary: 'The validity of e-signatures under the US ESIGN Act, UETA, and European eIDAS regulation.',
    content: `Yes, in almost all modern jurisdictions:
* **United States:** The federal **ESIGN Act (2000)** and the **Uniform Electronic Transactions Act (UETA)** give electronic signatures the same legal weight as handwritten ink signatures for commercial transactions.
* **European Union & UK:** Governed by **eIDAS Regulation**, which explicitly states that an electronic signature cannot be denied legal effect solely because it is in electronic format.
* **Exceptions:** Certain personal documents—such as wills, testamentary trusts, family law divorce decrees, and formal property deeds in certain states—still require wet-ink signatures or physical notarization.`,
    tags: ['FAQ', 'E-Signatures', 'Compliance'],
  },
];
