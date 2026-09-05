// ============================================================
// IS-SMART — Mock AI Services
// Abstraction layer that can be replaced with real API calls
// when a backend is connected via environment variables.
// ============================================================

import {
  AnalysisResult,
  CertificationResult,
  DemoScenario,
  ReadinessScore,
  Recommendation,
  Requirement,
  Standard,
  TenderIssue,
} from '@/types';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { DEMO_RELATIONSHIPS } from '@/data/relationships';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// ── Utility ─────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId() {
  return Math.random().toString(36).substring(2, 10);
}

// ── Requirement Analyzer ────────────────────────────────────

export async function analyzeRequirement(input: {
  product: string;
  purpose: string;
  technicalRequirements: string;
  environment: string;
  industry: string;
  rawInput?: string;
}): Promise<Requirement> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/analyze-requirement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return res.json();
  }

  await delay(600);

  const techLines = input.technicalRequirements
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    product: input.product,
    purpose: input.purpose,
    application: deriveApplication(input),
    technicalRequirements: techLines,
    environment: input.environment,
    industry: input.industry,
    language: 'en',
    rawInput: input.rawInput || `${input.product} — ${input.purpose}`,
  };
}

function deriveApplication(input: { product: string; purpose: string; environment: string }) {
  const p = (input.product + input.purpose + input.environment).toLowerCase();
  if (p.includes('highway') || p.includes('road')) return 'Highway Infrastructure';
  if (p.includes('municipal') || p.includes('water supply')) return 'Municipal Infrastructure';
  if (p.includes('building') || p.includes('office')) return 'Building Construction';
  if (p.includes('construction') || p.includes('site')) return 'Construction Site';
  return 'General Procurement';
}

// ── Semantic Matcher ────────────────────────────────────────

function computeRelevance(standard: Standard, requirement: Requirement): number {
  const needle = `${requirement.product} ${requirement.purpose} ${requirement.environment} ${requirement.technicalRequirements.join(' ')} ${requirement.industry}`.toLowerCase();
  let score = 0;
  let matched = 0;

  for (const kw of standard.keywords) {
    if (needle.includes(kw.toLowerCase())) {
      score += 12;
      matched++;
    }
  }

  if (standard.industry.some((i) => i.toLowerCase() === requirement.industry.toLowerCase())) score += 10;
  if (standard.status === 'Current') score += 5;
  if (standard.certificationRequired) score += 3;

  // Clamp to 40-99
  return Math.min(99, Math.max(40, score + 40));
}

function buildReasoning(standard: Standard, req: Requirement): string[] {
  const reasons: string[] = [];
  const needle = `${req.product} ${req.purpose} ${req.environment}`.toLowerCase();

  if (standard.keywords.some((k) => needle.includes(k.toLowerCase()))) {
    reasons.push('Product category matches scope of this standard');
  }
  if (standard.industry.some((i) => i.toLowerCase() === req.industry.toLowerCase())) {
    reasons.push('Industry sector alignment confirmed');
  }
  if (req.environment.toLowerCase().includes('outdoor') && standard.keywords.some(k => k.includes('outdoor') || k.includes('weather'))) {
    reasons.push('Environmental exposure requirements align');
  }
  if (standard.category === 'Testing Standard') {
    reasons.push('Testing requirements are relevant to this product type');
  }
  if (standard.category === 'Safety Standard') {
    reasons.push('Safety requirements are applicable to this application');
  }
  if (standard.certificationRequired) {
    reasons.push('Certification requirement relevant to procurement');
  }
  if (reasons.length === 0) reasons.push('Technical requirement overlap detected');
  return reasons;
}

export async function findRecommendations(requirement: Requirement): Promise<Recommendation[]> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/search-standards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirement }),
    });
    return res.json();
  }

  await delay(800);

  const results: Recommendation[] = [];

  for (const std of DEMO_STANDARDS) {
    const score = computeRelevance(std, requirement);
    if (score >= 55) {
      results.push({
        standard: std,
        relevanceScore: score,
        reason: `AI matched based on product type, application, and technical requirements`,
        matchedRequirements: requirement.technicalRequirements.slice(0, 3),
        category: std.category,
        aiReasoning: buildReasoning(std, requirement),
      });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);
}

// ── Tender Auditor ───────────────────────────────────────────

export async function auditTender(
  recommendations: Recommendation[],
  tenderText?: string
): Promise<TenderIssue[]> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/audit-tender`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recommendations, tenderText }),
    });
    return res.json();
  }

  await delay(500);

  const issues: TenderIssue[] = [];

  const hasOldRef = recommendations.some((r) => r.standard.previousVersion);
  if (hasOldRef) {
    const old = recommendations.find((r) => r.standard.previousVersion);
    issues.push({
      id: randomId(),
      type: 'Outdated Standard',
      severity: 'High',
      description: `Tender or specification may reference an older edition of ${old?.standard.standardNumber}. The latest version (${old?.standard.version}) should be referenced.`,
      detectedReference: `${old?.standard.standardNumber}:${old?.standard.previousYear}`,
      recommendedAction: `Update reference to ${old?.standard.standardNumber}:${old?.standard.version}`,
      relatedStandardId: old?.standard.id,
    });
  }

  const hasTestStd = recommendations.some((r) => r.standard.category === 'Testing Standard');
  if (!hasTestStd) {
    issues.push({
      id: randomId(),
      type: 'Missing Test Standard',
      severity: 'Medium',
      description: 'No testing standard has been referenced. Procurement documents should specify applicable test methods to ensure product conformance.',
      recommendedAction: 'Include relevant testing standard(s) in the technical specification section',
    });
  }

  const hasSafetyStd = recommendations.some((r) => r.standard.category === 'Safety Standard');
  if (!hasSafetyStd) {
    issues.push({
      id: randomId(),
      type: 'Missing Safety Requirement',
      severity: 'Medium',
      description: 'Safety-related standards have not been explicitly identified. Ensure applicable safety requirements are included.',
      recommendedAction: 'Review and include applicable safety standards in the specification',
    });
  }

  const certRequired = recommendations.filter((r) => r.standard.certificationRequired);
  if (certRequired.length > 0 && !tenderText?.toLowerCase().includes('bis')) {
    issues.push({
      id: randomId(),
      type: 'Missing Certification',
      severity: 'High',
      description: `${certRequired.length} standard(s) require BIS certification. The tender specification should explicitly mandate BIS ISI marking.`,
      recommendedAction: 'Add mandatory BIS certification clause to the technical specifications',
      relatedStandardId: certRequired[0].standard.id,
    });
  }

  return issues;
}

// ── Readiness Score ──────────────────────────────────────────

export function computeReadinessScore(
  recommendations: Recommendation[],
  issues: TenderIssue[]
): ReadinessScore {
  const hasMain = recommendations.some((r) => r.standard.category === 'Main Product Standard');
  const hasTest = recommendations.some((r) => r.standard.category === 'Testing Standard');
  const hasSafety = recommendations.some((r) => r.standard.category === 'Safety Standard');
  const hasCert = recommendations.some((r) => r.standard.certificationRequired);
  const hasOutdated = issues.some((i) => i.type === 'Outdated Standard');

  const standardCoverage = hasMain ? 92 : 60;
  const versionAccuracy = hasOutdated ? 72 : 95;
  const testingCoverage = hasTest ? 88 : 55;
  const safetyCoverage = hasSafety ? 85 : 60;
  const certificationCoverage = hasCert ? 90 : 70;

  const total = Math.round(
    (standardCoverage + versionAccuracy + testingCoverage + safetyCoverage + certificationCoverage) / 5
  );

  return {
    total,
    breakdown: {
      standardCoverage,
      versionAccuracy,
      testingCoverage,
      safetyCoverage,
      certificationCoverage,
    },
  };
}

// ── Certification Checker ────────────────────────────────────

export async function checkCertifications(
  requirement: Requirement,
  recommendations: Recommendation[]
): Promise<CertificationResult[]> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/check-certification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirement, recommendations }),
    });
    return res.json();
  }

  await delay(400);

  const results: CertificationResult[] = [
    {
      id: 'cert-bis',
      name: 'BIS Product Certification (ISI Mark)',
      body: 'Bureau of Indian Standards',
      applicable: recommendations.some((r) => r.standard.certificationRequired),
      applicabilityReason: 'One or more recommended standards require BIS product certification under the BIS Act, 2016.',
      verificationRequired: true,
      status: recommendations.some((r) => r.standard.certificationRequired) ? 'Applicable' : 'Verify Required',
    },
    {
      id: 'cert-crs',
      name: 'Compulsory Registration Scheme (CRS)',
      body: 'Bureau of Indian Standards',
      applicable: requirement.industry.toLowerCase().includes('electrical') || requirement.product.toLowerCase().includes('led') || requirement.product.toLowerCase().includes('light'),
      applicabilityReason: 'Electronic and electrical products may fall under CRS notification. Verify against current CRS product list.',
      verificationRequired: true,
      status: 'Verify Required',
    },
    {
      id: 'cert-gem',
      name: 'GeM Portal Compliance',
      body: 'Government e-Marketplace',
      applicable: true,
      applicabilityReason: 'Government procurement may require GeM portal listing. Vendors should be GeM registered.',
      verificationRequired: true,
      status: 'Verify Required',
    },
  ];

  return results;
}

// ── Specification Generator ──────────────────────────────────

export async function generateSpecification(
  requirement: Requirement,
  recommendations: Recommendation[]
): Promise<string> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/generate-specification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirement, recommendations }),
    });
    const data = await res.json();
    return data.specification;
  }

  await delay(1000);

  const mainStd = recommendations.filter((r) => r.standard.category === 'Main Product Standard');
  const testStd = recommendations.filter((r) => r.standard.category === 'Testing Standard');
  const safetyStd = recommendations.filter((r) => r.standard.category === 'Safety Standard');
  const installStd = recommendations.filter((r) => r.standard.category === 'Installation Standard');
  const certStd = recommendations.filter((r) => r.standard.certificationRequired);

  const techList = requirement.technicalRequirements.map((t) => `    • ${t}`).join('\n');
  const mainList = mainStd.map((r) => `    • ${r.standard.standardNumber}: ${r.standard.title}`).join('\n');
  const testList = testStd.map((r) => `    • ${r.standard.standardNumber}: ${r.standard.title}`).join('\n') || '    • To be specified';
  const safetyList = safetyStd.map((r) => `    • ${r.standard.standardNumber}: ${r.standard.title}`).join('\n') || '    • To be specified';
  const installList = installStd.map((r) => `    • ${r.standard.standardNumber}: ${r.standard.title}`).join('\n') || '    • To be specified';
  const certList = certStd.map((r) => `    • ${r.standard.standardNumber} — ${r.standard.certificationBody || 'BIS'} Certification Required`).join('\n') || '    • Verify applicable certification requirements';

  return `TECHNICAL SPECIFICATION
AI-Generated Draft — Verify before use
Generated by IS-SMART (Demo Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PRODUCT / ITEM DESCRIPTION
   ${requirement.product}

2. PURPOSE / APPLICATION
   ${requirement.purpose}

3. OPERATING ENVIRONMENT
   ${requirement.environment}

4. TECHNICAL REQUIREMENTS
${techList}

5. APPLICABLE INDIAN STANDARDS

   5.1 Main Product Standards:
${mainList || '    • To be specified based on final product selection'}

   5.2 Testing & Measurement Standards:
${testList}

   5.3 Safety Standards:
${safetyList}

   5.4 Installation Standards:
${installList}

6. CERTIFICATION & MARKING REQUIREMENTS
${certList}

   All products shall bear the BIS ISI mark wherever mandatory under
   the BIS Act, 2016 and applicable Quality Control Orders (QCOs).

7. INSPECTION & ACCEPTANCE CRITERIA
   • Pre-dispatch inspection at manufacturer's premises
   • Third-party inspection by NABL-accredited laboratory
   • Certificates of conformance to be submitted with each consignment
   • Random sampling as per IS 2500 (Sampling Inspection Procedures)

8. DOCUMENTATION REQUIRED
   • BIS License / CRS Registration Certificate
   • Test reports from NABL-accredited laboratory (not older than 3 years)
   • Declaration of Conformity
   • Technical data sheets
   • Warranty certificate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCLAIMER: This is an AI-generated draft specification for reference 
purposes only. Verify all standards, versions, amendments, and 
certification requirements against official BIS sources before use 
in procurement documents.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// ── Full Analysis Pipeline ───────────────────────────────────

export async function runFullAnalysis(
  scenario: DemoScenario | {
    product: string;
    purpose: string;
    technicalRequirements: string;
    environment: string;
    industry: string;
  },
  inputType: 'describe' | 'upload' | 'chat' = 'describe'
): Promise<AnalysisResult> {
  const requirement = await analyzeRequirement({
    product: scenario.product,
    purpose: scenario.purpose,
    technicalRequirements: scenario.technicalRequirements,
    environment: scenario.environment,
    industry: scenario.industry,
  });

  const recommendations = await findRecommendations(requirement);
  const issues = await auditTender(recommendations);
  const readinessScore = computeReadinessScore(recommendations, issues);
  const certifications = await checkCertifications(requirement, recommendations);

  return {
    id: randomId(),
    timestamp: new Date().toISOString(),
    inputType,
    requirement,
    recommendations,
    issues,
    readinessScore,
    certifications,
  };
}

// ── Standards Relationship Service ───────────────────────────

export function getRelationships(standardId: string) {
  return DEMO_RELATIONSHIPS.filter(
    (r) => r.sourceStandardId === standardId || r.targetStandardId === standardId
  );
}

// ── Chat Service ─────────────────────────────────────────────

interface ChatContext {
  product?: string;
  purpose?: string;
  environment?: string;
  power?: string;
  industry?: string;
  [key: string]: string | undefined;
}

export async function chatResponse(
  userMessage: string,
  context: Record<string, string | undefined>
): Promise<{ message: string; updatedContext: Record<string, string | undefined>; readyToAnalyze: boolean }> {
  if (API_ENDPOINT) {
    const res = await fetch(`${API_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, context }),
    });
    return res.json();
  }

  await delay(700);

  const msg = userMessage.toLowerCase();
  const updated = { ...context };

  // Simple intent extraction
  if (msg.includes('led') || msg.includes('light') || msg.includes('luminaire')) {
    updated.product = 'LED Luminaire';
    updated.industry = 'Lighting';
  }
  if (msg.includes('pump') || msg.includes('water')) {
    updated.product = 'Water Pump';
    updated.industry = 'Water Supply';
  }
  if (msg.includes('helmet') || msg.includes('ppe') || msg.includes('safety')) {
    updated.product = 'Safety Helmet';
    updated.industry = 'Safety';
  }
  if (msg.includes('highway') || msg.includes('road')) {
    updated.purpose = 'Highway Infrastructure';
    updated.environment = 'Outdoor';
  }
  if (msg.includes('outdoor')) updated.environment = 'Outdoor';
  if (msg.includes('indoor')) updated.environment = 'Indoor';
  const wattMatch = msg.match(/(\d+)\s*w/i);
  if (wattMatch) updated.power = wattMatch[1] + 'W';

  const readyToAnalyze =
    !!(updated.product && updated.environment);

  let response = '';
  if (!updated.product) {
    response = "I can help identify applicable Indian Standards. What product or equipment do you need standards for?";
  } else if (!updated.purpose) {
    response = `Got it — ${updated.product}. What is the intended application or purpose? (For example: highway lighting, water supply, building construction)`;
  } else if (!updated.environment) {
    response = "Will this equipment be installed indoors or outdoors? Any special environmental conditions (coastal, high temperature, explosive atmosphere)?";
  } else if (!updated.power && updated.product?.toLowerCase().includes('led')) {
    response = `What is the required power rating in Watts? This helps narrow down the applicable performance standards.`;
  } else {
    response = `I have sufficient information to begin the standards analysis for your ${updated.product} requirement. Click **Analyze Requirements** to see applicable Indian Standards.`;
  }

  return { message: response, updatedContext: updated, readyToAnalyze };
}

// ── History (Session Storage) ────────────────────────────────

const HISTORY_KEY = 'is-smart-analysis-history';

export function saveToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  const existing = loadHistory();
  const updated = [result, ...existing].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function loadHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}
