import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { useSovereign } from '../context/SovereignContext';
import NeuralConstellation from './NeuralConstellation';

const BentoBox: React.FC<{ title: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ title, children, className = '', style = {} }) => (
  <div className={`glass-panel bento-box ${className}`} style={style}>
    <div className="bento-header">
      <span className="bento-title">{title}</span>
      <MoreVertical size={14} className="bento-icon" />
    </div>
    <div className="bento-content">
      {children}
    </div>
  </div>
);

const BentoGrid: React.FC<{ setComposerMode: (mode: string) => void }> = ({ setComposerMode }) => {
  const { 
    sovereignCuration, 
    identityStatement, 
    uploadedAssets, 
    handleAudit, 
    saveSovereignSnapshot, 
    setSovereignCuration 
  } = useSovereign();

  return (
    <div className="bento-grid" style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(12, 1fr)', gap: '20px', height: '100%', minHeight: '0' }}>
      <BentoBox title="The Forge" className="bento-forge" style={{ gridColumn: 'span 6', gridRow: 'span 9' }}>
        <div style={{ height: '100%', minHeight: '0', background: '#000', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
          <NeuralConstellation onAudit={handleAudit} userDomains={sovereignCuration?.discoveredNodes} />
        </div>
      </BentoBox>
      
      <BentoBox title="Curated Insights" className="bento-insights" style={{ gridColumn: 'span 6', gridRow: 'span 9' }}>
        {sovereignCuration ? (
          <div className="insight-canvas-large" style={{ padding: '20px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="insight-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px' }}>AUTO-GENERATED: {sovereignCuration.timestamp}</span>
              <div className="insight-actions" style={{ display: 'flex', gap: '10px' }}>
                <button className="sidebar-btn small" onClick={saveSovereignSnapshot} style={{ padding: '8px 12px', fontSize: '10px', margin: 0 }}>PACKAGE</button>
                <button className="sidebar-btn small" onClick={() => setSovereignCuration(null)} style={{ padding: '8px 12px', fontSize: '10px', margin: 0 }}>RESET</button>
              </div>
            </div>
            <div className="narrative-section">
              <p className="summary-text-full" style={{ fontSize: '15px', lineHeight: '1.6', color: 'white', fontWeight: 400, margin: 0 }}>
                {sovereignCuration.content}
              </p>
            </div>
            {sovereignCuration.connectiveStatements && (
              <div className="connective-section">
                <span className="section-label" style={{ display: 'block', marginBottom: '15px', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>NEURAL BRIDGES // MARKET ACCESS</span>
                {sovereignCuration.connectiveStatements.map((stmt: string, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.1 }} 
                    style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid var(--color-primary)', padding: '12px 15px', marginBottom: '10px', borderRadius: '0 8px 8px 0' }}
                  >
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: '1.4' }}>{stmt}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-insights" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="drop-icon-pulse" style={{ fontSize: '24px', opacity: 0.3 }}>✧</div>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>
              {uploadedAssets.length > 0 ? 'RECORDS DETECTED. GENERATE NARRATIVE.' : 'UPLOAD DATA TO START.'}
            </p>
          </div>
        )}
      </BentoBox>

      <BentoBox title="Core Identity" className="bento-identity-footer" style={{ gridColumn: 'span 12', gridRow: 'span 3' }}>
        <div className="identity-footer-content" style={{ display: 'flex', gap: '20px', alignItems: 'center', height: '100%', width: '100%', padding: '5px' }}>
          <div className="identity-statement-section" style={{ flexGrow: 1, borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <span className="section-label" style={{ marginBottom: '8px', display: 'block', fontSize: '9px', flexShrink: 0 }}>COMPILED AUTHORITY STATEMENT</span>
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <p className="statement-text" style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '0.01em', lineHeight: '1.3' }}>
                {identityStatement}
              </p>
            </div>
          </div>
          
          <div className="identity-prompt-section" style={{ flexShrink: 0, minWidth: '150px', display: 'flex', justifyContent: 'center' }}>
            <button 
              className="primary-action-btn" 
              onClick={() => setComposerMode('data')} 
              style={{ 
                padding: '12px 30px', 
                fontSize: '11px', 
                fontWeight: 900, 
                letterSpacing: '0.15em',
                background: 'var(--color-primary)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              GENERATE
            </button>
          </div>
        </div>
      </BentoBox>
    </div>
  );
};

export default BentoGrid;
