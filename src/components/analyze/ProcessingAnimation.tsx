'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

const STAGES = [
  { icon: '🧠', label: 'Understanding requirement', key: 'understand' },
  { icon: '🔎', label: 'Identifying product category', key: 'identify' },
  { icon: '📋', label: 'Extracting technical requirements', key: 'extract' },
  { icon: '🧬', label: 'Semantic matching against knowledge base', key: 'match' },
  { icon: '🔗', label: 'Discovering related standards', key: 'discover' },
  { icon: '🕒', label: 'Checking versions & amendments', key: 'version' },
  { icon: '🚨', label: 'Auditing tender compliance', key: 'audit' },
  { icon: '✅', label: 'Generating recommendations', key: 'generate' },
];

interface ProcessingAnimationProps {
  onComplete: () => void;
}

export default function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (current >= STAGES.length) {
      onComplete();
      return;
    }
    const delay = 400 + Math.random() * 300;
    const t = setTimeout(() => {
      setDone((d) => [...d, STAGES[current].key]);
      setCurrent((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [current]);

  const progress = Math.round((done.length / STAGES.length) * 100);

  return (
    <div
      className="glass-card-bright"
      style={{ padding: '2.5rem', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}
    >
      {/* Header */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(0,212,255,0.2))',
          border: '2px solid rgba(59,130,246,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          animation: current < STAGES.length ? 'pulse-glow 2s ease infinite' : 'none',
        }}
      >
        <span style={{ fontSize: '1.75rem' }}>🤖</span>
      </div>

      <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
        AI Analysis in Progress
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
        IS-SMART is analyzing your requirement against the standards knowledge base...
      </p>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: '1.5rem', height: 8 }}>
        <div
          className="progress-fill"
          style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}
        />
      </div>

      {/* Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
        {STAGES.map((stage, i) => {
          const isDone = done.includes(stage.key);
          const isActive = current === i;
          return (
            <div
              key={stage.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                opacity: isDone || isActive ? 1 : 0.35,
                transition: 'opacity 0.3s, transform 0.3s',
                transform: isActive ? 'translateX(4px)' : 'none',
              }}
            >
              <div style={{ fontSize: '1rem', width: 24, textAlign: 'center' }}>{stage.icon}</div>
              <span
                style={{
                  fontSize: '0.8375rem',
                  color: isDone ? '#10b981' : isActive ? '#60a5fa' : 'var(--text-muted)',
                  fontWeight: isDone || isActive ? 500 : 400,
                  flex: 1,
                }}
              >
                {stage.label}
              </span>
              {isDone && <CheckCircle size={15} color="#10b981" />}
              {isActive && <Loader2 size={15} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        Demo Mode: Using local knowledge base
      </p>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
