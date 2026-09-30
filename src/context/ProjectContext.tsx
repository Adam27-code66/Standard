'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProject, ProjectDocument, AnalysisRecord, ExtractedRequirements, AnalysisResult } from '@/types';
import { extractRequirementsSync, runFullAnalysis } from '@/services/aiServices';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';

interface ProjectContextValue {
  projects: UserProject[];
  activeProject: UserProject | null;
  historyRecords: AnalysisRecord[];
  setActiveProject: (project: UserProject | null) => void;
  createProject: (name: string, rawInputText: string, documents?: ProjectDocument[], extractedRequirements?: ExtractedRequirements) => UserProject;
  updateActiveProject: (updates: Partial<UserProject>) => void;
  deleteProject: (id: string) => void;
  addHistoryRecord: (record: Omit<AnalysisRecord, 'id' | 'timestamp'>) => AnalysisRecord;
  deleteHistoryRecord: (id: string) => void;
  loadDemoScenarioAsProject: (scenarioId: string) => UserProject;
}

const ProjectContext = createContext<ProjectContextValue>({
  projects: [],
  activeProject: null,
  historyRecords: [],
  setActiveProject: () => {},
  createProject: () => ({} as UserProject),
  updateActiveProject: () => {},
  deleteProject: () => {},
  addHistoryRecord: () => ({} as AnalysisRecord),
  deleteHistoryRecord: () => {},
  loadDemoScenarioAsProject: () => ({} as UserProject),
});

const PROJECTS_STORAGE_KEY = 'is-smart-user-projects';
const ACTIVE_PROJECT_KEY = 'is-smart-active-project-id';
const HISTORY_STORAGE_KEY = 'is-smart-analysis-history';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [activeProject, setActiveProjectState] = useState<UserProject | null>(null);
  const [historyRecords, setHistoryRecords] = useState<AnalysisRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      let parsedProjects: UserProject[] = storedProjects ? JSON.parse(storedProjects) : [];
      
      // If no projects exist, initialize with a sample default project
      if (parsedProjects.length === 0) {
        const defaultProject: UserProject = {
          id: 'proj-default-01',
          name: 'Chennai Hospital Water Storage Project',
          rawInputText: 'Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals.',
          documents: [
            {
              id: 'doc-01',
              name: 'Hospital_Water_Tank_Req.txt',
              type: 'txt',
              content: 'Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals.',
              uploadedAt: new Date().toISOString(),
            }
          ],
          extractedRequirements: extractRequirementsSync('Procure 500 stainless steel water storage tanks of 750 litre capacity for government hospitals.'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        parsedProjects = [defaultProject];
      }
      setProjects(parsedProjects);

      const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (activeId) {
        const found = parsedProjects.find((p) => p.id === activeId);
        if (found) setActiveProjectState(found);
        else setActiveProjectState(parsedProjects[0] || null);
      } else {
        setActiveProjectState(parsedProjects[0] || null);
      }

      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistoryRecords(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load project state from localStorage:', e);
    }
  }, []);

  function saveProjectsToStorage(updated: UserProject[]) {
    setProjects(updated);
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }

  function setActiveProject(project: UserProject | null) {
    setActiveProjectState(project);
    try {
      if (project) {
        localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    } catch {}
  }

  function createProject(
    name: string,
    rawInputText: string,
    documents: ProjectDocument[] = [],
    extractedRequirements?: ExtractedRequirements
  ): UserProject {
    const extracted = extractedRequirements || extractRequirementsSync(rawInputText);
    const newProj: UserProject = {
      id: `proj-${Date.now()}`,
      name: name.trim() || 'Untitled Project',
      rawInputText,
      documents,
      extractedRequirements: extracted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProj, ...projects];
    saveProjectsToStorage(updated);
    setActiveProject(newProj);
    return newProj;
  }

  function updateActiveProject(updates: Partial<UserProject>) {
    if (!activeProject) return;
    const updatedProj: UserProject = {
      ...activeProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = projects.map((p) => (p.id === activeProject.id ? updatedProj : p));
    saveProjectsToStorage(updatedList);
    setActiveProjectState(updatedProj);
  }

  function deleteProject(id: string) {
    const updatedList = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updatedList);
    if (activeProject?.id === id) {
      setActiveProject(updatedList[0] || null);
    }
  }

  function addHistoryRecord(recordData: Omit<AnalysisRecord, 'id' | 'timestamp'>): AnalysisRecord {
    const newRecord: AnalysisRecord = {
      ...recordData,
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newRecord, ...historyRecords];
    setHistoryRecords(updatedHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
    return newRecord;
  }

  function deleteHistoryRecord(id: string) {
    const updatedHistory = historyRecords.filter((h) => h.id !== id);
    setHistoryRecords(updatedHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch {}
  }

  function loadDemoScenarioAsProject(scenarioId: string): UserProject {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    const rawText = scenario
      ? `${scenario.product}. Purpose: ${scenario.purpose}. ${scenario.technicalRequirements}`
      : 'Sample Procurement Requirement';
    
    const projName = scenario ? `${scenario.name} (Preset)` : 'Preset Project';

    // Check if project already exists in projects list
    const existing = projects.find((p) => p.name === projName);
    if (existing) {
      setActiveProject(existing);
      return existing;
    }

    return createProject(projName, rawText);
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        historyRecords,
        setActiveProject,
        createProject,
        updateActiveProject,
        deleteProject,
        addHistoryRecord,
        deleteHistoryRecord,
        loadDemoScenarioAsProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
