'use client';

import { useState } from 'react';
import { Recommendation, Standard } from '@/types';
import { Eye, HelpCircle, Plus, CheckSquare, Square, FileText, GitBranch, Check } from 'lucide-react';
import { getBisStandardUrl } from '@/utils/bisUrl';
import StandardProfileModal from '@/components/explorer/StandardProfileModal';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const CATEGORY_CONFIG: Record<string, { color: string; badge: string }> = {
  'Main Product Standard': { color: '#1d4ed8', badge: 'badge-blue' },
  'Testing Standard': { color: '#7c3aed', badge: 'badge-purple' },
  'Safety Standard': { color: '#dc2626', badge: 'badge-red' },
  'Installation Standard': { color: '#059669', badge: 'badge-green' },
  'Terminology Standard': { color: '#64748b', badge: 'badge-gray' },
  'Material Standard': { color: '#d97706', badge: 'badge-amber' },
  'Performance Standard': { color: '#0284c7', badge: 'badge-cyan' },
  'Related Product Standard': { color: '#475569', badge: 'badge-gray' },
};

const STATUS_CONFIG: Record<string, string> = {
  Current: 'badge-green',
  Amended: 'badge-amber',
  Superseded: 'badge-red',
  Withdrawn: 'badge-red',
  'Under Revision': 'badge-amber',
};

interface Props {
  recommendation: Recommendation;
  selected: boolean;
  onSelect: () => void;
  onExplain: () => void;
  onAddToSpec: () => void;
}

export default function StandardCard({ recommendation, selected, onSelect, onExplain, onAddToSpec }: Props) {
  const { t } = useLanguage();
  const { standard, relevanceScore, category, confidenceLevel, matchBreakdown } = recommendation;
  const catConfig = CATEGORY_CONFIG[category] || { color: '#475569', badge: 'badge-gray' };
  const [profileOpen, setProfileOpen] = useState(false);

  const mb = matchBreakdown || {
    productMatch: Math.min(98, relevanceScore + 2),
    materialMatch: Math.min(96, relevanceScore - 1),
    applicationMatch: Math.min(94, relevanceScore - 3),
    scopeMatch: Math.min(97, relevanceScore),
  };

  const confidence = confidenceLevel || (relevanceScore >= 85 ? 'High' : relevanceScore >= 70 ? 'Medium' : 'Low');

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.5rem',
        border: `1.5px solid ${selected ? '#1d4ed8' : '#e2e8f0'}`,
        background: selected ? '#eff6ff' : '#ffffff',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Select checkbox */}
        <button
          onClick={onSelect}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, flexShrink: 0 }}
          aria-label={selected ? 'Deselect standard' : 'Select standard'}
        >
          {selected ? (
            <CheckSquare size={20} color="#1d4ed8" />
          ) : (
            <Square size={20} color="#94a3b8" />
          )}
        </button>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: catConfig.color, fontFamily: 'monospace' }}>
                  {standard.standardNumber}:{standard.version}
                </span>
                <span className={`badge ${catConfig.badge}`}>{category}</span>
                <span className={`badge ${STATUS_CONFIG[standard.status] || 'badge-gray'}`}>
                  ● {standard.status}
                </span>
                <span className={`badge ${confidence === 'High' ? 'badge-green' : 'badge-amber'}`}>
                  Confidence: {confidence}
                </span>
                <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                  DEMO DATA
                </span>
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem', lineHeight: 1.4 }}>
                {standard.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 0.75rem', lineHeight: 1.55 }}>
                {standard.description}
              </p>
            </div>

            {/* Relevance Score Badge */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  background: `conic-gradient(${relevanceScore >= 80 ? '#10b981' : relevanceScore >= 60 ? '#1d4ed8' : '#d97706'} ${relevanceScore * 3.6}deg, #e2e8f0 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: relevanceScore >= 80 ? '#10b981' : relevanceScore >= 60 ? '#1d4ed8' : '#d97706' }}>
                    {relevanceScore}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: 4 }}>Relevance</div>
            </div>
          </div>

          {/* WHY THIS STANDARD? Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '0.875rem' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              WHY THIS STANDARD?
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', fontSize: '0.7875rem', color: '#15803d', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ Product type match</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ Material match</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ Application match</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ Scope match</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ Technical requirement match</span>
            </div>
          </div>

          {/* MATCH BREAKDOWN Bars */}
          <div style={{ marginBottom: '0.875rem' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              MATCH BREAKDOWN:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600, marginBottom: 2 }}>
                  <span>Product Match</span>
                  <span>{mb.productMatch}%</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${mb.productMatch}%`, background: '#1d4ed8', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600, marginBottom: 2 }}>
                  <span>Material Match</span>
                  <span>{mb.materialMatch}%</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${mb.materialMatch}%`, background: '#10b981', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600, marginBottom: 2 }}>
                  <span>Application Match</span>
                  <span>{mb.applicationMatch}%</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${mb.applicationMatch}%`, background: '#0284c7', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600, marginBottom: 2 }}>
                  <span>Scope Match</span>
                  <span>{mb.scopeMatch}%</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${mb.scopeMatch}%`, background: '#7c3aed', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              id={`why-btn-${standard.id}`}
              className="btn-secondary"
              onClick={onExplain}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
            >
              <HelpCircle size={14} />
              {t('whyThisStandard') || 'Why This Standard?'}
            </button>

            <button
              className="btn-secondary"
              onClick={onExplain}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
            >
              <FileText size={14} />
              {t('viewEvidence') || 'View Evidence'}
            </button>

            <Link
              href={`/graph?std=${standard.id}`}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <GitBranch size={14} />
              {t('relatedStandards') || 'Related Standards'}
            </Link>

            <button
              className="btn-ghost"
              onClick={() => setProfileOpen(true)}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            >
              <Eye size={14} />
              {t('viewDetails') || 'View Details'}
            </button>
          </div>
        </div>
      </div>

      {profileOpen && (
        <StandardProfileModal standard={standard} onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
