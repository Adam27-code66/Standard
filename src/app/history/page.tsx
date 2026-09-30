'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import { AnalysisResult } from '@/types';
import AnalysisResults from '@/components/results/AnalysisResults';
import { History, Trash2, ArrowRight, Folder, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { t } = useLanguage();
  const { historyRecords, deleteHistoryRecord, setActiveProject, projects } = useProject();
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  return (
    <AppShell title={t('analysisHistory') || "Analysis History"} subtitle="Review persistent project analyses, audit records, and generated specs">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        {selectedResult ? (
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Historical Analysis Detail: {selectedResult.requirement.product}
              </h3>
              <button className="btn-secondary" onClick={() => setSelectedResult(null)}>
                ← Back to History List
              </button>
            </div>
            <AnalysisResults result={selectedResult} onNewAnalysis={() => setSelectedResult(null)} />
          </div>
        ) : historyRecords.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <History size={28} color="#2563eb" />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Saved History Records Yet
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: 440, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Run requirement analyses, tender audits, or gap analyses to save audit history records automatically.
            </p>
            <Link href="/analyze" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> Start First Analysis
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {historyRecords.map((record) => (
              <div key={record.id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                      <Folder size={16} color="#2563eb" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{record.projectName}</span>
                      <span className="badge badge-blue">{record.analysisType}</span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                      {record.summary}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {new Date(record.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>Source: {record.inputSource}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      className="btn-primary"
                      onClick={() => setSelectedResult(record.result)}
                      style={{ fontSize: '0.8125rem', padding: '0.45rem 0.875rem' }}
                    >
                      Open Analysis
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => {
                        const proj = projects.find((p) => p.id === record.projectId);
                        if (proj) setActiveProject(proj);
                        setSelectedResult(record.result);
                      }}
                      style={{ fontSize: '0.8125rem', padding: '0.45rem 0.875rem' }}
                    >
                      Continue Analysis
                    </button>

                    <button
                      onClick={() => deleteHistoryRecord(record.id)}
                      title="Delete Record"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #fecaca',
                        borderRadius: 8,
                        padding: '0.45rem',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
