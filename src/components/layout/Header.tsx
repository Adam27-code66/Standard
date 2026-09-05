'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { lang, setLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <header
      style={{
        height: 65,
        background: 'var(--navy-900)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: '1rem',
      }}
    >
      {/* Left: Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        {title && (
          <div>
            <h1 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Demo badge */}
        <div className="badge badge-amber" style={{ marginRight: '0.5rem' }}>
          Demo Mode
        </div>

        {/* Language selector */}
        <div style={{ position: 'relative' }}>
          <button
            id="lang-selector-btn"
            className="btn-ghost"
            onClick={() => setLangOpen(!langOpen)}
            style={{ gap: '0.375rem', padding: '0.375rem 0.75rem' }}
            aria-label="Select language"
            aria-expanded={langOpen}
          >
            <span style={{ fontSize: '0.9rem' }}>🌐</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{currentLang.label}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{currentLang.name}</span>
          </button>

          {langOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setLangOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  background: 'var(--navy-800)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  minWidth: 180,
                  overflow: 'hidden',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
                  zIndex: 99,
                  animation: 'slide-up 0.15s ease',
                }}
              >
                <div style={{ padding: '0.5rem 0.875rem 0.375rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    id={`lang-${l.code}`}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: lang === l.code ? 'rgba(59,130,246,0.15)' : 'transparent',
                      border: 'none',
                      color: lang === l.code ? '#60a5fa' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                      borderLeft: `3px solid ${lang === l.code ? '#3b82f6' : 'transparent'}`,
                    }}
                    onMouseEnter={(e) => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { if (lang !== l.code) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontWeight: 700, width: 24, fontSize: '1rem' }}>{l.label}</span>
                    <span>{l.name}</span>
                    {lang === l.code && <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.75rem' }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="btn-ghost" style={{ padding: '0.375rem', position: 'relative' }} aria-label="Notifications">
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, background: '#3b82f6', borderRadius: '50%', border: '1px solid var(--navy-900)' }} />
        </button>

        {/* Quick Analyze CTA */}
        <Link href="/analyze" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.4rem 1rem' }}>
          + Analyze
        </Link>
      </div>
    </header>
  );
}
