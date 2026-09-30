'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import DocumentUploader from '@/components/common/DocumentUploader';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';
import { AlertTriangle, Sparkles, Table, FileText, CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

export default function GapAnalysisPage() {
  const { t } = useLanguage();
  const { activeProject, addHistoryRecord, createProject } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [customTenderText, setCustomTenderText] = useState('');

  async function handleRunAudit(customText?: string) {
    setAnalyzing(true);
    setResult(null);

    const inputText = customText || customTenderText || activeProject?.rawInputText || 'General Procurement Requirement Tender';
    const data = {
      product: activeProject?.extractedRequirements?.product.value || activeProject?.name || 'Tender Audit Requirement',
      purpose: activeProject?.extractedRequirements?.application.value || 'Gap Analysis Audit',
      technicalRequirements: inputText,
      environment: activeProject?.extractedRequirements?.material.value || 'Standard',
      industry: activeProject?.extractedRequirements?.otherRequirements.value || 'Public Sector',
      rawInput: inputText,
    };

    const res = await runFullAnalysis(data, 'upload');
    saveToHistory(res);

    if (activeProject) {
      addHistoryRecord({
        projectId: activeProject.id,
        projectName: activeProject.name,
        analysisType: 'Gap Analysis',
        status: 'Completed',
        language: 'English',
        inputSource: 'Gap Analysis Audit',
        summary: `Audited ${res.gapTable.length} parameters and identified ${res.issues.length} potential compliance gaps.`,
        result: res,
      });
    }

    setResult(res);
    setAnalyzing(false);
  }

  const handleExtractedText = (extractedText: string, fileName: string) => {
    setCustomTenderText(extractedText);
    createProject(fileName.replace(/\.[^/.]+$/, ''), extractedText);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'MATCH':
        return <span className="badge badge-green">✓ MATCH</span>;
      case 'MISSING':
        return <span className="badge badge-red">⚠ MISSING</span>;
      case 'AMBIGUOUS':
        return <span className="badge badge-amber">⚠ AMBIGUOUS</span>;
      case 'OUTDATED':
        return <span className="badge badge-red">❌ OUTDATED</span>;
      default:
        return <span className="badge badge-blue">ℹ REVIEW</span>;
    }
  };

  return (
    <AppShell title={t('gapAnalysis') || "Gap Analysis"} subtitle="Automated detection of specification gaps, outdated standards, and compliance risks">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        {!result && !analyzing && (
          <>
            {/* Global Project Workspace Banner */}
            <RequirementWorkspace onAnalyze={() => handleRunAudit()} showAnalyzeBtn />

            {/* Manual Input / Document Upload Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FileText size={18} color="#2563eb" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Paste Tender / Requirement for Gap Audit
                  </h3>
                </div>
                <textarea
                  rows={5}
                  placeholder="Paste tender requirements, materials, capacities, testing clauses..."
                  value={customTenderText}
                  onChange={(e) => setCustomTenderText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    color: '#1e293b',
                    marginBottom: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={() => handleRunAudit(customTenderText)}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  <Sparkles size={16} /> Run Gap Analysis Audit
                </button>
              </div>

              <div>
                <DocumentUploader onExtractedText={handleExtractedText} />
              </div>
            </div>
          </>
        )}

        {analyzing && <ProcessingAnimation onComplete={() => {}} />}

        {result && !analyzing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Audit Results: {result.requirement.product}
              </h3>
              <button className="btn-ghost" onClick={() => setResult(null)}>
                Run Another Gap Audit
              </button>
            </div>

            {/* Gap Analysis Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Parameters Checked</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{result.gapTable.length}</div>
              </div>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Matches</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: 2 }}>
                  {result.gapTable.filter((r) => r.status === 'MATCH').length}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Missing Clauses</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', marginTop: 2 }}>
                  {result.gapTable.filter((r) => r.status === 'MISSING').length}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Needs Review</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', marginTop: 2 }}>
                  {result.gapTable.filter((r) => r.status === 'AMBIGUOUS' || r.status === 'REVIEW').length}
                </div>
              </div>
            </div>

            {/* Gap Analysis Table */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Table size={18} color="#1d4ed8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  TENDER REQUIREMENT vs STANDARD REQUIREMENT
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Parameter</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Tender Value</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Standard Requirement</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#475569' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.gapTable.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>{row.parameter}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{row.tenderValue}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{row.standardRequirement}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{statusBadge(row.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
