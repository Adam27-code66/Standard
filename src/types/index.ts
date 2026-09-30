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

export type GapStatus = 'MATCH' | 'MISSING' | 'AMBIGUOUS' | 'OUTDATED' | 'REVIEW';

export interface ExtractedField {
  label: string;
  key: string;
  value: string;
  confidence: number; // e.g. 96 for 96%
}

export interface ExtractedRequirements {
  product: ExtractedField;
  quantity: ExtractedField;
  capacity: ExtractedField;
  material: ExtractedField;
  application: ExtractedField;
  otherRequirements: ExtractedField;
}

export interface GapItem {
  id: string;
  parameter: string;
  tenderValue: string;
  standardRequirement: string;
  status: GapStatus;
  explanation: string;
  clauseReference?: string;
}

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
    evidenceType?: 'Scope' | 'Requirement' | 'Reference';
    sourceStatus?: 'Verified' | 'Indexed' | 'Demo';
  }[];
}

export interface StandardRelationship {
  id: string;
  sourceStandardId: string;
  targetStandardId: string;
  relationshipType: RelationshipType;
  description: string;
  reason?: string;
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
  extractedRequirements?: ExtractedRequirements;
  quantity?: string;
  capacity?: string;
  material?: string;
  otherRequirements?: string;
}

export interface MatchBreakdown {
  productMatch: number;
  materialMatch: number;
  applicationMatch: number;
  scopeMatch: number;
}

export interface Recommendation {
  standard: Standard;
  relevanceScore: number; // 0-100
  confidenceLevel: 'High' | 'Medium' | 'Low';
  reason: string;
  matchedRequirements: string[];
  category: StandardCategory;
  relationshipType?: RelationshipType;
  aiReasoning: string[];
  matchBreakdown: MatchBreakdown;
  whyChecklist: {
    productMatch: boolean;
    materialMatch: boolean;
    applicationMatch: boolean;
    scopeMatch: boolean;
    technicalRequirementMatch: boolean;
  };
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
  gapTable: GapItem[];
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
  evidence?: string;
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
  reason?: string;
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

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'manual';
  content: string;
  uploadedAt: string;
}

export interface UserProject {
  id: string;
  name: string;
  description?: string;
  rawInputText: string;
  documents: ProjectDocument[];
  extractedRequirements?: ExtractedRequirements;
  createdAt: string;
  updatedAt: string;
  lastAnalysis?: AnalysisResult;
}

export interface AnalysisRecord {
  id: string;
  projectId?: string;
  projectName: string;
  analysisType: 'Requirement Analysis' | 'Tender Audit' | 'Gap Analysis' | 'Spec Assistant' | 'Compare Standards';
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Error';
  language: string;
  inputSource: string;
  summary: string;
  result: AnalysisResult;
}


