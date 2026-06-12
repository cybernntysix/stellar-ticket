import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Shield, ArrowUpCircle, CheckCircle, AlertTriangle, 
    User, MessageSquare, List, Clock, Zap, 
    UserPlus, Share2, Edit3, MoreHorizontal, Globe, Calendar
} from 'lucide-react';
import { useTickets, type Ticket, getSLAStatus, SLA_LIMITS } from '../context/TicketContext';

interface AuthorityArchiveProps {
  ticketId: string | null;
  onClose: () => void;
}

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

const AuthorityArchive: React.FC<AuthorityArchiveProps> = ({ ticketId, onClose }) => {
  const { tickets, toggleEscalation, updateTicketStatus, addComment, assignTicket, addTask, toggleTaskCompletion, currentUser } = useTickets();
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'tasks' | 'logs'>('details');

  const ticket = tickets.find(t => t.id === ticketId);
  const isClient = currentUser.role === 'client';

  if (!ticketId || !ticket) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ticket.id, { user: currentUser.name, text: commentText, isInternal: isInternalNote });
    setCommentText('');
    setIsInternalNote(false);
  };

  const handleClaim = () => {
    assignTicket(ticket.id, ticket.assignedTo === currentUser.name ? null : currentUser.name);
  };

  const slaStatus = getSLAStatus(ticket);
  const ageHours = (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
  const limit = SLA_LIMITS[ticket.priority];
  const progressPercent = Math.min(100, (ageHours / limit) * 100);
  const slaColor = slaStatus === 'breached' ? '#FF3B30' : slaStatus === 'warning' ? '#FF9500' : 'var(--color-primary)';

  const MetaItem = ({ label, value, icon: Icon, color = 'white' }: any) => (
    <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {Icon && <Icon size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            <span className="section-label" style={{ fontSize: '8px', margin: 0 }}>{label}</span>
        </div>
        <p style={{ fontSize: '14px', fontWeight: 800, color, margin: 0, letterSpacing: '0.05em' }}>{value.toUpperCase()}</p>
    </div>
  );

  return (
    <AnimatePresence>
      {ticketId && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="composer-view" 
            style={{ borderRadius: 0, zIndex: 3000 }}
        >
          {/* Header Section */}
          <div className="composer-header" style={{ padding: '0 40px', height: '100px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{ 
                    width: '60px', height: '60px', borderRadius: '12px', 
                    background: ticket.status === 'closed' ? 'rgba(255,255,255,0.1)' : PRIORITY_COLORS[ticket.priority], 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    boxShadow: ticket.status === 'closed' ? 'none' : `0 0 30px ${PRIORITY_COLORS[ticket.priority]}44` 
                }}>
                    <Shield size={32} color="white" />
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{ticket.id} // {ticket.status.toUpperCase()}</span>
                        {ticket.isEscalated && <span style={{ background: '#AF52DE', color: 'white', fontSize: '9px', fontWeight: 900, padding: '2px 10px', borderRadius: '4px' }}>ESCALATED</span>}
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: '5px 0' }}>{ticket.title}</h2>
                </div>
            </div>
            
            <div className="composer-actions">
                <button className="placeholder-button secondary glass-panel" onClick={onClose} style={{ padding: '12px 25px', fontSize: '11px' }}>EXIT ARCHIVE</button>
            </div>
          </div>

          <div className="composer-body" style={{ display: 'flex', flexDirection: 'row', padding: 0, margin: 0, height: 'calc(100vh - 100px)' }}>
            
            {/* Sidebar Navigation */}
            <div style={{ width: '280px', height: '100%', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '30px' }}>
                    <span className="section-label" style={{ marginBottom: '20px', display: 'block' }}>NAVIGATION</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => setActiveTab('details')} className={`sidebar-btn ${activeTab === 'details' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MessageSquare size={16} /> Ticket Thread
                        </button>
                        <button onClick={() => setActiveTab('tasks')} className={`sidebar-btn ${activeTab === 'tasks' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <List size={16} /> Sub-Tasks
                        </button>
                        <button onClick={() => setActiveTab('logs')} className={`sidebar-btn ${activeTab === 'logs' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Clock size={16} /> Audit Trail
                        </button>
                    </div>

                    {!isClient && (
                        <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="section-label" style={{ marginBottom: '20px', display: 'block' }}>CRITICAL COMMAND</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button onClick={() => toggleEscalation(ticket.id)} className="primary-action-btn" style={{ width: '100%', padding: '15px', fontSize: '10px', background: ticket.isEscalated ? 'rgba(255,255,255,0.05)' : '#AF52DE' }}>
                                    {ticket.isEscalated ? 'DE-ESCALATE' : 'ESCALATE NODE'}
                                </button>
                                <button onClick={() => updateTicketStatus(ticket.id, ticket.status === 'open' ? 'closed' : 'open')} className="primary-action-btn" style={{ width: '100%', padding: '15px', fontSize: '10px', background: ticket.status === 'open' ? 'rgba(255,255,255,0.05)' : 'var(--color-primary)' }}>
                                    {ticket.status === 'open' ? 'CLOSE SECTOR' : 'RE-OPEN'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', height: '100%', background: 'radial-gradient(circle at top center, rgba(0,122,255,0.05) 0%, transparent 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', maxWidth: '1100px', padding: '0 40px 60px 40px' }}>
                    
                    {activeTab === 'details' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            {/* Command Ribbon & Action Controls */}
                            {!isClient && (
                                <div style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '30px' }}>
                                    <button onClick={handleClaim} className="sidebar-btn" style={{ margin: 0, flex: 1, justifyContent: 'center', gap: '10px', fontSize: '10px', color: ticket.assignedTo === currentUser.name ? 'var(--color-primary)' : 'white' }}>
                                        <UserPlus size={14} /> {ticket.assignedTo === currentUser.name ? 'UNCLAIM' : 'CLAIM'}
                                    </button>
                                    <button className="sidebar-btn" style={{ margin: 0, flex: 1, justifyContent: 'center', gap: '10px', fontSize: '10px' }}><Share2 size={14} /> ASSIGN</button>
                                    <button className="sidebar-btn" style={{ margin: 0, flex: 1, justifyContent: 'center', gap: '10px', fontSize: '10px' }}><ArrowUpCircle size={14} /> TRANSFER</button>
                                    <button className="sidebar-btn" style={{ margin: 0, flex: 1, justifyContent: 'center', gap: '10px', fontSize: '10px' }}><Edit3 size={14} /> EDIT</button>
                                    <button className="sidebar-btn" style={{ margin: 0, width: '50px', justifyContent: 'center', padding: 0 }}><MoreHorizontal size={16} /></button>
                                </div>
                            )}

                            {/* Metadata Matrix */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: isClient ? '30px' : '0' }}>
                                <MetaItem label="STATUS" value={ticket.status} color={ticket.status === 'open' ? 'var(--color-success)' : 'rgba(255,255,255,0.4)'} />
                                <MetaItem label="PRIORITY" value={ticket.priority} icon={AlertTriangle} color={PRIORITY_COLORS[ticket.priority]} />
                                <MetaItem label="DEPARTMENT" value={ticket.department} icon={Globe} />
                                <MetaItem label="CREATOR" value={ticket.user} icon={User} />
                                <MetaItem label="ASSIGNED TO" value={ticket.assignedTo || 'UNASSIGNED'} icon={UserPlus} color={ticket.assignedTo ? 'white' : 'rgba(255,255,255,0.3)'} />
                            </div>

                            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                                {/* Left Content: Thread & Description */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="section-label" style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '15px' }}>ORIGINAL ISSUE REPORT</span>
                                        <p style={{ fontSize: '16px', color: 'white', lineHeight: '1.8', margin: 0 }}>{ticket.description}</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                        <span className="section-label">COMMUNICATION THREAD</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {ticket.comments.filter(c => !isClient || !c.isInternal).map(comment => (
                                                <div key={comment.id} style={{ display: 'flex', gap: '20px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <User size={18} />
                                                    </div>
                                                    <div style={{ flex: 1, background: comment.isInternal ? 'rgba(255, 149, 0, 0.05)' : 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '0 20px 20px 20px', border: comment.isInternal ? '1px solid rgba(255, 149, 0, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-primary)' }}>{comment.user}</span>
                                                                {comment.isInternal && <span style={{ fontSize: '8px', fontWeight: 900, background: '#FF9500', color: 'black', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.1em' }}>INTERNAL NOTE</span>}
                                                            </div>
                                                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                                                        </div>
                                                        <p style={{ fontSize: '14px', color: comment.isInternal ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255,255,255,0.8)', lineHeight: '1.6', margin: 0 }}>{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {ticket.comments.filter(c => !isClient || !c.isInternal).length === 0 && (
                                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>NO COMMUNICATION HISTORY</p>
                                            )}
                                        </div>

                                        <form onSubmit={handleAddComment} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <textarea 
                                                value={commentText}
                                                onChange={e => setCommentText(e.target.value)}
                                                placeholder="SUBMIT RESPONSE TO THIS NODE..."
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', color: 'white', fontSize: '15px', outline: 'none', height: '120px', resize: 'none' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {!isClient ? (
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isInternalNote} 
                                                            onChange={e => setIsInternalNote(e.target.checked)} 
                                                            style={{ accentColor: '#FF9500' }}
                                                        />
                                                        LOG AS INTERNAL NOTE
                                                    </label>
                                                ) : <div />}
                                                <button type="submit" className="primary-action-btn" style={{ padding: '12px 35px', fontSize: '10px', fontWeight: 900, borderRadius: '10px' }}>POST UPDATE</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Right Side Context (Optional for future add-ons) */}
                                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="section-label" style={{ fontSize: '9px', marginBottom: '15px', display: 'block' }}>USER INTELLIGENCE</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User color="white" />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 900, color: 'white', margin: 0 }}>{ticket.user}</p>
                                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>VERIFIED CLIENT</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '25px', borderLeft: `2px solid ${slaStatus === 'breached' ? 'rgba(255, 59, 48, 0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                                        <span className="section-label" style={{ fontSize: '8px' }}>SLA MONITOR // {limit}H LIMIT</span>
                                        <p style={{ fontSize: '18px', fontWeight: 900, color: slaColor, margin: '5px 0' }}>{ageHours.toFixed(1)}H / {limit}H</p>
                                        <span style={{ fontSize: '9px', color: slaColor, fontWeight: 700, letterSpacing: '0.1em' }}>{slaStatus.toUpperCase()}</span>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                style={{ height: '100%', background: slaColor }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <span className="section-label">SUB-TASK ORCHESTRATION</span>
                            
                            {/* Progress Bar */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', letterSpacing: '0.1em' }}>RESOLUTION PROGRESS</span>
                                    <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 900 }}>
                                        {ticket.tasks && ticket.tasks.length > 0 
                                            ? `${Math.round((ticket.tasks.filter(t => t.isComplete).length / ticket.tasks.length) * 100)}%` 
                                            : '0%'}
                                    </span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: ticket.tasks && ticket.tasks.length > 0 ? `${(ticket.tasks.filter(t => t.isComplete).length / ticket.tasks.length) * 100}%` : '0%' }}
                                        style={{ height: '100%', background: 'var(--color-primary)' }} 
                                    />
                                </div>
                            </div>

                            {/* Task List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(ticket.tasks || []).map(task => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => toggleTaskCompletion(ticket.id, task.id)}
                                        style={{ 
                                            background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', 
                                            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            opacity: task.isComplete ? 0.5 : 1
                                        }}
                                    >
                                        <div style={{ 
                                            width: '24px', height: '24px', borderRadius: '6px', 
                                            border: `2px solid ${task.isComplete ? 'var(--color-success)' : 'rgba(255,255,255,0.2)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: task.isComplete ? 'rgba(52, 199, 89, 0.2)' : 'transparent'
                                        }}>
                                            {task.isComplete && <CheckCircle size={14} color="var(--color-success)" />}
                                        </div>
                                        <p style={{ 
                                            fontSize: '14px', color: 'white', margin: 0, 
                                            textDecoration: task.isComplete ? 'line-through' : 'none' 
                                        }}>
                                            {task.description}
                                        </p>
                                    </div>
                                ))}
                                {(!ticket.tasks || ticket.tasks.length === 0) && (
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px' }}>NO SUB-TASKS DEFINED</p>
                                )}
                            </div>

                            {/* Add Task Form */}
                            {!isClient && (
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const input = (e.target as HTMLFormElement).elements.namedItem('taskDesc') as HTMLInputElement;
                                        if (!input.value.trim()) return;
                                        addTask(ticket.id, input.value);
                                        input.value = '';
                                    }}
                                    style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
                                >
                                    <input 
                                        name="taskDesc"
                                        type="text" 
                                        placeholder="DEFINE NEW RESOLUTION REQUIREMENT..."
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '12px', outline: 'none' }}
                                    />
                                    <button type="submit" className="primary-action-btn" style={{ padding: '0 30px', fontSize: '10px', fontWeight: 900, borderRadius: '12px' }}>ADD</button>
                                </form>
                            )}
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <span className="section-label">FULL AUDIT TRAIL</span>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {ticket.comments.map(log => (
                                    <div key={log.id} style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-35px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }} />
                                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 5px 0' }}>{new Date(log.timestamp).toLocaleString()}</p>
                                        <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>Update registered by <span style={{ color: 'var(--color-primary)' }}>{log.user}</span></p>
                                    </div>
                                ))}
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-35px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: PRIORITY_COLORS[ticket.priority] }} />
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 5px 0' }}>{new Date(ticket.createdAt).toLocaleString()}</p>
                                    <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>Ticket initialized via <span style={{ color: PRIORITY_COLORS[ticket.priority] }}>Web Portal</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthorityArchive;
