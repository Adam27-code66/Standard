'use client';

import { Search, Sun, Globe, Bell } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { lang, setLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <header
      style={{
        height: 68,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
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
      {/* Left: Mobile Menu Trigger or Empty spacer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
      </div>

      {/* Center: Search Bar (as shown in reference photo) */}
      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 24,
            padding: '0.45rem 1rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search standards, products, tenders..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              color: '#0f172a',
            }}
          />
          <kbd
            style={{
              padding: '0.15rem 0.45rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: '0.6875rem',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right Tools Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Light/Dark Toggle Icon Button */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            cursor: 'pointer',
          }}
          title="Toggle Theme"
        >
          <Sun size={18} />
        </button>

        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.4rem 0.75rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 20,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Globe size={16} color="#64748b" />
            <span>{currentLang.name}</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>▼</span>
          </button>

          {langOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setLangOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  minWidth: 180,
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 99,
                }}
              >
                <div
                  style={{
                    padding: '0.5rem 0.875rem 0.375rem',
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: lang === l.code ? '#eff6ff' : 'transparent',
                      border: 'none',
                      color: lang === l.code ? '#1d4ed8' : '#475569',
                      fontSize: '0.85rem',
                      fontWeight: lang === l.code ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{l.name}</span>
                    {lang === l.code && <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 16,
              height: 16,
              background: '#ef4444',
              borderRadius: '50%',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff',
            }}
          >
            3
          </span>
        </button>

        {/* User Profile Avatar Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingLeft: '0.25rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#1d4ed8',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(29, 78, 216, 0.3)',
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>Admin</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 1 }}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
