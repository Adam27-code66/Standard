'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Globe, Bell, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchStandards } from '@/data/demoStandards';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim() ? searchStandards(searchQuery.trim()).slice(0, 5) : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/explorer?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: 68,
        background: 'var(--surface)',
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
      {/* Left: Mobile Menu Trigger */}
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
      </div>

      {/* Center: Live Search Bar with Dropdown & Ctrl+K */}
      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', position: 'relative' }}>
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: '0.45rem 1rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('searchPlaceholder') || 'Search standards, products, tenders...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
              }}
            />
            <kbd
              style={{
                padding: '0.15rem 0.45rem',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => searchInputRef.current?.focus()}
            >
              Ctrl + K
            </kbd>
          </div>
        </form>

        {/* Live Search Results Dropdown */}
        {searchOpen && searchQuery.trim().length > 0 && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 80 }} onClick={() => setSearchOpen(false)} />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                zIndex: 90,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '0.5rem 0.875rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                MATCHING INDIAN STANDARDS ({searchResults.length})
              </div>
              {searchResults.map((std) => (
                <div
                  key={std.id}
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/explorer?q=${encodeURIComponent(std.standardNumber)}`);
                  }}
                  style={{
                    padding: '0.65rem 0.875rem',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    background: 'var(--surface)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {std.standardNumber}
                    </span>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{std.title}</div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
              {searchResults.length === 0 && (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No standards found. Press Enter to search.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Tools Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Light/Dark Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <Globe size={16} color="var(--text-muted)" />
            <span>{currentLang.name}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>▼</span>
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
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
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
                    color: 'var(--text-muted)',
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
                      background: lang === l.code ? 'var(--primary-light)' : 'transparent',
                      border: 'none',
                      color: lang === l.code ? 'var(--primary)' : 'var(--text-secondary)',
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
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
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
              border: '2px solid var(--surface)',
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
              background: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>Admin</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
