'use client';

import { useState } from 'react';
import { Search, Filter, Eye, RotateCcw, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { Standard } from '@/types';
import { getBisStandardUrl } from '@/utils/bisUrl';
import StandardProfileModal from '@/components/explorer/StandardProfileModal';
import Link from 'next/link';

const STATUS_OPTIONS = ['All', 'Current', 'Amended', 'Superseded', 'Withdrawn', 'Under Revision', 'Draft'];
const CATEGORY_OPTIONS = [
  'All',
  'Main Product Standard',
  'Testing Standard',
  'Safety Standard',
  'Installation Standard',
  'Performance Standard',
  'Material Standard',
  'Terminology Standard',
  'Related Product Standard',
];

const STATUS_BADGE: Record<string, string> = {
  Current: 'badge-green',
  Amended: 'badge-amber',
  Superseded: 'badge-red',
  Withdrawn: 'badge-red',
  'Under Revision': 'badge-amber',
  Draft: 'badge-gray',
};

export default function ExplorerPage() {
  // Search & Filter state
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [department, setDepartment] = useState('All');
  const [amendmentFilter, setAmendmentFilter] = useState('All');
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);

  // Derive unique departments
  const departments = ['All', ...Array.from(new Set(DEMO_STANDARDS.map((s) => s.department).filter(Boolean))) as string[]];

  const handleClearFilters = () => {
    setQuery('');
    setStatus('All');
    setCategory('All');
    setDepartment('All');
    setAmendmentFilter('All');
  };

  let results = DEMO_STANDARDS.filter((s) => {
    // Text query matching standard number, title, keywords, scope, description, ICS
    if (query) {
      const q = query.toLowerCase();
      const matchNumber = s.standardNumber.toLowerCase().includes(q);
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchKw = s.keywords.some((k) => k.toLowerCase().includes(q));
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchIcs = s.ics && s.ics.toLowerCase().includes(q);
      if (!matchNumber && !matchTitle && !matchKw && !matchDesc && !matchIcs) {
        return false;
      }
    }

    if (status !== 'All' && s.status !== status) return false;
    if (category !== 'All' && s.category !== category) return false;
    if (department !== 'All' && s.department !== department) return false;
    if (amendmentFilter === 'Has Amendments' && s.amendments === 0) return false;
    if (amendmentFilter === 'No Amendments' && s.amendments > 0) return false;

    return true;
  });

  return (
    <AppShell title="Standards Explorer" subtitle="Search and browse official Indian Standards knowledge base">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>

        {/* ── Search & Filters Bar ───────────────────────────────── */}
        <div className="glass-card-bright" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderRadius: 16 }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="explorer-search"
                className="input-field"
                style={{ paddingLeft: '2.35rem', height: 42, fontSize: '0.875rem' }}
                placeholder="Search standard number, product, keyword or requirement..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button className="btn-primary" style={{ height: 42, padding: '0 1.25rem', gap: '0.5rem' }}>
              <Search size={16} />
              <span>Search</span>
            </button>

            <button className="btn-ghost" onClick={handleClearFilters} style={{ height: 42, padding: '0 0.875rem', gap: '0.375rem' }}>
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                Category
              </label>
              <select className="input-field" style={{ fontSize: '0.8125rem' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                Status
              </label>
              <select className="input-field" style={{ fontSize: '0.8125rem' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                Department / Committee
              </label>
              <select className="input-field" style={{ fontSize: '0.8125rem' }} value={department} onChange={(e) => setDepartment(e.target.value)}>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                Amendments
              </label>
              <select className="input-field" style={{ fontSize: '0.8125rem' }} value={amendmentFilter} onChange={(e) => setAmendmentFilter(e.target.value)}>
                <option value="All">All Standards</option>
                <option value="Has Amendments">Has Amendments</option>
                <option value="No Amendments">No Amendments</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Showing <strong>{results.length}</strong> of <strong>{DEMO_STANDARDS.length}</strong> standards in dataset
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Dataset verified with BIS repository structure
            </span>
          </div>
        </div>

        {/* ── Standard Cards List ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {results.map((standard) => (
            <div
              key={standard.id}
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
                flexWrap: 'wrap',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#1d4ed8' }}>
                    {standard.standardNumber} : {standard.version}
                  </span>
                  <span className={`badge ${STATUS_BADGE[standard.status] || 'badge-gray'}`}>
                    ● {standard.status}
                  </span>
                  <span className="badge badge-blue">{standard.category}</span>
                  {standard.certificationRequired && (
                    <span className="badge badge-green">BIS Cert Required</span>
                  )}
                  {standard.amendments > 0 && (
                    <span className="badge badge-amber">{standard.amendments} Amendment(s)</span>
                  )}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                  {standard.title}
                </h3>

                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                  {standard.scope || standard.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.725rem', color: '#64748b', flexWrap: 'wrap' }}>
                  {standard.publicationYear && <span>Published: {standard.publicationYear}</span>}
                  {standard.previousVersion && <span>Prev Version: {standard.previousVersion} ({standard.previousYear})</span>}
                  {standard.department && <span>Dept: {standard.department}</span>}
                  {standard.committee && <span>Committee: {standard.committee}</span>}
                  {standard.ics && <span>ICS: {standard.ics}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedStandard(standard)}
                  style={{ fontSize: '0.7875rem', padding: '0.5rem 0.85rem', gap: '0.375rem' }}
                >
                  <Eye size={14} />
                  View Profile
                </button>

                <Link
                  href={`/compare?std1=${standard.id}`}
                  className="btn-ghost"
                  style={{ fontSize: '0.7875rem', padding: '0.5rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Scale size={14} />
                  Compare
                </Link>

                <a
                  href={getBisStandardUrl(standard.standardNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: '0.7875rem', padding: '0.5rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  title="View on Official BIS Portal"
                >
                  BIS Portal
                  <ChevronRight size={13} />
                </a>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Search size={32} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                No standards match your search query
              </h3>
              <p style={{ fontSize: '0.8125rem', margin: '0 0 1rem 0' }}>
                Try adjusting your search keywords or clearing filters.
              </p>
              <button className="btn-secondary" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Standard Profile Modal Popup */}
        {selectedStandard && (
          <StandardProfileModal
            standard={selectedStandard}
            onClose={() => setSelectedStandard(null)}
          />
        )}

        {/* Legal Disclaimer */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Notice:</strong> Standard entries presented are indexed from authoritative BIS publications for procurement workflow assistance. Official verification against published gazettes is recommended prior to tender issuance.
        </div>
      </div>
    </AppShell>
  );
}
