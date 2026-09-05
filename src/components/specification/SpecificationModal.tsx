'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, Copy, Download, Edit2, Check } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { generateSpecification } from '@/services/aiServices';

interface Props {
  result: AnalysisResult;
  selectedStandardIds: string[];
  onClose: () => void;
}

export default function SpecificationModal({ result, selectedStandardIds, onClose }: Props) {
  const [spec, setSpec] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedRecs = result.recommendations.filter((r) =>
    selectedStandardIds.includes(r.standard.id)
  );

  async function generate() {
    setLoading(true);
    const s = await generateSpecification(result.requirement, selectedRecs);
    setSpec(s);
    setLoading(false);
  }

  useEffect(() => { generate(); }, []);

  async function copy() {
    await navigator.clipboard.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function exportPDF() {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const margin = 15;
      const maxWidth = 180;
      const lines = doc.splitTextToSize(spec, maxWidth);
      let y = 20;

      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);

      lines.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 4.5;
      });

      doc.save(`IS-SMART_Specification_${result.requirement.product.replace(/\s+/g, '_')}.pdf`);
    });
  }

  function exportTxt() {
    const blob = new Blob([spec], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IS-SMART_Specification_${result.requirement.product.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 760,
          maxHeight: '90vh',
          background: 'var(--navy-900)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slide-up 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.125rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--navy-800)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.125rem' }}>
              Generated Tender Specification
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              {selectedRecs.length} standard{selectedRecs.length !== 1 ? 's' : ''} included • AI-generated draft
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
            aria-label="Close specification"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions */}
        <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--navy-850)' }}>
          <button
            className="btn-ghost"
            onClick={generate}
            disabled={loading}
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
            Regenerate
          </button>
          <button
            className="btn-ghost"
            onClick={() => setEditing(!editing)}
            style={{ fontSize: '0.8rem', color: editing ? '#60a5fa' : undefined }}
          >
            <Edit2 size={13} />
            {editing ? 'Done Editing' : 'Edit'}
          </button>
          <button
            className="btn-ghost"
            onClick={copy}
            style={{ fontSize: '0.8rem', color: copied ? '#10b981' : undefined }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-ghost"
              onClick={exportTxt}
              style={{ fontSize: '0.8rem' }}
            >
              <Download size={13} />
              Export TXT
            </button>
            <button
              id="export-pdf-btn"
              className="btn-primary"
              onClick={exportPDF}
              style={{ fontSize: '0.8rem' }}
            >
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#60a5fa', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 16, height: 16, border: '2px solid #3b82f6', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Generating specification...
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 16, width: `${75 + Math.random() * 25}%` }} />
              ))}
            </div>
          ) : editing ? (
            <textarea
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              style={{
                width: '100%',
                minHeight: 480,
                background: 'var(--navy-800)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '1rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
              }}
            />
          ) : (
            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}
            >
              {spec}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.875rem 1.5rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--navy-800)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
          }}
        >
          ⚠️ AI-generated draft. Verify all standards references, certification requirements, and technical details against official BIS sources before use in actual procurement documents.
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
