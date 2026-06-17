import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Zap, ArrowLeft, ArrowRight, Lock, FileText, Award, Camera } from 'lucide-react';
import { useTickets, type Role, type Department } from '../context/TicketContext';

interface LandingPageProps {
  onLogin: () => void;
}

const BADGES = [
  '/assets/dossier/google-cybersecurity-professional-certificate-v2.png',
  '/assets/dossier/cyber-threat-intelligence.png',
  '/assets/dossier/introduction-to-cybersecurity-tools-cyber-attacks.png',
  '/assets/dossier/network-security-database-vulnerabilities.png',
  '/assets/dossier/penetration-testing-incident-response-and-forensics.png',
  '/assets/dossier/cybersecurity-roles-processes-operating-system-security.png',
  '/assets/dossier/operating-systems-basics.png',
  '/assets/dossier/computer-hardware-basics.png',
  '/assets/dossier/engaging-stakeholders-for-success.png',
  '/assets/dossier/creating-compelling-reports.png'
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { login, register } = useTickets();
  const [activeTab, setActiveTab] = useState<'access' | 'docs' | 'gallery' | 'credentials'>('access');
  const [view, setView] = useState<'roles' | 'login' | 'register'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [department, setDepartment] = useState<Department>('IT');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'credentials') {
      const interval = setInterval(() => {
        setCurrentBadgeIndex((prev) => (prev + 1) % BADGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

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

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white'
    }}>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '40px' }}
        >
            <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '0.3em', margin: '0 0 10px 0', textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>STELLAR TICKET</h1>
            <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 900, letterSpacing: '0.5em', margin: 0 }}>NEURAL INCIDENT MANAGEMENT SYSTEM</p>
        </motion.div>

        {/* Portfolio Navigation */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '20px', marginBottom: '50px', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}
        >
            <button onClick={() => { setActiveTab('access'); setView('roles'); }} className={`sidebar-btn ${activeTab === 'access' ? 'active' : ''}`} style={{ margin: 0, padding: '10px 20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent' }}>
                <Lock size={14} /> SYSTEM ACCESS
            </button>
            <button onClick={() => setActiveTab('docs')} className={`sidebar-btn ${activeTab === 'docs' ? 'active' : ''}`} style={{ margin: 0, padding: '10px 20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent' }}>
                <FileText size={14} /> DOCUMENTATION
            </button>
            <button onClick={() => setActiveTab('gallery')} className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`} style={{ margin: 0, padding: '10px 20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent' }}>
                <Camera size={14} /> FIELD OPERATIONS
            </button>
            <button onClick={() => setActiveTab('credentials')} className={`sidebar-btn ${activeTab === 'credentials' ? 'active' : ''}`} style={{ margin: 0, padding: '10px 20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent' }}>
                <Award size={14} /> CREDENTIALS
            </button>
        </motion.div>

        <AnimatePresence mode="wait">
            {activeTab === 'access' && view === 'roles' && (
                <motion.div 
                    key="roles"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    <div 
                        className="glass-panel"
                        onClick={() => handleRoleSelect('client')}
                        style={{ 
                            padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>CLIENT PORTAL</h3>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>SUBMIT & TRACK NODES</p>
                        </div>
                    </div>

                    <div 
                        className="glass-panel"
                        onClick={() => handleRoleSelect('support_tier_1')}
                        style={{ 
                            padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(0,122,255,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer',
                            background: 'rgba(0,122,255,0.05)', transition: 'all 0.3s',
                            boxShadow: '0 0 30px rgba(0,122,255,0.1)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,122,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,122,255,0.05)'}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--color-primary)' }}>
                            <Zap size={24} color="white" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>IT PORTAL</h3>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>RESOLVE & ORCHESTRATE</p>
                        </div>
                    </div>

                    <div 
                        className="glass-panel"
                        onClick={() => handleRoleSelect('cybersecurity')}
                        style={{ 
                            padding: '40px', width: '240px', borderRadius: '24px', border: '1px solid rgba(255,59,48,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer',
                            background: 'rgba(255,59,48,0.05)', transition: 'all 0.3s',
                            boxShadow: '0 0 30px rgba(255,59,48,0.1)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,59,48,0.05)'}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #FF3B30' }}>
                            <Shield size={24} color="white" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>SECURITY PORTAL</h3>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>THREAT MONITORING</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'access' && view !== 'roles' && (
                <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel"
                    style={{ width: '400px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <button onClick={() => setView('roles')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 900, cursor: 'pointer', marginBottom: '30px' }}>
                        <ArrowLeft size={14} /> SELECT DIFFERENT ROLE
                    </button>

                    <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', textAlign: 'center' }}>
                        {view === 'login' ? 'AUTHENTICATE IDENTITY' : 'INITIALIZE CREDENTIALS'}
                    </h2>
                    
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '30px', letterSpacing: '0.1em' }}>
                        REQUESTED CLEARANCE: <span style={{ color: 'var(--color-primary)' }}>{selectedRole.toUpperCase()}</span>
                    </p>

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="USERNAME" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', color: 'white', outline: 'none' }}
                        />
                        <input 
                            type="password" 
                            placeholder="SECURITY KEY" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', color: 'white', outline: 'none' }}
                        />
                        
                        {view === 'register' && (
                            <>
                                <select 
                                    value={department}
                                    onChange={e => setDepartment(e.target.value as Department)}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', color: 'white', outline: 'none', appearance: 'none' }}
                                >
                                    <option value="IT">IT Department</option>
                                    <option value="Security">Security</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="HR">HR</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="TEAM ID TO JOIN (OR LEAVE BLANK)" 
                                    value={teamId}
                                    onChange={e => setTeamId(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', color: 'white', outline: 'none' }}
                                />
                                <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>OR CREATE NEW TEAM</div>
                                <input 
                                    type="text" 
                                    placeholder="NEW TEAM NAME" 
                                    value={teamName}
                                    onChange={e => setTeamName(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', color: 'white', outline: 'none' }}
                                />
                            </>
                        )}

                        {error && <p style={{ color: '#FF3B30', fontSize: '12px', textAlign: 'center', margin: '5px 0' }}>{error}</p>}
                        
                        <button type="submit" className="primary-action-btn" style={{ padding: '15px', marginTop: '10px', fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {view === 'login' ? 'INITIATE UPLINK' : 'REGISTER PROFILE'} <ArrowRight size={16} />
                        </button>
                    </form>

                    <button 
                        onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', marginTop: '20px', width: '100%', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.1em' }}
                    >
                        {view === 'login' ? 'CREATE NEW IDENTITY' : 'RETURN TO LOGIN'}
                    </button>
                </motion.div>
            )}

            {activeTab === 'docs' && (
                <motion.div 
                    key="docs"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    <a 
                        href="/assets/dossier/PORTFOLIO-Understanding-Ticketing-Systems.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glass-panel"
                        style={{ 
                            padding: '40px', width: '300px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s', textDecoration: 'none', color: 'white'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={24} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>PORTFOLIO REPORT</h3>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>UNDERSTANDING TICKETING SYSTEMS</p>
                        </div>
                    </a>

                    <a 
                        href="/assets/dossier/CERT-BADGES.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glass-panel"
                        style={{ 
                            padding: '40px', width: '300px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s', textDecoration: 'none', color: 'white'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={24} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>CERTIFICATION INDEX</h3>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>VERIFIED CREDENTIAL BREAKDOWN</p>
                        </div>
                    </a>
                </motion.div>
            )}

            {activeTab === 'gallery' && (
                <motion.div 
                    key="gallery"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel"
                    style={{ padding: '40px', width: '800px', maxWidth: '90vw', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
                >
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                        <Camera size={24} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 15px 0', letterSpacing: '0.1em' }}>FIELD OPERATIONS GALLERY</h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 30px 0', lineHeight: 1.6 }}>Photographic documentation of hands-on technical deployments and hardware operations at Per Scholas.</p>
                    
                    {/* Placeholder for future images */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        {[1, 2, 3].map((num) => (
                            <div key={num} style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '0.1em' }}>AWAITING IMAGE DATA</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'credentials' && (
                <motion.div 
                    key="credentials"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <div className="glass-panel" style={{ padding: '40px', width: '500px', maxWidth: '90vw', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', position: 'relative', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={currentBadgeIndex}
                                src={BADGES[currentBadgeIndex]}
                                alt="Certification Badge"
                                initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                style={{ width: '80%', height: 'auto', objectFit: 'contain' }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
                        {BADGES.map((_, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    width: '30px', height: '4px', borderRadius: '2px', 
                                    background: currentBadgeIndex === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                    transition: 'background 0.3s'
                                }} 
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default LandingPage;