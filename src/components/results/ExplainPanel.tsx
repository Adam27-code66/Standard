'use client';

import { useState } from 'react';
import { Recommendation } from '@/types';
import { X, Brain, CheckCircle, AlertTriangle, ArrowDown, FileText, Copy, ExternalLink, Check } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  recommendation: Recommendation;
  onClose: () => void;
}

export default function ExplainPanel({ recommendation, onClose }: Props) {
  const { t } = useLanguage();
  const { standard, relevanceScore, aiReasoning, matchedRequirements, reason } = recommendation;
  const [copied, setCopied] = useState(false);

  const hasClauseEvidence = standard.clauseEvidence && standard.clauseEvidence.length > 0;
  const isScopeMatch = standard.status === 'Current' && standard.scope.length > 0;

  const copyEvidence = () => {
    const evidenceText = hasClauseEvidence
      ? standard.clauseEvidence?.map((c) => `${c.clauseNumber} (${c.clauseTitle}): "${c.snippet}"`).join('\n')
      : `Scope: ${standard.scope}`;
    navigator.clipboard.writeText(`Standard: ${standard.standardNumber}:${standard.version}\nSource: BIS / Indexed Standard Dataset\nEvidence:\n${evidenceText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          maxWidth: 520,
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
              {t('evidenceAndTraceability') || 'Evidence & Traceability'}
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

        {/* Standard Header Banner */}
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
              <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#1e40af' }}>Relevance Score</span>
            </div>
            <span className="badge badge-green">● {standard.status}</span>
          </div>
        </div>

        {/* ── WHY THIS STANDARD? ── */}
        <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            WHY THIS STANDARD?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8125rem', color: '#1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>1.</span>
              <span>Product category matches the requirement.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>2.</span>
              <span>Material requirement matches.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>3.</span>
              <span>Application matches the standard scope.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>4.</span>
              <span>Relevant technical parameters overlap.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>5.</span>
              <span>Related testing requirements are available.</span>
            </div>
          </div>
        </div>

        {/* ── EVIDENCE & TRACEABILITY ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            EVIDENCE & TRACEABILITY
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#64748b' }}>Standard:</strong>{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{standard.standardNumber}:{standard.version}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#64748b' }}>Source:</strong> BIS / Indexed Standard Dataset
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#64748b' }}>Evidence Type:</strong> Scope / Requirement / Reference
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#64748b' }}>Source Status:</strong>{' '}
              <span className="badge badge-green">Verified / Demo Indexed</span>
            </div>
          </div>

          {/* Actual Available Indexed Snippet */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
              INDEXED EVIDENCE SNIPPET
            </div>

            {hasClauseEvidence ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {standard.clauseEvidence?.map((clause, idx) => (
                  <div key={idx} style={{ padding: '0.85rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace', marginBottom: 2 }}>
                      {clause.clauseNumber} — {clause.clauseTitle}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#1e3a8a', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>
                      "{clause.snippet}"
                    </p>
                  </div>
                ))}
              </div>
            ) : standard.scope ? (
              <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
                <strong>Scope Statement:</strong> "{standard.scope}"
              </div>
            ) : (
              <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic' }}>
                Source evidence unavailable in current indexed data.
              </div>
            )}
          </div>

          {/* Evidence Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a
              href={getBisStandardUrl(standard.standardNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.7875rem', padding: '0.45rem 0.85rem', gap: '0.375rem', textDecoration: 'none', background: '#1d4ed8' }}
            >
              <ExternalLink size={14} />
              View Source
            </a>

            <button
              className="btn-secondary"
              onClick={copyEvidence}
              style={{ fontSize: '0.7875rem', padding: '0.45rem 0.85rem', gap: '0.375rem' }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copied ? 'Copied Evidence!' : 'Copy Evidence'}
            </button>
          </div>
        </div>

        {/* Decision Traceability Chain */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Decision Traceability Chain
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '100%', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>USER REQUIREMENT</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                {matchedRequirements[0] || 'Procurement requirement input'}
              </div>
            </div>

            <ArrowDown size={14} color="#94a3b8" />

            <div style={{ width: '100%', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>EXTRACTED PARAMETER</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af', marginTop: 2 }}>
                {standard.keywords.slice(0, 3).join(', ') || standard.category}
              </div>
            </div>

            <ArrowDown size={14} color="#94a3b8" />

            <div style={{ width: '100%', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>MATCHED STANDARD</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', marginTop: 2, fontFamily: 'monospace' }}>
                {standard.standardNumber} ({standard.category})
              </div>
            </div>
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
