'use client';

import { CertificationResult } from '@/types';
import { ShieldCheck, CheckCircle, AlertTriangle, HelpCircle, FileText, ExternalLink } from 'lucide-react';

interface Props { certifications: CertificationResult[]; }

const STATUS_CONFIG: Record<string, { badge: string; icon: any; color: string }> = {
  Applicable: { badge: 'badge-green', icon: CheckCircle, color: '#16a34a' },
  'Not Applicable': { badge: 'badge-gray', icon: HelpCircle, color: '#64748b' },
  'Verify Required': { badge: 'badge-amber', icon: AlertTriangle, color: '#d97706' },
};

export default function CertificationChecker({ certifications }: Props) {
  return (
    <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <ShieldCheck size={22} color="#1d4ed8" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Certification & Quality Mark Information
          </h2>
        </div>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Identifies applicable mandatory and voluntary Quality Control Orders (QCOs), BIS ISI marking schemes, CRS registration, and GeM portal compliance.
      </p>

      {certifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {certifications.map((cert) => {
            const cfg = STATUS_CONFIG[cert.status] || STATUS_CONFIG['Verify Required'];
            const Icon = cfg.icon;
            return (
              <div
                key={cert.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.125rem 1.25rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: `${cfg.color}15`,
                    border: `1px solid ${cfg.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={cfg.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                      {cert.name}
                    </span>
                    <span className={`badge ${cfg.badge}`}>● {cert.status}</span>
                    {cert.verificationRequired && (
                      <span className="badge badge-amber">Verification Recommended</span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.7875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Issuing Authority: <strong style={{ color: '#334155' }}>{cert.body}</strong>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#334155', margin: '0 0 0.5rem 0', lineHeight: 1.55 }}>
                    {cert.applicabilityReason || 'Certification information retrieved from available regulatory dataset.'}
                  </p>

                  <div style={{ fontSize: '0.725rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={12} color="#1d4ed8" />
                    Source: Quality Control Orders (QCO) Gazette & BIS License Registry
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 10, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          Certification information not available in current dataset.
        </div>
      )}

      {/* Human Review Disclaimer */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.875rem 1rem',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 10,
          fontSize: '0.75rem',
          color: '#92400e',
          lineHeight: 1.6,
        }}
      >
        <strong>Notice:</strong> AI-generated analysis is provided for assistance and should be verified against the applicable current official standard and authoritative source. Do not rely solely on automated outputs for legal compliance determinations.
      </div>
    </div>
  );
}
