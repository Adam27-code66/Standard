'use client';

import { Suspense } from 'react';
import AnalyzeWorkspace from '@/components/analyze/AnalyzeWorkspace';
import AppShell from '@/components/layout/AppShell';

export default function AnalyzePage() {
  return (
    <AppShell title="Analyze Requirement" subtitle="AI-powered standards identification">
      <Suspense fallback={<div style={{ color: 'var(--text-muted)' }}>Loading...</div>}>
        <AnalyzeWorkspace />
      </Suspense>
    </AppShell>
  );
}
