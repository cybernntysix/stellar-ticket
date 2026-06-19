import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Zap, ArrowLeft, ArrowRight, Lock, FileText, Award, Camera, MonitorPlay, HardDrive } from 'lucide-react';
import { useTickets, type Role, type Department } from '../context/TicketContext';

const LinkedinIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);
import { PORTFOLIO_DOCS, type PortfolioDocument } from '../data/portfolioData';

interface LandingPageProps {
  onLogin: () => void;
}

const BADGES = [
  '/assets/dossier/badges/google-cybersecurity-professional-certificate-v2.png',
  '/assets/dossier/badges/cyber-threat-intelligence.png',
  '/assets/dossier/badges/introduction-to-cybersecurity-tools-cyber-attacks.png',
  '/assets/dossier/badges/network-security-database-vulnerabilities.png',
  '/assets/dossier/badges/penetration-testing-incident-response-and-forensics.png',
  '/assets/dossier/badges/cybersecurity-roles-processes-operating-system-security.png',
  '/assets/dossier/badges/operating-systems-basics.png',
  '/assets/dossier/badges/computer-hardware-basics.png',
  '/assets/dossier/badges/engaging-stakeholders-for-success.png',
  '/assets/dossier/badges/creating-compelling-reports.png'
];

const SKILL_DATA: Record<string, string[]> = {
  'HARDWARE DIAGNOSTICS': [
    "Provide technical support for desktops, laptops, and mobile devices, troubleshooting hardware and software issues.",
    "Perform hardware repairs and upgrades such as RAM, hard drives, and peripheral devices.",
    "Resolved 2,500+ technical incidents across macOS, Windows, and audio hardware, maintaining a strong track record of first-contact resolution.",
    "Diagnosed and resolved complex issues involving system performance, driver conflicts, OS errors, and software compatibility."
  ],
  'INCIDENT RESPONSE': [
    "Owned the full troubleshooting lifecycle, including issue diagnosis, resolution, and documentation, ensuring consistent and repeatable support processes.",
    "Supported high-demand clients in time-sensitive environments, maintaining system reliability and minimizing downtime during critical operations.",
    "Delivered 40+ hours/week of remote technical support via phone, email, Zoom, and messaging platforms.",
    "Managed flexible, on-call support across off-hours and overnight sessions, demonstrating reliability in fast-paced and unstructured environments."
  ],
  'CLOUD ARCHITECTURE': [
    "Entra ID configuration and environment deployment in homelab environments.",
    "Diagnose and resolve network connectivity issues (Wi-Fi, LAN, VPN) to minimize downtime.",
    "Experience with Office 365, Google Workspace, Azure, and ServiceNow platforms.",
    "Network traffic analysis via Wireshark and SIEM fundamentals."
  ],
  'SYSTEMS ADMINISTRATION': [
    "Install, configure, and maintain operating systems including Windows, macOS, and basic Linux environments.",
    "Configured macOS systems end-to-end, including software installation, OS updates, performance tuning, and workflow optimization.",
    "Improved system stability and reduced CPU-related disruptions by optimizing resource usage, plugin management, and system configurations.",
    "Python automation scripting, Linux file management, and security configuration."
  ]
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { login, register } = useTickets();
  const [isDemoLaunched, setIsDemoLaunched] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PortfolioDocument | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [view, setView] = useState<'roles' | 'login' | 'register'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [department, setDepartment] = useState<Department>('IT');
  const [error, setError] = useState('');

  const getIcon = (type: string) => {
    switch(type) {
      case 'Award': return <Award size={32} />;
      case 'HardDrive': return <HardDrive size={32} />;
      case 'MonitorPlay': return <MonitorPlay size={32} />;
      case 'FileText': default: return <FileText size={32} />;
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setView('login');
    setError('');
  };

  const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          if (view === 'login') {
              await login({ username, password });
              onLogin();
          } else {
              await register({
                  username,
                  password,
                  role: selectedRole,
                  department,
                  teamName: teamName || undefined,
                  teamIdToJoin: teamId || undefined,
                  isNewTeam: !!teamName
              });
              onLogin();
          }
      } catch (err: any) {
          setError(err.message);
      }
  };

  if (isDemoLaunched) {
      return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(20px)', zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
            <button 
                onClick={() => setIsDemoLaunched(false)} 
                style={{ position: 'absolute', top: '40px', left: '40px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em' }}
            >
                <ArrowLeft size={16} /> RETURN TO PORTFOLIO
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '0.3em', margin: '0 0 10px 0', textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>STELLAR TICKET</h1>
                <p style={{ color: 'var(--color-primary)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.5em', margin: 0 }}>LIVE DEMONSTRATION</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {view === 'roles' ? (
                    <motion.div 
                        key="roles" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        <div 
                            className="glass-panel" onClick={() => handleRoleSelect('client')}
                            style={{ padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        >
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={24} /></div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>CLIENT PORTAL</h3>
                                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>SUBMIT & TRACK NODES</p>
                            </div>
                        </div>

                        <div 
                            className="glass-panel" onClick={() => handleRoleSelect('support_tier_1')}
                            style={{ padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(0,122,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer', background: 'rgba(0,122,255,0.05)', transition: 'all 0.3s', boxShadow: '0 0 30px rgba(0,122,255,0.1)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,122,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,122,255,0.05)'}
                        >
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--color-primary)' }}><Zap size={24} color="white" /></div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>IT PORTAL</h3>
                                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>RESOLVE & ORCHESTRATE</p>
                            </div>
                        </div>

                        <div 
                            className="glass-panel" onClick={() => handleRoleSelect('cybersecurity')}
                            style={{ padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(255,59,48,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer', background: 'rgba(255,59,48,0.05)', transition: 'all 0.3s', boxShadow: '0 0 30px rgba(255,59,48,0.1)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,59,48,0.05)'}
                        >
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #FF3B30' }}><Shield size={24} color="white" /></div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>SECURITY PORTAL</h3>
                                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>THREAT MONITORING</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="auth-form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-panel" style={{ width: '400px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <button onClick={() => setView('roles')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowLeft size={16} /> BACK</button>
                            <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{selectedRole.toUpperCase()} ACCESS</span>
                        </div>

                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>USERNAME</label>
                                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>PASSWORD</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 12px 12px 35px', color: 'white', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>

                            {view === 'register' && (
                                <>
                                    <select value={department} onChange={e => setDepartment(e.target.value as Department)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none', appearance: 'none' }}>
                                        <option value="IT">IT SUPPORT</option>
                                        <option value="Security">SECURITY</option>
                                        <option value="Infrastructure">INFRASTRUCTURE</option>
                                    </select>
                                    <input type="text" placeholder="Enter Team ID to join..." value={teamId} onChange={e => { setTeamId(e.target.value); setTeamName(''); }} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '10px' }} />
                                    <input type="text" placeholder="New Team Name..." value={teamName} onChange={e => { setTeamName(e.target.value); setTeamId(''); }} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none' }} />
                                </>
                            )}

                            {error && <div style={{ color: '#FF3B30', fontSize: '12px', textAlign: 'center', fontWeight: 700 }}>{error}</div>}
                            <button type="submit" className="primary-action-btn" style={{ width: '100%', padding: '15px', fontSize: '11px', fontWeight: 900, marginTop: '10px' }}>
                                {view === 'login' ? 'AUTHENTICATE' : 'INITIALIZE CREDENTIALS'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      );
  }

  return (
    <>
        {/* Subtle Blurred Background */}
        <div style={{
            position: 'fixed',
            top: '-50px', left: '-50px', right: '-50px', bottom: '-50px',
            backgroundImage: 'url(/assets/backgrounds/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.6)',
            opacity: 0.8,
            zIndex: 90,
            pointerEvents: 'none'
        }} />

        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex', flexDirection: 'column',
            color: 'white',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '60px 20px'
        }}>
        {/* HERO HEADER */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}
        >
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, letterSpacing: '0.1em', margin: '0 0 10px 0', textShadow: '0 0 40px rgba(255,255,255,0.4)' }}>ANTHONY CURRIE</h1>
            <p style={{ color: 'var(--color-primary)', fontSize: 'clamp(12px, 2vw, 18px)', fontWeight: 900, letterSpacing: '0.4em', margin: '0 0 30px 0', textShadow: '0 0 20px var(--color-primary)' }}>IT SUPPORT SPECIALIST</p>
            
            <div className="skill-buttons-container" style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
                {Object.keys(SKILL_DATA).map(skill => (
                    <button 
                        key={skill} 
                        onClick={() => setSelectedSkill(skill)}
                        style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        [ {skill} ]
                    </button>
                ))}
            </div>

            <div style={{ position: 'relative', width: '100%', height: 0, zIndex: 100, display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence>
                    {selectedSkill && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="skill-popup-overlay"
                            style={{ top: 0, marginTop: 0 }}
                        >
                            <div className="skill-popup-content" style={{ textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(20px)', border: 'none', boxShadow: 'none', borderRadius: '36px', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Award size={16} color="var(--color-primary)" />
                                    <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em' }}>{selectedSkill}</span>
                                </div>
                                <button onClick={() => setSelectedSkill(null)} style={{ background: 'none', border: 'none', margin: 0, fontSize: '10px', color: '#FF3B30', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 900, letterSpacing: '0.1em' }}>
                                    CLOSE
                                </button>
                            </div>
                            
                            <div style={{ padding: '30px' }}>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {SKILL_DATA[selectedSkill].map((bullet, idx) => (
                                        <li key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                                            <span style={{ color: 'var(--color-primary)', fontSize: '18px', marginTop: '-2px' }}>•</span>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                                
                                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                                    <a 
                                            href="/assets/resume/Currie, Anthony - Resume  (2).pdf" 
                                            download="Currie_Anthony_Resume.pdf"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em', transition: 'all 0.3s', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 15px var(--color-primary)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.textShadow = 'none'; }}
                                        >
                                            <FileText size={16} color="var(--color-primary)" />
                                            DOWNLOAD RESUME
                                        </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', alignItems: 'center', marginBottom: '60px' }}>
                <a 
                    href="https://linkedin.com/in/anthonyccurrie" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em', transition: 'all 0.3s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 15px var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.textShadow = 'none'; }}
                >
                    <LinkedinIcon size={20} color="var(--color-primary)" />
                    CONNECT ON LINKEDIN
                </a>

                <a 
                    href="/assets/resume/Currie, Anthony - Resume  (2).pdf" 
                    download="Currie_Anthony_Resume.pdf"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em', transition: 'all 0.3s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 15px var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.textShadow = 'none'; }}
                >
                    <FileText size={20} color="var(--color-primary)" />
                    RESUME
                </a>
            </div>
        </motion.div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* SECTION 1: CREDENTIALS (Sliding Marquee) */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px 0', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '0 40px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Award size={24} color="var(--color-primary)" /></div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>VERIFIED CREDENTIALS</h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>IT INFRASTRUCTURE & CYBERSECURITY</p>
                    </div>
                </div>
                
                <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '20px 0' }}>
                    <motion.div 
                        animate={{ x: ['0%', '-50%'] }} 
                        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'flex', gap: '40px', width: 'max-content' }}
                    >
                        {/* First Set */}
                        {BADGES.map((badge, idx) => (
                            <div key={`set1-${idx}`} style={{ width: '250px', height: '250px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                                <img src={badge} alt="Certification Badge" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                        {/* Second Set (For seamless looping) */}
                        {BADGES.map((badge, idx) => (
                            <div key={`set2-${idx}`} style={{ width: '250px', height: '250px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                                <img src={badge} alt="Certification Badge" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* SECTION 2: DOCUMENTATION (Modal Hub) */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="var(--color-primary)" /></div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>DOCUMENTATION</h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>SYSTEMS PORTFOLIOS & REPORTS</p>
                    </div>
                </div>
                <div className="mobile-horizontal-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {PORTFOLIO_DOCS.map(doc => (
                        <button 
                            key={doc.id}
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    const link = document.createElement('a');
                                    link.href = doc.pdfUrl;
                                    link.download = doc.pdfUrl.split('/').pop() || 'document.pdf';
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } else {
                                    setSelectedDoc(doc);
                                }
                            }}
                            className="glass-panel mobile-center-doc"
                            style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'background 0.3s', textAlign: 'left', color: 'white' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                            {getIcon(doc.iconType)}
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>{doc.title}</h3>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{doc.subtitle}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.section>

            {/* SECTION 3: LABS GALLERY */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera size={24} color="var(--color-primary)" /></div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>FIELD OPERATIONS</h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>PER SCHOLAS HARDWARE & SYSTEMS LABS</p>
                    </div>
                </div>
                <div className="mobile-horizontal-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[
                      '/assets/dossier/landing-page-images/IMG_20260420_154106228.jpg',
                      '/assets/dossier/landing-page-images/IMG_20260420_155404710.jpg',
                      '/assets/dossier/landing-page-images/IMG_9515.jpeg'
                    ].map((imgSrc, idx) => (
                        <div key={idx} style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                            <img src={imgSrc} alt="Field Operation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* SECTION 4: CAPSTONE GATEWAY */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--color-primary)', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,0,0,0) 100%)', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 40px rgba(0,122,255,0.2)', background: 'black' }}>
                    <video 
                        src="/assets/dossier/STELLAR-TICKET-DEMO.mp4" 
                        controls 
                        autoPlay 
                        muted 
                        loop
                        playsInline
                        style={{ width: '100%', display: 'block' }} 
                    />
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 15px 0', letterSpacing: '0.2em', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>STELLAR TICKET</h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
                    A full-stack, multi-tenant IT Support and Cybersecurity ticketing platform. Featuring persistent data, role-based access control, an SLA engine, and a live Knowledge Base CMS.
                </p>
                <button 
                    className="primary-action-btn mobile-btn-fix"
                    onClick={() => setIsDemoLaunched(true)}
                    style={{ padding: '20px 40px', fontSize: '16px', fontWeight: 900, letterSpacing: '0.2em', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', margin: '0 auto' }}
                >
                    LAUNCH LIVE DEMONSTRATION <ArrowRight size={20} />
                </button>
            </motion.section>

        </div>
        
        {/* DOCUMENT VIEWER MODAL */}
        {createPortal(
            <AnimatePresence>
                {selectedDoc && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', color: 'white' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel"
                            style={{ width: '90vw', height: '90vh', maxWidth: '1200px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FileText size={16} color="var(--color-primary)" />
                                    <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em' }}>DOCUMENT VIEWER</span>
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <a href={selectedDoc.pdfUrl} download style={{ textDecoration: 'none', margin: 0, fontSize: '10px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 900, letterSpacing: '0.1em' }}>
                                        DOWNLOAD PDF
                                    </a>
                                    <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', margin: 0, fontSize: '10px', color: '#FF3B30', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 900, letterSpacing: '0.1em' }}>
                                        CLOSE VIEWER
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '40px', background: 'rgba(0,0,0,0.5)' }}>
                                {selectedDoc.content && selectedDoc.content.length > 0 ? (
                                    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '14px' }}>
                                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>{selectedDoc.title}</h3>
                                        
                                        {selectedDoc.content.map((section, idx) => (
                                            <div key={idx} style={{ marginBottom: '40px' }}>
                                                {section.sectionHeading && <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginTop: '50px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>{section.sectionHeading}</h3>}
                                                {section.title && <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '15px' }}>{section.title}</h4>}
                                                {section.paragraphs.map((p, pIdx) => (
                                                    <p key={pIdx} style={{ marginBottom: '20px' }}>{p}</p>
                                                ))}
                                                {section.images && section.images.length > 0 && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                                                        {section.images.map((img, imgIdx) => (
                                                            <img key={imgIdx} src={img} alt={`Figure ${imgIdx + 1}`} style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <iframe src={selectedDoc.pdfUrl} width="100%" height="100%" style={{ border: 'none', background: 'white', borderRadius: '12px' }} />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
        )}

        <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <a 
                href="https://linkedin.com/in/anthonyccurrie" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em' }}
            >
                <LinkedinIcon size={16} color="var(--color-primary)" />
                LINKEDIN
            </a>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', margin: 0 }}>© 2026 ANTHONY CURRIE // PORTFOLIO</p>
        </div>
    </div>
    </>
  );
};

export default LandingPage;