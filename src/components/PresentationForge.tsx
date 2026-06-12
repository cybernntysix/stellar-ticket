import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTickets, type Ticket, type Department } from '../context/TicketContext';
import NeuralConstellation from './NeuralConstellation';

type CategoryType = 'low' | 'normal' | 'high' | 'emergency' | 'escalated' | 'closed';

interface CategoryNode {
  id: CategoryType;
  label: string;
  count: number;
  color: string;
}

const CATEGORY_MAP: Record<CategoryType, { label: string; color: string }> = {
  emergency: { label: 'EMERGENCY', color: '#FF3B30' },
  high: { label: 'HIGH PRIORITY', color: '#FF9500' },
  normal: { label: 'NORMAL', color: '#007AFF' },
  low: { label: 'LOW PRIORITY', color: '#34C759' },
  escalated: { label: 'ESCALATED', color: '#AF52DE' },
  closed: { label: 'CLOSED', color: 'rgba(255,255,255,0.3)' }
};

const PresentationForge: React.FC = () => {
  const { tickets, departments, toggleEscalation, updateTicketStatus, currentUser } = useTickets();
  const [zoomLevel, setZoomLevel] = useState<'macro' | 'constellation' | 'depth'>('macro');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  
  const isMobile = window.innerWidth <= 768;
  const isCyber = currentUser.role === 'cybersecurity';
  const isClient = currentUser.role === 'client';

  // Filter departments based on role
  const accessibleDepartments = departments.filter(dept => {
    if (isCyber) return true; // Cyber sees everything
    if (isClient) return dept === currentUser.department; // Client only sees their own
    return true; // Support sees all
  });

  // Get categories for the selected department
  const getCategoryNodes = (): CategoryNode[] => {
    if (!selectedDepartment) return [];
    const deptTickets = tickets.filter(t => t.department === selectedDepartment);
    
    // Hide certain categories from Clients in the constellation
    const categories: CategoryType[] = isClient 
        ? ['high', 'normal', 'low', 'closed']
        : ['emergency', 'high', 'normal', 'low', 'escalated', 'closed'];

    return categories.map(cat => {
        let count = 0;
        if (cat === 'escalated') count = deptTickets.filter(t => t.isEscalated && t.status === 'open').length;
        else if (cat === 'closed') count = deptTickets.filter(t => t.status === 'closed').length;
        else count = deptTickets.filter(t => t.priority === cat && t.status === 'open' && !t.isEscalated).length;

        return {
            id: cat,
            label: CATEGORY_MAP[cat].label,
            count,
            color: CATEGORY_MAP[cat].color
        };
    }).filter(node => node.count > 0 || ['high', 'normal', 'low'].includes(node.id));
  };

  const categoryNodes = getCategoryNodes();

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    setZoomLevel('constellation');
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId as CategoryType);
    setZoomLevel('depth');
  };

  const resetZoom = () => {
    if (zoomLevel === 'depth') {
        if (activeTicket) {
            setActiveTicket(null);
        } else {
            setZoomLevel('constellation');
            setSelectedCategory(null);
        }
    } else if (zoomLevel === 'constellation') {
        setZoomLevel('macro');
        setSelectedDepartment(null);
    }
  };

  const DEPT_POSITIONS: Record<string, {x: number, y: number}> = {
    'IT': { x: 30, y: 30 },
    'Security': { x: 70, y: 30 },
    'Infrastructure': { x: 50, y: 50 },
    'Research': { x: 30, y: 70 },
    'HR': { x: 70, y: 70 }
  };

  const renderDataStreams = () => {
    const lines = [
        ['IT', 'Infrastructure'], 
        ['Security', 'Infrastructure'], 
        ['Infrastructure', 'Research'], 
        ['Infrastructure', 'HR'], 
        ['IT', 'Security'], 
        ['Research', 'HR']
    ];

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {lines.map((line, idx) => {
                // Only draw line if both departments are accessible
                if (!accessibleDepartments.includes(line[0] as Department) || !accessibleDepartments.includes(line[1] as Department)) return null;

                const p1 = DEPT_POSITIONS[line[0]];
                const p2 = DEPT_POSITIONS[line[1]];
                return (
                    <g key={idx}>
                        <line 
                            x1={`${p1.x}%`} y1={`${p1.y}%`} 
                            x2={`${p2.x}%`} y2={`${p2.y}%`} 
                            stroke="rgba(255,255,255,0.05)" strokeWidth="2" 
                        />
                        <motion.circle 
                            r="3" 
                            fill="var(--color-primary)" 
                            style={{ filter: 'blur(2px)' }}
                            animate={{
                                cx: [`${p1.x}%`, `${p2.x}%`],
                                cy: [`${p1.y}%`, `${p2.y}%`],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 2
                            }}
                        />
                    </g>
                );
            })}
        </svg>
    );
  };

  return (
    <div className="presentation-forge" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      
      {/* LAYER 0: THE MACRO (DEPARTMENT HUBS) */}
      <AnimatePresence>
        {zoomLevel === 'macro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10
            }}
          >
            {renderDataStreams()}
            
            <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 5 }}>
                {accessibleDepartments.map((dept, i) => {
                    const deptTickets = tickets.filter(t => t.department === dept);
                    const emergencyCount = deptTickets.filter(t => t.priority === 'emergency').length;
                    
                    const pos = DEPT_POSITIONS[dept] || { x: 50, y: 50 };

                    return (
                        <motion.div
                            key={dept}
                            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleDepartmentSelect(dept)}
                            style={{ 
                                position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <div className="dept-hub" style={{
                                width: '140px', height: '140px', borderRadius: '50%',
                                background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
                                boxShadow: (isCyber && emergencyCount > 0) ? '0 0 60px #FF3B30' : '0 0 40px var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid white' }}
                                />
                                <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', letterSpacing: '0.2em' }}>{deptTickets.length} NODES</span>
                            </div>
                            
                            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', marginTop: '15px', whiteSpace: 'nowrap' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.2em' }}>{dept}</h3>
                                <span className="section-label" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>SYSTEM HUB</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 1: THE CATEGORY CONSTELLATION */}
      <AnimatePresence>
        {zoomLevel === 'constellation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
          >
            <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 100 }}>
                <span className="section-label" style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '10px' }}>DEPARTMENT // {selectedDepartment}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '5px 0' }}>SECTOR CATEGORIES</h2>
            </div>

            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '600px', height: '600px' }}>
                    {/* Connections */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                        {categoryNodes.map((node, i) => {
                            const angle = (i / categoryNodes.length) * Math.PI * 2 - Math.PI / 2;
                            const x2 = 300 + Math.cos(angle) * 200;
                            const y2 = 300 + Math.sin(angle) * 200;
                            return (
                                <line key={`line-${i}`} x1="300" y1="300" x2={x2} y2={y2} stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                            );
                        })}
                    </svg>

                    {categoryNodes.map((node, i) => {
                        const angle = (i / categoryNodes.length) * Math.PI * 2 - Math.PI / 2;
                        const radius = 200;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0, x: `calc(-50% + 0px)`, y: `calc(-50% + 0px)` }}
                                animate={{ opacity: 1, scale: 1, x: `calc(-50% + ${x}px)`, y: `calc(-50% + ${y}px)` }}
                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                                onClick={() => handleCategorySelect(node.id)}
                                style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
                                    zIndex: 5
                                }}
                            >
                                <div style={{
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    background: node.color,
                                    boxShadow: `0 0 30px ${node.color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>{node.count}</span>
                                </div>
                                <span style={{ fontSize: '9px', fontWeight: 900, color: 'white', letterSpacing: '0.2em' }}>{node.label}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 100 }}>
                <button onClick={resetZoom} className="sidebar-btn" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>←</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 2: TICKET DEPTH (LIST) */}
      <AnimatePresence>
        {zoomLevel === 'depth' && selectedCategory && (
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                style={{
                    position: 'absolute', top: 0, right: 0, width: '450px', height: '100%',
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(50px)', padding: '40px',
                    borderLeft: `4px solid ${CATEGORY_MAP[selectedCategory].color}`, zIndex: 1000,
                    display: 'flex', flexDirection: 'column', gap: '30px'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="section-label" style={{ color: CATEGORY_MAP[selectedCategory].color, letterSpacing: '0.3em', fontSize: '10px' }}>{selectedDepartment} // {CATEGORY_MAP[selectedCategory].label}</span>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '5px 0' }}>SECTOR NODES</h2>
                    </div>
                    <button onClick={resetZoom} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                </div>

                <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tickets.filter(t => {
                        if (t.department !== selectedDepartment) return false;
                        if (selectedCategory === 'escalated') return t.isEscalated && t.status === 'open';
                        if (selectedCategory === 'closed') return t.status === 'closed';
                        return t.priority === selectedCategory && t.status === 'open' && !t.isEscalated;
                    }).map(ticket => (
                        <div key={ticket.id} onClick={() => setActiveTicket(ticket)} style={{ 
                            background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }} className="ticket-list-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)' }}>{ticket.id}</span>
                                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>{ticket.title}</h3>
                        </div>
                    ))}
                </div>

                {activeTicket && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                            background: 'black', padding: '40px', borderLeft: '1px solid rgba(255,255,255,0.1)',
                            zIndex: 1001, display: 'flex', flexDirection: 'column', gap: '30px'
                        }}
                    >
                        <button onClick={() => setActiveTicket(null)} className="sidebar-btn" style={{ width: 'auto', marginBottom: '10px' }}>BACK TO LIST</button>
                        
                        <div>
                            <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px', letterSpacing: '0.2em' }}>{activeTicket.id} // {activeTicket.department}</span>
                            <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: '10px 0' }}>{activeTicket.title}</h2>
                        </div>

                        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', fontSize: '16px' }}>{activeTicket.description}</p>
                        </div>

                        {!isClient && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
                                <button 
                                    onClick={() => {
                                        toggleEscalation(activeTicket.id);
                                        setActiveTicket({...activeTicket, isEscalated: !activeTicket.isEscalated});
                                    }} 
                                    className="primary-action-btn" 
                                    style={{ 
                                        width: '100%', padding: '18px', fontSize: '11px', fontWeight: 900, 
                                        background: activeTicket.isEscalated ? 'rgba(255,255,255,0.05)' : '#AF52DE',
                                        border: 'none', borderRadius: '12px'
                                    }}
                                >
                                    {activeTicket.isEscalated ? 'DE-ESCALATE NODE' : 'ESCALATE TO COMMAND'}
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        const newStatus = activeTicket.status === 'open' ? 'closed' : 'open';
                                        updateTicketStatus(activeTicket.id, newStatus);
                                        setActiveTicket({...activeTicket, status: newStatus});
                                    }} 
                                    className="primary-action-btn" 
                                    style={{ 
                                        width: '100%', padding: '18px', fontSize: '11px', fontWeight: 900, 
                                        background: activeTicket.status === 'open' ? 'rgba(255,255,255,0.05)' : 'var(--color-primary)',
                                        border: 'none', borderRadius: '12px'
                                    }}
                                >
                                    {activeTicket.status === 'open' ? 'CLOSE SECTOR' : 'RE-INITIALIZE NODE'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PresentationForge;
