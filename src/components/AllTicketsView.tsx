import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, AlertTriangle, User, ArrowRight } from 'lucide-react';
import { useTickets, Ticket } from '../context/TicketContext';
import AuthorityArchive from './AuthorityArchive';

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

const AllTicketsView: React.FC = () => {
  const { tickets, currentUser } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [archiveTicketId, setArchiveTicketId] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* Header & Search */}
      <div style={{ padding: '0 20px 30px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.15em', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>GLOBAL TICKET DIRECTORY</h2>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>SYSTEM-WIDE INCIDENT MANAGEMENT // ALL DEPARTMENTS</p>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                    type="text" 
                    placeholder="SEARCH BY ID OR KEYWORD..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 16px 16px 45px', color: 'white', fontSize: '12px', outline: 'none', transition: 'all 0.3s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
            </div>
            
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={() => setFilterStatus('all')} style={{ background: filterStatus === 'all' ? 'var(--color-primary)' : 'transparent', color: filterStatus === 'all' ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '8px', padding: '0 20px', fontSize: '10px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}>ALL</button>
                <button onClick={() => setFilterStatus('open')} style={{ background: filterStatus === 'open' ? 'var(--color-success)' : 'transparent', color: filterStatus === 'open' ? 'black' : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '8px', padding: '0 20px', fontSize: '10px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}>OPEN</button>
                <button onClick={() => setFilterStatus('closed')} style={{ background: filterStatus === 'closed' ? 'rgba(255,255,255,0.2)' : 'transparent', color: filterStatus === 'closed' ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '8px', padding: '0 20px', fontSize: '10px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}>CLOSED</button>
            </div>
        </div>
      </div>

      {/* Ticket List */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 20px 40px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredTickets.map((ticket, i) => (
                <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setArchiveTicketId(ticket.id)}
                    className="glass-panel"
                    style={{ 
                        background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.05)', borderLeft: `4px solid ${PRIORITY_COLORS[ticket.priority]}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '30px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <div style={{ width: '120px', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 900, color: 'white', letterSpacing: '0.1em' }}>{ticket.id}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: ticket.status === 'open' ? 'var(--color-success)' : 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>{ticket.status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0 }}>{ticket.title}</h3>
                            {ticket.isEscalated && <span style={{ background: '#AF52DE', color: 'white', fontSize: '8px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.1em' }}>ESCALATED</span>}
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexShrink: 0 }}>
                        <div>
                            <span className="section-label" style={{ fontSize: '8px', display: 'block', marginBottom: '4px' }}>DEPARTMENT</span>
                            <span style={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{ticket.department}</span>
                        </div>
                        <div>
                            <span className="section-label" style={{ fontSize: '8px', display: 'block', marginBottom: '4px' }}>ASSIGNED TO</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={12} color={ticket.assignedTo ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)'} />
                                <span style={{ fontSize: '11px', color: ticket.assignedTo ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{ticket.assignedTo || 'UNASSIGNED'}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="section-label" style={{ fontSize: '8px', display: 'block', marginBottom: '4px' }}>CREATED</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <ArrowRight size={20} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '10px' }} />
                </motion.div>
            ))}
        </div>
        
        {filteredTickets.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.3 }}>
                <TicketIcon size={48} style={{ margin: '0 auto 20px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.2em', margin: '0 0 10px 0' }}>NO TICKETS FOUND</h3>
                <p style={{ fontSize: '12px', letterSpacing: '0.1em' }}>ADJUST SEARCH OR FILTER PARAMETERS</p>
            </div>
        )}
      </div>

      <AuthorityArchive 
        ticketId={archiveTicketId} 
        onClose={() => setArchiveTicketId(null)} 
      />
    </motion.div>
  );
};

export default AllTicketsView;