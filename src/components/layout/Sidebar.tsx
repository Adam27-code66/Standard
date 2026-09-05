'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  FileText,
  FileEdit,
  Search,
  GitBranch,
  AlertTriangle,
  RotateCcw,
  History,
  Bot,
  ChevronRight,
  Droplet
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'ANALYSIS',
    items: [
      { href: '/analyze', icon: Zap, label: 'Analyze Requirement' },
      { href: '/tender', icon: FileText, label: 'Tender Analyzer' },
      { href: '/specification', icon: FileEdit, label: 'Spec Assistant' },
    ],
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { href: '/explorer', icon: Search, label: 'Standards Explorer' },
      { href: '/graph', icon: GitBranch, label: 'Standards Graph' },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { href: '/analyze#gap-analysis', icon: AlertTriangle, label: 'Gap Analysis' },
      { href: '/history#version-check', icon: RotateCcw, label: 'Version & Amendments' },
      { href: '/history', icon: History, label: 'Analysis History' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 260,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: '#1d4ed8',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(29, 78, 216, 0.25)',
          }}
        >
          <Droplet size={20} fill="#ffffff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', letterSpacing: '0.02em', lineHeight: 1.1 }}>
            IS-SMART
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.01em', marginTop: 2 }}>
            Indian Standards Intelligence
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.875rem' }}>
        {/* Dashboard Active Item */}
        <Link
          href="/"
          className={`sidebar-link ${pathname === '/' ? 'active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1rem',
            borderRadius: 10,
            marginBottom: '1.25rem',
            fontWeight: 600,
          }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        {/* Grouped Nav Items */}
        {NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.08em',
                padding: '0 0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              {group.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                    }}
                  >
                    <Icon size={17} style={{ opacity: isActive ? 1 : 0.7 }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* AI Assistant Banner Widget */}
      <div style={{ padding: '0.875rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            borderRadius: 14,
            padding: '1rem',
            color: '#ffffff',
            boxShadow: '0 8px 20px rgba(29, 78, 216, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={18} color="#ffffff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>AI Assistant</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dbeafe', lineHeight: 1.4, marginBottom: '0.75rem' }}>
            Need help finding Indian Standards?
          </div>
          <Link
            href="/analyze"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.5rem',
              background: '#ffffff',
              color: '#1d4ed8',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <span>Ask IS-SMART</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Footer System Status */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>
          SYSTEM STATUS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#334155', fontWeight: 500 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
            }}
          />
          <span>All Systems Operational</span>
        </div>
      </div>
    </aside>
  );
}
