'use client';

import { Requirement, Recommendation, TenderIssue } from '@/types';
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight, FileText, FileCheck } from 'lucide-react';

interface Props {
  requirement: Requirement;
  recommendations: Recommendation[];
  issues: TenderIssue[];
}

export default function BeforeAfterView({ requirement, recommendations, issues }: Props) {
  return (
    <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16, marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
        <Sparkles size={20} color="#1d4ed8" />
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          AI Before vs. After Specification Transformation
        </h2>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Visualizes how IS-SMART transforms unstructured procurement inputs into an unambiguous, standard-aligned technical specification.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', position: 'relative' }}>
        {/* Step 1: Original Raw Requirement */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '1.125rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            1. Original Procurement Requirement
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', padding: '0.875rem', borderRadius: 8, border: '1px solid #e2e8f0', minHeight: 70, lineHeight: 1.5 }}>
            "{requirement.rawInput || `${requirement.product} — ${requirement.purpose}`}"
          </div>
          <div style={{ fontSize: '0.725rem', color: '#dc2626', marginTop: '0.625rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} />
            Unstructured & missing normative reference standards
          </div>
        </div>

        {/* Step 2: AI Identified Specification Gaps */}
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 12, padding: '1.125rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            2. AI Identified Specification Gaps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {issues.length > 0 ? (
              issues.slice(0, 3).map((issue) => (
                <div key={issue.id} style={{ fontSize: '0.7875rem', color: '#9f1239', background: '#ffffff', padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid #ffe4e6', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#e11d48', fontWeight: 700 }}>⚠</span>
                  <span style={{ fontWeight: 600 }}>{issue.type}:</span> {issue.description.slice(0, 50)}...
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.7875rem', color: '#9f1239' }}>
                ⚠ Missing mandatory testing, safety, and certification clauses.
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Recommended Indian Standards */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '1.125rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            3. Recommended Indian Standards
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.standard.id} style={{ fontSize: '0.7875rem', background: '#ffffff', padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid #dbeafe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>{rec.standard.standardNumber}</strong>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{rec.relevanceScore}% Match</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Improved Structured Specification */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1.125rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            4. Improved Structured Specification
          </div>
          <div style={{ fontSize: '0.7875rem', color: '#166534', background: '#ffffff', padding: '0.75rem', borderRadius: 8, border: '1px solid #dcfce7', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 800, color: '#15803d', marginBottom: 2 }}>✓ BIS CONFORMANT DRAFT</div>
            <div>• Product: {requirement.product}</div>
            <div>• Primary Std: {recommendations[0]?.standard.standardNumber || 'IS Specified'}</div>
            <div>• Certification: BIS ISI Mark Mandatory</div>
            <div>• Testing: Conformance as per IS test codes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
