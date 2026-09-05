'use client';

import AppShell from '@/components/layout/AppShell';
import { useState } from 'react';
import { Save, Server, Trash2, CheckCircle } from 'lucide-react';
import { useLanguage, LANGUAGES, LangCode } from '@/context/LanguageContext';

export default function SettingsPage() {
  const { lang, setLang } = useLanguage();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Persist API endpoint to localStorage
    try { localStorage.setItem('is-smart-api-endpoint', apiEndpoint); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function clearHistory() {
    if (confirm('Clear all analysis history?')) {
      localStorage.removeItem('is-smart-analysis-history');
      alert('History cleared successfully.');
    }
  }

  return (
    <AppShell title="Settings" subtitle="Application preferences and configuration">
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Language */}
        <div className="glass-card-bright" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '1.125rem' }}>🌐</span>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Interface Language
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Select your preferred language for the analysis interface. Your choice is saved automatically.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.625rem' }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                id={`settings-lang-${l.code}`}
                onClick={() => setLang(l.code as LangCode)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: lang === l.code ? '#eff6ff' : '#ffffff',
                  border: `2px solid ${lang === l.code ? '#1d4ed8' : '#e2e8f0'}`,
                  color: lang === l.code ? '#1d4ed8' : '#475569',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  fontWeight: lang === l.code ? 700 : 400,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => { if (lang !== l.code) e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; }}
                onMouseLeave={(e) => { if (lang !== l.code) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span>{l.name}</span>
                {lang === l.code && <CheckCircle size={14} color="#10b981" />}
              </button>
            ))}
          </div>
          {lang !== 'en' && (
            <div
              style={{
                marginTop: '0.875rem',
                padding: '0.625rem 0.875rem',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 8,
                fontSize: '0.8rem',
                color: '#34d399',
              }}
            >
              ✓ Language changed to <strong>{LANGUAGES.find((l) => l.code === lang)?.name}</strong>. Form labels and placeholders on the Analyze page are now in your selected language.
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="glass-card-bright" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <Server size={18} color="#60a5fa" />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Backend API Configuration
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Connect to a real Python/FastAPI backend for live AI analysis. Leave blank to use Demo Mode.
          </p>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            Backend API Endpoint
          </label>
          <input
            id="api-endpoint-input"
            className="input-field"
            placeholder="https://your-backend.railway.app"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Or set <code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '0.1rem 0.3rem', borderRadius: 4 }}>NEXT_PUBLIC_API_ENDPOINT</code> as an environment variable. API keys are never stored in the frontend.
          </p>
        </div>

        {/* Demo Mode */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.5rem' }}>
            🔬 Demo Mode Active
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 0.875rem' }}>
            All analysis uses the local Demo Knowledge Base. Standards data is NOT official BIS data.
          </p>
          <button className="btn-ghost" onClick={clearHistory} style={{ fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
            <Trash2 size={13} />
            Clear History
          </button>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="save-settings-btn"
            className="btn-primary"
            onClick={handleSave}
            style={{ fontSize: '0.875rem', padding: '0.7rem 1.5rem' }}
          >
            {saved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
