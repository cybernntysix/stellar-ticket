import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTickets, Ticket, Department } from '../context/TicketContext';

interface TicketNode extends Ticket {
  x: number;
  y: number;
}

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

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
    department?: Department | null;
    onNodeClick?: (ticket: Ticket) => void;
}

const NeuralConstellation: React.FC<NeuralConstellationProps> = ({ department = null, onNodeClick }) => {
  const { tickets, updateTicketStatus, addComment } = useTickets();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dustRef = useRef<HTMLCanvasElement | null>(null);
  const dustParticles = useRef<DustParticle[]>([]);
  const [nodes, setNodes] = useState<TicketNode[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 42 : 35; 
    const centerX = 50; 
    const centerY = isMobile ? 55 : 50;

    const filteredTickets = department 
      ? tickets.filter(t => t.department === department)
      : tickets;

    const newNodes = filteredTickets.map((ticket, i) => {
      const angle = (i / filteredTickets.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...ticket,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
    setNodes(newNodes);
  }, [tickets, department]);

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
      if (nodes.length < 2) return;
      const i = Math.floor(Math.random() * nodes.length);
      const neighbor = nodes[(i + 1) % nodes.length];
      const startX = (nodes[i].x * canvas.width) / 100;
      const startY = (nodes[i].y * canvas.height) / 100;
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

      ctx.strokeStyle = 'rgba(200, 240, 255, 0.3)';
      ctx.lineWidth = 1.0;
      
      nodes.forEach((node, i) => {
        nodes.forEach((neighbor, j) => {
          if (i >= j) return; 
          ctx.beginPath();
          ctx.moveTo((node.x * canvas.width) / 100, (node.y * canvas.height) / 100);
          ctx.lineTo((neighbor.x * canvas.width) / 100, (neighbor.y * canvas.height) / 100);
          ctx.stroke();
        });
      });

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
      const rect = dustCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePos.current = { x, y };

      let foundHover = null;
      for (const node of nodes) {
        const sx = (node.x * canvas.width) / 100;
        const sy = (node.y * canvas.height) / 100;
        if (Math.sqrt((x-sx)**2 + (y-sy)**2) < 40) { foundHover = node.id; break; }
      }
      setHoveredNodeId(foundHover);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = dustCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (const node of nodes) {
        const sx = (node.x * canvas.width) / 100;
        const sy = (node.y * canvas.height) / 100;
        if (Math.sqrt((x-sx)**2 + (y-sy)**2) < 40) {
          if (onNodeClick) onNodeClick(node);
          return;
        }
      }
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
  }, [nodes, onNodeClick]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <canvas ref={dustRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, cursor: hoveredNodeId ? 'pointer' : 'default' }} />
        
        {nodes.map((node) => {
          const isHovered = hoveredNodeId === node.id;
          const isMobile = window.innerWidth < 768;
          const color = PRIORITY_COLORS[node.priority];

          return (
            <div key={node.id} style={{
                position: 'absolute', left: `${node.x}%`, top: `${node.y}%`,
                transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                zIndex: isHovered ? 300 : 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
                transition: 'opacity 0.8s ease, filter 0.8s ease',
            }}>
              <div style={{ 
                width: isMobile ? '8px' : '12px', height: isMobile ? '8px' : '12px', 
                background: color, borderRadius: '50%', 
                boxShadow: isHovered ? `0 0 30px ${color}, 0 0 60px ${color}` : `0 0 10px ${color}, 0 0 20px ${color}66`, 
                position: 'relative'
              }}>
                {isHovered && (
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 2, 1] }} transition={{ duration: 2, repeat: Infinity }} 
                    style={{ position: 'absolute', top: isMobile ? -7 : -15, left: isMobile ? -7 : -15, width: isMobile ? 20 : 40, height: isMobile ? 20 : 40, background: color, borderRadius: '50%', filter: 'blur(10px)' }} 
                  />
                )}
              </div>
              <span style={{ 
                fontSize: isMobile ? '8px' : '10px', fontWeight: 900, color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.5)', 
                letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '12px', 
                textShadow: '0 0 20px rgba(0,0,0,1)', whiteSpace: 'nowrap'
              }}>{node.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeuralConstellation;
