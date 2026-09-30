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
import SpecificationModal from '@/components/specification/SpecificationModal';
import { FileEdit, Sparkles, FileText, CheckCircle2, HelpCircle } from 'lucide-react';

export default function SpecificationPage() {
  const { t } = useLanguage();
  const { activeProject, addHistoryRecord, createProject } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [customSpecText, setCustomSpecText] = useState('');

  async function handleGenerate(customText?: string) {
    setAnalyzing(true);
    setResult(null);

    const text = customText || customSpecText || activeProject?.rawInputText || 'General Procurement Technical Specification';
    const data = {
      product: activeProject?.extractedRequirements?.product.value || activeProject?.name || 'Specification Product',
      purpose: activeProject?.extractedRequirements?.application.value || 'Procurement Technical Specification',
      technicalRequirements: text,
      environment: activeProject?.extractedRequirements?.material.value || 'Standard',
      industry: activeProject?.extractedRequirements?.otherRequirements.value || 'General',
      rawInput: text,
    };

    const res = await runFullAnalysis(data, 'describe');
    saveToHistory(res);

    if (activeProject) {
      addHistoryRecord({
        projectId: activeProject.id,
        projectName: activeProject.name,
        analysisType: 'Spec Assistant',
        status: 'Completed',
        language: 'English',
        inputSource: 'Specification Assistant',
        summary: `Generated structured tender specification covering 10 technical sections and ${res.recommendations.length} IS standards.`,
        result: res,
      });
    }

    setResult(res);
    setAnalyzing(false);
    setShowSpecModal(true);
  }

  const handleExtractedText = (extractedText: string, fileName: string) => {
    setCustomSpecText(extractedText);
    createProject(fileName.replace(/\.[^/.]+$/, ''), extractedText);
  };

  return (
    <AppShell title={t('specAssistant') || "Specification Assistant"} subtitle="Generate & refine 10-section tender specifications">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {!result && !analyzing && (
          <>
            {/* Global Project Input Workspace */}
            <RequirementWorkspace onAnalyze={() => handleGenerate()} showAnalyzeBtn />

            {/* Custom Input Box / Document Upload */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FileText size={18} color="#2563eb" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Paste Custom Technical Specification
                  </h3>
                </div>
                <textarea
                  rows={5}
                  placeholder="Paste your draft technical specification or requirements here..."
                  value={customSpecText}
                  onChange={(e) => setCustomSpecText(e.target.value)}
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
                  onClick={() => handleGenerate(customSpecText)}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  <Sparkles size={16} /> Generate Structured Specification
                </button>
              </div>

              <div>
                <DocumentUploader onExtractedText={handleExtractedText} />
              </div>
            </div>

            {/* Feature Overview */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.875rem' }}>
                10-Section Tender Specification Output
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                  '1. PRODUCT SCOPE',
                  '2. TECHNICAL REQUIREMENTS',
                  '3. MATERIAL SPECIFICATIONS',
                  '4. CAPACITY & DIMENSIONS',
                  '5. PERFORMANCE CRITERIA',
                  '6. MANDATORY TESTING',
                  '7. SAMPLING PROTOCOLS',
                  '8. CERTIFICATION SCHEMES',
                  '9. APPLICABLE IS STANDARDS',
                  '10. RELATED STANDARDS',
                ].map((sec, i) => (
                  <div key={i} style={{ padding: '0.65rem 0.875rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                    {sec}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {analyzing && <ProcessingAnimation onComplete={() => {}} />}

        {result && !analyzing && (
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setShowSpecModal(true)}>
                <FileEdit size={16} /> View & Export Tender Specification
              </button>
            </div>

            <AnalysisResults result={result} onNewAnalysis={() => setResult(null)} />

            {showSpecModal && (
              <SpecificationModal
                result={result}
                selectedStandardIds={result.recommendations.map((r) => r.standard.id)}
                onClose={() => setShowSpecModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
