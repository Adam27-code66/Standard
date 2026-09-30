'use client';

import { useState } from 'react';
import { TenderIssue } from '@/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronDown, ChevronUp, RotateCcw, HelpCircle, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

interface Props { issues: TenderIssue[]; }

const SEVERITY_CONFIG = {
  Critical: { color: '#ef4444', bg: '#fef2f2', border: '#fecdd3', icon: AlertCircle },
  High: { color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', icon: AlertTriangle },
  Medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: AlertTriangle },
  Low: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: Info },
  Info: { color: '#64748b', bg: '#f8fafc', border: '#cbd5e1', icon: Info },
};

export default function TenderAudit({ issues }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group issues into the 4 SIH gap analysis categories
  const missingCount = issues.filter(
    (i) => i.type === 'Missing Test Standard' || i.type === 'Missing Safety Requirement' || i.type === 'Incomplete Specification'
  ).length;

  const outdatedCount = issues.filter((i) => i.type === 'Outdated Standard' || i.type === 'Version Conflict').length;

  const ambiguousCount = issues.filter((i) => i.type === 'Incomplete Specification' || i.type === 'Missing Test Standard').length;

  const certGapCount = issues.filter((i) => i.type === 'Missing Certification').length;

  // Filter issues according to selected category card
  const filteredIssues = selectedCategory
    ? issues.filter((i) => {
        if (selectedCategory === 'MISSING') return i.type === 'Missing Test Standard' || i.type === 'Missing Safety Requirement' || i.type === 'Incomplete Specification';
        if (selectedCategory === 'OUTDATED') return i.type === 'Outdated Standard' || i.type === 'Version Conflict';
        if (selectedCategory === 'AMBIGUOUS') return i.type === 'Incomplete Specification' || i.type === 'Missing Test Standard';
        if (selectedCategory === 'CERTIFICATION') return i.type === 'Missing Certification';
        return true;
      })
    : issues;

  return (
    <div className="glass-card-bright" style={{ padding: '1.5rem', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Tender Specification Gap Analysis
        </h2>
        {selectedCategory && (
          <button
            className="btn-ghost"
            onClick={() => setSelectedCategory(null)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
          >
            Show All ({issues.length})
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Automated scan identifies missing standards, outdated editions, ambiguous requirements, and certification gaps. Click any card to inspect details.
      </p>

      {/* ── 4 CLICKABLE GAP CATEGORY CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Missing Requirements */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'MISSING' ? null : 'MISSING')}
          style={{
            background: selectedCategory === 'MISSING' ? '#eff6ff' : '#ffffff',
            border: `2px solid ${selectedCategory === 'MISSING' ? '#1d4ed8' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} color="#dc2626" />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{missingCount}</span>
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            MISSING REQUIREMENTS
          </div>
          <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            View Details <ArrowRight size={11} />
          </div>
        </button>

        {/* Card 2: Outdated Standards */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'OUTDATED' ? null : 'OUTDATED')}
          style={{
            background: selectedCategory === 'OUTDATED' ? '#eff6ff' : '#ffffff',
            border: `2px solid ${selectedCategory === 'OUTDATED' ? '#1d4ed8' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <RotateCcw size={18} color="#d97706" />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{outdatedCount}</span>
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            OUTDATED STANDARDS
          </div>
          <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            View Details <ArrowRight size={11} />
          </div>
        </button>

        {/* Card 3: Ambiguous Requirements */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'AMBIGUOUS' ? null : 'AMBIGUOUS')}
          style={{
            background: selectedCategory === 'AMBIGUOUS' ? '#eff6ff' : '#ffffff',
            border: `2px solid ${selectedCategory === 'AMBIGUOUS' ? '#1d4ed8' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <HelpCircle size={18} color="#7c3aed" />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{ambiguousCount}</span>
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            AMBIGUOUS REQUIREMENTS
          </div>
          <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            View Details <ArrowRight size={11} />
          </div>
        </button>

        {/* Card 4: Certification Gaps */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'CERTIFICATION' ? null : 'CERTIFICATION')}
          style={{
            background: selectedCategory === 'CERTIFICATION' ? '#eff6ff' : '#ffffff',
            border: `2px solid ${selectedCategory === 'CERTIFICATION' ? '#1d4ed8' : '#e2e8f0'}`,
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <ShieldAlert size={18} color="#16a34a" />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{certGapCount}</span>
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            CERTIFICATION GAPS
          </div>
          <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            View Details <ArrowRight size={11} />
          </div>
        </button>
      </div>

      {/* ── DETAILED ISSUES LIST ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {filteredIssues.map((issue) => {
          const cfg = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.Info;
          const Icon = cfg.icon;

          return (
            <div
              key={issue.id}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 12,
                padding: '1.125rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
                <Icon size={18} color={cfg.color} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  {issue.type}
                </span>
                <span
                  className={`badge ${issue.severity === 'Critical' || issue.severity === 'High' ? 'badge-red' : issue.severity === 'Medium' ? 'badge-amber' : 'badge-blue'}`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {issue.severity} Severity
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0 0 0.625rem 0', lineHeight: 1.55 }}>
                {issue.description}
              </p>

              {issue.detectedReference && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Detected Reference: <strong style={{ color: '#d97706', fontFamily: 'monospace' }}>{issue.detectedReference}</strong>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.625rem 0.85rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                }}
              >
                <CheckCircle size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8125rem', color: '#15803d', lineHeight: 1.5 }}>
                  <strong>Recommended Action:</strong> {issue.recommendedAction}
                </div>
              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1' }}>
            No issues found under this category filter.
          </div>
        )}
      </div>
    </div>
  );
}
