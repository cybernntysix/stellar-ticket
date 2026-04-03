import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSovereign } from '../context/SovereignContext';
import NeuralConstellation from './NeuralConstellation';

const DossierCaptureTank: React.FC = () => {
  const { 
    sovereignCuration, 
    identityStatement, 
    isExportingDossier, 
    setIsExportingDossier 
  } = useSovereign();
  
  const tankRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isExportingDossier && currentFrame === -1) {
      startExport();
    }
  }, [isExportingDossier]);

  const startExport = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080]
    });

    const nodes = sovereignCuration?.discoveredNodes || [];

    // --- PAGE 1: CORE IDENTITY ANCHOR ---
    setProgress(5);
    setCurrentFrame(0);
    await new Promise(r => setTimeout(r, 1000)); // Wait for render
    await capturePage(pdf, 0);

    // --- PAGE 2: THE CONSTELLATION ---
    setProgress(15);
    setCurrentFrame(1);
    await new Promise(r => setTimeout(r, 1500)); // Wait for canvas drawing
    await capturePage(pdf, 1);

    // --- PAGES 3-10: NODE DIVES ---
    for (let i = 0; i < nodes.length; i++) {
      setProgress(20 + ((i / nodes.length) * 60));
      setCurrentFrame(2 + i);
      await new Promise(r => setTimeout(r, 1000));
      await capturePage(pdf, 2 + i);
      if (i < nodes.length - 1 || true) pdf.addPage([1920, 1080], 'landscape');
    }

    // --- PAGE 11: CURATED INSIGHTS ---
    setProgress(90);
    setCurrentFrame(2 + nodes.length);
    await new Promise(r => setTimeout(r, 1000));
    await capturePage(pdf, 2 + nodes.length, true); // Final page

    pdf.save(`ParadigmOS_Dossier_${new Date().getTime()}.pdf`);
    setIsExportingDossier(false);
    setCurrentFrame(-1);
    setProgress(0);
  };

  const capturePage = async (pdf: jsPDF, pageIndex: number, isLast = false) => {
    if (!tankRef.current) return;
    const canvas = await html2canvas(tankRef.current, {
      scale: 1.5, 
      useCORS: true,
      backgroundColor: '#000000',
      logging: false,
      width: 1920,
      height: 1080
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    pdf.addImage(imgData, 'JPEG', 0, 0, 1920, 1080);
    if (!isLast) pdf.addPage([1920, 1080], 'landscape');
  };

  if (!isExportingDossier) return null;

  const activeNode = currentFrame >= 2 && currentFrame < 2 + (sovereignCuration?.discoveredNodes?.length || 0) 
    ? sovereignCuration.discoveredNodes[currentFrame - 2] 
    : null;

  const isInsightsPage = currentFrame === 2 + (sovereignCuration?.discoveredNodes?.length || 0);

  return (
    <div style={{ position: 'fixed', top: '-5000px', left: '-5000px', zIndex: -1000 }}>
      {/* THE CAPTURE TANK (1920x1080) */}
      <div 
        ref={tankRef} 
        style={{ 
          width: '1920px', height: '1080px', background: '#000', 
          position: 'relative', overflow: 'hidden', color: 'white',
          fontFamily: 'SF Pro Display, sans-serif'
        }}
      >
        {/* FRAME 0: ANCHOR */}
        {currentFrame === 0 && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
             <div style={{ width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, #007AFF 0%, transparent 70%)', boxShadow: '0 0 150px #007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '64px' }}>✧</span>
             </div>
             <h1 style={{ fontSize: '100px', fontWeight: 900, marginTop: '80px', letterSpacing: '0.1em' }}>{identityStatement.split(' // ')[0]}</h1>
             <span style={{ color: '#007AFF', fontSize: '18px', letterSpacing: '1em', marginTop: '40px' }}>CORE IDENTITY DOSSIER</span>
          </div>
        )}

        {/* FRAME 1: CONSTELLATION */}
        {currentFrame === 1 && (
          <div style={{ width: '100%', height: '100%', background: '#000' }}>
            <NeuralConstellation userDomains={sovereignCuration?.discoveredNodes} suppressDetail={true} />
            <div style={{ position: 'absolute', top: 80, left: 80 }}>
               <span style={{ fontSize: '12px', letterSpacing: '0.5em', color: '#007AFF' }}>NEURAL ARCHITECTURE</span>
               <h2 style={{ fontSize: '48px', fontWeight: 900, margin: '20px 0' }}>SYSTEMIC PROOF-OF-WORK</h2>
            </div>
          </div>
        )}

        {/* FRAME 2-10: NODE DIVES */}
        {activeNode && (
          <div style={{ width: '100%', height: '100%', padding: '120px', display: 'flex', alignItems: 'center', background: '#000' }}>
             <div style={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '500px', height: '500px', borderRadius: '50%', border: '2px solid #007AFF', boxShadow: '0 0 100px rgba(0,122,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {activeNode.visualArtifact?.type === 'svg' ? (
                      <div dangerouslySetInnerHTML={{ __html: activeNode.visualArtifact.content }} style={{ width: '80%' }} />
                   ) : (
                      <span style={{ fontSize: '120px', color: '#007AFF' }}>✧</span>
                   )}
                </div>
             </div>
             <div style={{ width: '60%', paddingLeft: '100px' }}>
                <span style={{ fontSize: '14px', letterSpacing: '0.5em', color: '#007AFF' }}>DOMAIN VERIFICATION</span>
                <h2 style={{ fontSize: '120px', fontWeight: 900, margin: '40px 0', lineHeight: '0.9' }}>{activeNode.label}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                   {(activeNode.description || activeNode.depthSummary || "").split(/[\n\-\*•]\s+/).filter((s: string) => s.trim().length > 5).map((bullet: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                         <div style={{ width: '10px', height: '10px', background: '#007AFF', borderRadius: '50%', marginTop: '15px' }} />
                         <p style={{ fontSize: '32px', lineHeight: '1.4', margin: 0, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{bullet.trim()}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* FRAME 11: INSIGHTS */}
        {isInsightsPage && (
          <div style={{ width: '100%', height: '100%', padding: '120px', background: '#000' }}>
             <span style={{ fontSize: '14px', letterSpacing: '0.5em', color: '#007AFF' }}>SYNTHESIS COMPLETE</span>
             <h2 style={{ fontSize: '80px', fontWeight: 900, margin: '40px 0' }}>CURATED INSIGHTS</h2>
             <p style={{ fontSize: '36px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', maxWidth: '1400px' }}>{sovereignCuration?.content}</p>
             <div style={{ marginTop: '80px', display: 'flex', gap: '40px' }}>
                {sovereignCuration?.connectiveStatements?.slice(0, 3).map((s: string, i: number) => (
                   <div key={i} style={{ flex: 1, padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', borderLeft: '4px solid #007AFF' }}>
                      <p style={{ fontSize: '20px', margin: 0 }}>{s}</p>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* OVERLAY FOR UI */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 1000000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
         <div className="loading-spinner" style={{ width: '80px', height: '80px' }}></div>
         <h2 style={{ marginTop: '40px', letterSpacing: '0.2em' }}>GENERATING DOSSIER... {Math.round(progress)}%</h2>
         <p style={{ opacity: 0.5, fontSize: '12px', marginTop: '20px' }}>CAPTURING NEURAL FRAMES FOR ARCHIVE</p>
      </div>
    </div>
  );
};

export default DossierCaptureTank;
