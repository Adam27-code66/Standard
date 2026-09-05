'use client';

import { Recommendation } from '@/types';
import { Eye, HelpCircle, Plus, CheckSquare, Square } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';

const CATEGORY_CONFIG: Record<string, { color: string; badge: string }> = {
  'Main Product Standard': { color: '#3b82f6', badge: 'badge-blue' },
  'Testing Standard': { color: '#a78bfa', badge: 'badge-purple' },
  'Safety Standard': { color: '#ef4444', badge: 'badge-red' },
  'Installation Standard': { color: '#10b981', badge: 'badge-green' },
  'Terminology Standard': { color: '#94a3b8', badge: 'badge-gray' },
  'Material Standard': { color: '#f59e0b', badge: 'badge-amber' },
  'Performance Standard': { color: '#00d4ff', badge: 'badge-cyan' },
  'Related Product Standard': { color: '#64748b', badge: 'badge-gray' },
};

const STATUS_CONFIG: Record<string, string> = {
  Current: 'badge-green',
  Amended: 'badge-amber',
  Superseded: 'badge-red',
  Withdrawn: 'badge-red',
  'Under Revision': 'badge-amber',
};

interface Props {
  recommendation: Recommendation;
  selected: boolean;
  onSelect: () => void;
  onExplain: () => void;
  onAddToSpec: () => void;
}

export default function StandardCard({ recommendation, selected, onSelect, onExplain, onAddToSpec }: Props) {
  const { standard, relevanceScore, category } = recommendation;
  const catConfig = CATEGORY_CONFIG[category] || { color: '#64748b', badge: 'badge-gray' };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.125rem 1.375rem',
        border: `1px solid ${selected ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
        background: selected ? 'rgba(37,99,235,0.06)' : undefined,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Select checkbox */}
        <button
          onClick={onSelect}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, flexShrink: 0 }}
          aria-label={selected ? 'Deselect standard' : 'Select standard'}
        >
          {selected ? (
            <CheckSquare size={18} color="#3b82f6" />
          ) : (
            <Square size={18} color="var(--text-muted)" />
          )}
        </button>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: catConfig.color, fontFamily: 'monospace' }}>
                  {standard.standardNumber}
                </span>
                <span className={`badge ${catConfig.badge}`}>{category}</span>
                <span className={`badge ${STATUS_CONFIG[standard.status] || 'badge-gray'}`}>
                  {standard.status === 'Current' ? '🟢' : standard.status === 'Amended' ? '🟡' : '🔴'} {standard.status}
                </span>
                {standard.certificationRequired && (
                  <span className="badge badge-amber">BIS Cert. Required</span>
                )}
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.375rem', lineHeight: 1.4 }}>
                {standard.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.625rem', lineHeight: 1.5 }}>
                {standard.description}
              </p>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>Version: <strong style={{ color: 'var(--text-secondary)' }}>{standard.version}</strong></span>
                <span>·</span>
                <span>Amendments: <strong style={{ color: 'var(--text-secondary)' }}>{standard.amendments}</strong></span>
                <span>·</span>
                <span>Industry: <strong style={{ color: 'var(--text-secondary)' }}>{standard.industry.join(', ')}</strong></span>
              </div>
            </div>

            {/* Relevance score */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: `conic-gradient(${relevanceScore >= 80 ? '#10b981' : relevanceScore >= 60 ? '#3b82f6' : '#f59e0b'} ${relevanceScore * 3.6}deg, var(--navy-700) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: relevanceScore >= 80 ? '#10b981' : relevanceScore >= 60 ? '#60a5fa' : '#f59e0b' }}>
                    {relevanceScore}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 4 }}>AI Relevance</div>
            </div>
          </div>

          {/* Relevance bar */}
          <div style={{ marginTop: '0.625rem' }}>
            <div className="relevance-bar">
              <div className="relevance-fill" style={{ width: `${relevanceScore}%` }} />
            </div>
          </div>

          {/* Matched reasons */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.625rem' }}>
            {recommendation.aiReasoning.slice(0, 3).map((r, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#10b981' }}>
                ✓ {r}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
            <button id={`explain-btn-${standard.id}`} className="btn-ghost" onClick={onExplain} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              <HelpCircle size={13} />
              Why Recommended?
            </button>
            <button className="btn-ghost" onClick={onAddToSpec} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              <Plus size={13} />
              {selected ? 'Added to Spec' : 'Add to Specification'}
            </button>
            <a
              href={getBisStandardUrl(standard.standardNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              <Eye size={13} />
              View Standard
            </a>
          </div>

          {/* Demo label */}
          <div style={{ marginTop: '0.5rem' }}>
            <span className="badge badge-gray" style={{ fontSize: '0.6rem' }}>Demo Knowledge Base • Not Official BIS Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
