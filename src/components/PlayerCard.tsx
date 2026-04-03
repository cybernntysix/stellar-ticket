import React from 'react';
import { motion } from 'framer-motion';
import { useSovereign } from '../context/SovereignContext';

const PlayerCard: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { userDomains, identityStatement, sovereignCuration, isAuditing, auditProgress } = useSovereign();

  const displayedStatement = (isAuditing || !sovereignCuration) 
    ? "NEURAL IDENTITY STANDBY" 
    : identityStatement.split(' // ')[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="player-card-overlay"
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.95)', zIndex: 50000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="player-card-content glass-panel"
        style={{
          width: '100%', maxWidth: '900px', padding: '80px',
          textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)',
          background: 'radial-gradient(circle at center, rgba(0, 122, 255, 0.1) 0%, transparent 70%)'
        }}
      >
        <div className="card-header" style={{ marginBottom: '60px' }}>
          <span className="section-label" style={{ letterSpacing: '0.5em', color: 'var(--color-primary)' }}>
            {(!sovereignCuration || isAuditing) ? "SYNTHESIZING AUTHORITY" : "CORE IDENTITY ANCHOR"}
          </span>
        </div>
        
        <h1 className="player-card-title" style={{ 
          fontSize: '42px', 
          fontWeight: 900, 
          color: 'white', 
          margin: '0 0 60px 0', 
          lineHeight: '1.1', 
          letterSpacing: '-0.02em',
          maxWidth: '800px',
          marginInline: 'auto'
        }}>
          {displayedStatement}
        </h1>

        {isAuditing && (
          <div style={{ width: '100%', maxWidth: '300px', margin: '-30px auto 60px' }}>
            <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${auditProgress}%` }}
                style={{ height: '100%', background: 'var(--color-primary)' }}
              />
            </div>
            <p style={{ color: 'var(--color-primary)', fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', marginTop: '10px' }}>
              SYSTEM STABILIZING // {auditProgress}%
            </p>
          </div>
        )}

        <div className="cta-hint" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', letterSpacing: '0.3em', fontWeight: 900, marginTop: '100px' }}>
          {(!sovereignCuration || isAuditing) ? "AWAITING SYSTEM STABILIZATION" : "TAP TO VIEW NEURAL INTERFACE"}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlayerCard;
