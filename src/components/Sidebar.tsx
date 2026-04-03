import React, { useRef, useState } from 'react';
import { Layers, FileText, Video, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSovereign } from '../context/SovereignContext';

interface SidebarProps {
  setComposerMode: (mode: string | null) => void;
  setPresentationMode: (mode: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setComposerMode, setPresentationMode }) => {
  const { uploadedAssets, savedProjects, loadSnapshot, handleFileSelect } = useSovereign();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);

  const silos = {
    documents: { count: uploadedAssets.filter(a => a.folder === 'documents').length, target: 5, label: 'KNOWLEDGE BASE' },
    artifacts: { count: uploadedAssets.filter(a => ['images', 'videos'].includes(a.folder)).length, target: 10, label: 'ARTIFACT GALLERY' }
  };

  return (
    <aside className="workspace-sidebar">
      <div className="sidebar-header" style={{ marginBottom: '40px' }}>
        <span className="nav-title">PARADIGMOS // 0.33.2</span>
      </div>
      
      <div className="sidebar-nav">
        <div className="sidebar-group">
          <p className="sidebar-label">CORE SYSTEMS</p>
          <button className="sidebar-btn" onClick={() => setComposerMode(null)}>
            <Layers size={14} style={{ marginRight: '10px' }} /> Dashboard
          </button>
          <button className="sidebar-btn" onClick={() => setComposerMode('data')}>
            <FileText size={14} style={{ marginRight: '10px' }} /> Data Vault
          </button>
          <button className="sidebar-btn" onClick={() => setComposerMode('visual')}>
            <Video size={14} style={{ marginRight: '10px' }} /> Gen Panel
          </button>
          <button 
            className="sidebar-btn" 
            onClick={() => setPresentationMode(true)} 
            style={{ marginTop: '20px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
          >
            <Zap size={14} style={{ marginRight: '10px' }} /> Presentation
          </button>
        </div>

        <div className="sidebar-group" style={{ marginTop: '40px' }}>
          <div 
            onClick={() => setIsMemoryExpanded(!isMemoryExpanded)} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '15px' }}
          >
            <p className="sidebar-label" style={{ margin: 0 }}>MEMORY ARCHIVE</p>
            {isMemoryExpanded ? <ChevronDown size={12} opacity={0.5} /> : <ChevronRight size={12} opacity={0.5} />}
          </div>
          
          <AnimatePresence>
            {isMemoryExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="snapshot-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedProjects.filter(p => p.type === 'snapshot').map((snap, i) => (
                    <button key={i} className="sidebar-btn" onClick={() => loadSnapshot(snap)} style={{ fontSize: '10px', textAlign: 'left' }}>
                      {snap.name}
                    </button>
                  ))}
                  {savedProjects.filter(p => p.type === 'snapshot').length === 0 && (
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', paddingLeft: '10px' }}>EMPTY ARCHIVE</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sidebar-group" style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <p className="sidebar-label">INTELLIGENCE SILOS</p>
          {Object.entries(silos).map(([key, silo]) => (
            <div key={key} className="silo-node" onClick={() => fileInputRef.current?.click()} style={{ marginBottom: '20px', cursor: 'pointer' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '10px', color: 'white' }}>{silo.label}</span>
                 <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{silo.count}/{silo.target}</span>
               </div>
               <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                 <div style={{ height: '100%', background: 'var(--color-primary)', width: `${Math.min(100, (silo.count/silo.target)*100)}%` }}></div>
               </div>
            </div>
          ))}
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)} 
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
