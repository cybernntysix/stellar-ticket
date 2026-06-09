import React from 'react';
import { Moon, Sun, Download } from 'lucide-react';

interface DashboardHeaderProps {
  setShowInitialUpload: (show: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
      <div>
        <h2 className="dashboard-title">NEURAL TICKETING INTERFACE</h2>
        <p className="dashboard-subtitle">COMMAND & CONTROL // SYSTEM ORCHESTRATION</p>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button className="placeholder-button export-btn glass-panel" style={{ padding: '12px 24px', fontSize: '11px' }}>
          <Download size={14} style={{ marginRight: '8px' }} /> SYSTEM EXPORT
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
