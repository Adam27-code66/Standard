'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 49,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          marginLeft: 260,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease',
        }}
        className="main-content"
      >
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .sidebar-desktop { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
