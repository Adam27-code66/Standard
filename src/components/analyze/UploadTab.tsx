'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface UploadTabProps {
  onAnalyzeComplete: (data: {
    product: string;
    purpose: string;
    technicalRequirements: string;
    environment: string;
    industry: string;
  }) => void;
}

type Stage = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

const PROCESSING_STAGES = [
  { key: 'uploaded', label: 'Document uploaded' },
  { key: 'extracted', label: 'Text extracted' },
  { key: 'product', label: 'Product identified' },
  { key: 'requirements', label: 'Requirements extracted' },
  { key: 'standards', label: 'Standards analyzed' },
  { key: 'recommendation', label: 'Recommendation generated' },
];

export default function UploadTab({ onAnalyzeComplete }: UploadTabProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) {
      setError('Only PDF, DOCX, and TXT files under 10MB are accepted.');
      return;
    }
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setError('');
    processFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  async function processFile(f: File) {
    setStage('uploading');
    setCompletedStages([]);

    // Simulate multi-stage processing
    const stages = PROCESSING_STAGES.map((s) => s.key);
    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setCompletedStages((prev) => [...prev, stages[i]]);
      if (i === 0) setStage('processing');
    }

    setStage('done');
  }

  function handleViewAnalysis() {
    // Simulate extracted content from uploaded document
    onAnalyzeComplete({
      product: 'Outdoor LED Street Light (from uploaded document)',
      purpose: 'Highway infrastructure lighting procurement',
      technicalRequirements: 'Power rating: 100W\nIP rating: IP65\nLuminous efficacy: 120 lm/W\nOperating voltage: 220-240V AC\nDesign life: 50,000 hours',
      environment: 'Outdoor / Highway / Monsoon exposure',
      industry: 'Infrastructure',
    });
  }

  const fmt = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="glass-card-bright" style={{ padding: '1.75rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Upload Tender Document
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Upload a tender PDF or document to automatically extract requirements and identify applicable standards.
      </p>

      {stage === 'idle' && (
        <div
          {...getRootProps()}
          id="upload-dropzone"
          style={{
            border: `2px dashed ${isDragActive ? '#3b82f6' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'rgba(59,130,246,0.05)' : 'var(--navy-800)',
            transition: 'all 0.2s ease',
          }}
        >
          <input {...getInputProps()} id="file-input" />
          <div
            style={{
              width: 56,
              height: 56,
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Upload size={24} color="#60a5fa" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            📄 Drop tender document here
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            or
          </p>
          <button className="btn-secondary" type="button">Browse Files</button>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Supports PDF, DOCX, TXT • Max 10 MB
          </p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {file && stage !== 'idle' && (
        <div style={{ marginTop: '1rem' }}>
          {/* File info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              background: 'var(--navy-800)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: '1.25rem',
            }}
          >
            <FileText size={20} color="#60a5fa" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmt(file.size)}</div>
            </div>
            {stage === 'done' ? (
              <CheckCircle size={18} color="#10b981" />
            ) : (
              <Loader2 size={18} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
            )}
          </div>

          {/* Processing stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {PROCESSING_STAGES.map((s) => {
              const done = completedStages.includes(s.key);
              const current = !done && completedStages.length === PROCESSING_STAGES.findIndex((x) => x.key === s.key);
              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: done ? 'rgba(16,185,129,0.15)' : current ? 'rgba(59,130,246,0.15)' : 'var(--navy-700)',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : current ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s',
                    }}
                  >
                    {done ? (
                      <CheckCircle size={12} color="#10b981" />
                    ) : current ? (
                      <Loader2 size={12} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--navy-600)' }} />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: done ? '#10b981' : current ? '#60a5fa' : 'var(--text-muted)',
                      fontWeight: done || current ? 500 : 400,
                      transition: 'color 0.3s',
                    }}
                  >
                    {done ? '✓ ' : ''}{s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {stage === 'done' && (
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button id="view-analysis-btn" className="btn-primary" onClick={handleViewAnalysis}>
                View Analysis
              </button>
              <button
                className="btn-ghost"
                onClick={() => { setStage('idle'); setFile(null); setCompletedStages([]); }}
              >
                Upload Different File
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
