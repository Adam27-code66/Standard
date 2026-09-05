'use client';

import { TenderIssue } from '@/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { issues: TenderIssue[]; }

const SEVERITY_CONFIG = {
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', icon: AlertCircle },
  High: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: AlertTriangle },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.2)', icon: AlertTriangle },
  Low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.05)', border: 'rgba(59,130,246,0.2)', icon: Info },
  Info: { color: '#94a3b8', bg: 'rgba(100,116,139,0.05)', border: 'rgba(100,116,139,0.2)', icon: Info },
};

function IssueCard({ issue }: { issue: TenderIssue }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.Info;
  const Icon = cfg.icon;

  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1rem',
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon size={16} color={cfg.color} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.8375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {issue.type}
          </span>
          <span
            className={`badge badge-${issue.severity === 'Critical' || issue.severity === 'High' ? 'red' : issue.severity === 'Medium' ? 'amber' : 'blue'}`}
            style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}
          >
            {issue.severity}
          </span>
        </div>
        {expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
      </button>

      {expanded && (
        <div style={{ padding: '0 1rem 1rem', borderTop: `1px solid ${cfg.border}` }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.75rem 0 0.5rem' }}>
            {issue.description}
          </p>
          {issue.detectedReference && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detected reference:</span>
              <code style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                {issue.detectedReference}
              </code>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: 8,
              marginTop: '0.625rem',
            }}
          >
            <CheckCircle size={13} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.775rem', color: '#34d399', margin: 0, lineHeight: 1.5 }}>
              <strong>Recommended action:</strong> {issue.recommendedAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TenderAudit({ issues }: Props) {
  if (issues.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#10b981', marginBottom: '0.375rem' }}>
          No Major Issues Detected
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          The identified standards appear to cover the key requirements. Review the full specification before finalizing.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card-bright" style={{ padding: '1.25rem' }}>
      <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Tender Compliance & Gap Analysis
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {issues.length} issue{issues.length !== 1 ? 's' : ''} detected that may affect procurement quality.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
