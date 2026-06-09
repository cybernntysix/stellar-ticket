import React, { useState } from 'react';
import { Camera, Zap, Download, X, Layers, Image as ImageIcon, FileText, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';
import { useSovereign } from '../context/SovereignContext';

interface GenPanelProps {
  onClose: () => void;
  uploadedAssets: any[];
  userDomains?: any[];
  onAssign?: (nodeLabel: string, visualData: any) => void;
}

const GenPanel: React.FC<GenPanelProps> = ({ onClose, uploadedAssets, userDomains, onAssign }) => {
  const { onboardingStep, setOnboardingStep } = useSovereign() as any;
  const isMainOnboarding = [14, 15, 16, 17].includes(onboardingStep);
  
  const [command, setCommand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<any>(null);
  const [visualHistory, setVisualHistory] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'source' | 'canvas' | 'panel'>('canvas');
  const isMobile = window.innerWidth <= 768;

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
        const r = await fetch('http://localhost:3031/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: file.path })
        });
        if (r.ok) {
          const d = await r.json();
          contextText += `\n--- FILE: ${file.name} ---\n${d.text || JSON.stringify(d.data)}\n`;
        }
      }

      const r = await fetch('http://localhost:3031/api/generate-visual', {
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

  if (isMobile) {
    return (
      <div className="composer-view gen-panel" style={{ borderRadius: 0, padding: 0 }}>
        {isMainOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, pointerEvents: 'none' }}
          />
        )}
        <div className="composer-header" style={{ padding: '0 20px', height: '60px', zIndex: 101, position: 'relative', background: isMainOnboarding ? 'transparent' : '', borderBottom: isMainOnboarding ? 'none' : '' }}>
          <h2 className="suite-title" style={{ fontSize: '14px', opacity: isMainOnboarding ? 0.2 : 1 }}>GEN PANEL // GENERATIVE INTERFACE</h2>
          <div className="composer-actions" style={{ position: 'relative' }}>
            {onboardingStep === 17 && <Tooltip text="This is where you generate visual artifacts. Tap CLOSE to exit." position="bottom" style={{ width: '200px', right: 0, left: 'auto', transform: 'none' }} />}
            <button 
              className="placeholder-button secondary glass-panel" 
              onClick={() => {
                if (onboardingStep > 0 && onboardingStep !== 17) return;
                if (onboardingStep === 17) setOnboardingStep(18);
                onClose();
              }}
              style={{ opacity: isMainOnboarding && onboardingStep !== 17 ? 0.2 : 1, cursor: isMainOnboarding && onboardingStep !== 17 ? 'not-allowed' : 'pointer', borderColor: onboardingStep === 17 ? '#FF9500' : '', color: onboardingStep === 17 ? '#FF9500' : '' }}
            >
              <X size={16} />
            </button>
            {onboardingStep === 17 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
                  border: '2px solid #FF9500', borderRadius: '100px',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: -1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </div>

        <div className="composer-body" style={{ flex: 1, overflow: 'hidden', padding: '10px', zIndex: 10, boxSizing: 'border-box' }}>
          
          {mobileView === 'source' && (
            <div className="mobile-source-view glass-panel" style={{ padding: '20px', minHeight: '400px' }}>
              <h4 className="tray-title" style={{ marginBottom: '20px' }}>SELECT SOURCE</h4>
              <div className="tray-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(uploadedAssets || []).map((asset, i) => (
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
          )}

          {mobileView === 'canvas' && (
            <div className="blender-col-main" style={{ flex: 1, minHeight: 0, background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '80px' }}>
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
            </div>
          )}

          {mobileView === 'panel' && (
            <div className="mobile-panel-view glass-panel" style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
              <h4 className="tray-title" style={{ marginBottom: '20px' }}>PANEL</h4>
              <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {visualHistory.map((v, i) => (
                  <button key={i} className="sidebar-btn" onClick={() => { setGeneratedVisual(v); setMobileView('canvas'); }} style={{ textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ImageIcon size={12} />
                      <span>{v.title}</span>
                    </div>
                  </button>
                ))}
                {visualHistory.length === 0 && <p style={{ fontSize: '10px', opacity: 0.2, textAlign: 'center', marginTop: '40px' }}>NO ASSETS SYNTHESIZED</p>}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION (MOBILE ONLY) */}
        <div className="mobile-suite-nav" style={{ flexShrink: 0, height: '70px', background: 'rgba(0,0,0,0.8)', display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', gap: '10px', zIndex: 100 }}>
          <button 
            onClick={() => setMobileView('source')} 
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'source' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900, position: 'relative' }}
          >
            <FileText size={16} />
            SOURCE
          </button>
          
          <button 
            onClick={() => setMobileView('canvas')} 
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'canvas' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900 }}
          >
            <Camera size={16} />
            CANVAS
          </button>

          <button 
            onClick={() => {
              if (onboardingStep > 0 && onboardingStep !== 16) return;
              if (onboardingStep === 16) setOnboardingStep(17);
              setMobileView('panel');
            }} 
            style={{ flex: 1, background: 'none', border: 'none', color: mobileView === 'panel' ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '9px', fontWeight: 900, position: 'relative', opacity: isMainOnboarding && onboardingStep !== 16 ? 0.2 : 1, cursor: isMainOnboarding && onboardingStep !== 16 ? 'not-allowed' : 'pointer' }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={16} style={{ color: onboardingStep === 16 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
              {onboardingStep === 16 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                    border: '2px solid #FF9500', borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                  }}
                />
              )}
            </div>
            <span style={{ color: onboardingStep === 16 ? '#FF9500' : 'inherit' }}>PANEL</span>
            {onboardingStep === 16 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
              >
                <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                  REVIEW AND ASSIGN YOUR VISUAL HISTORY HERE.
                </span>
                <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
              </motion.div>
            )}
          </button>
        </div>

        {/* COMMAND BAR (LOCKED ABSOLUTELY ABOVE NAV) */}
        {mobileView === 'canvas' && (
          <div className="console-chat-bar" style={{ position: 'absolute', bottom: '70px', left: 0, right: 0, height: '70px', padding: '10px 20px', background: 'transparent', border: 'none', zIndex: 1000, boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
              <input
                type="text"
                className="os-input glass-panel"
                placeholder="DESCRIBE THE ARTIFACT TO GENERATE..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                style={{ width: '100%', height: '100%', padding: '0 24px', paddingRight: '120px', borderRadius: '100px', fontWeight: 900, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
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
        )}
      </div>
    );
  }

  return (
    <div className="composer-view gen-panel" style={{ borderRadius: 0, padding: 0 }}>
      {isMainOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, pointerEvents: 'none' }}
        />
      )}
      <div className="composer-header" style={{ padding: '0 20px', height: '60px', zIndex: 101, position: 'relative', background: isMainOnboarding ? 'transparent' : '', borderBottom: isMainOnboarding ? 'none' : '' }}>
        <h2 className="suite-title" style={{ fontSize: '14px', opacity: isMainOnboarding ? 0.2 : 1 }}>GEN PANEL // GENERATIVE INTERFACE</h2>
        <div className="composer-actions" style={{ position: 'relative' }}>
          {onboardingStep === 17 && <Tooltip text="This is where you generate visual artifacts. Tap CLOSE to exit." position="bottom" style={{ width: '200px', right: 0, left: 'auto', transform: 'none' }} />}
          <button
            className="placeholder-button secondary glass-panel"
            onClick={() => {
              if (onboardingStep > 0 && onboardingStep !== 17) return;
              if (onboardingStep === 17) setOnboardingStep(18);
              onClose();
            }}
            style={{ opacity: isMainOnboarding && onboardingStep !== 17 ? 0.2 : 1, cursor: isMainOnboarding && onboardingStep !== 17 ? 'not-allowed' : 'pointer', borderColor: onboardingStep === 17 ? '#FF9500' : '', color: onboardingStep === 17 ? '#FF9500' : '' }}
          >
            <X size={16} />
          </button>
          {onboardingStep === 17 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
                border: '2px solid #FF9500', borderRadius: '100px',
                boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: -1, pointerEvents: 'none'
              }}
            />
          )}
        </div>      </div>

      <div className="composer-body" style={{ display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '20px', position: 'relative', zIndex: 10 }}>
        
        {/* COLUMN 1: ASSET VAULT (LEFT) */}
        <div className="blender-col-side glass-panel" style={{ padding: '20px' }}>
          <h4 className="tray-title" style={{ marginBottom: '20px' }}>SELECT SOURCE</h4>
          <div className="tray-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(uploadedAssets || []).map((asset, i) => (
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
                style={{ width: '100%', height: '56px', padding: '0 24px', paddingRight: '120px', borderRadius: '100px', fontWeight: 900, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)', border: 'none', color: 'black', fontWeight: 900, cursor: 'pointer', fontSize: '10px', letterSpacing: '0.1em', padding: '0 20px', borderRadius: '100px' }}
              >                {isGenerating ? 'PROCESSING...' : 'INITIALIZE'}
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