'use client';

import AppShell from '@/components/layout/AppShell';
import { useState } from 'react';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import AnalysisResults from '@/components/results/AnalysisResults';
import ProcessingAnimation from '@/components/analyze/ProcessingAnimation';
import { FileEdit, ArrowRight } from 'lucide-react';

export default function SpecificationPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function loadScenario(id: string) {
    const s = DEMO_SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setAnalyzing(true);
    const r = await runFullAnalysis(s, 'describe');
    saveToHistory(r);
    setResult(r);
    setAnalyzing(false);
  }

  return (
    <AppShell title="Specification Assistant" subtitle="Generate tender specifications">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {!result && !analyzing && (
          <div>
            <div className="glass-card-bright" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(0,212,255,0.2))', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileEdit size={24} color="#60a5fa" />
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Tender Specification Assistant
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Select a demo scenario below or run an analysis first. After analyzing, click "Generate Specification" to create a structured procurement document.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {DEMO_SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    className="btn-secondary"
                    onClick={() => loadScenario(s.id)}
                    style={{ fontSize: '0.8125rem' }}
                  >
                    <span>{s.icon}</span>
                    {s.name}
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {analyzing && <ProcessingAnimation onComplete={() => {}} />}
        {result && !analyzing && (
          <AnalysisResults result={result} onNewAnalysis={() => setResult(null)} />
        )}
      </div>
    </AppShell>
  );
}
