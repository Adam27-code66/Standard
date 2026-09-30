'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import CertificationChecker from '@/components/results/CertificationChecker';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';

export default function CertificationPage() {
  const { t } = useLanguage();
  const { activeProject } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleRunReview() {
    setAnalyzing(true);
    setResult(null);

    const inputText = activeProject?.rawInputText || 'General Certification Compliance Review';
    const data = {
      product: activeProject?.extractedRequirements?.product.value || activeProject?.name || 'Certification Review Product',
      purpose: activeProject?.extractedRequirements?.application.value || 'BIS Certification Review',
      technicalRequirements: inputText,
      environment: activeProject?.extractedRequirements?.material.value || 'Standard',
      industry: activeProject?.extractedRequirements?.otherRequirements.value || 'General',
      rawInput: inputText,
    };

    const res = await runFullAnalysis(data, 'describe');
    saveToHistory(res);
    setResult(res);
    setAnalyzing(false);
  }

  return (
    <AppShell title={t('certification') || "Certification Intelligence"} subtitle="BIS ISI Marking, QCO Gazette Orders, CRS & Compliance Verification">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        {!result && !analyzing && (
          <RequirementWorkspace onAnalyze={() => handleRunReview()} showAnalyzeBtn />
        )}

        {analyzing && <ProcessingAnimation onComplete={() => {}} />}

        {result && !analyzing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Certification Review for: {result.requirement.product}
              </h3>
              <button className="btn-ghost" onClick={() => setResult(null)}>
                Run Another Review
              </button>
            </div>
            <CertificationChecker certifications={result.certifications} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
