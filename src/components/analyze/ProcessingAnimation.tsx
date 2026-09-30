'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const STAGE_KEYS = [
  { icon: '🧠', labelEn: 'Understanding requirement', key: 'understand' },
  { icon: '🔎', labelEn: 'Identifying product category', key: 'identify' },
  { icon: '📋', labelEn: 'Extracting technical requirements', key: 'extract' },
  { icon: '🧬', labelEn: 'Semantic matching against knowledge base', key: 'match' },
  { icon: '🔗', labelEn: 'Discovering related standards', key: 'discover' },
  { icon: '🕒', labelEn: 'Checking versions & amendments', key: 'version' },
  { icon: '🚨', labelEn: 'Auditing tender compliance', key: 'audit' },
  { icon: '✅', labelEn: 'Generating recommendations', key: 'generate' },
];

interface ProcessingAnimationProps {
  onComplete: () => void;
}

export default function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (current >= STAGE_KEYS.length) {
      onComplete();
      return;
    }
    const delay = 400 + Math.random() * 300;
    const timer = setTimeout(() => {
      setDone((d) => [...d, STAGE_KEYS[current].key]);
      setCurrent((c) => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [current, onComplete]);

  const progress = Math.round((done.length / STAGE_KEYS.length) * 100);

  return (
    <div
      className="glass-card-bright"
      style={{ padding: '2.5rem', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}
    >
      {/* Header Icon */}
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
        }}
      >
        <span style={{ fontSize: '1.75rem' }}>🤖</span>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
        {t('processing') || 'AI Analysis Pipeline Running...'}
      </h3>

      {/* Progress Bar */}
      <div style={{ margin: '1.5rem 0 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.35rem' }}>
          <span>Pipeline Progress</span>
          <span>{progress}%</span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #2563eb, #10b981)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Stage List */}
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {STAGE_KEYS.map((stage, idx) => {
          const isDone = done.includes(stage.key);
          const isCurrent = current === idx;
          return (
            <div
              key={stage.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                background: isDone ? '#f0fdf4' : isCurrent ? '#eff6ff' : 'transparent',
                border: isDone ? '1px solid #bbf7d0' : isCurrent ? '1px solid #bfdbfe' : '1px solid transparent',
                opacity: isDone || isCurrent ? 1 : 0.45,
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{stage.icon}</span>
              <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: isDone || isCurrent ? 700 : 500, color: isDone ? '#15803d' : isCurrent ? '#1d4ed8' : '#64748b' }}>
                {t(stage.key) || stage.labelEn}
              </span>
              {isDone ? (
                <CheckCircle size={16} color="#16a34a" />
              ) : isCurrent ? (
                <Loader2 size={16} className="animate-spin" color="#2563eb" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
