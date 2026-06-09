import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useTickets, Ticket } from '../context/TicketContext';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose }) => {
  const { addTicket } = useTickets();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal' as Ticket['priority'],
    department: 'IT',
    user: 'Current User' // Placeholder for future auth
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    addTicket({
      ...formData,
      status: 'open'
    });
    
    setFormData({
      title: '',
      description: '',
      priority: 'normal',
      department: 'IT',
      user: 'Current User'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-panel"
            style={{ width: '500px', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: '30px' }}>
              <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px', letterSpacing: '0.3em' }}>INITIALIZE TICKET</span>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '10px 0 0 0' }}>NEW SYSTEM REQUEST</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>TITLE</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="SUMMARY OF INCIDENT..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>PRIORITY</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '12px', outline: 'none', appearance: 'none' }}
                  >
                    <option value="low">LOW</option>
                    <option value="normal">NORMAL</option>
                    <option value="high">HIGH</option>
                    <option value="emergency">EMERGENCY</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>DEPARTMENT</label>
                  <select 
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '12px', outline: 'none', appearance: 'none' }}
                  >
                    <option value="IT">IT SUPPORT</option>
                    <option value="Security">SECURITY</option>
                    <option value="Infrastructure">INFRASTRUCTURE</option>
                    <option value="Research">RESEARCH</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>DESCRIPTION</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="PROVIDE DETAILED LOGS OR STEPS TO REPRODUCE..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '14px', outline: 'none', height: '120px', resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="primary-action-btn"
                style={{ width: '100%', padding: '18px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
              >
                <Send size={14} /> SUBMIT TO CONSTELLATION
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewTicketModal;
