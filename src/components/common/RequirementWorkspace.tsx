'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';
import { Folder, Plus, FileText, Upload, Sparkles, Edit3, Check, Trash2, Layers } from 'lucide-react';
import DocumentUploader from './DocumentUploader';

interface RequirementWorkspaceProps {
  onAnalyze?: () => void;
  showAnalyzeBtn?: boolean;
}

export default function RequirementWorkspace({ onAnalyze, showAnalyzeBtn = true }: RequirementWorkspaceProps) {
  const { t } = useLanguage();
  const { projects, activeProject, setActiveProject, createProject, updateActiveProject, deleteProject, loadDemoScenarioAsProject } = useProject();

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjText, setNewProjText] = useState('');
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');

  const handleStartCreate = () => {
    setNewProjName('');
    setNewProjText('');
    setIsCreating(true);
  };

  const handleSaveNewProject = () => {
    if (!newProjText.trim() && !newProjName.trim()) return;
    const name = newProjName.trim() || `Tender Project ${projects.length + 1}`;
    createProject(name, newProjText);
    setIsCreating(false);
  };

  const handleStartEdit = () => {
    if (!activeProject) return;
    setEditName(activeProject.name);
    setEditText(activeProject.rawInputText);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!activeProject) return;
    updateActiveProject({
      name: editName.trim() || activeProject.name,
      rawInputText: editText,
    });
    setIsEditing(false);
  };

  const handleExtractedTextForNew = (extractedText: string, fileName: string) => {
    if (!newProjName) {
      setNewProjName(fileName.replace(/\.[^/.]+$/, ''));
    }
    setNewProjText((prev) => (prev ? `${prev}\n\n${extractedText}` : extractedText));
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #2563eb' }}>
      {/* Top Header / Project Switcher Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={18} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Project Input Workspace
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              {activeProject ? activeProject.name : 'No Active Project'}
            </div>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Project Dropdown Selector */}
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const selected = projects.find((p) => p.id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            style={{
              padding: '0.45rem 0.875rem',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              maxWidth: 240,
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>

          {/* Create New Project Button */}
          <button
            onClick={handleStartCreate}
            className="btn-secondary"
            style={{ fontSize: '0.8125rem', padding: '0.45rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>Create Project</span>
          </button>

          {/* Preset Scenario Selector */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  loadDemoScenarioAsProject(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              style={{
                padding: '0.45rem 0.875rem',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                ⚡ Load Preset Example...
              </option>
              {DEMO_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Project Content Preview / Editor */}
      {isCreating ? (
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '1.25rem', marginTop: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} color="#2563eb" /> Create New User Project
          </h4>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Hospital Water Storage Tank Tender 2026"
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.875rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0f172a',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Tender / Technical Requirement Text
            </label>
            <textarea
              rows={4}
              placeholder="Paste tender specifications, requirements, capacity, materials, testing requirements..."
              value={newProjText}
              onChange={(e) => setNewProjText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem',
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <DocumentUploader onExtractedText={handleExtractedTextForNew} compact />
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setIsCreating(false)} style={{ fontSize: '0.8125rem', padding: '0.45rem 0.875rem' }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveNewProject} style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}>
              Save & Activate Project
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '1.25rem', marginTop: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={16} color="#2563eb" /> Edit Active Project
          </h4>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Project Title
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}
            />
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Requirement / Tender Text
            </label>
            <textarea
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.875rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8125rem', color: '#1e293b', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setIsEditing(false)} style={{ fontSize: '0.8125rem', padding: '0.45rem 0.875rem' }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveEdit} style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}>
              Save Changes
            </button>
          </div>
        </div>
      ) : activeProject ? (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.875rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5, maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <strong>Active Input:</strong> &ldquo;{activeProject.rawInputText}&rdquo;
              </div>
              {activeProject.extractedRequirements && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <span className="badge badge-blue">Product: {activeProject.extractedRequirements.product.value}</span>
                  <span className="badge badge-gray">Material: {activeProject.extractedRequirements.material.value}</span>
                  <span className="badge badge-gray">Capacity: {activeProject.extractedRequirements.capacity.value}</span>
                  <span className="badge badge-gray">Quantity: {activeProject.extractedRequirements.quantity.value}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={handleStartEdit}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Edit3 size={14} /> Edit
              </button>

              {projects.length > 1 && (
                <button
                  onClick={() => deleteProject(activeProject.id)}
                  title="Delete project"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#dc2626',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}

              {showAnalyzeBtn && onAnalyze && (
                <button
                  className="btn-primary"
                  onClick={onAnalyze}
                  style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={14} /> Run Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
