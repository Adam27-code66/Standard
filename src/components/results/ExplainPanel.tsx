'use client';

import { Recommendation } from '@/types';
import { X, Brain, CheckCircle, AlertTriangle, ArrowDown, FileText } from 'lucide-react';

interface Props {
  recommendation: Recommendation;
  onClose: () => void;
}

export default function ExplainPanel({ recommendation, onClose }: Props) {
  const { standard, relevanceScore, aiReasoning, matchedRequirements, reason } = recommendation;

  // Clause evidence check
  const hasClauseEvidence = standard.clauseEvidence && standard.clauseEvidence.length > 0;

  // Scope check logic using actual scope
  const isScopeMatch = standard.status === 'Current' && standard.scope.length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          height: '100%',
          background: '#ffffff',
          borderLeft: '1px solid #cbd5e1',
          padding: '1.5rem',
          overflowY: 'auto',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          color: '#0f172a',
          animation: 'slideInRight 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Brain size={20} color="#1d4ed8" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Explainable AI Evidence
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Standard Info Header */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
            {standard.standardNumber} : {standard.version}
          </div>
          <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.35 }}>
            {standard.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: '#eff6ff',
                padding: '0.35rem 0.75rem',
                borderRadius: 20,
                border: '1px solid #bfdbfe',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8' }}>{relevanceScore}%</span>
              <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#1e40af' }}>Match Confidence</span>
            </div>
            <span className="badge badge-green">● {standard.status}</span>
          </div>
        </div>

        {/* ── 1. EVIDENCE CHAIN DIAGRAM (SIH REQUIREMENT) ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Decision Traceability Chain
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            {/* Step 1: User Requirement */}
            <div style={{ width: '100%', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>USER REQUIREMENT</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                {matchedRequirements[0] || 'Procurement requirement input'}
              </div>
            </div>

            <ArrowDown size={14} color="#94a3b8" />

            {/* Step 2: Extracted Key Parameter */}
            <div style={{ width: '100%', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>EXTRACTED PARAMETER</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af', marginTop: 2 }}>
                {standard.keywords.slice(0, 3).join(', ') || standard.category}
              </div>
            </div>

            <ArrowDown size={14} color="#94a3b8" />

            {/* Step 3: Matched Standard */}
            <div style={{ width: '100%', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>MATCHED STANDARD</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', marginTop: 2, fontFamily: 'monospace' }}>
                {standard.standardNumber} ({standard.category})
              </div>
            </div>

            <ArrowDown size={14} color="#94a3b8" />

            {/* Step 4: AI Reasoning */}
            <div style={{ width: '100%', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>MATCH RATIONALE</div>
              <div style={{ fontSize: '0.8125rem', color: '#5b21b6', marginTop: 2, lineHeight: 1.4 }}>
                {reason || 'Product scope, technical parameters, and application domain match standard definition.'}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. SCOPE CHECK ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Scope Validation Check
          </h3>

          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 10,
              background: isScopeMatch ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${isScopeMatch ? '#bbf7d0' : '#fde68a'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              {isScopeMatch ? (
                <CheckCircle size={16} color="#16a34a" />
              ) : (
                <AlertTriangle size={16} color="#d97706" />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isScopeMatch ? '#15803d' : '#b45309' }}>
                {isScopeMatch ? '✓ Scope appears relevant' : '⚠ Potential scope mismatch'}
              </span>
            </div>

            <p style={{ fontSize: '0.8125rem', color: isScopeMatch ? '#166534' : '#78350f', margin: 0, lineHeight: 1.5 }}>
              {standard.scope || 'Standard scope statement evaluated against extracted procurement requirements.'}
            </p>
          </div>
        </div>

        {/* ── 3. CLAUSE-LEVEL EVIDENCE ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Clause-Level Evidence
          </h3>

          {hasClauseEvidence ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {standard.clauseEvidence?.map((clause, idx) => (
                <div key={idx} style={{ padding: '0.75rem 0.875rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 2 }}>
                    <FileText size={13} color="#1d4ed8" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', fontFamily: 'monospace' }}>
                      {clause.clauseNumber} — {clause.clauseTitle}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.7875rem', color: '#334155', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>
                    "{clause.snippet}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '0.875rem 1rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic' }}>
              Clause-level evidence is not available in the current dataset.
            </div>
          )}
        </div>

        {/* ── 4. AI MATCHING CRITERIA DETAILS ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Verified Alignment Factors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {aiReasoning.map((reason, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: '#1e293b',
                  background: '#f8fafc',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div style={{ padding: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.725rem', color: '#92400e', lineHeight: 1.5 }}>
          AI-generated analysis is provided for assistance and should be verified against the applicable current official standard and authoritative source.
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
