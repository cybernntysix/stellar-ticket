import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  description: string;
  visualArtifact?: any;
}

const WireframeCube = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className="cube-container">
      <div className="cube">
        <div className="cube-face front">DATA</div>
        <div className="cube-face back">NULL</div>
        <div className="cube-face right">VOID</div>
        <div className="cube-face left">ZERO</div>
        <div className="cube-face top"></div>
        <div className="cube-face bottom"></div>
      </div>
    </div>
    <div className="holo-tag">AWAITING NEURAL LINK</div>
  </div>
);

interface DustParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  isEvaporating: boolean;
  life: number;
  vx: number;
  vy: number;
}

interface NeuralConstellationProps {
  onAudit?: (skill: any) => void;
  userDomains?: any[];
  suppressDetail?: boolean;
  focusedNodeId?: string | null;
}

const NeuralConstellation: React.FC<NeuralConstellationProps> = ({ 
  onAudit, 
  userDomains, 
  suppressDetail = false,
  focusedNodeId = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dustRef = useRef<HTMLCanvasElement | null>(null);
  const dustParticles = useRef<DustParticle[]>([]);
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const getBullets = (text: string) => {
    if (!text) return ["QUANTIFYING NEURAL DEPTH...", "ESTABLISHING SYSTEMIC PROOF..."];
    const points = text.split(/[.!?]/).map(p => p.trim()).filter(p => p.length > 10);
    return points.slice(0, 2);
  };

  useEffect(() => {
    const defaultNodes = [
      { label: 'STRATEGIC ARCHITECTURE', depthSummary: '- Systemic scaling patterns established\n- High-tier structural integrity verified' },
      { label: 'EXECUTION VELOCITY', depthSummary: '- Zero-latency implementation capability\n- Peak performance metrics identified' },
      { label: 'PREDICTIVE PROCESSING', depthSummary: '- Advanced pattern recognition active\n- Market-alpha generation detected' },
      { label: 'HOMEOSTATIC CONTROL', depthSummary: '- Dynamic state stabilization verified\n- 100% operational uptime achieved' },
      { label: 'NEURAL EFFICIENCY', depthSummary: '- Optimized cognitive resource allocation\n- Reduced processing overhead' },
      { label: 'AUTHORITY ANCHORING', depthSummary: '- High-status narrative anchoring active\n- Undeniable proof-of-work established' },
      { label: 'QUANTITATIVE ANALYSIS', depthSummary: '- Hard-metric evidentiary extraction\n- Data-driven decision architecture' },
      { label: 'SYSTEMIC SOVEREIGNTY', depthSummary: '- Absolute autonomy in execution\n- Independent neural stack verified' }
    ];

    const activeDomains = (userDomains && userDomains.length > 0) ? userDomains : defaultNodes;
    const count = activeDomains.length;
    
    // MOBILE OPTIMIZATION
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 42 : 35; 
    const centerX = 50; 
    const centerY = isMobile ? 55 : 50; // Shift down for mobile vertical balance

    const newSkills = activeDomains.map((domain, i) => {
      // Support both 'label' and 'node' keys from different synthesis versions
      const label = typeof domain === 'string' ? domain : ((domain as any).label || (domain as any).node);
      const description = typeof domain === 'string' ? '' : (domain as any).depthSummary || (domain as any).description;
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      
      // CTO Filter: Ensure high-status typography (Spaces, not Underscores)
      const cleanLabel = (label || `DOMAIN 0${i+1}`).toUpperCase().replace(/_/g, ' ');

      return {
        id: `node-${i}`,
        label: cleanLabel,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        description: description || 'Analyzing primary source records for metrics...',
        visualArtifact: (domain as any).visualArtifact
      };
    });
    setSkills(newSkills);
  }, [userDomains]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dustCanvas = dustRef.current;
    const container = containerRef.current;
    if (!canvas || !dustCanvas || !container) return;
    const ctx = canvas.getContext('2d');
    const dctx = dustCanvas.getContext('2d');
    if (!ctx || !dctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      dustCanvas.width = container.offsetWidth;
      dustCanvas.height = container.offsetHeight;
      initDust();
    };

    const resetParticle = (p: DustParticle) => {
      if (skills.length < 2) return;
      const i = Math.floor(Math.random() * skills.length);
      const neighbor = skills[(i + 1) % skills.length];
      const startX = (skills[i].x * canvas.width) / 100;
      const startY = (skills[i].y * canvas.height) / 100;
      const endX = (neighbor.x * canvas.width) / 100;
      const endY = (neighbor.y * canvas.height) / 100;
      const t = Math.random();
      p.x = startX + (endX - startX) * t + (Math.random() - 0.5) * 20;
      p.y = startY + (endY - startY) * t + (Math.random() - 0.5) * 20;
      p.originX = p.x; p.originY = p.y;
      p.size = Math.random() * 0.6 + 0.1;
      p.opacity = Math.random() * 0.4 + 0.2;
      p.isEvaporating = false;
      p.life = 1.0;
      p.vx = (Math.random() - 0.5) * 0.2;
      p.vy = (Math.random() - 0.5) * 0.2;
    };

    const initDust = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 400 : 1200; 
      dustParticles.current = [];
      for (let i = 0; i < particleCount; i++) {
        const p = {} as DustParticle;
        resetParticle(p);
        dustParticles.current.push(p);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);

      ctx.strokeStyle = focusedNodeId ? 'rgba(200, 240, 255, 0.05)' : 'rgba(200, 240, 255, 0.3)';
      ctx.lineWidth = 1.0;
      
      if (!focusedNodeId) {
        skills.forEach((node, i) => {
          skills.forEach((neighbor, j) => {
            if (i >= j) return; 
            ctx.beginPath();
            ctx.moveTo((node.x * canvas.width) / 100, (node.y * canvas.height) / 100);
            ctx.lineTo((neighbor.x * canvas.width) / 100, (neighbor.y * canvas.height) / 100);
            ctx.stroke();
          });
        });
      }

      // DRAW DUST
      dustParticles.current.forEach((p) => {
        const dx = p.x - mousePos.current.x;
        const dy = p.y - mousePos.current.y;
        if (Math.sqrt(dx*dx + dy*dy) < 60) p.isEvaporating = true;
        if (p.isEvaporating) {
          p.life -= 0.02; p.y -= 1.0;
          if (p.life <= 0) resetParticle(p);
        } else {
          p.x += p.vx; p.y += p.vy;
          if (Math.abs(p.x - p.originX) > 10) p.vx *= -1;
          if (Math.abs(p.y - p.originY) > 10) p.vy *= -1;
        }
        dctx.fillStyle = `rgba(200, 240, 255, ${p.isEvaporating ? p.life * p.opacity : p.opacity})`;
        dctx.beginPath(); dctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); dctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (focusedNodeId) return;
      const rect = dustCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePos.current = { x, y };

      let foundHover = null;
      for (const skill of skills) {
        const sx = (skill.x * canvas.width) / 100;
        const sy = (skill.y * canvas.height) / 100;
        if (Math.sqrt((x-sx)**2 + (y-sy)**2) < 40) { foundHover = skill.id; break; }
      }
      setHoveredNodeId(foundHover);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = dustCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (const skill of skills) {
        const sx = (skill.x * canvas.width) / 100;
        const sy = (skill.y * canvas.height) / 100;
        if (Math.sqrt((x-sx)**2 + (y-sy)**2) < 40) {
          if (suppressDetail && onAudit) {
            onAudit(skill);
          } else {
            setSelectedNode(prev => prev?.id === skill.id ? null : skill);
          }
          return;
        }
      }
      if (!suppressDetail) setSelectedNode(null);
    };

    window.addEventListener('resize', resize);
    dustCanvas.addEventListener('pointermove', handlePointerMove);
    dustCanvas.addEventListener('pointerdown', handlePointerDown);
    resize(); render();
    return () => {
      window.removeEventListener('resize', resize);
      dustCanvas.removeEventListener('pointermove', handlePointerMove);
      dustCanvas.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [skills, focusedNodeId]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 1
      }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <canvas ref={dustRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, cursor: hoveredNodeId ? 'pointer' : 'default' }} />
        
        {skills.map((skill) => {
          const isSelected = selectedNode?.id === skill.id || focusedNodeId === skill.id;
          const isHovered = hoveredNodeId === skill.id;
          const isGhosted = focusedNodeId && focusedNodeId !== skill.id;
          const isMobile = window.innerWidth < 768;

          return (
            <div key={skill.id} style={{
                position: 'absolute', left: `${skill.x}%`, top: `${skill.y}%`,
                transform: isMobile ? 'translate(-50%, -3px)' : 'translate(-50%, -5px)', pointerEvents: 'none',
                zIndex: isSelected ? 300 : 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
                transition: 'opacity 0.8s ease, filter 0.8s ease', 
                opacity: isGhosted ? 0 : 1,
                filter: isGhosted ? 'blur(10px)' : 'none'
            }}>
              <div style={{ 
                width: isMobile ? '6px' : '10px', height: isMobile ? '6px' : '10px', 
                background: '#ffffff', borderRadius: '50%', 
                boxShadow: (isSelected || isHovered) ? '0 0 30px #ffffff, 0 0 60px var(--color-primary)' : '0 0 10px #ffffff, 0 0 20px rgba(255,255,255,0.4)', 
                position: 'relative'
              }}>
                {(isSelected || isHovered) && (
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 2, 1] }} transition={{ duration: 2, repeat: Infinity }} 
                    style={{ position: 'absolute', top: isMobile ? -7 : -15, left: isMobile ? -7 : -15, width: isMobile ? 20 : 40, height: isMobile ? 20 : 40, background: 'var(--color-primary)', borderRadius: '50%', filter: 'blur(10px)' }} 
                  />
                )}
              </div>
              <span style={{ 
                fontSize: isMobile ? '8px' : '11px', fontWeight: 900, color: (isSelected || isHovered) ? '#ffffff' : 'rgba(255,255,255,0.5)', 
                letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: isMobile ? '8px' : '12px', 
                textShadow: '0 0 20px rgba(0,0,0,1)', whiteSpace: 'nowrap'
              }}>{skill.label}</span>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedNode && !suppressDetail && (
          <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            style={{
              position: 'absolute', top: '20px', right: '20px', bottom: '20px', width: '380px',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(50px)', padding: '40px',
              borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '4px solid var(--color-primary)',
              zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '-30px 0 60px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.3em' }}>NEURAL ANALYSIS</span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.05em', lineHeight: '1.2' }}>{selectedNode.label}</h3>

            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              {selectedNode.visualArtifact ? (
                <div className="visual-artifact-frame" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                  {selectedNode.visualArtifact.type === 'svg' ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedNode.visualArtifact.content }} 
                      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      className="svg-proportional-container"
                    />
                  ) : (
                    <p style={{ color: 'var(--color-primary)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' }}>ANALYTIC MODULE LINKED</p>
                  )}
                </div>
              ) : (
                <WireframeCube />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {getBullets(selectedNode.description).map((bullet, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.8', fontWeight: 500 }}>{bullet}.</p>
                </div>
              ))}
            </div>
            <button onClick={() => { if (onAudit) { onAudit(selectedNode.label); setSelectedNode(null); } }} className="primary-action-btn" style={{ width: '100%', padding: '20px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>
              RUN SOVEREIGN AUDIT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralConstellation;
