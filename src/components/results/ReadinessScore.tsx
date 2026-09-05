'use client';

import { ReadinessScore as Score } from '@/types';

interface Props { score: Score; }

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function ReadinessScore({ score }: Props) {
  const color = score.total >= 85 ? '#10b981' : score.total >= 70 ? '#3b82f6' : score.total >= 55 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score.total / 100) * circumference;

  return (
    <div className="glass-card-bright" style={{ padding: '1.375rem' }}>
      <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
        Tender Readiness Score
      </h2>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* SVG ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <svg width={100} height={100} className="score-ring">
            <circle cx={50} cy={50} r={40} fill="none" stroke="var(--navy-700)" strokeWidth={10} />
            <circle
              cx={50}
              cy={50}
              r={40}
              fill="none"
              stroke={color}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x={50} y={46} textAnchor="middle" fill="var(--text-primary)" fontSize={18} fontWeight={700}>
              {score.total}
            </text>
            <text x={50} y={62} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              / 100
            </text>
          </svg>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.375rem', textAlign: 'center' }}>
            Tender Readiness
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.4rem 0.875rem' }}
            onClick={() => {}}
          >
            Improve Tender
          </button>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <ScoreBar label="Standard Coverage" value={score.breakdown.standardCoverage} color="#3b82f6" />
          <ScoreBar label="Version Accuracy" value={score.breakdown.versionAccuracy} color="#a78bfa" />
          <ScoreBar label="Testing Coverage" value={score.breakdown.testingCoverage} color="#10b981" />
          <ScoreBar label="Safety Coverage" value={score.breakdown.safetyCoverage} color="#ef4444" />
          <ScoreBar label="Certification Coverage" value={score.breakdown.certificationCoverage} color="#f59e0b" />
        </div>
      </div>
    </div>
  );
}
