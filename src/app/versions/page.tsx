'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import VersionChecker from '@/components/results/VersionChecker';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';

export default function VersionsPage() {
  const { t } = useLanguage();
  const { activeProject } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleRunAudit() {
    setAnalyzing(true);
    setResult(null);

    const inputText = activeProject?.rawInputText || 'General Version Compliance Analysis';
    const data = {
      product: activeProject?.extractedRequirements?.product.value || activeProject?.name || 'Standard Version Audit',
      purpose: activeProject?.extractedRequirements?.application.value || 'Version Intelligence Audit',
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
    <AppShell title={t('versionCheck') || "Version & Amendments Intelligence"} subtitle="Verify active editions and published amendments of Indian Standards">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        {/* Project Workspace Banner */}
        {!result && !analyzing && (
          <RequirementWorkspace onAnalyze={() => handleRunAudit()} showAnalyzeBtn />
        )}

        {analyzing && <ProcessingAnimation onComplete={() => {}} />}

        {result && !analyzing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Version Audit Results for: {result.requirement.product}
              </h3>
              <button className="btn-ghost" onClick={() => setResult(null)}>
                Run Another Audit
              </button>
            </div>
            <VersionChecker recommendations={result.recommendations} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
