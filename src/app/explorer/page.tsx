'use client';

import { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { DEMO_STANDARDS, searchStandards } from '@/data/demoStandards';
import { Standard } from '@/types';
import { getBisStandardUrl } from '@/utils/bisUrl';

const STATUS_OPTIONS = ['All', 'Current', 'Amended', 'Superseded'];
const CATEGORY_OPTIONS = ['All', 'Main Product Standard', 'Testing Standard', 'Safety Standard', 'Installation Standard', 'Performance Standard', 'Material Standard'];

const STATUS_BADGE: Record<string, string> = {
  Current: 'badge-green', Amended: 'badge-amber', Superseded: 'badge-red', Withdrawn: 'badge-red', 'Under Revision': 'badge-amber',
};

function StandardRow({ standard }: { standard: Standard }) {
  const [exp, setExp] = useState(false);
  return (
    <div
      className="glass-card"
      style={{ marginBottom: '0.625rem', overflow: 'hidden', transition: 'all 0.2s' }}
    >
      <button
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.875rem 1.125rem', textAlign: 'left' }}
        onClick={() => setExp(!exp)}
      >
        <div style={{ flexShrink: 0, width: 130 }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 700, color: '#60a5fa' }}>{standard.standardNumber}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{standard.title}</span>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`badge ${STATUS_BADGE[standard.status] || 'badge-gray'}`}>{standard.status}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{standard.version}</span>
        </div>
      </button>
      {exp && (
        <div style={{ padding: '0 1.125rem 1rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.75rem' }}>{standard.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.625rem' }}>
            <span className="badge badge-blue">{standard.category}</span>
            {standard.industry.map((i) => <span key={i} className="badge badge-gray">{i}</span>)}
            {standard.certificationRequired && <span className="badge badge-amber">BIS Cert Required</span>}
            <span className="badge badge-gray">Amendments: {standard.amendments}</span>
            <span className="badge badge-cyan">Demo KB</span>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <a
              href={getBisStandardUrl(standard.standardNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Eye size={13} />
              View on BIS Portal
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');

  let results = query ? searchStandards(query) : DEMO_STANDARDS;
  if (status !== 'All') results = results.filter((s) => s.status === status);
  if (category !== 'All') results = results.filter((s) => s.category === category);

  return (
    <AppShell title="Standards Explorer" subtitle="Search and browse the demo knowledge base">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="glass-card-bright" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="explorer-search"
                className="input-field"
                style={{ paddingLeft: '2.125rem' }}
                placeholder="Search standard number, title, keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select className="input-field" style={{ width: 140 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <select className="input-field" style={{ width: 200 }} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginTop: '0.625rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing {results.length} of {DEMO_STANDARDS.length} standards in Demo Knowledge Base
          </div>
        </div>

        {results.map((std) => <StandardRow key={std.id} standard={std} />)}

        {results.length === 0 && (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No standards found matching your search.
          </div>
        )}

        <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: '0.72rem', color: '#fbbf24' }}>
          All standards shown are from the Demo Knowledge Base for prototype purposes. Not official BIS data.
        </div>
      </div>
    </AppShell>
  );
}
