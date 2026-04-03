import React, { useState, useRef } from 'react';
import { useSovereign } from '../context/SovereignContext';

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
    generateSovereignty
  } = useSovereign();

  const [onboardingPhase, setOnboardingPhase] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mission-onboarding-overlay">
      <div className="onboarding-card">
        <button className="skip-onboarding-btn" onClick={() => setShowInitialUpload(false)}>Skip ➜</button>
        {onboardingPhase === 'upload' ? (
          <>
            <h1 className="onboarding-title">DUMP YOUR LIFE.</h1>
            <div className="drop-zone-huge" onClick={() => fileInputRef.current?.click()}>
              <div className="drop-icon-pulse">✦</div>
              <p>DROP FILES</p>
            </div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) {
                  handleFileSelect(e.target.files);
                  setOnboardingPhase('extraction');
                }
              }}
            />
          </>
        ) : (
          <div className="calibration-view">
            <h1 className="onboarding-title">CALIBRATING IDENTITY.</h1>
            <div className="onboarding-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
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
                  style={{ textAlign: 'center', borderBottom: '2px solid white' }}
                />
              ))}
            </div>
            <input
              className="identity-input-field centered"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value.toUpperCase())}
              style={{ textAlign: 'center', borderBottom: '2px solid white', marginBottom: '60px' }}
            />
            <button
              className="placeholder-button export-btn glass-panel large"
              style={{ width: '100%', padding: '24px' }}
              onClick={async () => {
                await compileForgeNodes();
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
