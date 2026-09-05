'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, FileText, MessageCircle } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';
import { AnalysisResult } from '@/types';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import DescribeTab from './DescribeTab';
import UploadTab from './UploadTab';
import ChatTab from './ChatTab';
import ProcessingAnimation from './ProcessingAnimation';
import AnalysisResults from '../results/AnalysisResults';

const TABS = [
  { id: 'describe', label: 'Describe Product', icon: Zap },
  { id: 'upload', label: 'Upload Tender', icon: FileText },
  { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
];

export default function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'describe' | 'upload' | 'chat'>('describe');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [formData, setFormData] = useState({
    product: '',
    purpose: '',
    technicalRequirements: '',
    environment: '',
    industry: '',
  });

  // Auto-load scenario from URL param
  useEffect(() => {
    const scenarioId = searchParams.get('scenario');
    if (scenarioId) {
      const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
      if (scenario) {
        setFormData({
          product: scenario.product,
          purpose: scenario.purpose,
          technicalRequirements: scenario.technicalRequirements,
          environment: scenario.environment,
          industry: scenario.industry,
        });
        setActiveTab('describe');
      }
    }
  }, [searchParams]);

  const handleAnalyze = async (data?: typeof formData) => {
    const input = data || formData;
    setAnalyzing(true);
    setResult(null);
    try {
      const analysisResult = await runFullAnalysis(
        {
          product: input.product || 'General Product',
          purpose: input.purpose || '',
          technicalRequirements: input.technicalRequirements || '',
          environment: input.environment || '',
          industry: input.industry || 'General',
        },
        activeTab
      );
      setResult(analysisResult);
      saveToHistory(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      setFormData({
        product: scenario.product,
        purpose: scenario.purpose,
        technicalRequirements: scenario.technicalRequirements,
        environment: scenario.environment,
        industry: scenario.industry,
      });
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Demo Scenarios ───────────────────────────────── */}
      {!result && !analyzing && (
        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Demo scenarios:
            </span>
            {DEMO_SCENARIOS.map((s) => (
              <button
                key={s.id}
                className="btn-ghost"
                onClick={() => handleLoadScenario(s.id)}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', gap: '0.375rem' }}
              >
                <span>{s.icon}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────── */}
      {!result && !analyzing && (
        <>
          <div
            className="glass-card"
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.375rem',
              marginBottom: '1rem',
              width: 'fit-content',
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab Content ──────────────────────────────── */}
          {activeTab === 'describe' && (
            <DescribeTab
              formData={formData}
              setFormData={setFormData}
              onAnalyze={() => handleAnalyze()}
            />
          )}
          {activeTab === 'upload' && (
            <UploadTab onAnalyzeComplete={(data) => handleAnalyze(data)} />
          )}
          {activeTab === 'chat' && (
            <ChatTab onAnalyze={(data) => handleAnalyze(data)} />
          )}
        </>
      )}

      {/* ── Processing Animation ──────────────────────────── */}
      {analyzing && (
        <ProcessingAnimation onComplete={() => {}} />
      )}

      {/* ── Results ──────────────────────────────────────── */}
      {result && !analyzing && (
        <AnalysisResults
          result={result}
          onNewAnalysis={() => { setResult(null); }}
        />
      )}
    </div>
  );
}
