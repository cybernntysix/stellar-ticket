import React, { useState, useEffect } from 'react';
import { useTickets } from './context/TicketContext';

// Components
import Starfield from './components/Starfield';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import BentoGrid from './components/BentoGrid';
import PresentationForge from './components/PresentationForge';
import KnowledgeBaseLibrary from './components/KnowledgeBaseLibrary';
import AllTicketsView from './components/AllTicketsView';
import ShadowVectorView from './components/ShadowVectorView';
import LandingPage from './components/LandingPage';

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
  const { tickets, isAuthenticated } = useTickets();
  const [composerMode, setComposerMode] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sync mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`sovereign-os tab-dashboard ${isMobile ? 'is-mobile' : ''}`}>
      <Starfield paused={!!composerMode || presentationMode || !isAuthenticated} />
      
      {!isAuthenticated ? (
         <LandingPage onLogin={() => {}} />
      ) : (
        <div className="dashboard-layout">
          {!isMobile && (
            <Sidebar 
              setComposerMode={setComposerMode} 
              setPresentationMode={setPresentationMode}
              isCalibrationMode={isCalibrationMode}
              setIsCalibrationMode={setIsCalibrationMode}
            />
          )}

          <main className="editor-container" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ padding: '20px 20px 0 20px', flexShrink: 0 }}>
              <DashboardHeader setShowInitialUpload={() => {}} />
            </div>
            
            <div className="dashboard-content" style={{ flexGrow: 1, minHeight: 0, padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
              {presentationMode ? (
                <PresentationForge />
              ) : composerMode === 'kb' ? (
                <KnowledgeBaseLibrary />
              ) : composerMode === 'tickets' ? (
                <AllTicketsView />
              ) : composerMode === 'shadow_vector' ? (
                <ShadowVectorView />
              ) : (
                <BentoGrid isCalibrationMode={isCalibrationMode} />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
