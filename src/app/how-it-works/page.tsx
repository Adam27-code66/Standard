'use client';

import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { FolderPlus, Pencil, Brain, Box, BookOpen, ClipboardList, GitBranch, RotateCcw, AlertTriangle, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    { num: 1, title: '1. Create or Select a Project Workspace', desc: 'Define your procurement project name or select an active user workspace to maintain continuity across modules.', icon: FolderPlus },
    { num: 2, title: '2. Enter or Upload Tender Document', desc: 'Type/paste raw requirements or upload tender documents (PDF, DOCX, TXT, CSV) to extract text directly.', icon: Pencil },
    { num: 3, title: '3. Extract & Edit Structured Requirements', desc: 'The AI parses Product, Quantity, Capacity, Material, Application, and Other Requirements with confidence scores & inline editing.', icon: Brain },
    { num: 4, title: '4. Standards Matching & Traceability', desc: 'Cross-references requirements against official Indian Standards catalog with transparent clause-level evidence.', icon: BookOpen },
    { num: 5, title: '5. Relationship Knowledge Graph', desc: 'Maps connected normative reference standards, test methods, safety codes, and material specifications.', icon: GitBranch },
    { num: 6, title: '6. Version & Amendment Intelligence', desc: 'Detects outdated standard references, superseding editions, and published BIS amendments.', icon: RotateCcw },
    { num: 7, title: '7. Automated Tender Gap Analysis', desc: 'Audits specifications for missing testing standards, ambiguous clauses, and regulatory compliance gaps.', icon: AlertTriangle },
    { num: 8, title: '8. Certification & Regulatory Review', desc: 'Verifies mandatory Quality Control Orders (QCOs), BIS ISI marking schemes, and CRS requirements.', icon: ShieldCheck },
    { num: 9, title: '9. Generate & Export Specifications', desc: 'Compiles a complete 10-section tender specification ready for download as PDF or TXT report.', icon: FileCheck },
  ];

  return (
    <AppShell title={t('howItWorks') || "How It Works"} subtitle="Complete end-to-end user project workflow for Indian Standards intelligence">
      <div style={{ maxWidth: 1050, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div className="glass-card-bright" style={{ padding: '2rem', borderRadius: 16, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            User Project Workflow: From Raw Tender to Audited Specification
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: 640, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            IS-SMART enables government departments, PSUs, and procurement officers to enter their own custom tenders or specifications and run comprehensive Indian Standards audits.
          </p>
          <Link href="/analyze" className="btn-primary" style={{ padding: '0.65rem 1.5rem', gap: '0.5rem', display: 'inline-flex' }}>
            <span>Create / Select a Project</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Workflow Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="glass-card" style={{ padding: '1.25rem', borderRadius: 14, background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d4ed8', fontSize: '0.9rem' }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {s.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
