import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, ArrowRight } from 'lucide-react';
import { useTickets, Ticket } from '../context/TicketContext';

interface TicketListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

const PRIORITY_COLORS = {
  emergency: '#FF3B30',
  high: '#FF9500',
  normal: '#007AFF',
  low: '#34C759'
};

const TicketListModal: React.FC<TicketListModalProps> = ({ isOpen, onClose, onSelectTicket }) => {
  const { tickets, currentUser } = useTickets();
  const [search, setSearch] = useState('');

  const isClient = currentUser.role === 'client';
  
  const filteredTickets = tickets.filter(t => {
    if (isClient && t.department !== currentUser.department) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="glass-panel"
            style={{ width: '600px', height: '70vh', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ padding: '30px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px', letterSpacing: '0.3em' }}>{isClient ? 'MY REQUESTS' : 'SYSTEM QUEUE'}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '5px 0' }}>ACTIVE NODES</h2>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px 40px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input 
                        type="text" 
                        placeholder="SEARCH NODES..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 10px 10px 35px', color: 'white', fontSize: '12px', outline: 'none' }}
                    />
                </div>
                <button className="sidebar-btn" style={{ margin: 0, padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={14} /> FILTER
                </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            onClick={() => { onSelectTicket(ticket); onClose(); }}
                            style={{ 
                                background: 'rgba(255,255,255,0.03)', padding: '15px 20px', borderRadius: '16px', 
                                border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'all 0.2s'
                            }}
                            className="ticket-list-item-hover"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIORITY_COLORS[ticket.priority], boxShadow: `0 0 10px ${PRIORITY_COLORS[ticket.priority]}` }} />
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>{ticket.title}</h4>
                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 900 }}>{ticket.id} // {ticket.status.toUpperCase()}</span>
                                </div>
                            </div>
                            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        </div>
                    ))}
                    {filteredTickets.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.3 }}>
                            <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>NO MATCHING NODES FOUND</p>
                        </div>
                    )}
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TicketListModal;
