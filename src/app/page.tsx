'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Upload,
  ArrowRight,
  BookOpen,
  GitBranch,
  FileText,
  AlertTriangle,
  ExternalLink,
  Pencil,
  Brain,
  Box,
  ClipboardList,
  Search,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  Home,
  Building2,
  Lightbulb
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

export default function Dashboard() {
  const [requirementText, setRequirementText] = useState(
    'Procure 500 stainless steel water storage tanks for government hospitals'
  );

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* ── 1. Hero Card ("AI-Powered Standards Intelligence") ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 20,
            padding: '2.25rem 2.5rem',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column Content */}
          <div>
            {/* Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 20,
                color: '#1d4ed8',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={14} color="#1d4ed8" />
              <span>AI-Powered Standards Intelligence</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: '0 0 0.875rem 0',
              }}
            >
              Find the Right <span style={{ color: '#1d4ed8' }}>Indian Standards</span>.
              <br />
              Build Better Tenders.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.925rem',
                color: '#475569',
                maxWidth: 640,
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0',
              }}
            >
              AI-powered assistance for identifying applicable Indian Standards, related requirements, certifications, amendments, and tender specification gaps.
            </p>

            {/* Procurement Requirement Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 16,
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '0.7875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 500 }}>
                Describe your procurement requirement in detail...
              </div>
              <textarea
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder='Example: "Procure 500 stainless steel water storage tanks for government hospitals"'
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  fontWeight: 500,
                  resize: 'none',
                  minHeight: 48,
                  fontFamily: 'inherit',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                }}
              >
                {/* Upload & Format Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.45rem 0.85rem',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={14} color="#475569" />
                    <span>Upload Tender Document</span>
                  </button>
                  <span style={{ padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, color: '#ef4444' }}>PDF</span>
                  <span style={{ padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, color: '#1d4ed8' }}>DOCX</span>
                  <span style={{ padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, color: '#10b981' }}>XLSX</span>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/analyze?query=${encodeURIComponent(requirementText)}`}
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: 10,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    gap: '0.5rem',
                    background: '#1d4ed8',
                  }}
                >
                  <Sparkles size={16} fill="#ffffff" />
                  <span>Analyze Requirement</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column Visual (India Map Graphic with Network Ring) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: 280,
            }}
          >
            {/* Orbital concentric rings */}
            <div
              style={{
                position: 'absolute',
                width: 240,
                height: 240,
                borderRadius: '50%',
                border: '1px dashed #bfdbfe',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: '50%',
                border: '1px solid #dbeafe',
                background: 'rgba(239, 246, 255, 0.4)',
              }}
            />

            {/* Orbiting Icon Nodes */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 50,
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <FileText size={16} color="#1d4ed8" />
            </div>

            <div
              style={{
                position: 'absolute',
                top: 70,
                right: 15,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <ShieldCheck size={16} color="#1d4ed8" />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 50,
                right: 35,
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <Building2 size={16} color="#1d4ed8" />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 30,
                left: 45,
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <GitBranch size={16} color="#1d4ed8" />
            </div>

            {/* Central Node Badge */}
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(29, 78, 216, 0.4)',
                zIndex: 2,
              }}
            >
              <Box size={34} color="#ffffff" />
            </div>
          </div>
        </div>

        {/* ── 2. Metric Stat Cards Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  STANDARDS INDEXED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.1rem 0' }}>
                  1,250+
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Across all sectors</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="#1d4ed8" />
              </div>
            </div>
            {/* Sparkline SVG */}
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: 36, display: 'block' }}>
              <path d="M0 30 Q 30 15, 60 25 T 120 10 T 180 28 L 200 15 L 200 40 L 0 40 Z" fill="rgba(37,99,235,0.12)" />
              <path d="M0 30 Q 30 15, 60 25 T 120 10 T 180 28 L 200 15" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  RELATIONSHIPS MAPPED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.1rem 0' }}>
                  4,800+
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Standards interconnections</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#d1fae5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GitBranch size={18} color="#059669" />
              </div>
            </div>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: 36, display: 'block' }}>
              <path d="M0 35 Q 40 20, 80 28 T 140 12 T 200 20 L 200 40 L 0 40 Z" fill="rgba(16,185,129,0.12)" />
              <path d="M0 35 Q 40 20, 80 28 T 140 12 T 200 20" fill="none" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  TENDERS ANALYZED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.1rem 0' }}>
                  128
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>This month</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f3e8ff', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#7c3aed" />
              </div>
            </div>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: 36, display: 'block' }}>
              <path d="M0 25 Q 50 35, 100 20 T 160 30 T 200 10 L 200 40 L 0 40 Z" fill="rgba(139,92,246,0.12)" />
              <path d="M0 25 Q 50 35, 100 20 T 160 30 T 200 10" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Card 4 */}
          <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ISSUES DETECTED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.1rem 0' }}>
                  347
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Potential spec gaps</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ffedd5', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color="#ea580c" />
              </div>
            </div>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: 36, display: 'block' }}>
              <path d="M0 32 Q 40 18, 90 28 T 150 15 T 200 25 L 200 40 L 0 40 Z" fill="rgba(249,115,22,0.12)" />
              <path d="M0 32 Q 40 18, 90 28 T 150 15 T 200 25" fill="none" stroke="#f97316" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* ── 3. AI Analysis Pipeline Section ── */}
        <div className="glass-card" style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              AI Analysis Pipeline
            </h3>
            <Link
              href="/analyze"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}
            >
              <span>View Full Pipeline</span>
              <ExternalLink size={14} />
            </Link>
          </div>

          {/* 10-Step Horizontal Process Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {[
              { icon: Pencil, label: 'Input Requirement', sub: '' },
              { icon: Brain, label: 'AI Analysis', sub: 'Understanding', active: true },
              { icon: Box, label: 'Product ID', sub: 'Identification' },
              { icon: ClipboardList, label: 'Req Extraction', sub: 'Key Parameters' },
              { icon: BookOpen, label: 'Standards Matching', sub: 'AI Matching' },
              { icon: GitBranch, label: 'Relationships', sub: 'Mapping' },
              { icon: RotateCcw, label: 'Version Check', sub: 'Latest Versions' },
              { icon: AlertTriangle, label: 'Gap Analysis', sub: 'Issue Detection' },
              { icon: ShieldCheck, label: 'Certifications', sub: 'Validations' },
              { icon: FileCheck, label: 'Spec Generation', sub: 'Output' },
            ].map((step, idx, arr) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: 90 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: step.active ? '#dbeafe' : '#f1f5f9',
                        border: `1px solid ${step.active ? '#1d4ed8' : '#e2e8f0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <StepIcon size={20} color={step.active ? '#1d4ed8' : '#64748b'} />
                    </div>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: step.active ? '#1d4ed8' : '#1e293b', lineHeight: 1.2 }}>
                      {step.label}
                    </div>
                    {step.sub && (
                      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>{step.sub}</div>
                    )}
                  </div>
                  {idx < arr.length - 1 && (
                    <div style={{ color: '#cbd5e1', fontSize: '1rem', fontWeight: 300, margin: '0 0.25rem' }}>
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. Bottom Grid (3 Columns) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          {/* Column 1: Recent Analyses */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Recent Analyses
              </h3>
              <Link href="/history" style={{ fontSize: '0.8125rem', color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: 'Water Tanks', time: 'Today, 10:24 AM', icon: Home },
                { title: 'RCC Pipes', time: 'Yesterday', icon: Building2 },
                { title: 'LED Street Light', time: 'Oct 12, 2023', icon: Lightbulb },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ItemIcon size={18} color="#475569" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.time}</div>
                      </div>
                    </div>
                    <span className="badge badge-green">✓ Completed</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Top Standards by Usage */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Top Standards by Usage
              </h3>
              <Link href="/explorer" style={{ fontSize: '0.8125rem', color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}>
                Explore
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { name: '1. IS 1239', pct: '86%' },
                { name: '2. IS 456', pct: '74%' },
                { name: '3. IS 1893', pct: '62%' },
                { name: '4. IS 2062', pct: '55%' },
                { name: '5. IS 10262', pct: '41%' },
              ].map((std, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    <span>{std.name}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{std.pct}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: std.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Issue Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Issue Summary
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Donut Graphic */}
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e2e8f0" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="3.8" strokeDasharray="41 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeWidth="3.8" strokeDasharray="28 100" strokeDashoffset="-41" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#a855f7" strokeWidth="3.8" strokeDasharray="19 100" strokeDashoffset="-69" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="3.8" strokeDasharray="12 100" strokeDashoffset="-88" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>347</span>
                  <span style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>
                    TOTAL ISSUES
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <span>Missing</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>138</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                    <span>Outdated</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>104</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
                    <span>Ambiguous</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>69</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    <span>Cert Gaps</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>36</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
