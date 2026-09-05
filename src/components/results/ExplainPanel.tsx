'use client';

import { Recommendation } from '@/types';
import { X, Brain } from 'lucide-react';

interface Props {
  recommendation: Recommendation;
  onClose: () => void;
}

export default function ExplainPanel({ recommendation, onClose }: Props) {
  const { standard, relevanceScore, aiReasoning, matchedRequirements } = recommendation;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100%',
          background: 'var(--navy-900)',
          borderLeft: '1px solid var(--border)',
          padding: '1.5rem',
          overflowY: 'auto',
          animation: 'slideInRight 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Brain size={18} color="#60a5fa" />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Why Recommended?
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Standard info */}
        <div style={{ background: 'var(--navy-800)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
            {standard.standardNumber}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {standard.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: 'rgba(59,130,246,0.1)',
                padding: '0.375rem 0.75rem',
                borderRadius: 20,
              }}
            >
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa' }}>{relevanceScore}%</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Relevance Score</span>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Note: This is an AI-computed relevance score, not an official BIS rating.
          </p>
        </div>

        {/* AI Reasoning */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Matching Criteria
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'Product category matches scope of this standard',
              'Intended application aligns with standard coverage',
              'Technical requirements overlap detected',
              'Testing requirement relevant to this product type',
              'Safety requirement applicable to this environment',
            ].map((reason, i) => {
              const matched = i < aiReasoning.length;
              return (
                <div
                  key={reason}
                  style={{
                    display: 'flex',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    background: matched ? 'rgba(16,185,129,0.06)' : 'rgba(100,116,139,0.06)',
                    border: `1px solid ${matched ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                  }}
                >
                  <span style={{ color: matched ? '#10b981' : 'var(--text-muted)', flexShrink: 0, marginTop: 1 }}>
                    {matched ? '✓' : '○'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: matched ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.5 }}>
                    {reason}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Reasoning Summary */}
        <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            🧠 AI Reasoning Summary
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            This standard is highly relevant because the identified product category, intended application environment, and technical requirements align closely with the scope defined in <strong style={{ color: 'var(--text-primary)' }}>{standard.standardNumber}</strong>. The relevance score of <strong style={{ color: '#60a5fa' }}>{relevanceScore}%</strong> reflects the degree of alignment between your procurement requirement and this standard's coverage.
          </p>
        </div>

        {/* Matched requirements */}
        {matchedRequirements.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Matched Requirements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {matchedRequirements.map((req, i) => (
                <div key={i} className="badge badge-blue" style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, justifyContent: 'flex-start' }}>
                  {req}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard details */}
        <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'var(--navy-800)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
            Standard Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {[
              ['Version', standard.version],
              ['Status', standard.status],
              ['Amendments', standard.amendments.toString()],
              ['Category', standard.category],
              ['Certification', standard.certificationRequired ? `Required — ${standard.certificationBody || 'BIS'}` : 'Not Mandatory'],
              ['Source', 'Demo Knowledge Base (Not official BIS data)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
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
