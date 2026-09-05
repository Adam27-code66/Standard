'use client';

import { Requirement } from '@/types';
import { Brain } from 'lucide-react';

interface Props { requirement: Requirement; }

export default function RequirementSummary({ requirement }: Props) {
  const fields = [
    { label: 'PRODUCT IDENTIFIED', value: requirement.product },
    { label: 'CATEGORY / APPLICATION', value: requirement.application },
    { label: 'ENVIRONMENT', value: requirement.environment || 'Not specified' },
    { label: 'INDUSTRY / SECTOR', value: requirement.industry || 'General' },
  ];

  return (
    <div className="glass-card-bright" style={{ padding: '1.375rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={15} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            AI Requirement Analysis
          </h2>
          <div className="badge badge-cyan" style={{ marginTop: 2 }}>
            Demo Knowledge Base
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {fields.map((f) => (
          <div
            key={f.label}
            style={{
              background: 'var(--navy-800)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              {f.label}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {requirement.technicalRequirements.length > 0 && (
        <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
            EXTRACTED TECHNICAL REQUIREMENTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {requirement.technicalRequirements.slice(0, 8).map((req, i) => (
              <span key={i} className="badge badge-blue" style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {req.length > 45 ? req.slice(0, 45) + '…' : req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '0.875rem' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
          🧠 AI Understanding
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Your requirement concerns <strong style={{ color: 'var(--text-primary)' }}>{requirement.product}</strong> for{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{requirement.application}</strong>, with emphasis on
          technical performance, compliance, safety, and testing in a{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{requirement.environment || 'general'}</strong> operating environment.
        </p>
      </div>
    </div>
  );
}
