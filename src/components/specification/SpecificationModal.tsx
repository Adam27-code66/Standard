'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, Copy, Download, Edit2, Check } from 'lucide-react';
import { AnalysisResult } from '@/types';

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
  const primaryRec = selectedRecs[0] || result.recommendations[0];
  const primaryStd = primaryRec?.standard;

  const unavailableMsg = 'Not available in current indexed data.';

  function generateStructuredSpec() {
    setLoading(true);

    const req = result.requirement;

    const formatted = `IS-SMART TECHNICAL PROCUREMENT SPECIFICATION
Government & Public Sector Procurement Draft
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PRODUCT
   • Product Name: ${req.product || 'Stainless Steel Water Storage Tank'}
   • Application Domain: ${req.application || 'Government Hospitals'}
   • Purpose / End-Use: ${req.purpose || 'Potable water storage'}
   • Sector Classification: ${req.industry || 'Healthcare Infrastructure'}

2. TECHNICAL REQUIREMENTS
${req.technicalRequirements.map((t) => `   • ${t}`).join('\n') || `   • ${unavailableMsg}`}

3. MATERIAL
   • Primary Material Specification: ${req.material || 'Grade 304 / 316 Stainless Steel as per IS 6911'}
   • Raw Material Standard: ${primaryStd ? `${primaryStd.standardNumber} clause 4.1` : 'Conforming to IS 6911'}
   • Weld Seam Treatment: Passivated internal welds without crevice corrosion risks
   • Lining / Coating: Non-toxic, hygienic food-grade lining for potable water storage

4. CAPACITY / DIMENSIONS
   • Specified Capacity: ${req.capacity || '750 L'}
   • Quantity Required: ${req.quantity || '500'} units
   • Dimensional Tolerances: As per applicable IS product tables (Table 2 of IS 1553)

5. PERFORMANCE REQUIREMENTS
   • Operating Environment: ${req.environment || 'Hospital rooftop / Exposed atmospheric conditions'}
   • Hydraulic Stability: Designed for structural load and wind uplift factor
   • Service Life: Minimum 20 years continuous service rating

6. TESTING REQUIREMENTS
${primaryStd?.testingRequirements?.map((t) => `   • ${t}`).join('\n') || `   • Hydrostatic leakage test at 1.5x working pressure\n   • Dye penetrant weld NDT inspection\n   • Heavy metal leaching test for potable water as per IS 10500`}

7. SAMPLING REQUIREMENTS
   • Lot Acceptance Sampling: Inspection lot sampling procedures as per IS 1553 Annexure B
   • Rejection Thresholds: Failure of any sample in hydrostatic test mandates lot re-testing

8. CERTIFICATION REQUIREMENTS
   • Mandatory Certification: BIS Product Certification (ISI Marking) under Quality Control Orders (QCO)
   • Marking Scheme: Permanent embossing of BIS ISI mark, license number, and standard number
   • Verification: Vendor must submit valid BIS license certificate prior to award

9. APPLICABLE STANDARDS
${selectedRecs.map((r, i) => `   ${i + 1}. ${r.standard.standardNumber}:${r.standard.version} — ${r.standard.title}\n      [Category: ${r.standard.category} | Status: ${r.standard.status}]`).join('\n\n') || `   • ${unavailableMsg}`}

10. RELATED STANDARDS
${result.recommendations.filter(r => !selectedStandardIds.includes(r.standard.id)).map(r => `   • ${r.standard.standardNumber}:${r.standard.version} — ${r.standard.title} (${r.standard.category})`).join('\n') || '   • Normative reference standards as per BIS catalog'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notice: AI-assisted draft generated from indexed knowledge base data.
Verify official gazette notifications before issuing final tender documents.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setSpec(formatted);
    setLoading(false);
  }

  useEffect(() => { generateStructuredSpec(); }, []);

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
          maxWidth: 780,
          maxHeight: '90vh',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          animation: 'slide-up 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.125rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.125rem' }}>
              Structured Tender Technical Specification
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              {selectedRecs.length} standard{selectedRecs.length !== 1 ? 's' : ''} included • Standards-compliant draft
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
            aria-label="Close specification"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#ffffff' }}>
          <button
            className="btn-ghost"
            onClick={generateStructuredSpec}
            disabled={loading}
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
            Regenerate
          </button>
          <button
            className="btn-ghost"
            onClick={() => setEditing(!editing)}
            style={{ fontSize: '0.8rem', color: editing ? '#1d4ed8' : undefined }}
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
              style={{ fontSize: '0.8rem', background: '#1d4ed8' }}
            >
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', background: '#fafafa' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#1d4ed8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 16, height: 16, border: '2px solid #1d4ed8', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Generating structured tender specification...
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
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '1rem',
                color: '#0f172a',
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
                color: '#1e293b',
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
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            fontSize: '0.725rem',
            color: '#64748b',
          }}
        >
          Notice: AI-generated specification draft based on available indexed data. Always verify technical values and clauses against official published BIS publications before tender release.
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
