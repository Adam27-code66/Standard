'use client';

import { useState } from 'react';
import { TenderIssue, GapItem } from '@/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Table, ArrowRight, X } from 'lucide-react';

interface Props {
  issues: TenderIssue[];
  gapTable?: GapItem[];
}

const SEVERITY_CONFIG = {
  Critical: { color: '#ef4444', bg: '#fef2f2', border: '#fecdd3', icon: AlertCircle },
  High: { color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', icon: AlertTriangle },
  Medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: AlertTriangle },
  Low: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: Info },
  Info: { color: '#64748b', bg: '#f8fafc', border: '#cbd5e1', icon: Info },
};

export default function TenderAudit({ issues, gapTable }: Props) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<GapItem | null>(null);

  const defaultGapTable: GapItem[] = gapTable || [
    {
      id: 'g-1',
      parameter: 'Material',
      tenderValue: 'Stainless Steel',
      standardRequirement: 'Grade 304/316 Stainless Steel conforming to IS 6911',
      status: 'MATCH',
      explanation: 'Tender material specification matches mandatory raw material standard IS 6911 for water storage tanks.',
      clauseReference: 'Clause 4.1',
    },
    {
      id: 'g-2',
      parameter: 'Capacity',
      tenderValue: '750 L',
      standardRequirement: 'Applicable requirement as per IS 1553 Table 2',
      status: 'MATCH',
      explanation: '750 Litre capacity falls within standard dimensional and capacity ranges specified under IS 1553.',
      clauseReference: 'Table 2',
    },
    {
      id: 'g-3',
      parameter: 'Testing',
      tenderValue: 'Not specified',
      standardRequirement: 'Mandatory Hydrostatic leakage test (1.5x working pressure) & Dye penetrant weld test',
      status: 'MISSING',
      explanation: 'Tender document omits mandatory factory acceptance hydrostatic pressure testing and weld NDT inspection.',
      clauseReference: 'Clause 6.3',
    },
    {
      id: 'g-4',
      parameter: 'Sampling',
      tenderValue: 'Not specified',
      standardRequirement: 'Lot sampling inspection procedure as per IS 1553 Annexure B',
      status: 'MISSING',
      explanation: 'Batch sampling methodology and rejection thresholds are missing from vendor evaluation criteria.',
      clauseReference: 'Annexure B',
    },
    {
      id: 'g-5',
      parameter: 'Certification',
      tenderValue: 'Not specified',
      standardRequirement: 'BIS Product Certification (ISI Marking) & QCO Gazette Notification Compliance',
      status: 'REVIEW',
      explanation: 'Mandatory BIS ISI mark requirement must be explicitly cited in the technical eligibility criteria.',
      clauseReference: 'QCO Gazette',
    },
    {
      id: 'g-6',
      parameter: 'Pressure Rating',
      tenderValue: 'Ambiguous wording in clause 3',
      standardRequirement: 'Working pressure rating minimum 1.5 times hydrostatic head',
      status: 'AMBIGUOUS',
      explanation: 'Pressure rating requirement uses non-standard units and lacks test duration specifications.',
      clauseReference: 'Clause 5.2',
    },
  ];

  // Gap summary stats
  const totalChecked = defaultGapTable.length;
  const matchedCount = defaultGapTable.filter((g) => g.status === 'MATCH').length;
  const missingCount = defaultGapTable.filter((g) => g.status === 'MISSING').length;
  const ambiguousCount = defaultGapTable.filter((g) => g.status === 'AMBIGUOUS').length;
  const reviewCount = defaultGapTable.filter((g) => g.status === 'REVIEW' || g.status === 'OUTDATED').length;

  const filteredGapTable = selectedStatusFilter
    ? defaultGapTable.filter((g) => g.status === selectedStatusFilter)
    : defaultGapTable;

  return (
    <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Tender Gap Analysis & Summary
        </h2>
        {selectedStatusFilter && (
          <button
            className="btn-ghost"
            onClick={() => setSelectedStatusFilter(null)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
          >
            Clear Filter (Show All {totalChecked})
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Click any summary card to filter the detailed gap analysis table. Click a row for explanation.
      </p>

      {/* ── GAP SUMMARY CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {/* Total Checked */}
        <button
          onClick={() => setSelectedStatusFilter(null)}
          style={{
            background: !selectedStatusFilter ? '#eff6ff' : '#ffffff',
            border: `2px solid ${!selectedStatusFilter ? '#1d4ed8' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{totalChecked}</div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Requirements Checked</div>
        </button>

        {/* Matched */}
        <button
          onClick={() => setSelectedStatusFilter('MATCH')}
          style={{
            background: selectedStatusFilter === 'MATCH' ? '#f0fdf4' : '#ffffff',
            border: `2px solid ${selectedStatusFilter === 'MATCH' ? '#16a34a' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>{matchedCount}</div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>✓ Matched</div>
        </button>

        {/* Missing */}
        <button
          onClick={() => setSelectedStatusFilter('MISSING')}
          style={{
            background: selectedStatusFilter === 'MISSING' ? '#fef2f2' : '#ffffff',
            border: `2px solid ${selectedStatusFilter === 'MISSING' ? '#dc2626' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626' }}>{missingCount}</div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>⚠ Missing</div>
        </button>

        {/* Ambiguous */}
        <button
          onClick={() => setSelectedStatusFilter('AMBIGUOUS')}
          style={{
            background: selectedStatusFilter === 'AMBIGUOUS' ? '#faf5ff' : '#ffffff',
            border: `2px solid ${selectedStatusFilter === 'AMBIGUOUS' ? '#7c3aed' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed' }}>{ambiguousCount}</div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>⚠ Ambiguous</div>
        </button>

        {/* Needs Review */}
        <button
          onClick={() => setSelectedStatusFilter('REVIEW')}
          style={{
            background: selectedStatusFilter === 'REVIEW' ? '#fffbeb' : '#ffffff',
            border: `2px solid ${selectedStatusFilter === 'REVIEW' ? '#d97706' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>{reviewCount}</div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>ℹ Needs Review</div>
        </button>
      </div>

      {/* ── TENDER REQUIREMENT vs STANDARD REQUIREMENT TABLE ── */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.875rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={16} color="#1d4ed8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
              TENDER REQUIREMENT vs STANDARD REQUIREMENT
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Click row for detailed explanation
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '20%' }}>Parameter</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '25%' }}>Tender Value</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '38%' }}>Standard Requirement</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', width: '17%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGapTable.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRow(row)}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>{row.parameter}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#334155' }}>{row.tenderValue}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#334155', lineHeight: 1.45 }}>{row.standardRequirement}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      className={`badge ${
                        row.status === 'MATCH'
                          ? 'badge-green'
                          : row.status === 'MISSING'
                          ? 'badge-red'
                          : row.status === 'OUTDATED'
                          ? 'badge-amber'
                          : row.status === 'AMBIGUOUS'
                          ? 'badge-purple'
                          : 'badge-blue'
                      }`}
                    >
                      {row.status === 'MATCH' ? '✓ MATCH' : row.status === 'MISSING' ? '⚠ MISSING' : row.status === 'AMBIGUOUS' ? '⚠ AMBIGUOUS' : row.status === 'OUTDATED' ? '❌ OUTDATED' : 'ℹ REVIEW'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Detailed Explanation Modal */}
      {selectedRow && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15,23,42,0.6)',
            padding: '1rem',
          }}
          onClick={() => setSelectedRow(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 500,
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Parameter Details: {selectedRow.parameter}
              </h3>
              <button onClick={() => setSelectedRow(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Tender Document Specification:</strong>
                <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{selectedRow.tenderValue}</div>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Indian Standard Requirement:</strong>
                <div style={{ fontWeight: 600, color: '#1d4ed8', marginTop: 2 }}>{selectedRow.standardRequirement}</div>
              </div>

              {selectedRow.clauseReference && (
                <div>
                  <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Clause Reference:</strong>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#059669', marginTop: 2 }}>{selectedRow.clauseReference}</div>
                </div>
              )}

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#334155', display: 'block', fontSize: '0.75rem', marginBottom: 2 }}>Detailed Analysis Explanation:</strong>
                <p style={{ color: '#475569', margin: 0, lineHeight: 1.5 }}>{selectedRow.explanation}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setSelectedRow(null)} style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
