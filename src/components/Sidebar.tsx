import React from 'react';
import { Layers, Ticket, BookOpen, Settings, Zap, Shield, User, Sliders, LogOut, RotateCcw } from 'lucide-react';
import { useTickets, type Role } from '../context/TicketContext';

interface SidebarProps {
  setComposerMode: (mode: string | null) => void;
  setPresentationMode: (mode: boolean) => void;
  isCalibrationMode?: boolean;
  setIsCalibrationMode?: (mode: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setComposerMode, setPresentationMode, isCalibrationMode = false, setIsCalibrationMode }) => {
  const { tickets, knowledgeBase, currentUser, switchRole, logout, updateLayoutPrefs } = useTickets();

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    emergency: tickets.filter(t => t.priority === 'emergency').length,
    kb: knowledgeBase.length
  };

  const isCyber = currentUser?.role === 'cybersecurity';
  const isClient = currentUser?.role === 'client';

  const roleButtons: { id: Role; label: string }[] = [
    { id: 'client', label: 'CLIENT' },
    { id: 'support_tier_1', label: 'SUPPORT' },
    { id: 'cybersecurity', label: 'CYBER' }
  ];

  const handleRestoreDefaults = () => {
      updateLayoutPrefs({ showForge: true, showQueue: true, showLogs: true, showKB: true });
      if (setIsCalibrationMode) setIsCalibrationMode(false);
  };

  return (
    <aside className="workspace-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header" style={{ marginBottom: '20px' }}>
        <span className="nav-title">STELLAR TICKET // 1.0.0</span>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* Role Switcher (For Testing/Capstone Presentation) */}
          {currentUser && (
              <div className="sidebar-group" style={{ marginBottom: '30px' }}>
                <p className="sidebar-label">IDENTITY AUTH</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {roleButtons.map(btn => (
                        <button 
                            key={btn.id} 
                            onClick={() => switchRole(btn.id)}
                            className={`auth-role-btn ${currentUser.role === btn.id ? 'active' : ''}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '12px', textAlign: 'center', letterSpacing: '0.2em' }}>STATUS: {currentUser.role.toUpperCase()}</p>
              </div>
          )}
          
          <div className="sidebar-nav">
            <div className="sidebar-group">
              <p className="sidebar-label">CORE SYSTEMS</p>
              <button className={`sidebar-btn ${!setComposerMode ? 'active' : ''}`} onClick={() => { setComposerMode(null); setPresentationMode(false); }}>
                <Layers size={14} style={{ marginRight: '10px' }} /> Dashboard
              </button>
              
              {!isClient && (
                <button className={`sidebar-btn ${currentUser?.role !== 'client' && !setPresentationMode && !setComposerMode ? '' : ''}`} onClick={() => { setComposerMode('tickets'); setPresentationMode(false); }}>
                  <Ticket size={14} style={{ marginRight: '10px' }} /> All Tickets
                </button>
              )}

              {isCyber && (
                <button className="sidebar-btn" onClick={() => { setComposerMode('shadow_vector'); setPresentationMode(false); }} style={{ color: '#FF3B30', borderColor: '#FF3B30' }}>
                  <Shield size={14} style={{ marginRight: '10px' }} /> Shadow Vector
                </button>
              )}

              <button className="sidebar-btn" onClick={() => { setComposerMode('kb'); setPresentationMode(false); }}>
                <BookOpen size={14} style={{ marginRight: '10px' }} /> Knowledge Base
              </button>
              
              <button 
                className="sidebar-btn" 
                onClick={() => setPresentationMode(true)} 
                style={{ marginTop: '20px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
              >
                <Zap size={14} style={{ marginRight: '10px' }} /> Presentation Mode
              </button>
            </div>

            <div className="sidebar-group" style={{ marginTop: '40px' }}>
              <p className="sidebar-label">SYSTEM HEALTH</p>
              
              <div className="silo-node" style={{ marginBottom: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '10px', color: 'white' }}>OPEN TICKETS</span>
                   <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{stats.open}</span>
                 </div>
                 <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', background: 'var(--color-primary)', width: `${Math.min(100, (stats.open/10)*100)}%` }}></div>
                 </div>
              </div>

              {isCyber && (
                <div className="silo-node" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', color: 'white' }}>EMERGENCY NODES</span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{stats.emergency}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#FF3B30', width: `${Math.min(100, (stats.emergency/5)*100)}%` }}></div>
                    </div>
                </div>
              )}

              {!isClient && setIsCalibrationMode && (
                <>
                    <button 
                        className={`sidebar-btn ${isCalibrationMode ? 'active' : ''}`} 
                        onClick={() => setIsCalibrationMode(!isCalibrationMode)}
                        style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center', background: isCalibrationMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)' }}
                    >
                      <Sliders size={14} style={{ marginRight: '10px' }} /> {isCalibrationMode ? 'EXIT CALIBRATION' : 'CALIBRATE LAYOUT'}
                    </button>
                    {isCalibrationMode && (
                        <button 
                            className="sidebar-btn" 
                            onClick={handleRestoreDefaults}
                            style={{ marginTop: '10px', width: '100%', display: 'flex', justifyContent: 'center', color: '#FF9500', borderColor: 'rgba(255,149,0,0.3)' }}
                        >
                          <RotateCcw size={14} style={{ marginRight: '10px' }} /> RESTORE DEFAULTS
                        </button>
                    )}
                </>
              )}

            </div>
          </div>
      </div>
      
      {/* Footer Area */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '20px', flexShrink: 0 }}>
          <button 
            className="sidebar-btn" 
            onClick={() => {
                logout();
                setTimeout(() => {
                    if (setComposerMode) setComposerMode(null);
                    if (setPresentationMode) setPresentationMode(false);
                    if (setIsCalibrationMode) setIsCalibrationMode(false);
                }, 100);
            }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', border: 'none', background: 'transparent' }}
          >
            <LogOut size={14} style={{ marginRight: '10px' }} /> SYSTEM LOGOUT
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
