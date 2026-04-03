import React from 'react';
import { Layers, Zap, FileText, ImageIcon, Clock } from 'lucide-react';
import { useSovereign } from '../context/SovereignContext';

interface BottomCommandBarProps {
  setComposerMode: (mode: string | null) => void;
  setPresentationMode: (mode: boolean) => void;
  setShowMemoryDrawer: (show: boolean) => void;
  setMobileTab: (tab: string) => void;
}

const BottomCommandBar: React.FC<BottomCommandBarProps> = ({ setComposerMode, setPresentationMode, setShowMemoryDrawer, setMobileTab }) => {
  return (
    <nav className="bottom-command-bar glass-panel">
      <button className="nav-item" onClick={() => { 
        setMobileTab('map');
        setComposerMode(null); 
        setPresentationMode(false); 
      }}>
        <Layers size={20} />
        <span>MAP</span>
      </button>
      <button className="nav-item" onClick={() => setComposerMode('data')}>
        <FileText size={20} />
        <span>DATA VAULT</span>
      </button>
      <button className="nav-item accent" onClick={() => setPresentationMode(true)}>
        <Zap size={24} />
        <span>DIVE</span>
      </button>
      <button className="nav-item" onClick={() => setComposerMode('visual')}>
        <ImageIcon size={20} />
        <span>GEN PANEL</span>
      </button>
      <button className="nav-item" onClick={() => setShowMemoryDrawer(true)}>
        <Clock size={20} />
        <span>LOGS</span>
      </button>
    </nav>
  );
};

export default BottomCommandBar;
