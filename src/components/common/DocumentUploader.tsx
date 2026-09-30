'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { extractTextFromFile } from '@/utils/documentExtractor';
import { useLanguage } from '@/context/LanguageContext';

interface DocumentUploaderProps {
  onExtractedText: (text: string, fileName: string) => void;
  compact?: boolean;
}

export default function DocumentUploader({ onExtractedText, compact = false }: DocumentUploaderProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError(t('invalidFileError') || 'Only PDF, DOCX, TXT, or CSV files under 10MB are supported.');
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setLoading(true);

    try {
      const extractedText = await extractTextFromFile(file);
      onExtractedText(extractedText, file.name);
    } catch (err) {
      console.error('File extraction error:', err);
      setError(t('extractionError') || 'Failed to extract text from document.');
    } finally {
      setLoading(false);
    }
  }, [onExtractedText, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  if (compact) {
    return (
      <div>
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#2563eb' : '#cbd5e1'}`,
            borderRadius: 10,
            padding: '0.875rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? '#eff6ff' : '#f8fafc',
            transition: 'all 0.2s ease',
          }}
        >
          <input {...getInputProps()} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.8125rem', fontWeight: 600 }}>
            {loading ? <Loader2 size={16} className="animate-spin" color="#2563eb" /> : <Upload size={16} color="#2563eb" />}
            <span>{loading ? 'Extracting text...' : (fileName ? `Loaded: ${fileName}` : 'Upload PDF / DOCX / TXT')}</span>
          </div>
        </div>
        {error && <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: 12,
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.2s ease',
        }}
      >
        <input {...getInputProps()} />
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" color="#2563eb" />
          ) : fileName ? (
            <CheckCircle size={24} color="#16a34a" />
          ) : (
            <Upload size={24} color="#2563eb" />
          )}
        </div>

        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          {loading ? 'Processing Document...' : fileName ? `Extracted: ${fileName}` : 'Drag & Drop Tender Document'}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          {fileName ? 'Click or drop another file to replace' : 'Supports PDF, DOCX, TXT, CSV up to 10MB'}
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.65rem 0.875rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            color: '#991b1b',
            fontSize: '0.8125rem',
          }}
        >
          <AlertCircle size={16} color="#dc2626" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
