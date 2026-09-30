'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import DocumentUploader from '@/components/common/DocumentUploader';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import AnalysisResults from '@/components/results/AnalysisResults';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';
import { FileText, Search, Sparkles, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TenderPage() {
  const { t } = useLanguage();
  const { activeProject, addHistoryRecord, createProject } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [pastedTender, setPastedTender] = useState('');

  async function handleRunAnalysis(customInput?: string) {
    setAnalyzing(true);
    setResult(null);

    const inputText = customInput || pastedTender || activeProject?.rawInputText || 'General Tender Specification Requirement';
    
    const data = {
      product: activeProject?.extractedRequirements?.product.value || activeProject?.name || 'Tender Item Requirement',
      purpose: activeProject?.extractedRequirements?.application.value || 'Public Procurement Tender',
      technicalRequirements: inputText,
      environment: activeProject?.extractedRequirements?.material.value || 'Standard',
      industry: activeProject?.extractedRequirements?.otherRequirements.value || 'Public Sector / Government',
      rawInput: inputText,
    };

    const res = await runFullAnalysis(data, 'upload');
    saveToHistory(res);
    
    if (activeProject) {
      addHistoryRecord({
        projectId: activeProject.id,
        projectName: activeProject.name,
        analysisType: 'Tender Audit',
        status: 'Completed',
        language: 'English',
        inputSource: 'Tender Document / Project Workspace',
        summary: `Tender audit extracted ${res.gapTable.length} technical parameters and evaluated ${res.recommendations.length} IS standards.`,
        result: res,
      });
    }

    setResult(res);
    setAnalyzing(false);
  }

  const handleExtractedText = (extractedText: string, fileName: string) => {
    setPastedTender(extractedText);
    createProject(fileName.replace(/\.[^/.]+$/, ''), extractedText);
  };

  return (
    <AppShell title={t('tenderAnalyzer') || "Tender Analyzer"} subtitle="Analyze procurement tenders for Indian Standards compliance & gaps">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {!analyzing && !result && (
          <>
            {/* Project Input Workspace */}
            <RequirementWorkspace onAnalyze={() => handleRunAnalysis()} showAnalyzeBtn />

            {/* Direct Input & Tender Uploader Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Option A: Paste Tender Text */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FileText size={18} color="#2563eb" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Option A: Paste Tender Text
                  </h3>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste raw tender clauses, technical specifications, or eligibility criteria..."
                  value={pastedTender}
                  onChange={(e) => setPastedTender(e.target.value)}
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
                  onClick={() => handleRunAnalysis(pastedTender)}
                  disabled={!pastedTender.trim() && !activeProject}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  <Sparkles size={16} /> Analyze Pasted Tender
                </button>
              </div>

              {/* Option B: Upload Tender File */}
              <div>
                <DocumentUploader onExtractedText={handleExtractedText} />
              </div>
            </div>

            {/* Structured Clause Inspection Preview */}
            {activeProject && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#16a34a" /> Extracted Tender Clause Structure
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
                  <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tender Scope</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                      {activeProject.extractedRequirements?.product.value || 'Water Storage Supply'}
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Material Clause</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                      {activeProject.extractedRequirements?.material.value || 'Grade 304 Stainless Steel'}
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Testing & Inspection</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                      Hydrostatic & Weld Testing Required
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Certification</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                      Mandatory BIS ISI Mark
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {analyzing && <ProcessingAnimation onComplete={() => {}} />}
        {result && !analyzing && <AnalysisResults result={result} onNewAnalysis={() => { setResult(null); }} />}
      </div>
    </AppShell>
  );
}
