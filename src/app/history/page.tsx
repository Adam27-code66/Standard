'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { loadHistory } from '@/services/aiServices';
import { AnalysisResult } from '@/types';
import { History, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#f59e0b';
  return (
    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, background: `${color}15`, color, fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${color}30` }}>
      {score}/100
    </span>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => { setHistory(loadHistory()); }, []);

  return (
    <AppShell title="Analysis History" subtitle="Previous standards analyses">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {history.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <History size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No analyses yet
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Run your first analysis to see results here.
            </p>
            <Link href="/analyze" className="btn-primary">Start Analysis</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((item) => (
              <div key={item.id} className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {item.requirement.product}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(item.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`badge ${item.inputType === 'upload' ? 'badge-purple' : item.inputType === 'chat' ? 'badge-cyan' : 'badge-blue'}`}>
                        {item.inputType === 'upload' ? '📄 Tender PDF' : item.inputType === 'chat' ? '💬 Chat' : '📝 Describe'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa' }}>{item.recommendations.length}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Standards</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: item.issues.length > 0 ? '#f59e0b' : '#10b981' }}>
                        {item.issues.length}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Issues</div>
                    </div>
                    <ScorePill score={item.readinessScore.total} />
                    <span className="badge badge-green">Completed</span>
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
