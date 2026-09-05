'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Upload, TrendingUp, Shield, Zap, BookOpen, GitBranch, AlertTriangle } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

// ── Animated network background ──────────────────────────────
function NetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const N = 28;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();

    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1.5,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas!.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas!.height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.3;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.moveTo(n.x, n.y);
            ctx!.lineTo(m.x, m.y);
            ctx!.stroke();
          }
        }

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(59,130,246,0.7)';
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}
    />
  );
}

// ── Metric Card ───────────────────────────────────────────────
function MetricCard({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <div
      className="glass-card"
      style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Capability Card ───────────────────────────────────────────
function CapabilityCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.375rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.875rem',
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

// ── Workflow Step ─────────────────────────────────────────────
function WorkflowStep({ step, label, active }: { step: number; label: string; active?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: active ? 'linear-gradient(135deg, #2563eb, #00d4ff)' : 'var(--navy-700)',
          border: active ? 'none' : '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: active ? 'white' : 'var(--text-muted)',
          boxShadow: active ? '0 0 12px rgba(59,130,246,0.5)' : 'none',
        }}
      >
        {step}
      </div>
      <span style={{ fontSize: '0.65rem', color: active ? '#60a5fa' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}

const WORKFLOW_STEPS = [
  'Input', 'AI Analysis', 'Product ID', 'Req Extraction', 'Std Matching',
  'Relationships', 'Version Check', 'Gap Analysis', 'Certifications', 'Spec Generation',
];

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="IS-SMART AI Indian Standards Intelligence">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <div
          className="glass-card-bright"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '3rem 2.5rem',
            marginBottom: '1.5rem',
            minHeight: 260,
          }}
        >
          <NetworkViz />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>
              🤖 AI-Powered • Demo Mode Active
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: '0.875rem',
                maxWidth: 620,
              }}
            >
              <span className="gradient-text">Find the Right Indian Standards.</span>
              <br />
              Build Better Tenders.
            </h1>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: '1.75rem',
              }}
            >
              AI-powered assistance for identifying applicable Indian Standards, related requirements,
              certifications, amendments, and tender specification gaps.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link href="/analyze" className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.75rem 1.75rem' }}>
                <Zap size={16} />
                Analyze Requirement
              </Link>
              <Link href="/tender" className="btn-secondary" style={{ fontSize: '0.9375rem', padding: '0.75rem 1.75rem' }}>
                <Upload size={16} />
                Upload Tender
              </Link>
            </div>
          </div>

          {/* Floating badge */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 10,
              padding: '0.625rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 2,
            }}
          >
            <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div className="pulse-glow" style={{ width: 7, height: 7, background: '#10b981', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Demo Active</span>
            </div>
          </div>
        </div>

        {/* ── Metrics ──────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <MetricCard value="1,250+" label="Standards Indexed (Demo KB)" icon="📚" color="#3b82f6" />
          <MetricCard value="4,800+" label="Relationships Mapped" icon="🔗" color="#00d4ff" />
          <MetricCard value="128" label="Tender Analyses Run" icon="📋" color="#a78bfa" />
          <MetricCard value="347" label="Potential Issues Detected" icon="⚠️" color="#f59e0b" />
        </div>

        {/* ── AI Workflow ───────────────────────────────────── */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <GitBranch size={16} color="#60a5fa" />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Analysis Pipeline
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem', flex: 1, minWidth: 70 }}>
                <WorkflowStep step={i + 1} label={step} active={i < 3} />
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div style={{ marginTop: 14, flexShrink: 0 }}>
                    <ArrowRight size={12} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            IS-SMART understands requirements semantically — not just keyword matching.
          </p>
        </div>

        {/* ── Capability Cards ──────────────────────────────── */}
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.875rem' }}>
          Platform Capabilities
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <CapabilityCard
            icon={Zap}
            title="AI Requirement Analysis"
            description="Extracts product type, application, environment, and technical requirements from natural language input."
            color="#3b82f6"
          />
          <CapabilityCard
            icon={BookOpen}
            title="Semantic Standards Matching"
            description="Matches requirements against the knowledge base using AI relevance scoring, not simple keyword search."
            color="#00d4ff"
          />
          <CapabilityCard
            icon={GitBranch}
            title="Standards Relationship Graph"
            description="Visualizes normative references, test methods, safety, installation, and related product standards."
            color="#a78bfa"
          />
          <CapabilityCard
            icon={TrendingUp}
            title="Version & Amendment Check"
            description="Detects outdated standard references in tender documents and recommends the latest editions."
            color="#10b981"
          />
          <CapabilityCard
            icon={AlertTriangle}
            title="Tender Gap Analysis"
            description="Audits procurement specifications for missing test standards, safety requirements, and certification clauses."
            color="#f59e0b"
          />
          <CapabilityCard
            icon={Shield}
            title="Specification Generator"
            description="Generates structured, ready-to-use tender specifications based on identified applicable standards."
            color="#ec4899"
          />
        </div>

        {/* ── Quick Start Scenarios ─────────────────────────── */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Quick Demo Scenarios
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Try a pre-built scenario to experience the full IS-SMART workflow
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { icon: '💡', label: 'LED Street Light', href: '/analyze?scenario=scenario-led' },
              { icon: '🔧', label: 'Industrial Water Pump', href: '/analyze?scenario=scenario-pump' },
              { icon: '🏗️', label: 'Cement / OPC', href: '/analyze?scenario=scenario-cement' },
              { icon: '⚡', label: 'MCB / Electrical', href: '/analyze?scenario=scenario-mcb' },
              { icon: '⛑️', label: 'Safety Helmet', href: '/analyze?scenario=scenario-ppe' },
            ].map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="btn-ghost"
                style={{ gap: '0.5rem', fontSize: '0.8125rem' }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── AI Disclaimer ─────────────────────────────────── */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 10,
            padding: '0.875rem 1.25rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.75rem', color: '#fbbf24', lineHeight: 1.6, margin: 0 }}>
            <strong>AI-generated recommendations.</strong> Verify applicable standards, current editions, amendments, and certification requirements against official BIS sources before finalizing procurement documents. Standards data shown is from the Demo Knowledge Base and is for prototype purposes only.
          </p>
        </div>

      </div>
    </AppShell>
  );
}
