import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSovereign } from './context/SovereignContext';

// Components
import Starfield from './components/Starfield';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import BentoGrid from './components/BentoGrid';
import OnboardingOverlay from './components/OnboardingOverlay';
import PlayerCard from './components/PlayerCard';
import PresentationForge from './components/PresentationForge';
import NeuralConstellation from './components/NeuralConstellation';
import DataVault from './components/DataVault';
import GenPanel from './components/GenPanel';
import DossierCaptureTank from './components/DossierCaptureTank';
import BottomCommandBar from './components/BottomCommandBar';
import MemoryDrawer from './components/MemoryDrawer';
import Tooltip from './components/Tooltip';

// Styles
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/suites.css';
import './styles/home.css';
import './styles/cube.css';
import './styles/mobile.css';

const App = () => {
  const { 
    isAuditing, 
    auditProgress, 
    auditResult, 
    setAuditResult,
    uploadedAssets,
    fetchAssets,
    sovereignCuration,
    identityStatement,
    handleAudit,
    theme,
    assignVisualToNode,
    onboardingStep,
    setOnboardingStep
  } = useSovereign() as any;

  const [composerMode, setComposerMode] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showInitialUpload, setShowInitialUpload] = useState(true);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileTab, setMobileTab] = useState('home');
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);

  // Sync mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CTO Optimization: Pause Starfield during intensive overlay tasks
  const isStarfieldPaused = !!composerMode || showInitialUpload || showPlayerCard;

  // If we have a curation and we just finished onboarding, show the Player Card
  const handleOnboardingComplete = () => {
    setShowInitialUpload(false);
    setShowPlayerCard(true);
  };

  return (
    <div className={`sovereign-os tab-dashboard ${isMobile ? 'is-mobile' : ''}`}>
      <Starfield paused={isStarfieldPaused} />
      
      <div className="dashboard-layout">
        {!isMobile && (
          <Sidebar 
            setComposerMode={setComposerMode} 
            setPresentationMode={setPresentationMode} 
          />
        )}

        <main className="editor-container" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <DashboardHeader setShowInitialUpload={setShowInitialUpload} />
          
          {isMobile && !composerMode && mobileTab === 'home' ? (
            <div className="mobile-home-anchor" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
              <div style={{ marginBottom: '40px', padding: '20px', borderLeft: '2px solid var(--color-primary)', background: 'rgba(255,255,255,0.02)', borderRadius: '0 16px 16px 0' }}>
                <span className="section-label" style={{ fontSize: '9px', display: 'block', marginBottom: '15px' }}>CURRENT AUTHORITY ANCHOR</span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', lineHeight: '1.3', margin: 0 }}>{identityStatement}</h2>
              </div>
              <button 
                onClick={() => {
                  if (onboardingStep > 0) return;
                  setMobileTab('map');
                }}
                className="primary-action-btn"
                style={{ padding: '15px 40px', fontSize: '11px', letterSpacing: '0.2em', opacity: onboardingStep > 0 ? 0.3 : 1, cursor: onboardingStep > 0 ? 'not-allowed' : 'pointer' }}
              >
                INITIALIZE NEURAL MAP
              </button>
            </div>
          ) : (
            <BentoGrid setComposerMode={setComposerMode} />
          )}
        </main>

        {isMobile && (
          <BottomCommandBar 
            setComposerMode={setComposerMode} 
            setPresentationMode={setPresentationMode} 
            setShowMemoryDrawer={setShowMemoryDrawer}
            setMobileTab={setMobileTab}
          />
        )}
      </div>

      <AnimatePresence>
        {showInitialUpload && (
          <OnboardingOverlay 
            key="onboarding"
            setShowInitialUpload={setShowInitialUpload} 
            onComplete={handleOnboardingComplete}
          />
        )}
        
        {showPlayerCard && (
          <PlayerCard key="player-card" onDismiss={() => setShowPlayerCard(false)} />
        )}

        <MemoryDrawer 
          key="memory-drawer"
          isOpen={showMemoryDrawer} 
          onClose={() => setShowMemoryDrawer(false)} 
        />

        <DossierCaptureTank key="dossier-capture" />

        {composerMode === 'data' && (
          <div key="data-vault" className="composer-overlay">
            <DataVault 
              uploadedAssets={uploadedAssets} 
              fetchAssets={fetchAssets} 
              onClose={() => setComposerMode(null)}
              sovereignCuration={sovereignCuration}
              identityStatement={identityStatement}
            />
          </div>
        )}

        {composerMode === 'visual' && (
          <div key="gen-panel" className="composer-overlay">
            <GenPanel 
              onClose={() => setComposerMode(null)}
              uploadedAssets={uploadedAssets}
              userDomains={sovereignCuration?.discoveredNodes || []}
              onAssign={assignVisualToNode}
            />
          </div>
        )}

        {presentationMode && (
          <motion.div 
            key="presentation"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="presentation-overlay"
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'black', zIndex: 1000000, overflow: 'hidden' 
            }}
          >
            <Starfield paused={isStarfieldPaused} />
            <div style={{ position: 'absolute', top: 40, right: 40, zIndex: 1000002 }}>
              <div style={{ position: 'relative' }}>
                {onboardingStep === 7 && <Tooltip text="Tap here to exit presentation mode." position="left" style={{ width: '150px' }} />}
                <button 
                  onClick={() => {
                    if (onboardingStep > 0 && onboardingStep !== 7) return;
                    if (onboardingStep === 7) setOnboardingStep(8);
                    setPresentationMode(false);
                  }}
                  className="placeholder-button secondary glass-panel"
                  style={{ padding: '12px 24px', fontSize: '11px', letterSpacing: '0.2em', opacity: onboardingStep > 0 && onboardingStep !== 7 ? 0.3 : 1, cursor: onboardingStep > 0 && onboardingStep !== 7 ? 'not-allowed' : 'pointer' }}
                >
                  EXIT PRESENTATION
                </button>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000001 }}>
              <PresentationForge />
            </div>
          </motion.div>
        )}

        {isAuditing && (
          <div key="audit-progress" className="audit-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="audit-progress-container" style={{ width: '300px' }}>
              <div className="audit-progress-bar" style={{ height: '2px', background: 'var(--color-primary)', width: `${auditProgress}%`, transition: 'width 0.3s ease' }}></div>
              <p style={{ color: 'var(--color-primary)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', marginTop: '20px', textAlign: 'center' }}>
                NEURAL AUDIT IN PROGRESS // {auditProgress}%
              </p>
            </div>
          </div>
        )}

        {auditResult && (
          <div key="audit-result" className="audit-modal-overlay" onClick={() => setAuditResult(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 3000000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="audit-modal glass-panel" onClick={e => e.stopPropagation()} style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: '32px', overflow: 'hidden' }}>
              <div className="composer-header">
                <h2 className="suite-title">{auditResult.label} // AUDIT</h2>
                <button className="placeholder-button secondary glass-panel" onClick={() => setAuditResult(null)}>CLOSE</button>
              </div>
              <div className="quick-look-content" style={{ padding: '40px', color: 'white', lineHeight: '1.8' }}>
                {auditResult.summary}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
