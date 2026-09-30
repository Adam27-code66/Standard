'use client';

import { useState } from 'react';
import { Search, Filter, Eye, RotateCcw, Scale, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const { t } = useLanguage();
  const { activeProject } = useProject();

  // Search & Filter state
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [department, setDepartment] = useState('All');
  const [amendmentFilter, setAmendmentFilter] = useState('All');
  const [projectMatchOnly, setProjectMatchOnly] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);

  // Derive unique departments
  const departments = ['All', ...Array.from(new Set(DEMO_STANDARDS.map((s) => s.department).filter(Boolean))) as string[]];

  const handleClearFilters = () => {
    setQuery('');
    setStatus('All');
    setCategory('All');
    setDepartment('All');
    setAmendmentFilter('All');
    setProjectMatchOnly(false);
  };

  const activeProjectKeyword = activeProject?.extractedRequirements?.product.value.toLowerCase() ||
    activeProject?.extractedRequirements?.material.value.toLowerCase() ||
    activeProject?.rawInputText.toLowerCase() ||
    '';

  let results = DEMO_STANDARDS.filter((s) => {
    if (projectMatchOnly && activeProjectKeyword) {
      const matchNumber = s.standardNumber.toLowerCase().includes(activeProjectKeyword);
      const matchTitle = s.title.toLowerCase().includes(activeProjectKeyword);
      const matchKw = s.keywords.some((k) => activeProjectKeyword.includes(k.toLowerCase()) || k.toLowerCase().includes(activeProjectKeyword));
      const matchDesc = s.description.toLowerCase().includes(activeProjectKeyword);
      if (!matchNumber && !matchTitle && !matchKw && !matchDesc) return false;
    }

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
    <AppShell title={t('standardsExplorer') || "Standards Explorer"} subtitle="Search and browse official Indian Standards knowledge base">
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        {/* Project Requirement Workspace */}
        <RequirementWorkspace />

        {/* Project Match Quick Action */}
        {activeProject && (
          <div className="glass-card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem', background: projectMatchOnly ? '#eff6ff' : '#ffffff', border: projectMatchOnly ? '1px solid #bfdbfe' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
              <Sparkles size={16} color="#2563eb" />
              <span>Project Context: <strong>{activeProject.name}</strong></span>
            </div>
            <button
              onClick={() => setProjectMatchOnly(!projectMatchOnly)}
              className={projectMatchOnly ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem' }}
            >
              {projectMatchOnly ? "Showing Project Matches" : "Filter Standards for Active Project"}
            </button>
          </div>
        )}

        {/* Search & Filters Bar */}
        <div className="glass-card-bright" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderRadius: 16 }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="explorer-search"
                className="input-field"
                style={{ paddingLeft: '2.35rem', height: 42, fontSize: '0.875rem' }}
                placeholder="Search IS number, product, keyword or requirement..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button className="btn-primary" style={{ height: 42, padding: '0 1.25rem', gap: '0.5rem' }}>
              <Search size={16} />
              <span>{t('search') || 'Search'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="input-field" style={{ width: 'auto', fontSize: '0.8125rem' }} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="input-field" style={{ width: 'auto', fontSize: '0.8125rem' }} value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {(query || status !== 'All' || category !== 'All' || projectMatchOnly) && (
              <button className="btn-ghost" onClick={handleClearFilters} style={{ fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}>
                <RotateCcw size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Match Level Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
          <span>Found <strong>{results.length}</strong> Indian Standards</span>
          <span style={{ fontSize: '0.75rem' }}>
            Match Categories: <span style={{ color: '#16a34a', fontWeight: 700 }}>■ Confirmed Match</span> | <span style={{ color: '#2563eb', fontWeight: 700 }}>■ Potential Match</span>
          </span>
        </div>

        {/* Standards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {results.map((std) => {
            const isConfirmed = activeProjectKeyword && (std.title.toLowerCase().includes(activeProjectKeyword) || std.standardNumber.toLowerCase().includes(activeProjectKeyword));
            return (
              <div key={std.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `4px solid ${isConfirmed ? '#16a34a' : '#2563eb'}` }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{std.standardNumber}</span>
                    <span className={`badge ${STATUS_BADGE[std.status] || 'badge-blue'}`}>{std.status}</span>
                  </div>

                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1.4 }}>{std.title}</h3>

                  <p style={{ fontSize: '0.7875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {std.scope || std.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                    <span className="badge badge-gray">{std.category}</span>
                    <span className="badge badge-blue">Year: {std.publicationYear}</span>
                    {isConfirmed && <span className="badge badge-green">✓ Confirmed Match</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={() => setSelectedStandard(std)} style={{ flex: 1, fontSize: '0.7875rem', padding: '0.4rem 0.65rem', justifyContent: 'center' }}>
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedStandard && (
          <StandardProfileModal standard={selectedStandard} onClose={() => setSelectedStandard(null)} />
        )}
      </div>
    </AppShell>
  );
}
