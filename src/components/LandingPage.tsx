import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Zap, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { useTickets, Role, Department } from '../context/TicketContext';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { login, register } = useTickets();
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
            style={{ textAlign: 'center', marginBottom: '60px' }}
        >
            <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '0.3em', margin: '0 0 10px 0', textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>STELLAR TICKET</h1>
            <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 900, letterSpacing: '0.5em', margin: 0 }}>NEURAL INCIDENT MANAGEMENT SYSTEM</p>
        </motion.div>

        <AnimatePresence mode="wait">
            {view === 'roles' ? (
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
            ) : (
                <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel"
                    style={{ width: '400px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <button onClick={() => setView('roles')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ArrowLeft size={16} /> BACK
                        </button>
                        <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{selectedRole.toUpperCase()} ACCESS</span>
                    </div>

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>USERNAME</label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 12px 12px 35px', color: 'white', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {view === 'register' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>DEPARTMENT</label>
                                    <select 
                                        value={department}
                                        onChange={e => setDepartment(e.target.value as Department)}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none', appearance: 'none' }}
                                    >
                                        <option value="IT">IT SUPPORT</option>
                                        <option value="Security">SECURITY</option>
                                        <option value="Infrastructure">INFRASTRUCTURE</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>TEAM / ORGANIZATION</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Team ID to join..."
                                        value={teamId}
                                        onChange={e => { setTeamId(e.target.value); setTeamName(''); }}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '10px' }}
                                    />
                                    <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '5px 0' }}>— OR CREATE NEW —</div>
                                    <input 
                                        type="text" 
                                        placeholder="New Team Name..."
                                        value={teamName}
                                        onChange={e => { setTeamName(e.target.value); setTeamId(''); }}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </>
                        )}

                        {error && <div style={{ color: '#FF3B30', fontSize: '12px', textAlign: 'center', fontWeight: 700 }}>{error}</div>}

                        <button type="submit" className="primary-action-btn" style={{ width: '100%', padding: '15px', fontSize: '11px', fontWeight: 900, marginTop: '10px' }}>
                            {view === 'login' ? 'AUTHENTICATE' : 'INITIALIZE CREDENTIALS'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button 
                            onClick={() => {
                                setView(view === 'login' ? 'register' : 'login');
                                setError('');
                            }} 
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'underline' }}
                        >
                            {view === 'login' ? "REQUEST NEW CLEARANCE (REGISTER)" : "RETURN TO AUTHENTICATION (LOGIN)"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{ position: 'absolute', bottom: '40px', textAlign: 'center' }}
        >
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', margin: 0 }}>© 2026 STELLAR TICKET // ALL SYSTEMS SECURED</p>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginTop: '10px' }}>UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED</p>
        </motion.div>
    </div>
  );
};

export default LandingPage;