'use client';

import { useState } from 'react';
import { Recommendation, Standard } from '@/types';
import { CheckCircle, AlertTriangle, ArrowRight, Scale, History, FileText } from 'lucide-react';
import Link from 'next/link';
import StandardProfileModal from '@/components/explorer/StandardProfileModal';

interface Props { recommendations: Recommendation[]; }

export default function VersionChecker({ recommendations }: Props) {
  const [profileStandard, setProfileStandard] = useState<Standard | null>(null);

  const withHistory = recommendations.filter((r) => r.standard.previousVersion);
  const current = recommendations.filter((r) => !r.standard.previousVersion || r.standard.status === 'Current');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
          Version & Amendment Verification
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Automated check against the latest Indian Standards registry. Detects outdated references, superseded editions, and active amendments.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendations.map((rec) => {
            const isOutdated = rec.standard.previousVersion && rec.standard.previousYear;
            const hasAmendments = rec.standard.amendments > 0;

            return (
              <div
                key={rec.standard.id}
                style={{
                  padding: '1.25rem',
                  background: '#ffffff',
                  border: `1px solid ${isOutdated ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: 12,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
                        {rec.standard.standardNumber} : {rec.standard.version}
                      </span>
                      <span className={`badge ${rec.standard.status === 'Current' ? 'badge-green' : 'badge-amber'}`}>
                        ● {rec.standard.status}
                      </span>
                      {hasAmendments && (
                        <span className="badge badge-amber">{rec.standard.amendments} Amendment(s)</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {rec.standard.title}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => setProfileStandard(rec.standard)}
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
                    >
                      <History size={13} />
                      View Version History
                    </button>
                    <Link
                      href={`/compare?std1=${rec.standard.id}`}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Scale size={13} />
                      Compare Versions
                    </Link>
                  </div>
                </div>

                {/* Version Mismatch Warning Card */}
                {isOutdated && (
                  <div
                    style={{
                      marginTop: '0.875rem',
                      padding: '0.875rem 1rem',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <AlertTriangle size={16} color="#d97706" />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.02em' }}>
                        ⚠ VERSION UPDATE DETECTED
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: '#78350f', fontWeight: 500 }}>Tender Referenced Version: </span>
                        <strong style={{ color: '#be123c', fontFamily: 'monospace' }}>
                          {rec.standard.standardNumber} : {rec.standard.previousYear}
                        </strong>
                      </div>
                      <ArrowRight size={14} color="#d97706" />
                      <div>
                        <span style={{ color: '#78350f', fontWeight: 500 }}>Available Newer Version: </span>
                        <strong style={{ color: '#15803d', fontFamily: 'monospace' }}>
                          {rec.standard.standardNumber} : {rec.standard.version}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amendments List */}
                {hasAmendments && (
                  <div style={{ marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px border #f1f5f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Active Amendments Breakdown
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {rec.standard.amendmentDetails ? (
                        rec.standard.amendmentDetails.map((amd) => (
                          <div key={amd.number} style={{ fontSize: '0.7875rem', color: '#334155', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#b45309' }}>Amd {amd.number} ({amd.year}):</strong> {amd.title}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.7875rem', color: '#64748b' }}>
                          {rec.standard.amendments} Amendment(s) published for this edition.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Scoreboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: 12 }}>
          <CheckCircle size={24} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>{current.length}</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>Up-to-Date Standards</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: 12 }}>
          <AlertTriangle size={24} color="#d97706" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>{withHistory.length}</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>Newer Editions Available</div>
        </div>
      </div>

      {profileStandard && (
        <StandardProfileModal standard={profileStandard} onClose={() => setProfileStandard(null)} />
      )}
    </div>
  );
}
