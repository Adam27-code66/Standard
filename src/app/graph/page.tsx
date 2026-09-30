'use client';

import AppShell from '@/components/layout/AppShell';
import StandardsGraph from '@/components/results/StandardsGraph';
import RequirementWorkspace from '@/components/common/RequirementWorkspace';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import { Recommendation } from '@/types';

export default function GraphPage() {
  const { t } = useLanguage();
  const { activeProject } = useProject();

  // If activeProject has lastAnalysis recommendations, use them; otherwise use full standards
  const baseRecs = activeProject?.lastAnalysis?.recommendations || [];
  
  const recsToUse: Recommendation[] = baseRecs.length > 0
    ? baseRecs
    : DEMO_STANDARDS.map((std) => ({
        standard: std,
        relevanceScore: 75,
        confidenceLevel: 'High',
        reason: 'Indexed standard node in knowledge graph',
        matchedRequirements: [],
        category: std.category,
        aiReasoning: [],
        matchBreakdown: { productMatch: 95, materialMatch: 90, applicationMatch: 88, scopeMatch: 92 },
        whyChecklist: {
          productMatch: true,
          materialMatch: true,
          applicationMatch: true,
          scopeMatch: true,
          technicalRequirementMatch: true,
        },
      }));

  return (
    <AppShell title={t('standardsGraph') || "Standards Graph"} subtitle="Interactive standards relationship visualization mapped to project requirements">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Project Input Workspace Banner */}
        <RequirementWorkspace />

        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            <strong>Visualizing Relationships for:</strong> {activeProject ? activeProject.name : 'Knowledge Base'}. Click any node to inspect details, clause references, and normative links. Drag to rearrange. Scroll to zoom.
            <br />
            Edge Legend: <span style={{ color: '#3b82f6', fontWeight: 700 }}>■ Normative Reference</span> · <span style={{ color: '#8b5cf6', fontWeight: 700 }}>■ Test Method</span> · <span style={{ color: '#ef4444', fontWeight: 700 }}>■ Safety Standard</span> · <span style={{ color: '#10b981', fontWeight: 700 }}>■ Installation</span> · <span style={{ color: '#f59e0b', fontWeight: 700 }}>■ Related Product</span>
          </p>
        </div>

        <div style={{ height: '70vh', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#ffffff' }}>
          <StandardsGraph recommendations={recsToUse} mainStandardId={recsToUse[0]?.standard.id || "std-001"} />
        </div>
      </div>
    </AppShell>
  );
}
