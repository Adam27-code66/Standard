// ============================================================
// IS-SMART — TypeScript Type Definitions
// ============================================================

export type StandardStatus = 'Current' | 'Superseded' | 'Amended' | 'Withdrawn' | 'Under Revision';

export type StandardCategory =
  | 'Main Product Standard'
  | 'Testing Standard'
  | 'Safety Standard'
  | 'Installation Standard'
  | 'Terminology Standard'
  | 'Material Standard'
  | 'Performance Standard'
  | 'Related Product Standard';

export type RelationshipType =
  | 'NORMATIVE_REFERENCE'
  | 'TEST_METHOD'
  | 'SAFETY'
  | 'INSTALLATION'
  | 'TERMINOLOGY'
  | 'RELATED_PRODUCT'
  | 'SUPERSEDES'
  | 'PART_OF';

export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface AmendmentDetail {
  number: number;
  year: number;
  title: string;
  summary?: string;
}

export interface Standard {
  id: string;
  standardNumber: string;
  title: string;
  description: string;
  scope: string;
  category: StandardCategory;
  industry: string[];
  version: string;
  publicationYear: number;
  status: StandardStatus;
  amendments: number;
  previousVersion?: string;
  previousYear?: number;
  certificationRequired: boolean;
  certificationBody?: string;
  keywords: string[];
  source: 'DEMO_KB'; // clearly marking demo data
  lastVerified: string;

  // Extended SIH attributes
  standardType?: string;
  ics?: string;
  department?: string;
  committee?: string;
  publicationDate?: string;
  revisionDate?: string;
  lastAmendmentDate?: string;
  amendmentDetails?: AmendmentDetail[];
  requirementsSummary?: string[];
  testingRequirements?: string[];
  certificationDetails?: {
    mandatory: boolean;
    scheme: string;
    details: string;
    sourceUrl?: string;
  };
  clauseEvidence?: {
    clauseNumber: string;
    clauseTitle: string;
    snippet: string;
  }[];
}

export interface StandardRelationship {
  id: string;
  sourceStandardId: string;
  targetStandardId: string;
  relationshipType: RelationshipType;
  description: string;
}

export interface Requirement {
  product: string;
  purpose: string;
  application: string;
  technicalRequirements: string[];
  environment: string;
  industry: string;
  language: string;
  rawInput: string;
}

export interface Recommendation {
  standard: Standard;
  relevanceScore: number; // 0-100
  reason: string;
  matchedRequirements: string[];
  category: StandardCategory;
  relationshipType?: RelationshipType;
  aiReasoning: string[];
}

export interface TenderIssue {
  id: string;
  type: 'Outdated Standard' | 'Missing Test Standard' | 'Missing Safety Requirement' | 'Missing Certification' | 'Incomplete Specification' | 'Version Conflict';
  severity: IssueSeverity;
  description: string;
  detectedReference?: string;
  recommendedAction: string;
  relatedStandardId?: string;
  resolved?: boolean;
}

export interface ReadinessScore {
  total: number; // out of 100
  breakdown: {
    standardCoverage: number;
    versionAccuracy: number;
    testingCoverage: number;
    safetyCoverage: number;
    certificationCoverage: number;
  };
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputType: 'describe' | 'upload' | 'chat';
  requirement: Requirement;
  recommendations: Recommendation[];
  issues: TenderIssue[];
  readinessScore: ReadinessScore;
  certifications: CertificationResult[];
  generatedSpec?: string;
}

export interface CertificationResult {
  id: string;
  name: string;
  body: string;
  applicable: boolean;
  applicabilityReason: string;
  verificationRequired: boolean;
  status: 'Applicable' | 'Not Applicable' | 'Verify Required';
}

export interface GraphNode {
  id: string;
  standardNumber: string;
  title: string;
  category: StandardCategory;
  status: StandardStatus;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  product: string;
  purpose: string;
  technicalRequirements: string;
  environment: string;
  industry: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface AppSettings {
  language: Language;
  demoMode: boolean;
  apiEndpoint?: string;
  apiKey?: string;
}
