import React from 'react';

interface BlenderControlsProps {
  intents: { visualize: boolean; summarize: boolean };
  setIntents: (intents: any) => void;
  selectedLens: string;
  setSelectedLens: (lens: string) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  initiateBlender: () => void;
  stagedCount: number;
}

const BlenderControls: React.FC<BlenderControlsProps> = ({ 
  intents, 
  setIntents, 
  selectedLens, 
  setSelectedLens, 
  isAnalyzing, 
  analysisProgress, 
  initiateBlender,
  stagedCount
}) => {
  return (
    <div className="blender-controls-small" style={{ marginTop: 'auto' }}>
      <div className="intent-selector" style={{ marginBottom: '32px' }}>
        <h4 className="tray-title" style={{ marginBottom: '15px' }}>INTENT</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIntents({...intents, summarize: !intents.summarize})}
            className={`sidebar-btn ${intents.summarize ? 'active' : ''}`}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '9px',
              background: intents.summarize ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255,255,255,0.03)',
              borderColor: intents.summarize ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'
            }}
          >
            SUMMARIZE
          </button>
        </div>        
        {intents.summarize && (
          <div className="lens-container" style={{ marginTop: '24px' }}>
            <h4 className="tray-title" style={{ marginBottom: '12px' }}>LENS</h4>
            <select 
              value={selectedLens} 
              onChange={(e) => setSelectedLens(e.target.value)} 
              className="sidebar-btn" 
              style={{ 
                width: '100%', 
                cursor: 'pointer', 
                textTransform: 'uppercase', 
                fontWeight: 900, 
                fontSize: '10px',
                appearance: 'none',
                textAlign: 'center'
              }}
            >
              <option value="alpha">Alpha Narrative (Elite)</option>
              <option value="executive">Executive Paragraph</option>
              <option value="nodes">Neural Nodes (Bullets)</option>
              <option value="echo">Direct Echo (Quotes)</option>
              <option value="shadow">Shadow Vector (Patterns)</option>
            </select>
          </div>
        )}
      </div>
      <button 
        className={`placeholder-button export-btn glass-panel ${isAnalyzing ? 'is-loading' : ''}`} 
        style={{ width: '100%', padding: '16px', fontSize: '11px', letterSpacing: '0.2em' }} 
        onClick={initiateBlender} 
        disabled={isAnalyzing || stagedCount === 0}
      >
        {isAnalyzing ? `ANALYZING ${analysisProgress}%` : 'START BLENDER'}
      </button>
    </div>
  );
};

export default BlenderControls;
