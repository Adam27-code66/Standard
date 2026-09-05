'use client';

import { Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FormData {
  product: string;
  purpose: string;
  technicalRequirements: string;
  environment: string;
  industry: string;
}

interface DescribeTabProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalyze: () => void;
}

const INDUSTRIES = [
  'Infrastructure', 'Electrical', 'Water Supply', 'Construction',
  'Lighting', 'Safety', 'Municipal', 'Industrial', 'Mechanical', 'General',
];

export default function DescribeTab({ formData, setFormData, onAnalyze }: DescribeTabProps) {
  const { t } = useLanguage();
  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [field]: e.target.value });

  const isValid = formData.product.trim().length > 0;

  return (
    <div
      className="glass-card-bright"
      style={{ padding: '1.75rem' }}
    >
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Describe Your Product / Requirement
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Describe what you need standards for. The AI will identify applicable Indian Standards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Product */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            {t('product')} <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="product-input"
            className="input-field"
            placeholder={t('productPlaceholder')}
            value={formData.product}
            onChange={update('product')}
          />
        </div>

        {/* Purpose */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            {t('purpose')}
          </label>
          <input
            id="purpose-input"
            className="input-field"
            placeholder={t('purposePlaceholder')}
            value={formData.purpose}
            onChange={update('purpose')}
          />
        </div>

        {/* Technical Requirements */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            {t('techReq')}
          </label>
          <textarea
            id="tech-req-input"
            className="textarea-field"
            rows={5}
            placeholder={t('techReqPlaceholder')}
            value={formData.technicalRequirements}
            onChange={update('technicalRequirements')}
          />
        </div>

        {/* Environment */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            {t('environment')}
          </label>
          <input
            id="env-input"
            className="input-field"
            placeholder={t('envPlaceholder')}
            value={formData.environment}
            onChange={update('environment')}
          />
        </div>

        {/* Industry */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
            {t('industry')}
          </label>
          <select
            id="industry-select"
            className="input-field"
            value={formData.industry}
            onChange={update('industry')}
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {t('regionalNote')}
        </p>
        <button
          id="analyze-btn"
          className="btn-primary"
          onClick={onAnalyze}
          disabled={!isValid}
          style={{
            opacity: isValid ? 1 : 0.5,
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontSize: '0.9375rem',
            padding: '0.7rem 1.75rem',
          }}
        >
          <Zap size={16} />
          {t('analyzeBtn')}
        </button>
      </div>
    </div>
  );
}
