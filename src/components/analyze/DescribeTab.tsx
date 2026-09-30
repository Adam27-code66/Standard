'use client';

import { useState } from 'react';
import { Zap, Sparkles, Check, Edit2, ArrowRight } from 'lucide-react';
import { Requirement, ExtractedRequirements } from '@/types';
import { parseNaturalLanguageRequirement } from '@/services/aiServices';

interface DescribeTabProps {
  formData: {
    product: string;
    purpose: string;
    technicalRequirements: string;
    environment: string;
    industry: string;
  };
  setFormData: (data: any) => void;
  onAnalyze: (customReq?: Requirement) => void;
}

const EXAMPLES = [
  { label: 'Stainless Steel Water Tanks (English)', text: 'Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals.' },
  { label: 'Outdoor LED Street Lights (English)', text: 'Procure 100 outdoor LED street lights 100W IP65 for national highway infrastructure project.' },
  { label: 'நீர் சேமிப்பு தொட்டிகள் (Tamil)', text: '500 துருப்பிடிக்காத எஃகு நீர் சேமிப்பு தொட்டிகள் 750 லிட்டர் அரசு மருத்துவமனை' },
  { label: 'पानी की टंकियां (Hindi)', text: 'सरकारी अस्पतालों के लिए 750 लीटर क्षमता वाली 500 स्टेनलेस स्टील पानी की टंकियां' },
];

export default function DescribeTab({ formData, setFormData, onAnalyze }: DescribeTabProps) {
  const [naturalText, setNaturalText] = useState(
    'Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals.'
  );

  const [extracted, setExtracted] = useState<ExtractedRequirements | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [extracting, setExtracting] = useState(false);

  const handleExtract = async () => {
    if (!naturalText.trim()) return;
    setExtracting(true);
    const parsed = await parseNaturalLanguageRequirement(naturalText);
    if (parsed.extractedRequirements) {
      setExtracted(parsed.extractedRequirements);
      setEditValues({
        product: parsed.extractedRequirements.product.value,
        quantity: parsed.extractedRequirements.quantity.value,
        capacity: parsed.extractedRequirements.capacity.value,
        material: parsed.extractedRequirements.material.value,
        application: parsed.extractedRequirements.application.value,
        otherRequirements: parsed.extractedRequirements.otherRequirements.value,
      });
    }
    setExtracting(false);
  };

  const handleSaveEdit = (key: string) => {
    if (!extracted) return;
    setExtracted({
      ...extracted,
      [key]: {
        ...(extracted as any)[key],
        value: editValues[key] || (extracted as any)[key].value,
      },
    });
    setEditingKey(null);
  };

  const handleConfirmAndFind = () => {
    if (!extracted) {
      onAnalyze();
      return;
    }

    const updatedReq: Requirement = {
      product: editValues.product || extracted.product.value,
      purpose: `Procurement of ${editValues.product || extracted.product.value} (${editValues.quantity || extracted.quantity.value} units, ${editValues.capacity || extracted.capacity.value} capacity) for ${editValues.application || extracted.application.value}`,
      application: editValues.application || extracted.application.value,
      technicalRequirements: (editValues.otherRequirements || extracted.otherRequirements.value).split(',').map(s => s.trim()),
      environment: 'Hospital rooftop / Exposed atmosphere',
      industry: 'Healthcare',
      language: 'en',
      rawInput: naturalText,
      quantity: editValues.quantity || extracted.quantity.value,
      capacity: editValues.capacity || extracted.capacity.value,
      material: editValues.material || extracted.material.value,
      extractedRequirements: extracted,
    };

    onAnalyze(updatedReq);
  };

  return (
    <div className="glass-card-bright" style={{ padding: '1.75rem', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
        <Sparkles size={20} color="#1d4ed8" />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Analyze Procurement Requirement
        </h2>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Enter your requirement in natural language (English, Hindi, or Tamil). The AI will structure the parameters and match relevant Indian Standards.
      </p>

      {/* Example Prompts */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Sample Requirements:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="btn-ghost"
              onClick={() => {
                setNaturalText(ex.text);
                setExtracted(null);
              }}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Text Box */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
          Enter Requirement Statement
        </label>
        <textarea
          id="natural-req-input"
          className="textarea-field"
          rows={3}
          value={naturalText}
          onChange={(e) => {
            setNaturalText(e.target.value);
            setExtracted(null);
          }}
          placeholder="e.g. Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals."
          style={{ fontSize: '0.9rem', lineHeight: 1.5 }}
        />
      </div>

      {/* Extract Button */}
      {!extracted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            id="extract-req-btn"
            className="btn-primary"
            onClick={handleExtract}
            disabled={!naturalText.trim() || extracting}
            style={{ padding: '0.65rem 1.5rem', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <Zap size={16} />
            <span>{extracting ? 'Extracting Requirements...' : 'Analyze Requirement'}</span>
          </button>
        </div>
      )}

      {/* ── EXTRACTED REQUIREMENTS CARD ── */}
      {extracted && (
        <div style={{ background: '#f8fafc', border: '1px solid #bfdbfe', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              EXTRACTED REQUIREMENTS
            </div>
            <span className="badge badge-blue">AI Structuring Complete</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              extracted.product,
              extracted.quantity,
              extracted.capacity,
              extracted.material,
              extracted.application,
              extracted.otherRequirements,
            ].map((field) => {
              const isEditing = editingKey === field.key;
              return (
                <div
                  key={field.key}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '0.875rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {field.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '0.1rem 0.4rem', borderRadius: 10 }}>
                        {field.confidence}% Confidence
                      </span>
                      {!isEditing ? (
                        <button
                          onClick={() => setEditingKey(field.key)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEdit(field.key)}
                          style={{ background: '#1d4ed8', border: 'none', borderRadius: 4, color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Check size={11} /> Save
                        </button>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {field.value}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}
                      value={editValues[field.key] || ''}
                      onChange={(e) => setEditValues({ ...editValues, [field.key]: e.target.value })}
                      autoFocus
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              className="btn-secondary"
              onClick={handleConfirmAndFind}
              style={{ fontSize: '0.875rem', padding: '0.65rem 1.25rem' }}
            >
              Confirm Requirements
            </button>

            <button
              id="find-standards-btn"
              className="btn-primary"
              onClick={handleConfirmAndFind}
              style={{ fontSize: '0.875rem', padding: '0.65rem 1.5rem', gap: '0.5rem', background: '#1d4ed8' }}
            >
              <Zap size={16} fill="#ffffff" />
              <span>Find Standards</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
