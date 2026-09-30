'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import CompareStandards from '@/components/compare/CompareStandards';

function CompareContent() {
  const searchParams = useSearchParams();
  const std1 = searchParams.get('std1') || undefined;
  const std2 = searchParams.get('std2') || undefined;

  return <CompareStandards initialStd1Id={std1} initialStd2Id={std2} />;
}

export default function ComparePage() {
  return (
    <AppShell title="Standard Comparison" subtitle="Side-by-side analysis of Indian Standards">
      <Suspense fallback={<div style={{ color: 'var(--text-muted)' }}>Loading comparison...</div>}>
        <CompareContent />
      </Suspense>
    </AppShell>
  );
}
