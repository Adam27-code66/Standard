'use client';

import AppShell from '@/components/layout/AppShell';
import StandardsGraph from '@/components/results/StandardsGraph';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { Recommendation } from '@/types';

// Build full recommendations from all standards for graph view
const ALL_RECS: Recommendation[] = DEMO_STANDARDS.map((std) => ({
  standard: std,
  relevanceScore: 75,
  reason: 'Full graph view',
  matchedRequirements: [],
  category: std.category,
  aiReasoning: [],
}));

export default function GraphPage() {
  return (
    <AppShell title="Standards Graph" subtitle="Interactive standards relationship visualization">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            This graph shows relationships between all standards in the Demo Knowledge Base. Click any node to inspect it. Drag to rearrange. Scroll to zoom.
            Edge colors represent relationship types: <span style={{ color: '#3b82f6' }}>Normative</span> · <span style={{ color: '#a78bfa' }}>Test Method</span> · <span style={{ color: '#ef4444' }}>Safety</span> · <span style={{ color: '#10b981' }}>Installation</span> · <span style={{ color: '#f59e0b' }}>Related Product</span>
          </p>
        </div>
        <div style={{ height: '75vh' }}>
          <StandardsGraph recommendations={ALL_RECS} mainStandardId="std-001" />
        </div>
      </div>
    </AppShell>
  );
}
