import React from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { useSovereign } from '../context/SovereignContext';

interface DashboardHeaderProps {
  setShowInitialUpload: (show: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setShowInitialUpload }) => {
  const { theme, toggleTheme, setIsExportingDossier } = useSovereign();

  const downloadDossier = () => {
    setIsExportingDossier(true);
  };

  return (
    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
      <div>
        <h2 className="dashboard-title">LIVE DASHBOARD</h2>
        <p className="dashboard-subtitle">ORCHESTRATING YOUR DIGITAL SOVEREIGNTY</p>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          className="placeholder-button secondary glass-panel" 
          style={{ padding: '12px', borderRadius: '50%', minWidth: '44px', height: '44px' }}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="placeholder-button export-btn glass-panel" style={{ padding: '12px 24px', fontSize: '11px' }} onClick={downloadDossier}>
          <Download size={14} style={{ marginRight: '8px' }} /> DOSSIER
        </button>
        <button className="placeholder-button secondary glass-panel" style={{ padding: '12px 24px', fontSize: '11px' }} onClick={() => setShowInitialUpload(true)}>
          RE-CALIBRATE
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
