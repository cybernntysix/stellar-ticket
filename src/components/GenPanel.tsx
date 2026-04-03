import React, { useState } from 'react';
import { Camera, Zap, Download, X, Layers, Image as ImageIcon, FileText, Link } from 'lucide-react';

interface GenPanelProps {
  onClose: () => void;
  uploadedAssets: any[];
  userDomains?: any[];
  onAssign?: (nodeLabel: string, visualData: any) => void;
}

const GenPanel: React.FC<GenPanelProps> = ({ onClose, uploadedAssets, userDomains, onAssign }) => {
  const [command, setCommand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<any>(null);
  const [visualHistory, setVisualHistory] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);

  const toggleFileSelection = (file: any) => {
    if (selectedFiles.find(f => f.path === file.path)) {
      setSelectedFiles(selectedFiles.filter(f => f.path !== file.path));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleGenerate = async () => {
    if (!command.trim()) return;
    setIsGenerating(true);
    
    try {
      let contextText = "CONTEXT ASSETS:\n";
      for (const file of selectedFiles) {
        const r = await fetch('http://localhost:3002/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: file.path })
        });
        if (r.ok) {
          const d = await r.json();
          contextText += `\n--- FILE: ${file.name} ---\n${d.text || JSON.stringify(d.data)}\n`;
        }
      }

      const r = await fetch('http://localhost:3002/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Based on this context: ${contextText.substring(0, 5000)}\n\nUser Request: ${command}`
        })
      });

      if (!r.ok) throw new Error('Generation failed');
      const d = await r.json();
      
      const cleanJson = d.output.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
      const visualData = {
        type: 'svg',
        title: `DRAWING: ${command.substring(0, 20).toUpperCase()}...`,
        content: cleanJson
      };
      
      setGeneratedVisual(visualData);
      setVisualHistory([visualData, ...visualHistory]);
    } catch (e) {
      console.error('Generation failed:', e);
      alert("GENERATION FAILED. CHECK CONSOLE.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderVisual = (visual: any) => {
    if (!visual) return null;

    if (visual.type === 'svg') {
      return (
        <div 
          className="svg-display-area" 
          dangerouslySetInnerHTML={{ __html: visual.content }} 
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        />
      );
    }
    
    return <p>Synthesis ready in vault.</p>;
  };

  return (
    <div className="composer-view gen-panel">
      <div className="composer-header">
        <h2 className="suite-title">GEN PANEL // GENERATIVE INTERFACE</h2>
        <div className="composer-actions">
          <button className="placeholder-button secondary glass-panel" onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      <div className="composer-body" style={{ display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '20px' }}>
        
        {/* COLUMN 1: ASSET VAULT (LEFT) */}
        <div className="blender-col-side glass-panel" style={{ padding: '20px' }}>
          <h4 className="tray-title" style={{ marginBottom: '20px' }}>SELECT SOURCE</h4>
          <div className="tray-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {uploadedAssets.map((asset, i) => (
              <button 
                key={i} 
                className={`sidebar-btn ${selectedFiles.find(f => f.path === asset.path) ? 'active' : ''}`}
                onClick={() => toggleFileSelection(asset)}
                style={{ 
                  fontSize: '9px', 
                  textTransform: 'uppercase', 
                  textAlign: 'left',
                  background: selectedFiles.find(f => f.path === asset.path) ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255,255,255,0.02)',
                  borderColor: selectedFiles.find(f => f.path === asset.path) ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={12} style={{ opacity: 0.5 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.name}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedFiles.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '9px', opacity: 0.4 }}>{selectedFiles.length} ASSETS STAGED</span>
            </div>
          )}
        </div>

        {/* COLUMN 2: MAIN CANVAS (CENTER) */}
        <div className="blender-col-main glass-panel" style={{ padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {generatedVisual ? (
              <div className="generated-visual-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h3 className="section-label" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '12px' }}>{generatedVisual.title}</h3>
                  {userDomains && userDomains.length > 0 && (
                    <div style={{ position: 'relative' }}>
                      <button 
                        className="placeholder-button secondary glass-panel" 
                        style={{ padding: '8px 16px', fontSize: '10px' }}
                        onClick={() => setAssignMenuOpen(!assignMenuOpen)}
                      >
                        <Link size={12} style={{ marginRight: '8px' }} /> ASSIGN TO NODE
                      </button>
                      {assignMenuOpen && (
                        <div style={{ 
                          position: 'absolute', top: '100%', right: 0, marginTop: '10px', 
                          background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px', padding: '10px', zIndex: 100, width: '200px',
                          display: 'flex', flexDirection: 'column', gap: '5px'
                        }}>
                          {userDomains.map((node, i) => (
                            <button 
                              key={i} 
                              className="sidebar-btn" 
                              onClick={() => {
                                if (onAssign) onAssign(node.label, generatedVisual);
                                setAssignMenuOpen(false);
                              }}
                              style={{ fontSize: '10px', padding: '10px' }}
                            >
                              {node.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="visual-render-area" style={{ background: 'rgba(0,0,0,0.3)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {renderVisual(generatedVisual)}
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                <ImageIcon size={64} style={{ marginBottom: '20px' }} />
                <p style={{ letterSpacing: '0.4em', fontSize: '11px', fontWeight: 900 }}>NEURAL SENSOR STANDBY</p>
              </div>
            )}
          </div>

          {/* COMMAND BAR */}
          <div className="console-chat-bar" style={{ marginTop: '40px', background: 'rgba(0,0,0,0.6)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="os-input glass-panel" 
                placeholder="DESCRIBE THE ARTIFACT TO GENERATE..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                style={{ width: '100%', padding: '16px 24px', paddingRight: '120px', borderRadius: '100px', fontWeight: 900, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)', border: 'none', color: 'black', fontWeight: 900, cursor: 'pointer', fontSize: '10px', letterSpacing: '0.1em', padding: '0 20px', borderRadius: '100px' }}
              >
                {isGenerating ? 'PROCESSING...' : 'INITIALIZE'}
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 3: SIDEBAR / HISTORY (RIGHT) */}
        <div className="blender-col-side glass-panel" style={{ padding: '20px' }}>
          <h4 className="tray-title" style={{ marginBottom: '20px' }}>VISUAL REPERTOIRE</h4>
          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {visualHistory.map((v, i) => (
              <button key={i} className="sidebar-btn" onClick={() => setGeneratedVisual(v)} style={{ textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={12} />
                  <span>{v.title}</span>
                </div>
              </button>
            ))}
            {visualHistory.length === 0 && <p style={{ fontSize: '10px', opacity: 0.2, textAlign: 'center', marginTop: '40px' }}>NO ASSETS SYNTHESIZED</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenPanel;