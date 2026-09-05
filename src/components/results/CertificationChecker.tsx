'use client';

import { CertificationResult } from '@/types';
import { Shield, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props { certifications: CertificationResult[]; }

const STATUS_CONFIG = {
  Applicable: { badge: 'badge-green', icon: CheckCircle, color: '#10b981' },
  'Not Applicable': { badge: 'badge-gray', icon: HelpCircle, color: '#64748b' },
  'Verify Required': { badge: 'badge-amber', icon: AlertTriangle, color: '#f59e0b' },
};

export default function CertificationChecker({ certifications }: Props) {
  return (
    <div className="glass-card-bright" style={{ padding: '1.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
        <Shield size={18} color="#60a5fa" />
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          Certification & Compliance
        </h2>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        Applicable certification and conformity requirements. Verify against official sources before procurement.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {certifications.map((cert) => {
          const cfg = STATUS_CONFIG[cert.status] || STATUS_CONFIG['Verify Required'];
          const Icon = cfg.icon;
          return (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--navy-800)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${cfg.color}15`,
                  border: `1px solid ${cfg.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cert.name}
                  </span>
                  <span className={`badge ${cfg.badge}`}>{cert.status}</span>
                  {cert.verificationRequired && (
                    <span className="badge badge-amber">Verify Required</span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                  Issuing Body: <strong style={{ color: 'var(--text-secondary)' }}>{cert.body}</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {cert.applicabilityReason}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 8,
          fontSize: '0.72rem',
          color: '#fbbf24',
          lineHeight: 1.6,
        }}
      >
        ⚠️ Certification requirements shown are AI-estimated based on product type and industry. Always verify mandatory certifications against current QCOs, BIS notifications, and other applicable regulations before finalizing tender specifications.
      </div>
    </div>
  );
}
