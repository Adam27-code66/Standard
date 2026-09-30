'use client';

import { useState } from 'react';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { Standard } from '@/types';
import { Scale, Eye, ArrowRightLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';

import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';

interface Props {
  initialStd1Id?: string;
  initialStd2Id?: string;
}

export default function CompareStandards({ initialStd1Id, initialStd2Id }: Props) {
  const { t } = useLanguage();
  const { activeProject } = useProject();

  const projectRecs = activeProject?.lastAnalysis?.recommendations || [];
  const defaultStd1 = projectRecs[0]?.standard.id || initialStd1Id || DEMO_STANDARDS[0]?.id || '';
  const defaultStd2 = projectRecs[1]?.standard.id || initialStd2Id || DEMO_STANDARDS[1]?.id || DEMO_STANDARDS[0]?.id || '';

  const [std1Id, setStd1Id] = useState<string>(defaultStd1);
  const [std2Id, setStd2Id] = useState<string>(defaultStd2);

  const std1 = DEMO_STANDARDS.find((s) => s.id === std1Id);
  const std2 = DEMO_STANDARDS.find((s) => s.id === std2Id);

  const unavailableMsg = 'Not available in current indexed data.';

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      {/* Project Workspace Banner */}
      <RequirementWorkspace />

      {/* Selector Card */}
      <div className="glass-card-bright" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 16 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overlapping & Differences Banners */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', marginBottom: '0.35rem' }}>
                ✓ OVERLAPPING REQUIREMENTS
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.5 }}>
                Both standards share common underlying sector testing norms, Quality Control Order (QCO) applicability, and material testing procedures.
              </div>
            </div>

            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '1rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#be123c', marginBottom: '0.35rem' }}>
                ⚠ KEY DIFFERENCES
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#9f1239', lineHeight: 1.5 }}>
                Different product scopes ({std1.category} vs {std2.category}), specific dimensional tolerances, and mandatory ISI mark schemes.
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden', padding: 0, border: '1px solid #e2e8f0', borderRadius: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.25rem', width: '22%', fontSize: '0.8125rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Parameter
                  </th>
                  <th style={{ padding: '1rem 1.25rem', width: '39%', background: '#eff6ff' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
                      {std1.standardNumber}:{std1.version}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2, lineHeight: 1.3 }}>
                      {std1.title}
                    </div>
                  </th>
                  <th style={{ padding: '1rem 1.25rem', width: '39%', background: '#f0fdf4' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace' }}>
                      {std2.standardNumber}:{std2.version}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginTop: 2, lineHeight: 1.3 }}>
                      {std2.title}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Scope */}
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

                {/* Material */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Material Provisions
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std1.requirementsSummary?.find((r) => r.toLowerCase().includes('material') || r.toLowerCase().includes('ss')) || std1.description}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std2.requirementsSummary?.find((r) => r.toLowerCase().includes('material') || r.toLowerCase().includes('ss')) || std2.description}
                  </td>
                </tr>

                {/* Application */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Application Domain
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std1.industry.join(', ')}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std2.industry.join(', ')}
                  </td>
                </tr>

                {/* Testing */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Testing Requirements
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std1.testingRequirements ? std1.testingRequirements.join(', ') : unavailableMsg}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
                    {std2.testingRequirements ? std2.testingRequirements.join(', ') : unavailableMsg}
                  </td>
                </tr>

                {/* Certification */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Certification Scheme
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                    {std1.certificationRequired ? <span className="badge badge-green">Mandatory BIS ISI Mark</span> : <span className="badge badge-gray">Voluntary</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                    {std2.certificationRequired ? <span className="badge badge-green">Mandatory BIS ISI Mark</span> : <span className="badge badge-gray">Voluntary</span>}
                  </td>
                </tr>

                {/* Version & Amendments */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Version & Amendments
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                    Edition {std1.version} ({std1.publicationYear}) · {std1.amendments} Amendment(s)
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem' }}>
                    Edition {std2.version} ({std2.publicationYear}) · {std2.amendments} Amendment(s)
                  </td>
                </tr>

                {/* Official Links */}
                <tr>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }}>
                    Official Link
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <a href={getBisStandardUrl(std1.standardNumber)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                      <Eye size={12} /> View {std1.standardNumber} on BIS
                    </a>
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <a href={getBisStandardUrl(std2.standardNumber)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                      <Eye size={12} /> View {std2.standardNumber} on BIS
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Select two standards above to view transparent side-by-side comparison.
        </div>
      )}
    </div>
  );
}
