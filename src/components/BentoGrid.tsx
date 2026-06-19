import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Shield, AlertCircle, Filter, List, Eye, EyeOff } from 'lucide-react';
import { useTickets, type Ticket, type Activity, type KBArticle, getSLAStatus } from '../context/TicketContext';
import NeuralConstellation from './NeuralConstellation';
import NewTicketModal from './NewTicketModal';
import TicketDetailModal from './TicketDetailModal';
import KBArticleModal from './KBArticleModal';
import TicketListModal from './TicketListModal';
import AuthorityArchive from './AuthorityArchive';

interface BentoBoxProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    isCalibrationMode?: boolean;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
}

const BentoBox: React.FC<BentoBoxProps> = ({ title, children, className = '', style = {}, isCalibrationMode, isVisible = true, onToggleVisibility }) => (
  <div className={`glass-panel bento-box ${className}`} style={{ ...style, display: isVisible || isCalibrationMode ? 'flex' : 'none', flexDirection: 'column', minHeight: 0, opacity: !isVisible && isCalibrationMode ? 0.3 : 1 }}>
    {title && (
      <div className="bento-header" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="bento-title">{title}</span>
        {isCalibrationMode && onToggleVisibility ? (
            <button onClick={onToggleVisibility} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
        ) : (
            <MoreVertical size={14} className="bento-icon" />
        )}
      </div>
    )}
    <div className="bento-content" style={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

const SEVERITY_COLORS = {
  critical: '#FF3B30',
  warning: '#FF9500',
  info: 'var(--color-primary)'
};

interface BentoGridProps {
    isCalibrationMode?: boolean;
}

const BentoGrid: React.FC<BentoGridProps> = ({ isCalibrationMode = false }) => {
  const { tickets, activities, knowledgeBase, currentUser, updateLayoutPrefs } = useTickets();
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isTicketListOpen, setIsTicketListOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedKB, setSelectedKB] = useState<KBArticle | null>(null);
  const [archiveTicketId, setArchiveTicketId] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'security' | 'support'>('all');

  const isCyber = currentUser?.role === 'cybersecurity';
  const isClient = currentUser?.role === 'client';
  const clientTickets = tickets.filter(t => t.department === currentUser?.department);
  
  // Safe layout prefs access
  const prefs = currentUser?.layoutPrefs || { showForge: true, showQueue: true, showLogs: !isClient, showKB: true };

  const handleTogglePref = (key: keyof typeof prefs) => {
      updateLayoutPrefs({ [key]: !prefs[key] });
  };

  const filteredActivities = activities.filter(a => {
    if (logFilter === 'all') return true;
    if (logFilter === 'security') return a.type === 'security_event';
    if (logFilter === 'support') return a.type !== 'security_event';
    return true;
  });

  const hasCriticalEvent = activities.some(a => a.severity === 'critical' && (Date.now() - new Date(a.timestamp).getTime() < 1000 * 60 * 60));

  // Layout Logic
  const showQueue = !isClient && prefs.showQueue;
  const showLogs = !isClient && prefs.showLogs;
  const forgeGridCol = showQueue || showLogs ? 'span 8' : 'span 12';
  let forgeGridRow = 'span 8';
  if (!showQueue && !showLogs) forgeGridRow = prefs.showKB ? 'span 8' : 'span 10';

  return (
    <div className="bento-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(12, 1fr)', 
      gridTemplateRows: 'repeat(12, 1fr)', 
      gap: '12px', 
      height: '100%', 
      width: '100%',
      minHeight: 0 
    }}>
      
      {/* BOX 1: NEURAL PANEL (The Forge) */}
      <BentoBox 
        title="NEURAL PANEL // TICKETS" 
        className={`bento-forge ${isCyber && hasCriticalEvent ? 'critical-breach-box' : ''}`} 
        style={{ gridColumn: forgeGridCol, gridRow: forgeGridRow, position: 'relative' }}
        isCalibrationMode={isCalibrationMode}
        isVisible={prefs.showForge}
        onToggleVisibility={() => handleTogglePref('showForge')}
      >
        <div style={{ height: '100%', width: '100%', background: '#000', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
          {isCyber && hasCriticalEvent && (
            <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, border: '2px solid #FF3B30', borderRadius: '12px', zIndex: 10, pointerEvents: 'none', boxShadow: 'inset 0 0 50px rgba(255,59,48,0.3)' }}
            />
          )}
          <NeuralConstellation onNodeClick={(ticket) => setArchiveTicketId(ticket.id)} />
        </div>
      </BentoBox>
      
      {/* BOX 2: ACTIVE QUEUE */}
      <BentoBox 
        title={isClient ? "MY SYSTEM REQUESTS" : "ACTIVE QUEUE"} 
        className="bento-tickets" 
        style={{ gridColumn: 'span 4', gridRow: showLogs ? 'span 4' : (prefs.showKB ? 'span 8' : 'span 10') }}
        isCalibrationMode={isCalibrationMode}
        isVisible={showQueue}
        onToggleVisibility={() => handleTogglePref('showQueue')}
      >
        <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
          {(isClient ? clientTickets : tickets).map(ticket => {
            const slaStatus = getSLAStatus(ticket);
            return (
                <div 
                    key={ticket.id} 
                    onClick={() => setArchiveTicketId(ticket.id)}
                    style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${PRIORITY_COLORS[ticket.priority]}`, padding: '12px', borderRadius: '0 8px 8px 0', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.2s' }}
                    className="ticket-queue-item"
                >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'white' }}>{ticket.id}</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {!isClient && ticket.isEscalated && <span style={{ background: '#AF52DE', width: '6px', height: '6px', borderRadius: '50%' }} />}
                        {!isClient && slaStatus === 'breached' && <span className="critical-breach-box" style={{ background: '#FF3B30', width: '6px', height: '6px', borderRadius: '50%' }} />}
                        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{ticket.status.toUpperCase()}</span>
                    </div>
                </div>
                <p style={{ fontSize: '12px', color: 'white', fontWeight: 600, margin: '5px 0' }}>{ticket.title}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{ticket.priority.toUpperCase()}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                </div>
            );
          })}
          {(isClient ? clientTickets : tickets).length === 0 && (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' }}>NO NODES DETECTED</p>
            </div>
          )}
        </div>
      </BentoBox>

      {/* BOX 3: SYSTEM LOGS */}
      <BentoBox 
        title={isCyber ? "SHADOW VECTOR // SYSTEM LOGS" : "SYSTEM LOGS"} 
        className="bento-activity" 
        style={{ gridColumn: 'span 4', gridRow: showQueue ? 'span 4' : (prefs.showKB ? 'span 8' : 'span 10') }}
        isCalibrationMode={isCalibrationMode}
        isVisible={showLogs}
        onToggleVisibility={() => handleTogglePref('showLogs')}
      >
            {isCyber && (
                <div style={{ display: 'flex', gap: '8px', padding: '0 10px 10px 10px', flexShrink: 0 }}>
                    <button onClick={() => setLogFilter('all')} style={{ background: logFilter === 'all' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '8px', fontWeight: 900, color: 'white', cursor: 'pointer' }}>ALL</button>
                    <button onClick={() => setLogFilter('security')} style={{ background: logFilter === 'security' ? '#FF3B30' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '8px', fontWeight: 900, color: 'white', cursor: 'pointer' }}>SECURITY</button>
                    <button onClick={() => setLogFilter('support')} style={{ background: logFilter === 'support' ? '#007AFF' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '8px', fontWeight: 900, color: 'white', cursor: 'pointer' }}>SUPPORT</button>
                </div>
            )}
            <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px' }}>
            {filteredActivities.filter(a => isCyber || a.type !== 'security_event').map(activity => (
                <div key={activity.id} style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <div style={{ width: '2px', background: SEVERITY_COLORS[activity.severity], opacity: 0.8 }} />
                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: SEVERITY_COLORS[activity.severity], display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {isCyber && activity.type === 'security_event' && <Shield size={10} />}
                        {activity.severity === 'critical' && <AlertCircle size={10} />}
                        {activity.user}
                    </span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    {activity.ticketId && <span style={{ color: 'white' }}>{activity.ticketId}: </span>}
                    {activity.detail}
                    {isCyber && activity.vector && <span style={{ fontSize: '8px', color: SEVERITY_COLORS[activity.severity], marginLeft: '8px', opacity: 0.5 }}>[{activity.vector.toUpperCase()}]</span>}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </BentoBox>

      {/* BOX 4: KNOWLEDGE BASE (Sliding Text) */}
      <BentoBox 
        title="KNOWLEDGE BASE // NEURAL INSIGHTS" 
        className="bento-kb" 
        style={{ gridColumn: 'span 12', gridRow: 'span 2' }}
        isCalibrationMode={isCalibrationMode}
        isVisible={prefs.showKB}
        onToggleVisibility={() => handleTogglePref('showKB')}
      >
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative', width: '100%' }}>
          <motion.div 
            animate={{ x: ['0%', '-50%'] }} 
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: '100px', whiteSpace: 'nowrap', width: 'max-content' }}
          >
            {/* First Set */}
            {knowledgeBase.map(kb => (
              <div key={`set1-${kb.id}`} onClick={() => setSelectedKB(kb)} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} className="kb-marquee-item">
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{kb.id}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{kb.title.toUpperCase()}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>//</span>
              </div>
            ))}
            {/* Second Set (For seamless looping) */}
            {knowledgeBase.map(kb => (
              <div key={`set2-${kb.id}`} onClick={() => setSelectedKB(kb)} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} className="kb-marquee-item">
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{kb.id}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{kb.title.toUpperCase()}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>//</span>
              </div>
            ))}
          </motion.div>
        </div>
      </BentoBox>

      {/* BOX 5: QUICK ACTIONS */}
      <BentoBox className="bento-actions" style={{ gridColumn: 'span 12', gridRow: 'span 2' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', height: '100%', width: '100%', padding: '0 5px', justifyContent: 'space-between' }}>
          <div style={{ flexGrow: 1, minWidth: '150px' }}>
            <span className="section-label" style={{ marginBottom: '4px', display: 'block', fontSize: '9px' }}>AUTHORITY PANEL // SYSTEM STATUS: {isCyber && hasCriticalEvent ? 'BREACH DETECTED' : 'OPTIMAL'}</span>
            <p style={{ fontSize: '11px', fontWeight: 800, color: isCyber && hasCriticalEvent ? '#FF3B30' : 'white', margin: 0, lineHeight: '1.4' }}>
                {isCyber && hasCriticalEvent ? 'CRITICAL SECURITY ANOMALY IN PROGRESS // STANDBY' : 'NEURAL TICKETING INTERFACE ACTIVE // STANDBY'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button 
                className="placeholder-button secondary glass-panel" 
                style={{ padding: '8px 15px', fontSize: '9px', fontWeight: 900, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setIsTicketListOpen(true)}
            >
                <List size={12} /> VIEW NODES
            </button>
            <button 
                className="primary-action-btn" 
                style={{ padding: '8px 15px', fontSize: '9px', fontWeight: 900, flexShrink: 0, background: isCyber && hasCriticalEvent ? '#FF3B30' : 'var(--color-primary)' }}
                onClick={() => setIsNewTicketModalOpen(true)}
            >
                NEW TICKET
            </button>
          </div>
        </div>
      </BentoBox>

      <NewTicketModal 
        isOpen={isNewTicketModalOpen} 
        onClose={() => setIsNewTicketModalOpen(false)} 
      />

      <TicketListModal
        isOpen={isTicketListOpen}
        onClose={() => setIsTicketListOpen(false)}
        onSelectTicket={(ticket) => setArchiveTicketId(ticket.id)}
      />

      <KBArticleModal
        article={selectedKB}
        onClose={() => setSelectedKB(null)}
      />

      <AuthorityArchive 
        ticketId={archiveTicketId} 
        onClose={() => setArchiveTicketId(null)} 
      />

    </div>
  );
};

export default BentoGrid;
