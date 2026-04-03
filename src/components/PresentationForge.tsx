import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSovereign } from '../context/SovereignContext';
import NeuralConstellation from './NeuralConstellation';

const PresentationForge: React.FC = () => {
  const { sovereignCuration, identityStatement } = useSovereign();
  const [zoomLevel, setZoomLevel] = useState<'macro' | 'constellation' | 'depth'>('macro');
  const [activeNode, setActiveNode] = useState<any>(null);
  const [rotation, setRotation] = useState(0);
  const isMobile = window.innerWidth <= 768;

  // Auto-rotation for the "Living" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleNodeSelect = (skill: any) => {
    setActiveNode(skill);
    setZoomLevel('depth');
  };

  const resetZoom = () => {
    if (zoomLevel === 'depth') {
      setZoomLevel('constellation');
      setActiveNode(null);
    } else if (zoomLevel === 'constellation') {
      setZoomLevel('macro');
    }
  };

  // CTO Logic: Calculate transform to put node at exactly 30% X, 50% Y (Desktop) or 50% X, 15% Y (Mobile)
  const getConstellationTransform = () => {
    if (zoomLevel === 'macro') return { scale: 0.3, x: 0, y: 0, opacity: 0 };
    if (zoomLevel === 'constellation') return { scale: 1, x: 0, y: 0, opacity: 1 };
    
    if (zoomLevel === 'depth' && activeNode) {
      const scale = isMobile ? 2.0 : 4.0; // Less zoom on mobile to keep context
      // Desktop: 30% X, 50% Y | Mobile: 50% X, 15% Y
      const targetX = isMobile ? 50 : 30;
      const targetY = isMobile ? 15 : 50;
      
      const translateX = (targetX - activeNode.x * scale);
      const translateY = (targetY - activeNode.y * scale);
      return { 
        scale, 
        x: `${translateX}%`, 
        y: `${translateY}%`, 
        opacity: 1 
      };
    }
    return { scale: 1, x: 0, y: 0, opacity: 1 };
  };

  const transform = getConstellationTransform();

  return (
    <div className="presentation-forge" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      
      {/* LAYER 0: THE MACRO (AUTHORITY ANCHOR) */}
      <AnimatePresence>
        {zoomLevel === 'macro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, padding: isMobile ? '20px' : '0'
            }}
            onClick={() => setZoomLevel('constellation')}
          >
            <div className="identity-anchor-orb" style={{
              width: isMobile ? '120px' : '180px', height: isMobile ? '120px' : '180px', borderRadius: '50%',
              background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
              boxShadow: isMobile ? '0 0 60px var(--color-primary)' : '0 0 120px var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid white' }}
              />
              <span style={{ fontSize: isMobile ? '24px' : '32px', filter: 'drop-shadow(0 0 10px white)' }}>✧</span>
            </div>
            
            <motion.div
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.6, duration: 1 }}
               style={{ textAlign: 'center', marginTop: isMobile ? '40px' : '60px', width: isMobile ? '90%' : 'auto' }}
            >
              <h1 style={{ fontSize: isMobile ? '24px' : '56px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: isMobile ? '0.1em' : '0.15em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                {identityStatement.split(' // ')[0]}
              </h1>
              <p style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 900, letterSpacing: isMobile ? '0.4em' : '0.8em', marginTop: '24px', textIndent: isMobile ? '0.4em' : '0.8em' }}>
                INITIALIZE CORE DIVE
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 1: THE VISUAL PROOF (THE CONSTELLATION) */}
      <motion.div 
        animate={{ 
          scale: transform.scale,
          x: transform.x,
          y: transform.y,
          opacity: transform.opacity,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
      >
        <NeuralConstellation 
          onAudit={handleNodeSelect} 
          userDomains={sovereignCuration?.discoveredNodes} 
          suppressDetail={true}
          focusedNodeId={activeNode?.id}
        />
      </motion.div>

      {/* LAYER 2: NARRATIVE DEPTH (FLOATING CONTENT) */}
      <AnimatePresence>
        {zoomLevel === 'depth' && activeNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={isMobile ? 'detail-view-mobile' : ''}
            style={isMobile ? {
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
              background: 'linear-gradient(to top, black 80%, transparent)',
              padding: '30px 20px', display: 'flex', flexDirection: 'column',
              zIndex: 100, overflowY: 'auto'
            } : {
              position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
              padding: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              zIndex: 100, pointerEvents: 'none'
            }}
          >
            <div style={{ pointerEvents: 'all' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}
              >
                <div style={{ width: '40px', height: '1px', background: 'var(--color-primary)' }} />
                <span className="section-label" style={{ color: 'var(--color-primary)', letterSpacing: '0.4em', fontSize: '10px' }}>IDENTITY VERIFICATION</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                style={{ fontSize: isMobile ? '24px' : '84px', fontWeight: 900, color: 'white', margin: isMobile ? '0 0 15px 0' : '0 0 40px 0', letterSpacing: '-0.02em', lineHeight: '0.9' }}
              >
                {activeNode.label}
              </motion.h2>
              
              <div style={{ maxWidth: '600px' }}>
                <div className="dossier-text-section" style={{ margin: isMobile ? '0 0 20px 0' : '0 0 60px 0' }}>
                  {(() => {
                    const text = activeNode.description || activeNode.depthSummary || "Synthesizing evidentiary patterns...";
                    const bullets = text.split(/[\n\-\*•]\s+/).filter((s: string) => s.trim().length > 5);
                    
                    if (bullets.length > 1) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '24px' }}>
                          {bullets.map((bullet: string, i: number) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.1 + (i * 0.1) }}
                              style={{ display: 'flex', gap: isMobile ? '10px' : '20px', alignItems: 'flex-start' }}
                            >
                              <div style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', marginTop: isMobile ? '6px' : '12px', flexShrink: 0, boxShadow: '0 0 10px var(--color-primary)' }} />
                              <p style={{ fontSize: isMobile ? '13px' : '22px', lineHeight: '1.4', color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 500 }}>{bullet.trim()}</p>
                            </motion.div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        style={{ fontSize: isMobile ? '14px' : '24px', lineHeight: '1.5', color: 'rgba(255,255,255,0.7)', fontWeight: 400, margin: 0 }}
                      >
                        {text}
                      </motion.p>
                    );
                  })()}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{ padding: isMobile ? '20px' : '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', maxWidth: '500px' }}
                >
                  {activeNode.visualArtifact ? (
                    <div style={{ width: '100%', maxHeight: isMobile ? '150px' : '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {activeNode.visualArtifact.type === 'svg' ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: activeNode.visualArtifact.content }} 
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          className="svg-proportional-container"
                        />
                      ) : (
                        <div style={{ padding: '10px', textAlign: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>ANALYTIC MODULE LINKED</span>
                          <p style={{ fontSize: '12px', marginTop: '8px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{activeNode.visualArtifact.title}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className="drop-icon-pulse" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>✧</div>
                      <div>
                        <span style={{ fontSize: '9px', fontWeight: 900, opacity: 0.4, display: 'block', marginBottom: '6px', letterSpacing: '0.2em' }}>MASTER PROOF</span>
                        <p style={{ fontSize: '13px', margin: 0, color: 'white', lineHeight: '1.4' }}>Evidence-based high-tier competency.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={resetZoom} 
                className="sidebar-btn" 
                style={{ width: 'auto', padding: '14px 32px', fontSize: '10px', marginTop: isMobile ? '30px' : '60px', borderRadius: '100px' }}
              >
                RETURN TO ORBIT
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION FOOTER */}
      {zoomLevel !== 'depth' && (
        <div style={{ position: 'absolute', bottom: isMobile ? 100 : 40, left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
          <div className="glass-panel" style={{ padding: '12px 32px', borderRadius: '100px', fontSize: '9px', fontWeight: 900, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'center' }}>
            {zoomLevel === 'macro' ? 'CLICK FOR CORE DIVE' : 'SELECT NODE'}
          </div>
        </div>
      )}

      {zoomLevel !== 'macro' && (
        <button 
          onClick={resetZoom}
          className="sidebar-btn"
          style={{ position: 'absolute', bottom: isMobile ? 100 : 40, left: isMobile ? 20 : 40, width: '44px', height: '44px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', zIndex: 1000 }}
        >
          ←
        </button>
      )}
    </div>
  );
};

export default PresentationForge;
