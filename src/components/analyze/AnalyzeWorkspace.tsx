'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, FileText, MessageCircle } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';
import { AnalysisResult } from '@/types';
import { runFullAnalysis, saveToHistory } from '@/services/aiServices';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import DescribeTab from './DescribeTab';
import UploadTab from './UploadTab';
import ChatTab from './ChatTab';
import ProcessingAnimation from './ProcessingAnimation';
import AnalysisResults from '../results/AnalysisResults';

const TABS = [
  { id: 'describe', label: 'Describe Product / Requirement', icon: Zap },
  { id: 'upload', label: 'Upload Tender Document', icon: FileText },
  { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
];

export default function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { activeProject, addHistoryRecord, updateActiveProject } = useProject();

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

  // Sync formData with active project
  useEffect(() => {
    if (activeProject) {
      const ext = activeProject.extractedRequirements;
      setFormData({
        product: ext?.product?.value || activeProject.name || 'General Requirement',
        purpose: ext?.application?.value || 'Procurement Analysis',
        technicalRequirements: activeProject.rawInputText || '',
        environment: ext?.material?.value || '',
        industry: ext?.otherRequirements?.value || 'Infrastructure',
      });
    }
  }, [activeProject]);

  const handleAnalyze = async (data?: any) => {
    setAnalyzing(true);
    setResult(null);
    try {
      let analysisResult: AnalysisResult;
      if (data && data.extractedRequirements) {
        analysisResult = await runFullAnalysis(data, activeTab);
      } else {
        const input = data || formData;
        analysisResult = await runFullAnalysis(
          {
            product: input.product || activeProject?.name || 'General Product',
            purpose: input.purpose || '',
            technicalRequirements: Array.isArray(input.technicalRequirements) ? input.technicalRequirements.join('\n') : (input.technicalRequirements || ''),
            environment: input.environment || '',
            industry: input.industry || 'General',
            rawInput: activeProject?.rawInputText || input.rawInput || input.product,
            quantity: input.quantity,
            capacity: input.capacity,
            material: input.material,
          },
          activeTab
        );
      }

      setResult(analysisResult);
      saveToHistory(analysisResult);

      // Save in Project Context
      if (activeProject) {
        updateActiveProject({ lastAnalysis: analysisResult });
        addHistoryRecord({
          projectId: activeProject.id,
          projectName: activeProject.name,
          analysisType: 'Requirement Analysis',
          status: 'Completed',
          language: 'English',
          inputSource: activeProject.name,
          summary: `Extracted ${analysisResult.recommendations.length} applicable standards and found ${analysisResult.gapTable.length} gap checklist items.`,
          result: analysisResult,
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Reusable Requirement / Project Workspace ────── */}
      {!result && !analyzing && (
        <RequirementWorkspace onAnalyze={() => handleAnalyze()} showAnalyzeBtn />
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
                  {t(tab.id) || tab.label}
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
