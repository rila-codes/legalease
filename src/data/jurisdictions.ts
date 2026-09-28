export interface JurisdictionInfo {
  country: string;
  states: {
    name: string;
    code: string;
    legalNote?: string;
  }[];
  generalNote: string;
}

export const SUPPORTED_JURISDICTIONS: Record<string, JurisdictionInfo> = {
  'United States': {
    country: 'United States',
    generalNote: 'U.S. contract law is primarily governed by state statutory and common law. Commercial transactions frequently adopt the Uniform Commercial Code (UCC).',
    states: [
      { name: 'California', code: 'CA', legalNote: 'Strict statutory prohibition against employee non-compete agreements (Cal. Bus. & Prof. Code § 16600).' },
      { name: 'Delaware', code: 'DE', legalNote: 'Renowned corporate Chancery Court jurisdiction; highly standard for business entity formation and commercial contracts.' },
      { name: 'New York', code: 'NY', legalNote: 'Widely chosen for international financial and commercial agreements; strict statutory rent stabilization and security deposit rules.' },
      { name: 'Texas', code: 'TX', legalNote: 'Strong pro-freedom of contract tradition with specific statutory requirements for consumer dispute venue.' },
      { name: 'Florida', code: 'FL', legalNote: 'Requires strict compliance with landlord-tenant notice periods (Fla. Stat. Chapter 83).' },
      { name: 'Washington', code: 'WA', legalNote: 'Specific salary thresholds required for enforceable non-competition restrictions.' },
      { name: 'Illinois', code: 'IL', legalNote: 'Enacted Freedom to Work Act placing compensation floors on restrictive employment covenants.' },
      { name: 'Massachusetts', code: 'MA', legalNote: 'Non-compete agreements require Garden Leave or mutually agreed consideration.' },
      { name: 'Colorado', code: 'CO', legalNote: 'Criminal penalties may apply for unenforceable restrictive covenants under restrictive covenant reform.' },
      { name: 'Other US State / Federal', code: 'US-GEN', legalNote: 'Default state common law principles apply.' },
    ],
  },
  'United Kingdom': {
    country: 'United Kingdom',
    generalNote: 'Governed by English Common Law. Contractual principles emphasize freedom of contract, subject to Consumer Rights Act 2015 and Unfair Contract Terms Act 1977.',
    states: [
      { name: 'England & Wales', code: 'EW', legalNote: 'Standard jurisdiction for global commerce and financial contracts. Subject to IR35 off-payroll tax rules.' },
      { name: 'Scotland', code: 'SCT', legalNote: 'Distinct Scots law framework; contract law is a civil-common hybrid with different property conveyance traditions.' },
      { name: 'Northern Ireland', code: 'NI', legalNote: 'Distinct court system aligned closely with English common law precedents.' },
    ],
  },
  'Canada': {
    country: 'Canada',
    generalNote: 'Common law applies across all provinces and territories, except Quebec which operates under the Civil Code of Quebec.',
    states: [
      { name: 'Ontario', code: 'ON', legalNote: 'Governed by Ontario Consumer Protection Act and Residential Tenancies Act.' },
      { name: 'British Columbia', code: 'BC', legalNote: 'Modern electronic transactions act; strong residential tenancy protections.' },
      { name: 'Quebec', code: 'QC', legalNote: 'Civil Code of Quebec applies; contracts of adhesion must comply with Charter of the French Language provisions.' },
      { name: 'Alberta', code: 'AB', legalNote: 'Commercial law heavily informed by Alberta Business Corporations Act.' },
    ],
  },
  'Australia': {
    country: 'Australia',
    generalNote: 'Federal Competition and Consumer Act 2010 (Australian Consumer Law) regulates unfair contract terms across all states.',
    states: [
      { name: 'New South Wales', code: 'NSW', legalNote: 'Contracts Review Act 1980 allows relief against unjust contracts.' },
      { name: 'Victoria', code: 'VIC', legalNote: 'Strict Residential Tenancies Act and Victorian Civil and Administrative Tribunal (VCAT) oversight.' },
      { name: 'Queensland', code: 'QLD', legalNote: 'Mandatory standard terms under REIQ for real property contracts.' },
    ],
  },
  'European Union / International': {
    country: 'European Union / International',
    generalNote: 'Subject to Brussels I Regulation (recast) for jurisdictional forum and Rome I Regulation for applicable law. GDPR privacy rules strictly apply.',
    states: [
      { name: 'Germany (Federal Republic)', code: 'DE', legalNote: 'German Civil Code (BGB); stringent review of Standard Terms and Conditions (AGB).' },
      { name: 'France', code: 'FR', legalNote: 'French Civil Code (Code civil); strong protection for contracting parties against excessive imbalance.' },
      { name: 'Singapore', code: 'SG', legalNote: 'English-derived common law; leading global hub for international commercial arbitration (SIAC).' },
      { name: 'United Arab Emirates (DIFC / ADGM)', code: 'UAE', legalNote: 'Dual legal system: Civil Code for mainland, Common law in English within DIFC and ADGM economic zones.' },
      { name: 'India', code: 'IN', legalNote: 'Indian Contract Act 1872; Section 27 renders agreements in restraint of trade largely void.' },
    ],
  },
};

export const JURISDICTION_DISCLAIMER =
  'Important Notice: Legal requirements, statutory formalities, and judicial interpretation vary significantly across countries, states, and provinces. A document valid in one jurisdiction may be invalid or subject to mandatory implied terms in another.';
