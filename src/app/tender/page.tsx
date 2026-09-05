'use client';

import AppShell from '@/components/layout/AppShell';
import UploadTab from '@/components/analyze/UploadTab';
import { useState } from 'react';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import AnalysisResults from '@/components/results/AnalysisResults';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';

export default function TenderPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleAnalyze(data: {
    product: string; purpose: string; technicalRequirements: string; environment: string; industry: string;
  }) {
    setAnalyzing(true);
    const r = await runFullAnalysis(data, 'upload');
    saveToHistory(r);
    setResult(r);
    setAnalyzing(false);
  }

  return (
    <AppShell title="Tender Analyzer" subtitle="Upload and analyze tender documents">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {!analyzing && !result && (
          <>
            <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Upload a procurement tender document. IS-SMART will extract requirements, identify applicable Indian Standards, detect outdated references, and generate gap analysis.
              </p>
            </div>
            <UploadTab onAnalyzeComplete={handleAnalyze} />
          </>
        )}
        {analyzing && <ProcessingAnimation onComplete={() => {}} />}
        {result && !analyzing && <AnalysisResults result={result} onNewAnalysis={() => { setResult(null); }} />}
      </div>
    </AppShell>
  );
}
