import React from 'react';
import { Layers, Zap, FileText, ImageIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSovereign } from '../context/SovereignContext';

interface BottomCommandBarProps {
  setComposerMode: (mode: string | null) => void;
  setPresentationMode: (mode: boolean) => void;
  setShowMemoryDrawer: (show: boolean) => void;
  setMobileTab: (tab: string) => void;
}

const BottomCommandBar: React.FC<BottomCommandBarProps> = ({ setComposerMode, setPresentationMode, setShowMemoryDrawer, setMobileTab }) => {
  const { onboardingStep, setOnboardingStep } = useSovereign() as any;

  const isMainOnboarding = [3, 8, 9, 13, 18].includes(onboardingStep);

  return (
    <>
      {isMainOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, pointerEvents: 'none' }}
        />
      )}
      <nav 
        className={`bottom-command-bar ${isMainOnboarding ? '' : 'glass-panel'}`} 
        style={{ 
          zIndex: isMainOnboarding ? 10000 : 1000, 
          background: isMainOnboarding ? 'transparent' : '', 
          border: isMainOnboarding ? 'none' : '', 
          boxShadow: isMainOnboarding ? 'none' : '' 
        }}
      >
        <button className="nav-item" style={{ position: 'relative', opacity: isMainOnboarding && onboardingStep !== 8 ? 0.2 : 1 }} onClick={() => { 
          if (onboardingStep > 0 && onboardingStep !== 8) return; // Lock
          if (onboardingStep === 8) {
            setOnboardingStep(8.5);
            setTimeout(() => setOnboardingStep(9), 2000);
          }
          setMobileTab('map');
          setComposerMode(null); 
          setPresentationMode(false); 
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} style={{ color: onboardingStep === 8 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
            {onboardingStep === 8 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                  border: '2px solid #FF9500', borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <span style={{ color: onboardingStep === 8 ? '#FF9500' : 'inherit' }}>MAP</span>
          {onboardingStep === 8 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
            >
              <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                THIS IS WHERE YOU CAN WORK ON YOUR PRESENTATION NODES.
              </span>
              <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
            </motion.div>
          )}
        </button>

        <button className="nav-item" style={{ position: 'relative', opacity: isMainOnboarding && onboardingStep !== 9 ? 0.2 : 1 }} onClick={() => {
          if (onboardingStep > 0 && onboardingStep !== 9) return; // Lock
          if (onboardingStep === 9) setOnboardingStep(10);
          setComposerMode('data');
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} style={{ color: onboardingStep === 9 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
            {onboardingStep === 9 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                  border: '2px solid #FF9500', borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <span style={{ color: onboardingStep === 9 ? '#FF9500' : 'inherit' }}>DATA VAULT</span>
          {onboardingStep === 9 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
            >
              <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                INGEST MORE RAW DATA HERE TO EXPAND YOUR CORE IDENTITY.
              </span>
              <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
            </motion.div>
          )}
        </button>

        <button className="nav-item accent" style={{ position: 'relative', opacity: isMainOnboarding && onboardingStep !== 3 ? 0.2 : 1 }} onClick={() => {
          if (onboardingStep > 0 && onboardingStep !== 3) return; // Lock
          if (onboardingStep === 3) setOnboardingStep(4);
          setPresentationMode(true);
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} style={{ color: onboardingStep === 3 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
            {onboardingStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
                  border: '2px solid #FF9500', borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
          {onboardingStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
            >
              <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                INITIATE CORE DIVE TO SEE YOUR GENERATED INSIGHTS.
              </span>
              <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
            </motion.div>
          )}
        </button>

        <button className="nav-item" style={{ position: 'relative', opacity: isMainOnboarding && onboardingStep !== 13 ? 0.2 : 1 }} onClick={() => {
          if (onboardingStep > 0 && onboardingStep !== 13) return; // Lock
          if (onboardingStep === 13) setOnboardingStep(14);
          setComposerMode('visual');
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={20} style={{ color: onboardingStep === 13 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
            {onboardingStep === 13 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                  border: '2px solid #FF9500', borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <span style={{ color: onboardingStep === 13 ? '#FF9500' : 'inherit' }}>GEN PANEL</span>
          {onboardingStep === 13 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
            >
              <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                NODES REQUIRE VISUAL ARTIFACTS. GENERATE THEM HERE.
              </span>
              <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
            </motion.div>
          )}
        </button>

        <button className="nav-item" style={{ position: 'relative', opacity: isMainOnboarding && onboardingStep !== 15 ? 0.2 : 1 }} onClick={() => {
          if (onboardingStep > 0 && onboardingStep !== 15) return; // Lock
          if (onboardingStep === 15) setOnboardingStep(0); // Complete
          setShowMemoryDrawer(true);
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} style={{ color: onboardingStep === 15 ? '#FF9500' : 'inherit', position: 'relative', zIndex: 2 }} />
            {onboardingStep === 15 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                  border: '2px solid #FF9500', borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 149, 0, 0.5)', zIndex: 1, pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <span style={{ color: onboardingStep === 15 ? '#FF9500' : 'inherit' }}>LOGS</span>
          {onboardingStep === 15 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', pointerEvents: 'none' }}
            >
              <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                REVIEW PREVIOUS INTELLIGENCE SNAPSHOTS HERE.
              </span>
              <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
            </motion.div>
          )}
        </button>
      </nav>
    </>
  );
};

export default BottomCommandBar;