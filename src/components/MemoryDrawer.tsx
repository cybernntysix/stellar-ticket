import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Database } from 'lucide-react';
import { useSovereign } from '../context/SovereignContext';

interface MemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MemoryDrawer: React.FC<MemoryDrawerProps> = ({ isOpen, onClose }) => {
  const { savedProjects, loadSnapshot } = useSovereign();
  const snapshots = savedProjects.filter(p => p.type === 'snapshot');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              zIndex: 2000000,
              pointerEvents: 'auto'
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              height: '70vh',
              background: 'rgba(10, 10, 10, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              zIndex: 2000001,
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -20px 50px rgba(0,0,0,0.5)',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={18} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, letterSpacing: '0.2em', color: 'white' }}>MEMORY ARCHIVE</h3>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {snapshots.length > 0 ? (
                  snapshots.map((snap, i) => (
                    <button 
                      key={i} 
                      className="sidebar-btn" 
                      onClick={() => {
                        loadSnapshot(snap);
                        onClose();
                      }}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        gap: '8px',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>{snap.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={10} color="rgba(255,255,255,0.3)" />
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{snap.timestamp || 'LEGACY FRAME'}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div style={{ height: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                    <Clock size={40} />
                    <p style={{ marginTop: '20px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em' }}>NO ARCHIVED SNAPSHOTS</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemoryDrawer;
