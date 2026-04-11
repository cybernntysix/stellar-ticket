import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSovereign } from '../context/SovereignContext';
import Tooltip from './Tooltip';

interface OnboardingOverlayProps {
  setShowInitialUpload: (show: boolean) => void;
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ setShowInitialUpload, onComplete }) => {
  const {
    userDomains,
    setUserDomains,
    userSkills,
    setUserSkills,
    handleFileSelect,
    compileForgeNodes,
    generateSovereignty,
    setOnboardingStep
  } = useSovereign() as any;

  const [onboardingPhase, setOnboardingPhase] = useState('upload');
  const [showFocus, setShowFocus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (onboardingPhase === 'upload' || onboardingPhase === 'extraction') {
      const timer = setTimeout(() => setShowFocus(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowFocus(false);
    }
  }, [onboardingPhase]);

  return (
    <div className="mission-onboarding-overlay">
      {showFocus && (onboardingPhase === 'upload' || onboardingPhase === 'extraction') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 5, pointerEvents: 'none' }}
        />
      )}
      {onboardingPhase === 'upload' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showFocus ? 1 : 0, y: showFocus ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-20px' }}
        >
          <span style={{ color: '#FF9500', fontSize: '13px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', maxWidth: '320px', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
            UPLOAD FILES THAT SHOW YOUR SKILLS AND EXPERIENCE.
          </span>
          <div style={{ width: '2px', height: '40px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '15px' }} />
        </motion.div>
      )}
      <div className="onboarding-card" style={{ position: 'relative', zIndex: 10 }}>
        {showFocus && (onboardingPhase === 'upload' || onboardingPhase === 'extraction') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 15, pointerEvents: 'none', borderRadius: 'inherit' }}
          />
        )}
        <button className="skip-onboarding-btn" onClick={() => setShowInitialUpload(false)} style={{ zIndex: 20 }}>Skip ➜</button>
        {onboardingPhase === 'upload' ? (
          <>
            <h1 className="onboarding-title" style={{ position: 'relative', zIndex: 20 }}>DUMP YOUR LIFE.</h1>
            <div style={{ position: 'relative', marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div 
                className="drop-zone-huge" 
                onClick={() => fileInputRef.current?.click()}
                style={{ position: 'relative', zIndex: showFocus ? 20 : 1, width: '100%' }}
              >
                {showFocus && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      border: '2px solid #FF9500', borderRadius: 'inherit',
                      boxShadow: '0 0 40px rgba(255, 149, 0, 0.5)', zIndex: -1, pointerEvents: 'none'
                    }}
                  />
                )}
                <div className="drop-icon-pulse" style={{ position: 'relative', zIndex: 2 }}>✦</div>
                <p style={{ position: 'relative', zIndex: 2 }}>DROP FILES</p>
              </div>
            </div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) {
                  setShowFocus(false);
                  handleFileSelect(e.target.files);
                  setOnboardingPhase('extraction');
                }
              }}
            />
          </>
        ) : (
          <div className="calibration-view" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h1 className="onboarding-title" style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>CALIBRATING IDENTITY.</h1>
            
            {/* DOMAINS SECTION */}
            <div style={{ position: 'relative', zIndex: showFocus ? 20 : 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                {showFocus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                  >
                    <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', maxWidth: '320px', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                      WHAT PROFESSIONS/CRAFTS ARE YOU EXPERIENCED IN?
                    </span>
                    <div style={{ width: '2px', height: '20px', background: 'linear-gradient(to bottom, #FF9500, transparent)', marginTop: '10px' }} />
                  </motion.div>
                )}
              </div>
              
              <div style={{ position: 'relative', width: '100%', padding: '20px', marginTop: '10px' }}>
                {showFocus && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      border: '2px solid #FF9500', borderRadius: '16px',
                      boxShadow: '0 0 40px rgba(255, 149, 0, 0.5)', zIndex: -1, pointerEvents: 'none'
                    }}
                  />
                )}
                <div className="onboarding-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                  {userDomains.map((d, i) => (
                    <input
                      key={i}
                      className="identity-input-field centered"
                      placeholder={`DOMAIN 0${i+1}`}
                      value={d}
                      onChange={(e) => {
                        const n = [...userDomains];
                        n[i] = e.target.value.toUpperCase();
                        setUserDomains(n);
                      }}
                      style={{ textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.2)', color: 'white', transition: 'all 0.5s ease', margin: 0, padding: '10px 0' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* SKILLS SECTION */}
            <div style={{ position: 'relative', zIndex: showFocus ? 20 : 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '100%', padding: '20px', marginBottom: '10px' }}>
                {showFocus && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      border: '2px solid #FF9500', borderRadius: '16px',
                      boxShadow: '0 0 40px rgba(255, 149, 0, 0.5)', zIndex: -1, pointerEvents: 'none'
                    }}
                  />
                )}
                <input
                  className="identity-input-field centered"
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value.toUpperCase())}
                  style={{ textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.2)', width: '100%', color: 'white', transition: 'all 0.5s ease', margin: 0, padding: '10px 0' }}
                />
              </div>

              <div style={{ minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                {showFocus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                  >
                    <div style={{ width: '2px', height: '20px', background: 'linear-gradient(to top, #FF9500, transparent)', marginBottom: '10px' }} />
                    <span style={{ color: '#FF9500', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textAlign: 'center', maxWidth: '320px', textShadow: '0 0 10px rgba(255,149,0,0.5)' }}>
                      CHOOSE UP TO 3 ADJECTIVES TO DESCRIBE YOUR STRENGTHS.
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            <button
              className="placeholder-button export-btn glass-panel large"
              style={{ width: '100%', padding: '24px', position: 'relative', zIndex: 1, marginTop: 'auto' }}
              onClick={async () => {
                await compileForgeNodes();
                setOnboardingStep(3); // Move to Dive step
                onComplete();
                setTimeout(() => generateSovereignty(), 1000);
              }}
            >
              INITIALIZE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingOverlay;
