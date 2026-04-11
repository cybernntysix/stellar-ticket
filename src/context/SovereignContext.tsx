import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3002`;

interface SovereignContextType {
  uploadedAssets: any[];
  savedProjects: any[];
  sovereignCuration: any | null;
  identityStatement: string;
  isAuditing: boolean;
  auditProgress: number;
  auditResult: any | null;
  theme: string;
  userDomains: string[];
  userSkills: string;
  fetchAssets: () => Promise<any[]>;
  fetchProjects: () => Promise<void>;
  handleFileSelect: (files: FileList) => Promise<void>;
  generateSovereignty: (promptValue?: string) => Promise<void>;
  compileForgeNodes: () => Promise<void>;
  saveSovereignSnapshot: () => Promise<void>;
  loadSnapshot: (snapshot: any) => void;
  handleAudit: (skillLabel: string) => Promise<string | null>;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  setUserDomains: (domains: string[]) => void;
  setUserSkills: (skills: string) => void;
  setSovereignCuration: (curation: any) => void;
  setIdentityStatement: (statement: string) => void;
  setIsAuditing: (is: boolean) => void;
  setAuditResult: (res: any) => void;
  setAuditProgress: (prog: number) => void;
  setOnboardingStep: (step: number) => void;
  assignVisualToNode: (nodeLabel: string, visualData: any) => void;
}

const SovereignContext = createContext<SovereignContextType | undefined>(undefined);

export const SovereignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedAssets, setUploadedAssets] = useState<any[]>([]);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [sovereignCuration, setSovereignCuration] = useState<any | null>(null);
  const [identityStatement, setIdentityStatement] = useState("NEURAL IDENTITY STANDBY // INITIALIZE ONBOARDING");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [theme, setThemeState] = useState('dark');
  const [userDomains, setUserDomains] = useState(['', '', '', '']);
  const [userSkills, setUserSkills] = useState('ANALYTICAL, STRATEGIC, PRECISION-DRIVEN');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (t: string) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

  const fetchAssets = useCallback(async () => {
    try {
      const r = await fetch(`${BASE_URL}/api/assets`);
      const assets = await r.json();
      if (Array.isArray(assets)) {
        setUploadedAssets(assets);
        return assets;
      }
      return [];
    } catch (e) {
      console.error("Asset fetch failed", e);
      return [];
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const r = await fetch(`${BASE_URL}/api/projects`);
      const d = await r.json();
      setSavedProjects(Array.isArray(d) ? d : []);
    } catch (e) {
      setSavedProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchProjects();
  }, [fetchAssets, fetchProjects]);

  const handleFileSelect = async (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
    try {
      await fetch(`${BASE_URL}/api/upload`, { method: 'POST', body: formData });
      await fetchAssets();
    } catch (e) {
      console.error('Upload failed', e);
    }
  };

  const compileForgeNodes = async () => {
    setIsAuditing(true);
    setAuditProgress(30);
    try {
      const response = await fetch(`${BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `DOMAINS: ${userDomains.join(', ')} | ATTRIBUTES: ${userSkills}`,
          lens: 'cli',
          customPrompt: `ACT AS THE PARADIGMOS COMPILER. 
          1. FORMULA: Based on these Domains and Attributes, reason out 8 high-status expert 'Neural Nodes' (2-3 words each, e.g. \"STRATEGIC ARCHITECTURE\").
          2. DEPTH: For each node, synthesize a 'Depth Summary' that bridges the skill with an elite attribute.
          3. IDENTITY STATEMENT: One powerful marketable statement.
          RETURN JSON ONLY: { \"discoveredNodes\": [{ \"label\": \"NODE TITLE\", \"depthSummary\": \"...\" }, ...], \"statement\": \"...\" }`
        })
      });
      const data = await response.json();
      if (data.discoveredNodes) {
        setSovereignCuration(prev => ({ ...prev, discoveredNodes: data.discoveredNodes }));
      }
      if (data.statement) setIdentityStatement(data.statement.toUpperCase());
    } catch (e) {
      console.error('Compilation failed');
    } finally {
      setIsAuditing(false);
    }
  };

  const generateSovereignty = async (promptValue: string = "") => {
    if (isAuditing) return; 
    setIsAuditing(true);
    setAuditProgress(10);
    setSovereignCuration(null);

    try {
      const r_assets = await fetch(`${BASE_URL}/api/assets`);
      if (!r_assets.ok) throw new Error("Neural link failed.");
      const latestAssets = await r_assets.json();
      const docs = latestAssets.filter((a: any) => a.folder === 'documents' || a.name.match(/\.(txt|pdf|csv)$/i)).slice(0, 5);
      let combinedText = "RECORDS: " + latestAssets.map((a: any) => a.name).join(', ');

      setAuditProgress(30);
      const analysisResults = await Promise.all(docs.map(async (asset: any) => {
        const r = await fetch(`${BASE_URL}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: asset.path }) });
        if (!r.ok) return `--- SOURCE: ${asset.name} (ANALYSIS FAILED) ---`;
        const d = await r.json();
        return `\n--- SOURCE: ${asset.name} ---\n${d.text || JSON.stringify(d.data)}`;
      }));

      combinedText += analysisResults.join('\n');

      setAuditProgress(80);
      const summarizeResponse = await fetch(`${BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: combinedText, 
          lens: 'alpha',
          customPrompt: promptValue || `Perform an ELITE SOVEREIGN SYNTHESIS on these records. 

          1. SOVEREIGN IDENTITY (statement): Synthesize ONE single, concise, high-status sentence that anchors the user's authority. No filler.
          2. CURATED INSIGHTS (summary): Provide a comprehensive, multi-paragraph analysis. Integrate the \"Official Record\" (specific numbers, metrics, achievements) with the \"Shadow Vector\" (strategic intuition).
          3. NEURAL NODES (discoveredNodes): Based on the data, identify 8 high-status expert skills (e.g. \"STRATEGIC ARCHITECTURE\", \"EXECUTION VELOCITY\"). For each skill, include 3-5 specific metrics or data points found in the records within the 'depthSummary'.

          MANDATE: Prioritize hard numbers and specific evidentiary metrics found in the provided records.
          TONE: High-status, expert, direct.
          RETURN JSON ONLY: { \"statement\": \"...\", \"summary\": \"...\", \"discoveredNodes\": [{ \"label\": \"EXPERT SKILL\", \"depthSummary\": \"...\" }, ...] }`
        }),
      });
      const data = await summarizeResponse.json();
      
      if (data.statement) setIdentityStatement(data.statement.toUpperCase());

      const newInsight = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        content: data.summary,
        connectiveStatements: data.connectiveStatements || [],
        discoveredNodes: data.discoveredNodes || [], 
        statement: data.statement || identityStatement
      };
      setSovereignCuration(newInsight);
      
      await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newInsight, type: 'snapshot', name: 'AUTO-GEN ' + new Date().toLocaleTimeString() })
      });
      fetchProjects();
    } catch (e: any) {
      console.error('Generation failed', e);
      alert(`NEURAL SYNTHESIS ERROR: ${e.message}`);
    } finally {
      setIsAuditing(false);
      setAuditProgress(100);
    }
  };

  const saveSovereignSnapshot = async () => {
    if (!sovereignCuration) return;
    const name = prompt("NAME THIS SNAPSHOT:", `MARKET SYNTHESIS ${new Date().toLocaleDateString()}`);
    if (!name) return;
    try {
      await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sovereignCuration, name: name.toUpperCase(), type: 'snapshot' })
      });
      fetchProjects();
      alert("SNAPSHOT ARCHIVED.");
    } catch (e) {
      console.error('Save failed');
    }
  };

  const loadSnapshot = (snapshot: any) => {
    setSovereignCuration(snapshot);
    if (snapshot.statement) setIdentityStatement(snapshot.statement.toUpperCase());
  };

  const handleAudit = async (skillLabel: string) => {
    setIsAuditing(true);
    setAuditProgress(10);
    try {
      const auditResp = await fetch(`${BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "AUDIT DATA SOURCE", lens: 'shadow', customPrompt: `Audit skill: "${skillLabel}".` })
      });
      const auditData = await auditResp.json();
      setAuditResult({ label: skillLabel, summary: auditData.summary });
      return auditData.summary;
    } catch (e) {
      console.error('Audit failed');
      return null;
    } finally {
      setIsAuditing(false);
    }
  };

  const assignVisualToNode = (nodeLabel: string, visualData: any) => {
    setSovereignCuration((prev: any) => {
      if (!prev || !prev.discoveredNodes) return prev;
      return {
        ...prev,
        discoveredNodes: prev.discoveredNodes.map((n: any) => 
          n.label === nodeLabel ? { ...n, visualData } : n
        )
      };
    });
  };

  return (
    <SovereignContext.Provider value={{
      uploadedAssets,
      savedProjects,
      sovereignCuration,
      identityStatement,
      isAuditing,
      auditProgress,
      auditResult,
      onboardingStep,
      userDomains,
      userSkills,
      fetchAssets,
      fetchProjects,
      handleFileSelect,
      generateSovereignty,
      compileForgeNodes,
      saveSovereignSnapshot,
      loadSnapshot,
      handleAudit,
      setTheme,
      toggleTheme,
      setUserDomains,
      setUserSkills,
      setSovereignCuration,
      setIdentityStatement,
      setIsAuditing,
      setAuditResult,
      setAuditProgress,
      theme,
      setOnboardingStep,
      assignVisualToNode
    }}>
      {children}
    </SovereignContext.Provider>
  );
};

export const useSovereign = () => {
  const context = useContext(SovereignContext);
  if (context === undefined) {
    throw new Error('useSovereign must be used within a SovereignProvider');
  }
  return context;
};
