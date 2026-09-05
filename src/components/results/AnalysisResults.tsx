'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { ArrowLeft, Download, Plus, AlertTriangle } from 'lucide-react';
import RequirementSummary from './RequirementSummary';
import StandardCard from './StandardCard';
import ExplainPanel from './ExplainPanel';
import StandardsGraph from './StandardsGraph';
import VersionChecker from './VersionChecker';
import TenderAudit from './TenderAudit';
import ReadinessScore from './ReadinessScore';
import CertificationChecker from './CertificationChecker';
import SpecificationModal from '../specification/SpecificationModal';
import { Recommendation } from '@/types';

interface Props {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

const SECTION_TABS = [
  { id: 'standards', label: '📋 Recommended Standards' },
  { id: 'graph', label: '🔗 Relationship Graph' },
  { id: 'versions', label: '🕒 Version Check' },
  { id: 'audit', label: '⚠️ Gap Analysis' },
  { id: 'certification', label: '🛡️ Certifications' },
];

export default function AnalysisResults({ result, onNewAnalysis }: Props) {
  const [activeSection, setActiveSection] = useState('standards');
  const [explainRec, setExplainRec] = useState<Recommendation | null>(null);
  const [showSpec, setShowSpec] = useState(false);
  const [selectedStandards, setSelectedStandards] = useState<string[]>(
    result.recommendations.slice(0, 3).map((r) => r.standard.id)
  );

  const toggleSelect = (id: string) => {
    setSelectedStandards((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const issueCount = result.issues.length;

  return (
    <div>
      {/* ── Top Bar ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn-ghost" onClick={onNewAnalysis} style={{ gap: '0.375rem' }}>
          <ArrowLeft size={14} />
          New Analysis
        </button>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            id="generate-spec-btn"
            className="btn-secondary"
            onClick={() => setShowSpec(true)}
          >
            <Plus size={14} />
            Generate Specification
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowSpec(true)}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── Requirement Summary ───────────────────────────── */}
      <RequirementSummary requirement={result.requirement} />

      {/* ── Score + Issue count summary ───────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.875rem',
          marginBottom: '1.25rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: result.readinessScore.total >= 80 ? '#10b981' : result.readinessScore.total >= 60 ? '#f59e0b' : '#ef4444' }}>
            {result.readinessScore.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Readiness Score / 100</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa' }}>
            {result.recommendations.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standards Identified</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: issueCount > 0 ? '#f59e0b' : '#10b981' }}>
            {issueCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issues Detected</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa' }}>
            {result.certifications.filter((c) => c.applicable).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Certifications Applicable</div>
        </div>
      </div>

      {/* ── Section Tabs ──────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.25rem',
          overflowX: 'auto',
          paddingBottom: 1,
        }}
      >
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: '0.625rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeSection === tab.id ? '#3b82f6' : 'transparent'}`,
              color: activeSection === tab.id ? '#60a5fa' : 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: activeSection === tab.id ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
          >
            {tab.label}
            {tab.id === 'audit' && issueCount > 0 && (
              <span
                style={{
                  marginLeft: '0.375rem',
                  background: '#f59e0b',
                  color: '#000',
                  borderRadius: 10,
                  fontSize: '0.65rem',
                  padding: '0 5px',
                  fontWeight: 700,
                }}
              >
                {issueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Section Content ───────────────────────────────── */}
      {activeSection === 'standards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {result.recommendations.map((rec) => (
            <StandardCard
              key={rec.standard.id}
              recommendation={rec}
              selected={selectedStandards.includes(rec.standard.id)}
              onSelect={() => toggleSelect(rec.standard.id)}
              onExplain={() => setExplainRec(rec)}
              onAddToSpec={() => {
                if (!selectedStandards.includes(rec.standard.id)) {
                  toggleSelect(rec.standard.id);
                }
              }}
            />
          ))}
          {result.recommendations.length === 0 && (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No standards matched the given requirements. Try broadening your description.
            </div>
          )}
        </div>
      )}

      {activeSection === 'graph' && (
        <StandardsGraph
          recommendations={result.recommendations}
          mainStandardId={result.recommendations[0]?.standard.id}
        />
      )}

      {activeSection === 'versions' && (
        <VersionChecker recommendations={result.recommendations} />
      )}

      {activeSection === 'audit' && (
        <>
          <ReadinessScore score={result.readinessScore} />
          <div style={{ marginTop: '1.25rem' }}>
            <TenderAudit issues={result.issues} />
          </div>
        </>
      )}

      {activeSection === 'certification' && (
        <CertificationChecker certifications={result.certifications} />
      )}

      {/* ── Explainable AI Panel ──────────────────────────── */}
      {explainRec && (
        <ExplainPanel
          recommendation={explainRec}
          onClose={() => setExplainRec(null)}
        />
      )}

      {/* ── Specification Modal ───────────────────────────── */}
      {showSpec && (
        <SpecificationModal
          result={result}
          selectedStandardIds={selectedStandards}
          onClose={() => setShowSpec(false)}
        />
      )}

      {/* Disclaimer */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 8,
          display: 'flex',
          gap: '0.625rem',
          alignItems: 'flex-start',
        }}
      >
        <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.72rem', color: '#fbbf24', margin: 0, lineHeight: 1.6 }}>
          AI-generated recommendation. Verify applicable standards, current editions, amendments, and certification requirements against official BIS sources before finalizing procurement documents.
        </p>
      </div>
    </div>
  );
}
