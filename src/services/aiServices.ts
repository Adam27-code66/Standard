// ============================================================
// IS-SMART — Mock AI Services
// Abstraction layer that can be replaced with real API calls
// when a backend is connected via environment variables.
// ============================================================

import {
  AnalysisResult,
  CertificationResult,
  DemoScenario,
  ExtractedRequirements,
  GapItem,
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

// ── Natural Language Extractor (EN / HI / TA) ──────────────────

export function extractRequirementsSync(rawInput: string): ExtractedRequirements {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  let product = 'General Product';
  let quantity = 'Not specified';
  let capacity = 'Not specified';
  let material = 'Not specified';
  let application = 'General Procurement';
  let otherReqs: string[] = [];

  if (lower.includes('water tank') || lower.includes('water storage') || lower.includes('stainless steel') || lower.includes('தொட்டி') || lower.includes('टंकी')) {
    product = 'Stainless Steel Water Storage Tank';
    material = 'Stainless Steel';
    application = 'Government Hospitals';
    capacity = '750 L';
    quantity = '500';
  } else if (lower.includes('led') || lower.includes('street light')) {
    product = 'Outdoor LED Street Light';
    material = 'Aluminium Alloy & Toughened Glass';
    application = 'Highway Infrastructure';
    capacity = '100 W';
    quantity = '1000';
  } else if (lower.includes('pump')) {
    product = 'Industrial Water Pump';
    material = 'Cast Iron Casing, Stainless Steel Impeller';
    application = 'Water Supply';
  } else if (lower.includes('cement')) {
    product = 'Ordinary Portland Cement (OPC)';
    material = 'Hydraulic Cement';
    application = 'Civil Construction';
  } else if (lower.includes('mcb')) {
    product = 'Miniature Circuit Breaker (MCB)';
    material = 'Thermoplastic';
    application = 'Electrical Wiring';
  } else if (lower.includes('helmet') || lower.includes('ppe')) {
    product = 'Industrial Safety Helmet';
    material = 'HDPE';
    application = 'Construction Site Safety';
  } else if (text) {
    product = text.slice(0, 45);
  }

  return {
    product: { label: 'Product Name', key: 'product', value: product, confidence: 96 },
    quantity: { label: 'Quantity', key: 'quantity', value: quantity, confidence: 98 },
    capacity: { label: 'Capacity', key: 'capacity', value: capacity, confidence: 95 },
    material: { label: 'Material', key: 'material', value: material, confidence: 96 },
    application: { label: 'Application', key: 'application', value: application, confidence: 94 },
    otherRequirements: { label: 'Other Requirements', key: 'otherRequirements', value: 'Conformity to IS product standards', confidence: 91 },
  };
}

export async function parseNaturalLanguageRequirement(rawInput: string): Promise<Requirement> {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  let product = 'General Product';
  let quantity = 'Not specified';
  let capacity = 'Not specified';
  let material = 'Not specified';
  let application = 'General Procurement';
  let industry = 'General';
  let environment = 'General Operating Environment';
  let otherReqs: string[] = [];
  let lang: 'en' | 'ta' | 'hi' = 'en';

  if (/[\u0B80-\u0BFF]/.test(text)) {
    lang = 'ta';
    if (lower.includes('தொட்டி') || lower.includes('நீர்')) {
      product = 'Stainless Steel Water Storage Tank';
      material = 'Stainless Steel';
      application = 'Government Hospitals';
      capacity = '750 L';
      quantity = '500';
      industry = 'Healthcare';
    }
  } else if (/[\u0900-\u097F]/.test(text)) {
    lang = 'hi';
    if (lower.includes('टंकी') || lower.includes('पानी')) {
      product = 'Stainless Steel Water Storage Tank';
      material = 'Stainless Steel';
      application = 'Government Hospitals';
      capacity = '750 L';
      quantity = '500';
      industry = 'Healthcare';
    }
  } else {
    if (lower.includes('water tank') || lower.includes('water storage') || lower.includes('stainless steel')) {
      product = 'Stainless Steel Water Storage Tank';
      material = 'Stainless Steel';
      industry = 'Healthcare';
    } else if (lower.includes('led') || lower.includes('street light') || lower.includes('luminaire')) {
      product = 'Outdoor LED Street Light';
      material = 'Aluminium Alloy & Toughened Glass';
      industry = 'Lighting';
      application = 'Highway Infrastructure';
    } else if (lower.includes('pump') || lower.includes('centrifugal')) {
      product = 'Industrial Water Pump';
      material = 'Cast Iron Casing, Stainless Steel Impeller';
      industry = 'Water Supply';
      application = 'Municipal Infrastructure';
    } else if (lower.includes('cement') || lower.includes('opc')) {
      product = 'Ordinary Portland Cement (OPC)';
      material = 'Hydraulic Cement';
      industry = 'Construction';
      application = 'Civil Construction';
    } else if (lower.includes('mcb') || lower.includes('circuit breaker')) {
      product = 'Miniature Circuit Breaker (MCB)';
      material = 'Flame Retardant Thermoplastic';
      industry = 'Electrical';
      application = 'Building Wiring';
    } else if (lower.includes('helmet') || lower.includes('ppe')) {
      product = 'Industrial Safety Helmet';
      material = 'High Density Polyethylene (HDPE)';
      industry = 'Safety';
      application = 'Construction Site Safety';
    }

    const qtyMatch = text.match(/(\d+)\s*(units|nos|pieces|MT|tanks|sets)?/i);
    if (qtyMatch) {
      quantity = qtyMatch[1];
    } else if (lower.includes('500')) {
      quantity = '500';
    }

    const capMatch = text.match(/(\d+\s*(litre|l|litres|kVA|kW|w|m³|mm|hp))/i);
    if (capMatch) {
      capacity = capMatch[1].toUpperCase();
    } else if (lower.includes('750')) {
      capacity = '750 L';
    }

    if (lower.includes('stainless steel') || lower.includes('ss304') || lower.includes('ss316')) {
      material = 'Stainless Steel (SS 304/316)';
    }

    if (lower.includes('hospital') || lower.includes('government hospital')) {
      application = 'Government Hospitals';
      environment = 'Hospital Healthcare Facility (Rooftop/Potable Water)';
    } else if (lower.includes('highway') || lower.includes('road')) {
      application = 'Highway Infrastructure';
      environment = 'Outdoor Exposed Highway';
    } else if (lower.includes('municipal')) {
      application = 'Municipal Water Supply';
      environment = 'Municipal Distribution Network';
    }
  }

  otherReqs = [
    `Potable water storage compliance as per health guidelines`,
    `Hydrostatic pressure testing mandatory`,
    `Passivated weld seams & non-toxic lining`,
    `Corrosion resistance in chlorinated water supply`,
  ];

  return {
    product,
    purpose: `Procurement & installation of ${product} (${quantity} units, ${capacity} capacity) for ${application}`,
    application,
    technicalRequirements: otherReqs,
    environment,
    industry,
    language: lang,
    rawInput: text,
    quantity,
    capacity,
    material,
    otherRequirements: otherReqs.join('; '),
    extractedRequirements: {
      product: { label: 'Product Name', key: 'product', value: product, confidence: 96 },
      quantity: { label: 'Quantity', key: 'quantity', value: quantity, confidence: 98 },
      capacity: { label: 'Capacity', key: 'capacity', value: capacity, confidence: 95 },
      material: { label: 'Material', key: 'material', value: material, confidence: 96 },
      application: { label: 'Application', key: 'application', value: application, confidence: 94 },
      otherRequirements: { label: 'Other Requirements', key: 'otherRequirements', value: otherReqs.join(', '), confidence: 91 },
    },
  };
}

// ── Requirement Analyzer ────────────────────────────────────

export async function analyzeRequirement(input: {
  product: string;
  purpose: string;
  technicalRequirements: string;
  environment: string;
  industry: string;
  rawInput?: string;
  quantity?: string;
  capacity?: string;
  material?: string;
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

  if (input.rawInput && input.rawInput.trim().length > 10 && (!input.product || input.product === 'General Product')) {
    return parseNaturalLanguageRequirement(input.rawInput);
  }

  const techLines = input.technicalRequirements
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const productVal = input.product || 'Stainless Steel Water Storage Tank';
  const qtyVal = input.quantity || '500';
  const capVal = input.capacity || '750 L';
  const matVal = input.material || 'Stainless Steel';
  const appVal = deriveApplication(input);

  return {
    product: productVal,
    purpose: input.purpose || `Procurement of ${productVal} for ${appVal}`,
    application: appVal,
    technicalRequirements: techLines.length > 0 ? techLines : [
      'Conformity to IS product standards mandatory',
      'Material test certificates required from vendor',
      'BIS ISI mark certification required',
    ],
    environment: input.environment || 'Hospital rooftop / Exposed atmosphere',
    industry: input.industry || 'Healthcare',
    language: 'en',
    rawInput: input.rawInput || `Procure ${qtyVal} ${productVal} of ${capVal} capacity for ${appVal}`,
    quantity: qtyVal,
    capacity: capVal,
    material: matVal,
    extractedRequirements: {
      product: { label: 'Product Name', key: 'product', value: productVal, confidence: 96 },
      quantity: { label: 'Quantity', key: 'quantity', value: qtyVal, confidence: 98 },
      capacity: { label: 'Capacity', key: 'capacity', value: capVal, confidence: 95 },
      material: { label: 'Material', key: 'material', value: matVal, confidence: 96 },
      application: { label: 'Application', key: 'application', value: appVal, confidence: 94 },
      otherRequirements: { label: 'Other Requirements', key: 'otherRequirements', value: techLines.join(', ') || 'Potable water storage', confidence: 91 },
    },
  };
}

function deriveApplication(input: { product: string; purpose: string; environment: string }) {
  const p = (input.product + input.purpose + input.environment).toLowerCase();
  if (p.includes('hospital') || p.includes('healthcare')) return 'Government Hospitals';
  if (p.includes('highway') || p.includes('road')) return 'Highway Infrastructure';
  if (p.includes('municipal') || p.includes('water supply')) return 'Municipal Infrastructure';
  if (p.includes('building') || p.includes('office')) return 'Building Construction';
  if (p.includes('construction') || p.includes('site')) return 'Construction Site';
  return 'Government Procurement';
}

// ── Semantic Matcher ────────────────────────────────────────

function computeRelevance(standard: Standard, requirement: Requirement): number {
  const needle = `${requirement.product} ${requirement.purpose} ${requirement.environment} ${requirement.technicalRequirements.join(' ')} ${requirement.industry} ${requirement.material || ''}`.toLowerCase();
  let score = 0;

  for (const kw of standard.keywords) {
    if (needle.includes(kw.toLowerCase())) {
      score += 12;
    }
  }

  if (standard.industry.some((i) => i.toLowerCase() === requirement.industry.toLowerCase())) score += 12;
  if (standard.status === 'Current') score += 5;
  if (standard.certificationRequired) score += 3;

  return Math.min(99, Math.max(40, score + 45));
}

function buildReasoning(standard: Standard, req: Requirement): string[] {
  const reasons: string[] = [];
  const needle = `${req.product} ${req.purpose} ${req.environment} ${req.material || ''}`.toLowerCase();

  if (standard.keywords.some((k) => needle.includes(k.toLowerCase()))) {
    reasons.push('Product category matches requirement');
  }
  if (req.material && standard.description.toLowerCase().includes('stainless steel')) {
    reasons.push('Material requirement matches');
  }
  if (standard.industry.some((i) => i.toLowerCase() === req.industry.toLowerCase())) {
    reasons.push('Application matches standard scope');
  }
  if (standard.category === 'Testing Standard' || standard.testingRequirements) {
    reasons.push('Relevant testing requirements are available');
  }
  if (standard.category === 'Safety Standard' || standard.certificationRequired) {
    reasons.push('Relevant technical parameters overlap');
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
    if (score >= 52) {
      const pMatch = Math.min(98, Math.max(88, score + 2));
      const mMatch = Math.min(97, Math.max(85, score - 1));
      const aMatch = Math.min(96, Math.max(82, score - 3));
      const sMatch = Math.min(99, Math.max(86, score));

      results.push({
        standard: std,
        relevanceScore: score,
        confidenceLevel: score >= 85 ? 'High' : score >= 70 ? 'Medium' : 'Low',
        reason: `AI matched based on product type, application domain, material parameters, and scope.`,
        matchedRequirements: requirement.technicalRequirements.slice(0, 3),
        category: std.category,
        aiReasoning: buildReasoning(std, requirement),
        matchBreakdown: {
          productMatch: pMatch,
          materialMatch: mMatch,
          applicationMatch: aMatch,
          scopeMatch: sMatch,
        },
        whyChecklist: {
          productMatch: true,
          materialMatch: !!(requirement.material || std.keywords.includes('stainless steel')),
          applicationMatch: true,
          scopeMatch: true,
          technicalRequirementMatch: true,
        },
      });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);
}

// ── Tender Auditor & Gap Table ───────────────────────────────

export function generateGapTable(requirement: Requirement, recommendations: Recommendation[]): GapItem[] {
  const gaps: GapItem[] = [];
  const primaryStd = recommendations[0]?.standard;

  gaps.push({
    id: 'gap-mat',
    parameter: 'Material',
    tenderValue: requirement.material || 'Stainless Steel',
    standardRequirement: primaryStd ? `${primaryStd.standardNumber} — Grade 304/316 Stainless Steel conforming to IS 6911` : 'Grade 304 / 316 Stainless Steel',
    status: 'MATCH',
    explanation: 'Tender material specification conforms to mandatory raw material standard IS 6911 for water storage tanks.',
    clauseReference: 'Clause 4.1',
  });

  gaps.push({
    id: 'gap-cap',
    parameter: 'Capacity',
    tenderValue: requirement.capacity || '750 L',
    standardRequirement: 'Applicable requirement (IS 1553 Table 2 & IS 1172 hospital per bed storage rules)',
    status: 'MATCH',
    explanation: '750 Litre capacity falls within standard dimensional and capacity ranges specified under IS 1553.',
    clauseReference: 'Table 2',
  });

  gaps.push({
    id: 'gap-test',
    parameter: 'Testing',
    tenderValue: 'Not specified',
    standardRequirement: 'Mandatory Hydrostatic leakage test (1.5x working pressure) & Dye penetrant weld test',
    status: 'MISSING',
    explanation: 'Tender document omits mandatory factory acceptance hydrostatic pressure testing and weld NDT inspection.',
    clauseReference: 'Clause 6.3',
  });

  gaps.push({
    id: 'gap-samp',
    parameter: 'Sampling',
    tenderValue: 'Not specified',
    standardRequirement: 'Lot sampling inspection procedure as per IS 1553 Annexure B',
    status: 'MISSING',
    explanation: 'Batch sampling methodology and rejection thresholds are missing from vendor evaluation criteria.',
    clauseReference: 'Annexure B',
  });

  gaps.push({
    id: 'gap-cert',
    parameter: 'Certification',
    tenderValue: 'Not specified',
    standardRequirement: 'BIS Product Certification (ISI Marking) & QCO Gazette Notification Compliance',
    status: 'REVIEW',
    explanation: 'Mandatory BIS ISI mark requirement must be explicitly cited in the technical eligibility criteria.',
    clauseReference: 'QCO Gazette',
  });

  const outdatedStd = recommendations.find((r) => r.standard.previousVersion);
  if (outdatedStd) {
    gaps.push({
      id: 'gap-ver',
      parameter: 'Standard Version',
      tenderValue: `${outdatedStd.standard.standardNumber}:${outdatedStd.standard.previousYear || '2014'}`,
      standardRequirement: `${outdatedStd.standard.standardNumber}:${outdatedStd.standard.version}`,
      status: 'OUTDATED',
      explanation: `Tender references outdated standard edition. Update reference to the latest ${outdatedStd.standard.version} publication.`,
      clauseReference: 'Gazette Rev 2024',
    });
  }

  return gaps;
}

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
      description: `Tender specification references an older edition of ${old?.standard.standardNumber}. The latest edition (${old?.standard.version}) should be mandated.`,
      detectedReference: `${old?.standard.standardNumber}:${old?.standard.previousYear}`,
      recommendedAction: `Update technical clause reference to ${old?.standard.standardNumber}:${old?.standard.version}`,
      relatedStandardId: old?.standard.id,
    });
  }

  const hasTestStd = recommendations.some((r) => r.standard.category === 'Testing Standard' || r.standard.testingRequirements);
  if (!hasTestStd) {
    issues.push({
      id: randomId(),
      type: 'Missing Test Standard',
      severity: 'Medium',
      description: 'Testing standards missing from tender specifications. Specify hydrostatic pressure and weld inspection test methods.',
      recommendedAction: 'Include explicit testing standard clauses in the technical specification',
    });
  }

  const certRequired = recommendations.filter((r) => r.standard.certificationRequired);
  if (certRequired.length > 0 && !tenderText?.toLowerCase().includes('bis')) {
    issues.push({
      id: randomId(),
      type: 'Missing Certification',
      severity: 'High',
      description: `${certRequired.length} applicable standard(s) require mandatory BIS product certification. Add explicit ISI mark compliance criteria.`,
      recommendedAction: 'Mandate BIS ISI Marking license verification in vendor eligibility criteria',
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

  await delay(800);

  const recList = recommendations.map(
    (r, i) => `   ${i + 1}. ${r.standard.standardNumber} (${r.standard.version}): ${r.standard.title} [${r.relevanceScore}% Match]\n      Category: ${r.standard.category} | Status: ${r.standard.status}`
  ).join('\n\n');

  const alliedList = recommendations
    .filter((r) => r.standard.category !== 'Main Product Standard')
    .map((r) => `   • ${r.standard.standardNumber} — ${r.standard.title} (${r.standard.category})`)
    .join('\n') || '   • Normative reference standards as per BIS catalog';

  const versionList = recommendations.map((r) => {
    if (r.standard.previousVersion) {
      return `   • ${r.standard.standardNumber}: Current edition is ${r.standard.version} (Published ${r.standard.publicationYear}). Replaces ${r.standard.previousVersion}.`;
    }
    return `   • ${r.standard.standardNumber}: Edition ${r.standard.version} is up-to-date and active.`;
  }).join('\n');

  const amendmentList = recommendations.map((r) => {
    if (r.standard.amendments > 0) {
      const details = r.standard.amendmentDetails?.map((a) => `Amd ${a.number} (${a.year})`).join(', ') || `${r.standard.amendments} Amendment(s)`;
      return `   • ${r.standard.standardNumber}: ${details} incorporated.`;
    }
    return `   • ${r.standard.standardNumber}: No pending amendments recorded.`;
  }).join('\n');

  const certList = recommendations
    .filter((r) => r.standard.certificationRequired)
    .map((r) => `   • ${r.standard.standardNumber}: Mandatory BIS Product Certification (ISI Mark)`)
    .join('\n') || '   • Voluntary certification scheme / Self-declaration as per applicable QCO';

  return `IS-SMART FINAL PROCUREMENT REPORT
Department of Consumer Affairs (DoCA) — Smart Automation Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TENDER SUMMARY
   • Requirement Input: ${requirement.rawInput || requirement.product}
   • Sector / Industry: ${requirement.industry}
   • Operating Environment: ${requirement.environment}
   • Generated Timestamp: ${new Date().toLocaleString()}

2. EXTRACTED REQUIREMENTS
${requirement.technicalRequirements.map((t) => `   • ${t}`).join('\n') || '   • Standard technical parameters extracted by AI engine'}

3. PRODUCT IDENTIFICATION
   • Identified Product: ${requirement.product}
   • Application Domain: ${requirement.application}
   • Purpose: ${requirement.purpose}

4. RECOMMENDED INDIAN STANDARDS
${recList}

5. RECOMMENDATION EXPLANATION
   The recommendations above were computed using semantic matching between 
   extracted product parameters, application environment, and official BIS 
   scopes. Matched keywords, testing criteria, and safety codes align 
   with the technical intent of the procurement requirement.

6. ALLIED / NORMATIVE STANDARDS
${alliedList}

7. VERSION CHECK
${versionList}

8. AMENDMENT CHECK
${amendmentList}

9. CERTIFICATION INFORMATION
${certList}
   Note: All products must conform to Quality Control Orders (QCOs) published 
   in the Official Gazette under the Bureau of Indian Standards Act, 2016.

10. GAP ANALYSIS
   • Missing Requirements: Check testing standards for complete coverage
   • Outdated References: Verify tender documents against 2024/2023 BIS editions
   • Ambiguous Parameters: Ensure capacity, pressure ratings, and grade specs are explicit
   • Certification Gaps: Mandate BIS ISI mark license verification in vendor eligibility criteria

11. WARNINGS
   ⚠ AI-generated analysis is based on indexed knowledge base entries.
   ⚠ Verify standard availability, gazette status, and local municipal bylaws before tender publication.

12. HUMAN REVIEW ITEMS
   [ ] Confirm standard edition numbers in tender technical specification clause
   [ ] Verify NABL laboratory accreditation requirement for third-party testing
   [ ] Cross-check mandatory ISI marking against current BIS QCO notification list
   [ ] Review structural and safety requirements with departmental technical committee

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IS-SMART Intelligence System — Department of Consumer Affairs (DoCA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// ── Full Analysis Pipeline ───────────────────────────────────

export async function runFullAnalysis(
  scenario: DemoScenario | {
    product: string;
    purpose: string;
    technicalRequirements: string;
    environment: string;
    industry: string;
    rawInput?: string;
    quantity?: string;
    capacity?: string;
    material?: string;
  },
  inputType: 'describe' | 'upload' | 'chat' = 'describe'
): Promise<AnalysisResult> {
  const requirement = await analyzeRequirement({
    product: scenario.product,
    purpose: scenario.purpose,
    technicalRequirements: scenario.technicalRequirements,
    environment: scenario.environment,
    industry: scenario.industry,
    rawInput: (scenario as any).rawInput,
    quantity: (scenario as any).quantity,
    capacity: (scenario as any).capacity,
    material: (scenario as any).material,
  });

  const recommendations = await findRecommendations(requirement);
  const issues = await auditTender(recommendations);
  const readinessScore = computeReadinessScore(recommendations, issues);
  const certifications = await checkCertifications(requirement, recommendations);
  const gapTable = generateGapTable(requirement, recommendations);

  return {
    id: randomId(),
    timestamp: new Date().toISOString(),
    inputType,
    requirement,
    recommendations,
    issues,
    readinessScore,
    certifications,
    gapTable,
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
