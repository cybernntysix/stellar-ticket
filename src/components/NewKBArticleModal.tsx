import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BookOpen } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

interface NewKBArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewKBArticleModal: React.FC<NewKBArticleModalProps> = ({ isOpen, onClose }) => {
  const { addKBArticle } = useTickets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    addKBArticle(title, content);
    
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-panel"
            style={{ width: '600px', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 122, 255, 0.4)' }}>
                <BookOpen size={24} color="white" />
              </div>
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px', letterSpacing: '0.3em' }}>AUTHORING SUITE</span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '5px 0 0 0' }}>PUBLISH NEURAL INSIGHT</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>PROTOCOL TITLE</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="E.G., OPTIMIZING NEURAL THROUGHPUT..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em' }}>CONTENT DIRECTIVE</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="DEFINE MANDATORY STEPS OR GUIDELINES..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '14px', outline: 'none', height: '160px', resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="primary-action-btn"
                style={{ width: '100%', padding: '18px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
              >
                <Send size={14} /> DEPLOY TO KNOWLEDGE BASE
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewKBArticleModal;