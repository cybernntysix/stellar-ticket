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
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
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
            <p style={{ color: 'var(--color-primary)', fontSize: 'clamp(12px, 2vw, 18px)', fontWeight: 900, letterSpacing: '0.4em', margin: '0 0 30px 0', textShadow: '0 0 20px var(--color-primary)' }}>IT SUPPORT SPECIALIST</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                {['HARDWARE DIAGNOSTICS', 'INCIDENT RESPONSE', 'CLOUD ARCHITECTURE', 'SYSTEMS ADMINISTRATION'].map(skill => (
                    <span key={skill} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
                        [ {skill} ]
                    </span>
                ))}
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

            {/* SECTION 2: DOCUMENTATION */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="var(--color-primary)" /></div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '0.1em' }}>PROFESSIONAL DOSSIER</h2>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>SYSTEMS PORTFOLIO & REPORTS</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="/assets/dossier/PORTFOLIO-Understanding-Ticketing-Systems.pdf" target="_blank" rel="noopener noreferrer" className="sidebar-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', padding: '10px 20px', margin: 0, color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                            <FileText size={14} /> OPEN FULL SCREEN PDF
                        </a>
                    </div>
                </div>
                
                <div style={{ width: '100%', height: '600px', borderRadius: '16px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', padding: '40px', boxSizing: 'border-box' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '14px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Understanding Ticketing Systems</h3>
                        
                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What information should a user provide when creating a ticket?</h4>
                        <p style={{ marginBottom: '20px' }}>When a user creates a ticket they should describe the experience of the client and their problem needing to be resolved. The documentation should include the client's name, details of the issue, whatever is needed to access the machine, and a clear description of what information was gathered during their conversation. They should also document whatever decisions were made to try and fix the issue if there were any steps taken.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why is it important to categorize tickets?</h4>
                        <p style={{ marginBottom: '20px' }}>It's important to categorize tickets because we need to resolve tickets in the order of impact or reach and to imply the escalation level if it has not already been assigned/claimed by that Support team. It gives clarity on which tickets to prioritize other than the SLA timing. Also it is important for organizational purposes because there can be a lot of tickets coming in sometimes depending on the state of the organization. So it's good to have categorization to keep a birds eye view on what sort of tickets are coming in and it can reveal a larger, more connected issue than just there being a lot of individual tickets coming in. This gives you the ability to get to the core of an issue that resolves multiple tickets at once saving companies a lot of time.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What happens after a ticket is submitted?</h4>
                        <p style={{ marginBottom: '20px' }}>After a ticket is submitted by a client, the IT Support team will get them into a queue where we read the tickets and decide whether we will claim that ticket, assign it to a team member, or escalate the ticket to Level 2 Support. Once we do receive the ticket we speak with the client to gather clarifying information about the problem and determine as much as we can so we can resolve and close the ticket or escalate it to the proper team that can handle it. If we escalate the ticket after gathering information, we document and communicate the task to the team we assigned the ticket to and keep the ticket open.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What happens when a ticket is resolved?</h4>
                        <p style={{ marginBottom: '20px' }}>When tickets are resolved we make sure that all of the steps from information gathering, theorizing, troubleshooting theories, and testing solutions are all documented properly. Once the ticket is resolved, closed, and everything is working properly make sure to always send a professional statement of the resolution to the client.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why should ticket history be preserved?</h4>
                        <p style={{ marginBottom: '20px' }}>Tickets having so much useful documentation is crucial when it comes to ticket history because there are going to be repeated issues that can be referenced from past tickets. This data is vital for efficiency and effective use of our previous efforts to make sure that we work smart and keep ourselves and other teams fresh for truly unique problems and issues. Over time this could turn into a full Knowledge Base of guidance that clients could use without even needing our help and it can provide team members the ability to work more autonomously, empowering even new team members.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What are internal notes used for?</h4>
                        <p style={{ marginBottom: '20px' }}>When tickets have internal notes, these can give us the ability to communicate faster than emails to other team members throughout tickets' lifespan, while keeping all of the communication attached and in one place, easy to see. It is clean, saves time navigating, and can help with nuance for tickets of the similar variety.</p>

                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginTop: '50px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>User Roles</h3>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What should an IT Support technician be able to do?</h4>
                        <p style={{ marginBottom: '20px' }}>IT Support should be able to claim, assign, create, and escalate tickets. They should also be able to create Knowledge Base insights, they should be able to reply to tickets and communicate with clients and the Level 2 Support teams. IT Support is responsible for gathering the information, for resolving tickets within their role's scope and to make sure that pristine details and communication towards the resolution is handled in an orderly manner.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why might a Cybersecurity Analyst need access to ticket information?</h4>
                        <p style={{ marginBottom: '20px' }}>A Cybersecurity team member would use the ticket information for them to interpret a solution based on the problem's details and the communication between IT Support and the client.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why is role-based access important?</h4>
                        <p style={{ marginBottom: '20px' }}>Practicing the principle of Least Privilege allows scope and responsibility to remain clear, making sure there is no confusion or ability to go outside of the necessary chain of custody. Also it can further prevent human error and vulnerabilities inside of an organization.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What metrics would help a manager monitor support performance?</h4>
                        <p style={{ marginBottom: '20px' }}>The metrics managers use need to measure how efficiently the IT team is working to resolve tickets. The main metrics they'd be monitoring are the number of open tickets, average response time, average resolution time, first-contact resolution rate, backlog size, SLA compliance, technician workload, ticket reopen rate, and customer satisfaction. These metrics help identify bottlenecks, balance workloads, improve service quality, and ensure users receive timely support.</p>

                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginTop: '50px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Project Overview</h3>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What problem were you trying to solve when you decided to build Stellar Ticket?</h4>
                        <p style={{ marginBottom: '20px' }}>The intention of Stellar Ticket was to build every piece of the ticketing system as a way to design the elements, the procedures, and the operations of an enterprise IT Support environment. With AI, this has been a new way to get an understanding of the systems, concepts, and procedures that make ticketing systems effective. I wanted to create a ticketing system that resembled its impact and allow me to see from the perspective of Level 2 Support and the cybersecurity perspective.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Who would use this system in a real company?</h4>
                        <p style={{ marginBottom: '20px' }}>In a real company, the IT Support and Cybersecurity professionals could use Stellar Ticket as a way to bring life to a lot of the redundant tasks of ticketing systems. I would hope to gamify and make the work more engaging while maintaining efficiency and even optimizing some of the functionality of the software in comparison to a lot of the ticketing systems I see that are still widely used today.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why would someone use Stellar Ticket instead of email?</h4>
                        <p style={{ marginBottom: '20px' }}>Stellar Ticket allows for seamless visualization of IT Support operations, role-based access, ticket lifecycle management, event logging, dashboards, knowledge base integration, and department workflows. Also the actual GUI for user experience is important for Stellar Ticket, modular parts to keep users engaged.</p>

                        <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What makes Stellar Ticket different from a basic ticketing system?</h4>
                        <p style={{ marginBottom: '20px' }}>It is designed to fit the user based on their preferences or the agreement of their own teams. It continuously iterates features and offers deeper customization to users who desire that. Each teams' version of the application can look different depending on their needs and objectives.</p>
                    </div>
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

        {/* PDF VIEWER MODAL */}
        <AnimatePresence>
            {selectedPdf && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
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
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <a href={selectedPdf} download className="sidebar-btn" style={{ textDecoration: 'none', margin: 0, padding: '8px 16px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    DOWNLOAD PDF
                                </a>
                                <button onClick={() => setSelectedPdf(null)} className="sidebar-btn" style={{ margin: 0, padding: '8px 16px', fontSize: '10px', color: '#FF3B30', borderColor: 'rgba(255,59,48,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    CLOSE VIEWER
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '40px', background: 'rgba(0,0,0,0.5)' }}>
                            {selectedPdf.includes('PORTFOLIO') ? (
                                <div style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '14px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Understanding Ticketing Systems</h3>
                                    
                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What information should a user provide when creating a ticket?</h4>
                                    <p style={{ marginBottom: '20px' }}>When a user creates a ticket they should describe the experience of the client and their problem needing to be resolved. The documentation should include the client's name, details of the issue, whatever is needed to access the machine, and a clear description of what information was gathered during their conversation. They should also document whatever decisions were made to try and fix the issue if there were any steps taken.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why is it important to categorize tickets?</h4>
                                    <p style={{ marginBottom: '20px' }}>It's important to categorize tickets because we need to resolve tickets in the order of impact or reach and to imply the escalation level if it has not already been assigned/claimed by that Support team. It gives clarity on which tickets to prioritize other than the SLA timing. Also it is important for organizational purposes because there can be a lot of tickets coming in sometimes depending on the state of the organization. So it's good to have categorization to keep a birds eye view on what sort of tickets are coming in and it can reveal a larger, more connected issue than just there being a lot of individual tickets coming in. This gives you the ability to get to the core of an issue that resolves multiple tickets at once saving companies a lot of time.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What happens after a ticket is submitted?</h4>
                                    <p style={{ marginBottom: '20px' }}>After a ticket is submitted by a client, the IT Support team will get them into a queue where we read the tickets and decide whether we will claim that ticket, assign it to a team member, or escalate the ticket to Level 2 Support. Once we do receive the ticket we speak with the client to gather clarifying information about the problem and determine as much as we can so we can resolve and close the ticket or escalate it to the proper team that can handle it. If we escalate the ticket after gathering information, we document and communicate the task to the team we assigned the ticket to and keep the ticket open.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What happens when a ticket is resolved?</h4>
                                    <p style={{ marginBottom: '20px' }}>When tickets are resolved we make sure that all of the steps from information gathering, theorizing, troubleshooting theories, and testing solutions are all documented properly. Once the ticket is resolved, closed, and everything is working properly make sure to always send a professional statement of the resolution to the client.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why should ticket history be preserved?</h4>
                                    <p style={{ marginBottom: '20px' }}>Tickets having so much useful documentation is crucial when it comes to ticket history because there are going to be repeated issues that can be referenced from past tickets. This data is vital for efficiency and effective use of our previous efforts to make sure that we work smart and keep ourselves and other teams fresh for truly unique problems and issues. Over time this could turn into a full Knowledge Base of guidance that clients could use without even needing our help and it can provide team members the ability to work more autonomously, empowering even new team members.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What are internal notes used for?</h4>
                                    <p style={{ marginBottom: '20px' }}>When tickets have internal notes, these can give us the ability to communicate faster than emails to other team members throughout tickets' lifespan, while keeping all of the communication attached and in one place, easy to see. It is clean, saves time navigating, and can help with nuance for tickets of the similar variety.</p>

                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginTop: '50px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>User Roles</h3>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What should an IT Support technician be able to do?</h4>
                                    <p style={{ marginBottom: '20px' }}>IT Support should be able to claim, assign, create, and escalate tickets. They should also be able to create Knowledge Base insights, they should be able to reply to tickets and communicate with clients and the Level 2 Support teams. IT Support is responsible for gathering the information, for resolving tickets within their role's scope and to make sure that pristine details and communication towards the resolution is handled in an orderly manner.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why might a Cybersecurity Analyst need access to ticket information?</h4>
                                    <p style={{ marginBottom: '20px' }}>A Cybersecurity team member would use the ticket information for them to interpret a solution based on the problem's details and the communication between IT Support and the client.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why is role-based access important?</h4>
                                    <p style={{ marginBottom: '20px' }}>Practicing the principle of Least Privilege allows scope and responsibility to remain clear, making sure there is no confusion or ability to go outside of the necessary chain of custody. Also it can further prevent human error and vulnerabilities inside of an organization.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What metrics would help a manager monitor support performance?</h4>
                                    <p style={{ marginBottom: '20px' }}>The metrics managers use need to measure how efficiently the IT team is working to resolve tickets. The main metrics they'd be monitoring are the number of open tickets, average response time, average resolution time, first-contact resolution rate, backlog size, SLA compliance, technician workload, ticket reopen rate, and customer satisfaction. These metrics help identify bottlenecks, balance workloads, improve service quality, and ensure users receive timely support.</p>

                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '0.1em', marginTop: '50px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Project Overview</h3>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What problem were you trying to solve when you decided to build Stellar Ticket?</h4>
                                    <p style={{ marginBottom: '20px' }}>The intention of Stellar Ticket was to build every piece of the ticketing system as a way to design the elements, the procedures, and the operations of an enterprise IT Support environment. With AI, this has been a new way to get an understanding of the systems, concepts, and procedures that make ticketing systems effective. I wanted to create a ticketing system that resembled its impact and allow me to see from the perspective of Level 2 Support and the cybersecurity perspective.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Who would use this system in a real company?</h4>
                                    <p style={{ marginBottom: '20px' }}>In a real company, the IT Support and Cybersecurity professionals could use Stellar Ticket as a way to bring life to a lot of the redundant tasks of ticketing systems. I would hope to gamify and make the work more engaging while maintaining efficiency and even optimizing some of the functionality of the software in comparison to a lot of the ticketing systems I see that are still widely used today.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>Why would someone use Stellar Ticket instead of email?</h4>
                                    <p style={{ marginBottom: '20px' }}>Stellar Ticket allows for seamless visualization of IT Support operations, role-based access, ticket lifecycle management, event logging, dashboards, knowledge base integration, and department workflows. Also the actual GUI for user experience is important for Stellar Ticket, modular parts to keep users engaged.</p>

                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 900, marginTop: '30px', marginBottom: '10px' }}>What makes Stellar Ticket different from a basic ticketing system?</h4>
                                    <p style={{ marginBottom: '20px' }}>It is designed to fit the user based on their preferences or the agreement of their own teams. It continuously iterates features and offers deeper customization to users who desire that. Each teams' version of the application can look different depending on their needs and objectives.</p>
                                </div>
                            ) : (
                                <iframe src={selectedPdf} width="100%" height="100%" style={{ border: 'none', background: 'white', borderRadius: '12px' }} />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default LandingPage;