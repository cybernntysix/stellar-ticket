import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, ArrowUpCircle } from 'lucide-react';
import { useTickets, type Ticket } from '../context/TicketContext';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket: initialTicket, onClose }) => {
  const { tickets, toggleEscalation, updateTicketStatus, addComment } = useTickets();
  const [commentText, setCommentText] = useState('');

  // Find the fresh version of the ticket from context to ensure reactive updates
  const ticket = initialTicket ? tickets.find(t => t.id === initialTicket.id) : null;

  if (!ticket) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ticket.id, { user: 'Staff-Alpha', text: commentText });
    setCommentText('');
  };

  return (
    <AnimatePresence>
      {ticket && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel"
            style={{ width: '700px', maxHeight: '85vh', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ padding: '30px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: PRIORITY_COLORS[ticket.priority], letterSpacing: '0.3em' }}>{ticket.id} // {ticket.status.toUpperCase()}</span>
                    {ticket.isEscalated && <span style={{ background: '#AF52DE', color: 'white', fontSize: '8px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.1em' }}>ESCALATED</span>}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>{ticket.title}</h2>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>USER: {ticket.user} | DEPT: {ticket.department} | CREATED: {new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '40px', display: 'flex', gap: '40px' }}>
                
                {/* Left Side: Description & Logs */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div>
                        <span className="section-label" style={{ fontSize: '9px', color: 'var(--color-primary)', marginBottom: '15px', display: 'block' }}>INCIDENT DESCRIPTION</span>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>{ticket.description}</p>
                    </div>

                    <div>
                        <span className="section-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '15px', display: 'block' }}>ACTIVITY LOG</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {ticket.comments.map(comment => (
                                <div key={comment.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-primary)' }}>{comment.user}</span>
                                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{comment.text}</p>
                                </div>
                            ))}
                            {ticket.comments.length === 0 && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>NO RECENT UPDATES</p>}
                        </div>
                    </div>
                </div>

                {/* Right Side: Quick Actions */}
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                    <span className="section-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px', display: 'block' }}>SYSTEM CONTROLS</span>
                    
                    <button 
                        onClick={() => toggleEscalation(ticket.id)}
                        className="sidebar-btn" 
                        style={{ margin: 0, padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: ticket.isEscalated ? '#AF52DE' : 'white' }}
                    >
                        <ArrowUpCircle size={16} /> {ticket.isEscalated ? 'DE-ESCALATE' : 'ESCALATE'}
                    </button>

                    <button 
                        onClick={() => updateTicketStatus(ticket.id, ticket.status === 'open' ? 'closed' : 'open')}
                        className="sidebar-btn" 
                        style={{ margin: 0, padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        {ticket.status === 'open' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        {ticket.status === 'open' ? 'CLOSE TICKET' : 'REOPEN TICKET'}
                    </button>

                    <form onSubmit={handleAddComment} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea 
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="ADD UPDATE..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '12px', outline: 'none', height: '100px', resize: 'none' }}
                        />
                        <button type="submit" className="primary-action-btn" style={{ padding: '12px', fontSize: '10px', fontWeight: 900 }}>POST UPDATE</button>
                    </form>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TicketDetailModal;
