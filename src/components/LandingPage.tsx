import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Zap, ArrowLeft, ArrowRight, Lock, FileText, Award, Camera, MonitorPlay } from 'lucide-react';
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
  const [isDemoLaunched, setIsDemoLaunched] = useState(false);
  const [view, setView] = useState<'roles' | 'login' | 'register'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [department, setDepartment] = useState<Department>('IT');
  const [error, setError] = useState('');

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
                <p style={{ color: 'var(--color-primary)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.5em', margin: 0 }}>LIVE CAPSTONE DEMONSTRATION</p>
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
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      color: 'white',
      overflowY: 'auto',
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
            <p style={{ color: 'var(--color-primary)', fontSize: 'clamp(12px, 2vw, 18px)', fontWeight: 900, letterSpacing: '0.4em', margin: 0, textShadow: '0 0 20px var(--color-primary)' }}>IT SUPPORT SPECIALIST</p>
        </motion.div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* SECTION 1: CREDENTIALS */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={24} color="var(--color-primary)" /></div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>VERIFIED CREDENTIALS</h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>IT INFRASTRUCTURE & CYBERSECURITY</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                    {BADGES.map((badge, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img src={badge} alt="Certification Badge" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* SECTION 2: DOCUMENTATION */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="var(--color-primary)" /></div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>PROFESSIONAL DOSSIER</h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>SYSTEMS PORTFOLIO & REPORTS</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <a href="/assets/dossier/PORTFOLIO-Understanding-Ticketing-Systems.pdf" target="_blank" rel="noopener noreferrer" style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <FileText size={32} />
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>TICKETING SYSTEMS PORTFOLIO</h3>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>A comprehensive breakdown of enterprise ticketing architectures, workflows, and SLA management.</p>
                        </div>
                    </a>
                    <a href="/assets/dossier/CERT-BADGES.pdf" target="_blank" rel="noopener noreferrer" style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <Award size={32} />
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 5px 0', letterSpacing: '0.1em' }}>CERTIFICATION INDEX</h3>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>A detailed document outlining all verified IT and Cybersecurity credentials acquired.</p>
                        </div>
                    </a>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map((num) => (
                        <div key={num} style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 900 }}>
                            AWAITING IMAGE DATA
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* SECTION 4: CAPSTONE GATEWAY */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '60px 40px', borderRadius: '32px', border: '1px solid var(--color-primary)', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,0,0,0) 100%)', textAlign: 'center' }}>
                <MonitorPlay size={48} color="var(--color-primary)" style={{ margin: '0 auto 20px auto', filter: 'drop-shadow(0 0 20px rgba(0,122,255,0.5))' }} />
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 15px 0', letterSpacing: '0.2em', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>STELLAR TICKET CAPSTONE</h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
                    A full-stack, multi-tenant IT Support and Cybersecurity ticketing platform. Featuring persistent data, role-based access control, an SLA engine, and a live Knowledge Base CMS.
                </p>
                <button 
                    className="primary-action-btn"
                    onClick={() => setIsDemoLaunched(true)}
                    style={{ padding: '20px 40px', fontSize: '16px', fontWeight: 900, letterSpacing: '0.2em', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', margin: '0 auto' }}
                >
                    LAUNCH LIVE DEMONSTRATION <ArrowRight size={20} />
                </button>
            </motion.section>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5 }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', margin: 0 }}>© 2026 ANTHONY CURRIE // CAPSTONE PORTFOLIO</p>
        </div>
    </div>
  );
};

export default LandingPage;