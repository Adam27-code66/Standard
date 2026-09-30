'use client';

import { CertificationResult } from '@/types';
import { ShieldCheck, CheckCircle, AlertTriangle, HelpCircle, FileText } from 'lucide-react';

interface Props { certifications: CertificationResult[]; }

const STATUS_CONFIG: Record<string, { badge: string; icon: any; color: string }> = {
  Applicable: { badge: 'badge-green', icon: CheckCircle, color: '#16a34a' },
  'Not Applicable': { badge: 'badge-gray', icon: HelpCircle, color: '#64748b' },
  'Verify Required': { badge: 'badge-amber', icon: AlertTriangle, color: '#d97706' },
};

export default function CertificationChecker({ certifications }: Props) {
  const defaultCerts: CertificationResult[] = certifications.length > 0 ? certifications : [
    {
      id: 'c-1',
      name: 'BIS Product Certification (ISI Mark)',
      body: 'Bureau of Indian Standards',
      applicable: true,
      applicabilityReason: 'Mandatory certification under Quality Control Order (QCO) for public health & water infrastructure equipment.',
      verificationRequired: true,
      status: 'Applicable',
      evidence: 'Gazette QCO Notification under Section 16 of BIS Act, 2016',
    },
    {
      id: 'c-2',
      name: 'Compulsory Registration Scheme (CRS)',
      body: 'Bureau of Indian Standards / MeitY',
      applicable: false,
      applicabilityReason: 'CRS scheme applies primarily to electronic IT goods. Non-electronic storage equipment is exempt.',
      verificationRequired: false,
      status: 'Not Applicable',
      evidence: 'MeitY CRS Product Schedule List',
    },
    {
      id: 'c-3',
      name: 'QCO Mandatory Gazette Notification',
      body: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      applicable: true,
      applicabilityReason: 'Potable water storage tanks installed in public institutions require mandatory QCO compliance certification.',
      verificationRequired: true,
      status: 'Applicable',
      evidence: 'Official Gazette QCO Notification',
    },
  ];

  return (
    <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <ShieldCheck size={22} color="#1d4ed8" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            CERTIFICATION REQUIREMENTS
          </h2>
        </div>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Evaluates mandatory BIS ISI Product Certification, Compulsory Registration Scheme (CRS), Hallmarking, and Quality Control Orders (QCOs).
      </p>

      {/* ── CERTIFICATION REQUIREMENTS TABLE ── */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '30%' }}>Requirement / Scheme</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '20%' }}>Status</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '50%' }}>Available Supporting Evidence</th>
              </tr>
            </thead>
            <tbody>
              {defaultCerts.map((cert) => {
                const cfg = STATUS_CONFIG[cert.status] || STATUS_CONFIG['Verify Required'];
                return (
                  <tr key={cert.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{cert.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{cert.body}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className={`badge ${cfg.badge}`}>● {cert.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#334155', lineHeight: 1.5 }}>
                      <div>{cert.applicabilityReason}</div>
                      {cert.evidence ? (
                        <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={12} />
                          Evidence: {cert.evidence}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: 4 }}>
                          Certification applicability requires verification against current official BIS information.
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      <div
        style={{
          padding: '0.875rem 1rem',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 10,
          fontSize: '0.75rem',
          color: '#92400e',
          lineHeight: 1.6,
        }}
      >
        <strong>Notice:</strong> Certification applicability requires verification against current official BIS information, QCO notifications, and official gazettes prior to issuing tenders.
      </div>
    </div>
  );
}
