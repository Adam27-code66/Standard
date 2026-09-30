'use client';

import { useState } from 'react';
import { Standard } from '@/types';
import { X, Eye, FileText, CheckCircle, AlertTriangle, ShieldCheck, GitBranch, Scale } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';
import Link from 'next/link';

interface Props {
  standard: Standard;
  onClose: () => void;
}

export default function StandardProfileModal({ standard, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'scope' | 'requirements' | 'versions' | 'amendments' | 'related' | 'testing' | 'certification'
  >('overview');

  const STATUS_BADGE: Record<string, string> = {
    Current: 'badge-green',
    Amended: 'badge-amber',
    Superseded: 'badge-red',
    Withdrawn: 'badge-red',
    'Under Revision': 'badge-amber',
    Draft: 'badge-gray',
  };

  const unavailableMsg = (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
      Not available in current dataset.
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-bright"
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: '#ffffff',
          color: '#0f172a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', background: '#f8fafc' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>
                {standard.standardNumber}
              </span>
              <span className={`badge ${STATUS_BADGE[standard.status] || 'badge-gray'}`}>
                ● {standard.status}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                Version: {standard.version}
              </span>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
              {standard.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            padding: '0.5rem 1.5rem 0',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            background: '#ffffff',
          }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'scope', label: 'Scope' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'versions', label: 'Versions' },
            { id: 'amendments', label: 'Amendments' },
            { id: 'related', label: 'Related Standards' },
            { id: 'testing', label: 'Testing' },
            { id: 'certification', label: 'Certification' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.55rem 0.85rem',
                border: 'none',
                background: 'transparent',
                borderBottom: `2.5px solid ${activeTab === tab.id ? '#1d4ed8' : 'transparent'}`,
                color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, background: '#ffffff' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Description
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {standard.description || 'Not available in current dataset.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard Type:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.standardType || 'Product Standard'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Category:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ICS Classification:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.ics || 'Not available in current dataset.'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Department:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.department || 'Not available in current dataset.'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Technical Committee:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.committee || 'Not available in current dataset.'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Publication Year:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{standard.publicationYear}</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Keywords / Sector Focus
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {standard.keywords.map((kw) => (
                    <span key={kw} className="badge badge-gray">{kw}</span>
                  ))}
                  {standard.industry.map((ind) => (
                    <span key={ind} className="badge badge-blue">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scope' && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Scope & Applicability
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.65, background: '#eff6ff', padding: '1.25rem', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                {standard.scope || 'Not available in current dataset.'}
              </p>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Key Technical Requirements
              </h4>
              {standard.requirementsSummary && standard.requirementsSummary.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {standard.requirementsSummary.map((req, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5 }}>{req}</li>
                  ))}
                </ul>
              ) : (
                unavailableMsg
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Current Edition</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d4ed8' }}>{standard.standardNumber} : {standard.version}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                  Published / Revised: {standard.publicationDate || standard.publicationYear}
                </div>
              </div>

              {standard.previousVersion ? (
                <div style={{ padding: '1rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#9f1239', marginBottom: '0.25rem' }}>Previous / Superseded Edition</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#be123c' }}>{standard.standardNumber} : {standard.previousVersion} ({standard.previousYear})</div>
                  <div style={{ fontSize: '0.75rem', color: '#881337', marginTop: 4 }}>
                    Status: Superseded by {standard.version} edition
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>No previous edition recorded in current dataset.</div>
              )}
            </div>
          )}

          {activeTab === 'amendments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Amendments & Corrigenda ({standard.amendments})
                </h4>
                {standard.lastAmendmentDate && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last amendment: {standard.lastAmendmentDate}</span>
                )}
              </div>

              {standard.amendmentDetails && standard.amendmentDetails.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {standard.amendmentDetails.map((amd) => (
                    <div key={amd.number} style={{ padding: '0.875rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                        Amendment No. {amd.number} ({amd.year})
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#78350f', marginTop: 4, fontWeight: 500 }}>
                        {amd.title}
                      </div>
                      {amd.summary && (
                        <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: 4 }}>
                          {amd.summary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : standard.amendments > 0 ? (
                <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.85rem', color: '#b45309' }}>
                  {standard.amendments} amendment(s) registered for this standard. Detailed text not available in current dataset.
                </div>
              ) : (
                <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', color: '#64748b' }}>
                  No active amendments published for this version.
                </div>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Allied & Normative Reference Standards
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                Explore interconnected standards via the <Link href={`/graph?std=${standard.id}`} style={{ color: '#1d4ed8', fontWeight: 600 }}>Interactive Standards Graph</Link>.
              </p>
              <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                Cross-referenced standards available in graph view.
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Testing & Conformance Provisions
              </h4>
              {standard.testingRequirements && standard.testingRequirements.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {standard.testingRequirements.map((test, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: '#1e293b' }}>{test}</li>
                  ))}
                </ul>
              ) : (
                unavailableMsg
              )}
            </div>
          )}

          {activeTab === 'certification' && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Certification & Quality Scheme
              </h4>
              {standard.certificationDetails ? (
                <div style={{ padding: '1.25rem', background: standard.certificationDetails.mandatory ? '#f0fdf4' : '#f8fafc', border: `1px solid ${standard.certificationDetails.mandatory ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <ShieldCheck size={18} color={standard.certificationDetails.mandatory ? '#16a34a' : '#64748b'} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: standard.certificationDetails.mandatory ? '#15803d' : '#0f172a' }}>
                      {standard.certificationDetails.scheme}
                    </span>
                    <span className={`badge ${standard.certificationDetails.mandatory ? 'badge-green' : 'badge-gray'}`}>
                      {standard.certificationDetails.mandatory ? 'Mandatory' : 'Optional / Self-Declaration'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                    {standard.certificationDetails.details}
                  </p>
                </div>
              ) : standard.certificationRequired ? (
                <div style={{ padding: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', marginBottom: 4 }}>
                    BIS Product Certification (ISI Mark) Required
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
                    Product certification body: {standard.certificationBody || 'BIS'}.
                  </p>
                </div>
              ) : (
                unavailableMsg
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href={`/compare?std1=${standard.id}`}
              className="btn-secondary"
              style={{ fontSize: '0.7875rem', padding: '0.45rem 0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Scale size={14} />
              Compare Standard
            </Link>
            <a
              href={getBisStandardUrl(standard.standardNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.7875rem', padding: '0.45rem 0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Eye size={14} />
              View on BIS Portal
            </a>
          </div>

          <button onClick={onClose} className="btn-primary" style={{ fontSize: '0.7875rem', padding: '0.45rem 1rem' }}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
