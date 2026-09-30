'use client';

import { useState } from 'react';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { Standard } from '@/types';
import { Scale, Eye, Check, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';

interface Props {
  initialStd1Id?: string;
  initialStd2Id?: string;
}

export default function CompareStandards({ initialStd1Id, initialStd2Id }: Props) {
  const [std1Id, setStd1Id] = useState<string>(initialStd1Id || DEMO_STANDARDS[0]?.id || '');
  const [std2Id, setStd2Id] = useState<string>(
    initialStd2Id || DEMO_STANDARDS[1]?.id || DEMO_STANDARDS[0]?.id || ''
  );

  const std1 = DEMO_STANDARDS.find((s) => s.id === std1Id);
  const std2 = DEMO_STANDARDS.find((s) => s.id === std2Id);

  const unavailableMsg = 'Not available in current dataset.';

  const isDiff = (val1: any, val2: any) => {
    if (!val1 && !val2) return false;
    return String(val1).trim().toLowerCase() !== String(val2).trim().toLowerCase();
  };

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      {/* Selector Card */}
      <div className="glass-card-bright" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
          <Scale size={20} color="#1d4ed8" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Compare Indian Standards
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.375rem' }}>
              Standard A
            </label>
            <select
              className="input-field"
              value={std1Id}
              onChange={(e) => setStd1Id(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.875rem', fontWeight: 600 }}
            >
              {DEMO_STANDARDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.standardNumber} — {s.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1.25rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRightLeft size={18} color="#1d4ed8" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7875rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.375rem' }}>
              Standard B
            </label>
            <select
              className="input-field"
              value={std2Id}
              onChange={(e) => setStd2Id(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.875rem', fontWeight: 600 }}
            >
              {DEMO_STANDARDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.standardNumber} — {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {std1 && std2 ? (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0, border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.25rem', width: '22%', fontSize: '0.8125rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Attribute
                </th>
                <th style={{ padding: '1rem 1.25rem', width: '39%', background: '#eff6ff' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
                    {std1.standardNumber}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2, lineHeight: 1.3 }}>
                    {std1.title}
                  </div>
                </th>
                <th style={{ padding: '1rem 1.25rem', width: '39%', background: '#f0fdf4' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace' }}>
                    {std2.standardNumber}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2, lineHeight: 1.3 }}>
                    {std2.title}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row: Status */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Status
                </td>
                <td style={{ padding: '0.875rem 1.25rem', background: isDiff(std1.status, std2.status) ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                  <span className="badge badge-green">● {std1.status}</span>
                </td>
                <td style={{ padding: '0.875rem 1.25rem', background: isDiff(std1.status, std2.status) ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                  <span className="badge badge-green">● {std2.status}</span>
                </td>
              </tr>

              {/* Row: Version & Revision Year */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Current Version
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {std1.version} (Published: {std1.publicationYear})
                  {std1.previousVersion && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      Previous: {std1.previousVersion}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {std2.version} (Published: {std2.publicationYear})
                  {std2.previousVersion && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      Previous: {std2.previousVersion}
                    </div>
                  )}
                </td>
              </tr>

              {/* Row: Standard Category & Type */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Category & Type
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.85rem' }}>
                  <span className="badge badge-blue">{std1.category}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    Type: {std1.standardType || 'Product Specification'}
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.85rem' }}>
                  <span className="badge badge-blue">{std2.category}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    Type: {std2.standardType || 'Product Specification'}
                  </div>
                </td>
              </tr>

              {/* Row: Scope */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Scope
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                  {std1.scope || unavailableMsg}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                  {std2.scope || unavailableMsg}
                </td>
              </tr>

              {/* Row: Technical Requirements */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Requirements
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                  {std1.requirementsSummary && std1.requirementsSummary.length > 0 ? (
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                      {std1.requirementsSummary.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b' }}>{std1.description}</span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                  {std2.requirementsSummary && std2.requirementsSummary.length > 0 ? (
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                      {std2.requirementsSummary.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b' }}>{std2.description}</span>
                  )}
                </td>
              </tr>

              {/* Row: Testing Provisions */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Testing
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                  {std1.testingRequirements && std1.testingRequirements.length > 0 ? (
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                      {std1.testingRequirements.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b' }}>{unavailableMsg}</span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                  {std2.testingRequirements && std2.testingRequirements.length > 0 ? (
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                      {std2.testingRequirements.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b' }}>{unavailableMsg}</span>
                  )}
                </td>
              </tr>

              {/* Row: Amendments */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Amendments
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                  <span className="badge badge-amber">{std1.amendments} Amendment(s)</span>
                  {std1.amendmentDetails && (
                    <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: 4 }}>
                      {std1.amendmentDetails.map((a) => `Amd ${a.number} (${a.year})`).join(', ')}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                  <span className="badge badge-amber">{std2.amendments} Amendment(s)</span>
                  {std2.amendmentDetails && (
                    <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: 4 }}>
                      {std2.amendmentDetails.map((a) => `Amd ${a.number} (${a.year})`).join(', ')}
                    </div>
                  )}
                </td>
              </tr>

              {/* Row: Certification */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Certification
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                  {std1.certificationRequired ? (
                    <span className="badge badge-green">BIS ISI Certification Required</span>
                  ) : (
                    <span className="badge badge-gray">Not Mandated</span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                  {std2.certificationRequired ? (
                    <span className="badge badge-green">BIS ISI Certification Required</span>
                  ) : (
                    <span className="badge badge-gray">Not Mandated</span>
                  )}
                </td>
              </tr>

              {/* Row: BIS External Links */}
              <tr>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                  Official Portal
                </td>
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <a
                    href={getBisStandardUrl(std1.standardNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Eye size={12} />
                    View {std1.standardNumber} on BIS
                  </a>
                </td>
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <a
                    href={getBisStandardUrl(std2.standardNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Eye size={12} />
                    View {std2.standardNumber} on BIS
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Select two standards above to compare details.
        </div>
      )}
    </div>
  );
}
