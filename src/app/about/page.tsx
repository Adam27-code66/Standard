'use client';

import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, BookOpen, GitBranch, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <AppShell title={t('about') || "About IS-SMART"} subtitle="Indian Standards Intelligence Platform for Procurement & Compliance">
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Hero Banner */}
        <div className="glass-card-bright" style={{ padding: '2.25rem', borderRadius: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Sparkles size={14} color="#1d4ed8" />
            <span>Public User Project Platform</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0', lineHeight: 1.3 }}>
            Connecting User Tenders & Specifications to Indian Standards Intelligence
          </h1>

          <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.75, margin: '0 0 1.5rem 0' }}>
            <strong>IS-SMART</strong> allows government departments, PSUs, procurement agencies, and technical reviewers to upload or enter their own custom tenders and requirements. The platform connects procurement text to relevant Indian Standards, explains why they match with transparent evidence, maps normative/related standards, verifies version history, identifies certification considerations, detects tender gaps, and helps generate a 10-section specification.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link href="/analyze" className="btn-primary" style={{ padding: '0.65rem 1.35rem', gap: '0.5rem' }}>
              <span>Start User Project</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/explorer" className="btn-secondary" style={{ padding: '0.65rem 1.35rem' }}>
              Explore Standards
            </Link>
          </div>
        </div>

        {/* Key Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
            <BookOpen size={24} color="#1d4ed8" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Custom User Input First
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Upload PDF/DOCX/TXT documents or paste tender requirements directly into your workspace.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
            <GitBranch size={24} color="#059669" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Relationship Knowledge Graph
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Visualizes normative references, testing standards, safety codes, and installation practices in an interactive graph.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
            <ShieldCheck size={24} color="#dc2626" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Automated Gap Detection
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Audits tender requirements to detect missing testing standards, outdated editions, and certification gaps.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
