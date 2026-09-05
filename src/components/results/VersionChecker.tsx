'use client';

import { Recommendation } from '@/types';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props { recommendations: Recommendation[]; }

export default function VersionChecker({ recommendations }: Props) {
  const withHistory = recommendations.filter((r) => r.standard.previousVersion);
  const current = recommendations.filter((r) => !r.standard.previousVersion || r.standard.status === 'Current');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-card-bright" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Standard Version Status
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Ensure your tender references the latest editions. Outdated references are highlighted.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recommendations.map((rec) => {
            const isOutdated = rec.standard.previousVersion && rec.standard.previousYear;
            return (
              <div
                key={rec.standard.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--navy-800)',
                  border: `1px solid ${isOutdated ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
                  borderRadius: 10,
                  flexWrap: 'wrap',
                }}
              >
                {/* Status icon */}
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {rec.standard.status === 'Current' ? (
                    <CheckCircle size={18} color="#10b981" />
                  ) : (
                    <AlertTriangle size={18} color="#f59e0b" />
                  )}
                </div>

                {/* Standard info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>
                      {rec.standard.standardNumber}
                    </span>
                    <span className={`badge ${rec.standard.status === 'Current' ? 'badge-green' : rec.standard.status === 'Amended' ? 'badge-amber' : 'badge-red'}`}>
                      {rec.standard.status === 'Current' ? '🟢 Current' : rec.standard.status === 'Amended' ? '🟡 Amended' : '🔴 ' + rec.standard.status}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Amendments: {rec.standard.amendments}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.375rem' }}>
                    {rec.standard.title}
                  </div>

                  {isOutdated && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tender may reference:</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b', fontFamily: 'monospace' }}>
                          {rec.standard.standardNumber}:{rec.standard.previousYear}
                        </span>
                      </div>
                      <ArrowRight size={12} color="var(--text-muted)" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Should use:</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#10b981', fontFamily: 'monospace' }}>
                          {rec.standard.standardNumber}:{rec.standard.version}
                        </span>
                      </div>
                      <button className="btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}>
                        ✓ Replace with Latest
                      </button>
                    </div>
                  )}
                </div>

                {/* Version badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {rec.standard.version}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Current Version</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <CheckCircle size={24} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{current.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current / Up-to-date</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <AlertTriangle size={24} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{withHistory.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>With Previous Versions</div>
        </div>
      </div>
    </div>
  );
}
