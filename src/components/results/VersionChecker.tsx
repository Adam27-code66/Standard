'use client';

import { useState } from 'react';
import { Recommendation, Standard } from '@/types';
import { CheckCircle, AlertTriangle, ArrowRight, Scale, History, ArrowDown } from 'lucide-react';
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Version & Amendment Intelligence
          </h2>
          <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
            DEMO VERSION DATA
          </span>
        </div>

        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Automated check against the latest indexed Indian Standards registry. Tracks revision timelines, amendment history, and flags outdated tender references.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recommendations.map((rec) => {
            const isOutdated = !!(rec.standard.previousVersion && rec.standard.previousYear);
            const hasAmendments = rec.standard.amendments > 0;
            const statusType: 'CURRENT' | 'OUTDATED' | 'SUPERSEDED' | 'UNKNOWN' = isOutdated
              ? 'OUTDATED'
              : rec.standard.status === 'Current'
              ? 'CURRENT'
              : rec.standard.status === 'Superseded'
              ? 'SUPERSEDED'
              : 'UNKNOWN';

            return (
              <div
                key={rec.standard.id}
                style={{
                  padding: '1.25rem',
                  background: '#ffffff',
                  border: `1px solid ${statusType === 'OUTDATED' || statusType === 'SUPERSEDED' ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: 12,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
                        {rec.standard.standardNumber} : {rec.standard.version}
                      </span>
                      <span
                        className={`badge ${
                          statusType === 'CURRENT'
                            ? 'badge-green'
                            : statusType === 'OUTDATED'
                            ? 'badge-amber'
                            : statusType === 'SUPERSEDED'
                            ? 'badge-red'
                            : 'badge-gray'
                        }`}
                      >
                        Status: {statusType}
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
                      Version History
                    </button>
                    <Link
                      href={`/compare?std1=${rec.standard.id}`}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Scale size={13} />
                      Compare
                    </Link>
                  </div>
                </div>

                {/* ── TIMELINE DISPLAY ── */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', marginBottom: '0.875rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                    REVISION & AMENDMENT TIMELINE
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Previous version */}
                    {rec.standard.previousVersion && (
                      <>
                        <div style={{ padding: '0.5rem 0.85rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>PREVIOUS EDITION</div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>
                            {rec.standard.standardNumber}:{rec.standard.previousYear}
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94a3b8" />
                      </>
                    )}

                    {/* Amendments */}
                    {rec.standard.amendmentDetails?.map((amd) => (
                      <div key={amd.number} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem 0.85rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#b45309' }}>AMENDMENT {amd.number}</div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#78350f' }}>
                            Year {amd.year}
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94a3b8" />
                      </div>
                    ))}

                    {/* Current indexed version */}
                    <div style={{ padding: '0.5rem 0.85rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a' }}>CURRENT INDEXED VERSION</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace' }}>
                        {rec.standard.standardNumber}:{rec.standard.version}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Box */}
                <div style={{ padding: '0.875rem 1rem', background: isOutdated ? '#fffbeb' : '#f0fdf4', border: `1px solid ${isOutdated ? '#fde68a' : '#bbf7d0'}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, color: isOutdated ? '#b45309' : '#15803d' }}>
                      {isOutdated ? <AlertTriangle size={16} color="#d97706" /> : <CheckCircle size={16} color="#16a34a" />}
                      <span>Tender Version: {isOutdated ? `${rec.standard.standardNumber}:${rec.standard.previousYear}` : `${rec.standard.standardNumber}:${rec.standard.version}`}</span>
                      <span>|</span>
                      <span>Current Indexed Version: {rec.standard.standardNumber}:{rec.standard.version}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: isOutdated ? '#78350f' : '#166534', marginTop: 4 }}>
                    <strong>Action:</strong> {isOutdated ? `Review and update reference in tender document from ${rec.standard.previousYear} to ${rec.standard.version} edition.` : 'Reference is up-to-date. No version update required.'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {profileStandard && (
        <StandardProfileModal standard={profileStandard} onClose={() => setProfileStandard(null)} />
      )}
    </div>
  );
}
