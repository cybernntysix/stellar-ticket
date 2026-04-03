import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSovereign } from '../context/SovereignContext';
import NeuralConsole from './NeuralConsole';
import BlenderControls from './BlenderControls';

interface DataVaultProps {
  uploadedAssets: any[];
  fetchAssets: () => Promise<void>;
  onClose: () => void;
  sovereignCuration?: any;
  identityStatement?: string;
}

const DataVault: React.FC<DataVaultProps> = ({ 
  uploadedAssets, 
  fetchAssets, 
  onClose,
  sovereignCuration,
  identityStatement 
}) => {
  const { BASE_URL } = useSovereign() as any;
  const [stagedDocs, setStagedDocs] = useState<any[]>([]);
  const [dataAnalysis, setDataAnalysis] = useState<any>(null);
  const [selectedLens, setSelectedLens] = useState('executive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [mobileView, setMobileView] = useState('insights'); // 'vault', 'insights', 'blender'
  
  // Local Intents (Hardcoded to Summarize only now)
  const intents = { summarize: true, visualize: false };
  const setIntents = () => {}; // No-op to satisfy BlenderControls props

  const chartStackRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth <= 768;

  const handleFileSelect = async (files: FileList) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const r = await fetch(`${BASE_URL || 'http://localhost:3002'}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (r.ok) {
        await fetchAssets();
      }
    } catch (e) {
      console.error('Upload failed');
    }
  };

  const stageDocument = (asset: any) => {
    if (stagedDocs.find(d => d.path === asset.path)) return; 
    setStagedDocs([...stagedDocs, asset]);
  };

  const initiateBlender = async () => {
    if (!stagedDocs || stagedDocs.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setDataAnalysis(null);

    const timer = setInterval(() => {
      setAnalysisProgress(prev => (prev >= 90 ? 90 : prev + 5));
    }, 200);

    try {
      let combinedText = "";
      let hasCsv = false;
      let csvData = null;

      const results = await Promise.all(stagedDocs.map(async (asset) => {
        const r = await fetch(`${BASE_URL || 'http://localhost:3002'}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: asset.path })
        });
        if (!r.ok) return null;
        return r.json();
      }));

      results.forEach((d, i) => {
        if (!d) return;
        if (d.type === 'csv') {
          hasCsv = true;
          csvData = d.data;
        } else {
          combinedText += `\n\n--- DOCUMENT: ${stagedDocs[i].name} ---\n${d.text || ""}`;
        }
      });
      
      if (combinedText.length > 15000) {
        combinedText = combinedText.substring(0, 15000) + "\n\n[CONTEXT TRUNCATED]";
      }

      let finalAnalysis = { type: hasCsv ? 'csv' : 'pdf', data: csvData, text: combinedText, summary: '' };

      const summarizeResponse = await fetch(`${BASE_URL || 'http://localhost:3002'}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: combinedText, 
          lens: selectedLens,
          customPrompt: selectedLens === 'alpha' ? 'Perform an ELITE SOVEREIGN SYNTHESIS. Identify Structural Alpha, apply Dual-Map Logic, and isolate the Master Proof. High-status, expert tone.' : undefined
        }),
      });
      
      const summaryData = await summarizeResponse.json();
      finalAnalysis.summary = summaryData.summary;

      setDataAnalysis(finalAnalysis);
      setAnalysisProgress(100);
      if (isMobile) setMobileView('insights');
    } catch (err) {
      console.error('Synthesis failed:', err);
    } finally {
      setIsAnalyzing(false);
      clearInterval(timer);
    }
  };

  const exportInsightStack = async () => {
    if (!chartStackRef.current) return;
    const element = chartStackRef.current;
    const originalStyle = element.style.cssText;
    
    element.style.width = '1200px';
    element.style.height = 'auto';
    element.style.background = '#000000';
    element.style.padding = '60px';

    try {
      const canvas = await html2canvas(element, { 
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ParadigmOS_Intelligence_Report.pdf');
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      element.style.cssText = originalStyle;
    }
  };

  if (isMobile) {
    return (
      <div className="composer-view" style={{ borderRadius: 0, padding: 0 }}>
        <div className="composer-header" style={{ padding: '0 20px', height: '60px' }}>
          <h2 className="suite-title" style={{ fontSize: '14px' }}>DATA VAULT</h2>
          <button className="placeholder-button secondary glass-panel" onClick={onClose} style={{ padding: '8px 15px', fontSize: '10px' }}>CLOSE</button>
        </div>

        <div className="composer-body" style={{ height: 'calc(100% - 130px)', overflowY: 'auto', padding: '20px' }}>
          {mobileView === 'insights' && (
            <div className="mobile-insights-main">
              <div className="insight-canvas-large" ref={chartStackRef} style={{ padding: '20px', background: 'transparent', border: 'none' }}>
                {(dataAnalysis || sovereignCuration || identityStatement) ? (
                  <div className="analysis-results">
                    {identityStatement && (
                      <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--color-primary)' }}>
                        <h5 className="section-label" style={{ fontSize: '8px', marginBottom: '8px' }}>CORE IDENTITY STATEMENT</h5>
                        <p style={{ fontSize: '16px', fontWeight: 900, color: 'white', margin: 0, lineHeight: '1.4' }}>{identityStatement}</p>
                      </div>
                    )}
                    {(dataAnalysis?.summary || sovereignCuration?.content) && (
                      <div className="summary-section">
                        <h5 className="section-label">EXECUTIVE SUMMARY</h5>
                        <div className="summary-text-full" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                          {dataAnalysis?.summary || sovereignCuration?.content}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="loading-state" style={{ height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="pulse-orb" style={{ width: '40px', height: '40px' }}></div>
                    <p className="tray-title" style={{ marginTop: '20px', fontSize: '10px' }}>AWAITING SYNTHESIS</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {mobileView === 'vault' && (
            <div className="mobile-vault-view">
              <h4 className="tray-title" style={{ marginBottom: '20px' }}>VAULT RECORDS</h4>
              <div className="tray-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {(uploadedAssets || []).filter(a => a.name.match(/\.(csv|pdf|txt)$/i)).map((asset, i) => (
                  <button key={i} className="sidebar-btn" onClick={() => { stageDocument(asset); setMobileView('blender'); }} style={{ textAlign: 'left', padding: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>
                    {asset.name}
                  </button>
                ))}
                {(!uploadedAssets || uploadedAssets.length === 0) && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center' }}>NO RECORDS IN VAULT</p>}
              </div>
              <button className="primary-action-btn" style={{ width: '100%', marginTop: '30px', padding: '15px' }} onClick={() => (document.getElementById('mobile-file-input') as HTMLInputElement)?.click()}>
                INGEST NEW DATA
              </button>
              <input id="mobile-file-input" type="file" multiple onChange={(e) => handleFileSelect(e.target.files!)} style={{ display: 'none' }} />
            </div>
          )}

          {mobileView === 'blender' && (
            <div className="mobile-blender-view">
              <h4 className="tray-title" style={{ marginBottom: '20px' }}>STAGED FOR SYNTHESIS</h4>
              <div className="staged-list" style={{ marginBottom: '30px' }}>
                {stagedDocs.map((asset, i) => (
                  <div key={i} className="sidebar-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', overflow: 'hidden', width: '100%' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1 }}>{asset.name}</span>
                    <button onClick={() => setStagedDocs(stagedDocs.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', flexShrink: 0, marginLeft: '10px' }}>✕</button>
                  </div>
                ))}
                {stagedDocs.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center' }}>SELECT FILES FROM VAULT</p>}
              </div>

              <BlenderControls 
                intents={intents}
                setIntents={setIntents}
                selectedLens={selectedLens}
                setSelectedLens={setSelectedLens}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                initiateBlender={initiateBlender}
                stagedCount={stagedDocs.length}
              />
            </div>
          )}
        </div>

        <div className="mobile-suite-nav" style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
          display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)',
          zIndex: 100
        }}>
          <button 
            className={`nav-item ${mobileView === 'vault' ? 'active' : ''}`} 
            onClick={() => setMobileView('vault')}
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'vault' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900 }}
          >
            <span>VAULT FILES</span>
          </button>
          <button 
            className={`nav-item ${mobileView === 'insights' ? 'active' : ''}`} 
            onClick={() => setMobileView('insights')}
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'insights' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900 }}
          >
            <span style={{ fontSize: '12px', color: mobileView === 'insights' ? 'white' : 'inherit' }}>INSIGHTS</span>
          </button>
          <button 
            className={`nav-item ${mobileView === 'blender' ? 'active' : ''}`} 
            onClick={() => setMobileView('blender')}
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'blender' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900 }}
          >
            <span>GENERATION</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="composer-view">
      <div className="composer-header">
        <h2 className="suite-title">DATA VAULT</h2>
        <div className="composer-actions">
          {dataAnalysis && <button className="placeholder-button export-btn glass-panel" onClick={exportInsightStack}>EXPORT REPORT (PDF)</button>}
          <button className="placeholder-button secondary glass-panel" onClick={onClose}>CLOSE</button>
        </div>
      </div>

      <div className="composer-body">
        <div className="data-blender-layout-redesign">
          <div className="blender-col-side glass-panel">
            <h4 className="tray-title">DATA VAULT</h4>
            <div className="tray-list">
              {(uploadedAssets || []).filter(a => a.name.match(/\.(csv|pdf|txt)$/i)).map((asset, i) => (
                <button 
                  key={i} 
                  className="sidebar-btn" 
                  onClick={() => stageDocument(asset)}
                  style={{ fontSize: '10px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%', textAlign: 'left' }}
                >
                  {asset.name}
                </button>
              ))}
            </div>
            <button className="placeholder-button secondary glass-panel ingest-btn" onClick={() => (document.getElementById('suite-file-input') as HTMLInputElement)?.click()}>
              INGEST NEW DATA
            </button>
            <input id="suite-file-input" type="file" multiple onChange={(e) => handleFileSelect(e.target.files!)} style={{ display: 'none' }} />
          </div>

          <div className="blender-col-main glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="insight-canvas-large" ref={chartStackRef} style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
              {!dataAnalysis && !isAnalyzing && !sovereignCuration && (
                <div className="loading-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="pulse-orb"></div>
                  <h3 className="tray-title" style={{ marginTop: '24px' }}>NEURAL STANDBY</h3>
                </div>
              )}

              {dataAnalysis && (
                <div className="analysis-results">
                  {dataAnalysis.summary && (
                    <div className="summary-section">
                      <h5 className="section-label">EXECUTIVE SUMMARY</h5>
                      <div className="summary-text-full">{dataAnalysis.summary}</div>
                    </div>
                  )}
                </div>
              )}

              {!dataAnalysis && !isAnalyzing && (sovereignCuration || identityStatement) && (
                <div className="analysis-results">
                  <div className="summary-section">
                    <h5 className="section-label" style={{ color: 'var(--color-primary)' }}>EXISTING SYNTHESIS</h5>
                    {identityStatement && (
                      <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)' }}>
                        <h5 className="section-label" style={{ fontSize: '10px', marginBottom: '10px' }}>CORE IDENTITY STATEMENT</h5>
                        <p style={{ fontSize: '20px', fontWeight: 900, color: 'white', margin: 0, lineHeight: '1.4' }}>{identityStatement}</p>
                      </div>
                    )}
                    {sovereignCuration?.content && (
                      <div className="summary-text-full" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        {sovereignCuration.content}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="loading-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="loading-spinner"></div>
                  <p className="tray-title" style={{ marginTop: '24px' }}>SYNTHESIZING...</p>
                </div>
              )}
            </div>
          </div>

          <div className="blender-col-side glass-panel">
            <div className="staging-top">
              <h4 className="tray-title">STAGED FOR SYNTHESIS</h4>
              <div className="staged-list">
                {stagedDocs.map((asset, i) => (
                  <div key={i} className="sidebar-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default', fontSize: '10px', textTransform: 'uppercase', overflow: 'hidden', width: '100%' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1 }}>{asset.name}</span>
                    <button className="clean-remove-btn" onClick={() => setStagedDocs(stagedDocs.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', flexShrink: 0, marginLeft: '10px' }}>✕</button>
                  </div>
                ))}
                {stagedDocs.length === 0 && <p className="hint-text" style={{ textAlign: 'center', marginTop: '40px' }}>SELECT FILES FROM VAULT</p>}
              </div>
            </div>

            <BlenderControls 
              intents={intents}
              setIntents={setIntents}
              selectedLens={selectedLens}
              setSelectedLens={setSelectedLens}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
              initiateBlender={initiateBlender}
              stagedCount={stagedDocs.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVault;