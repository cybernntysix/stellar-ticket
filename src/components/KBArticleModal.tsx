import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Shield, Zap } from 'lucide-react';
import { KBArticle } from '../context/TicketContext';

interface KBArticleModalProps {
  article: KBArticle | null;
  onClose: () => void;
}

const KBArticleModal: React.FC<KBArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      {article && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-panel"
            style={{ width: '800px', maxHeight: '80vh', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 100px rgba(0,0,0,1)' }}
          >
            {/* Top Branding Bar */}
            <div style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, transparent 100%)', height: '4px', width: '100%' }} />

            <div style={{ padding: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)', fontSize: '10px', letterSpacing: '0.4em', display: 'block', marginBottom: '15px' }}>NEURAL INSIGHT // {article.id}</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.05em' }}>{article.title.toUpperCase()}</h2>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '44px', height: '44px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '40px', display: 'flex', gap: '50px' }}>
                <div style={{ flex: 1 }}>
                    <div className="kb-content-section" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', lineHeight: '1.8', fontWeight: 400 }}>
                        {article.content.split('. ').map((sentence, i) => (
                            <p key={i} style={{ marginBottom: '20px' }}>{sentence}.</p>
                        ))}
                    </div>
                </div>

                <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="section-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '15px' }}>RELATED VECTORS</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                                <Shield size={14} /> SECURITY PROTOCOL
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                                <Zap size={14} /> PERFORMANCE OPS
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                                <BookOpen size={14} /> CORE DOCS
                            </div>
                        </div>
                    </div>

                    <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                        <span className="section-label" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '10px' }}>AUTHORITY SIGNATURE</span>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: 'white', margin: 0 }}>SYSTEM ARCHITECT // ALPHA-0</p>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>VERIFIED 2026.06.04</p>
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>STELLAR TICKET // KNOWLEDGE BASE ARCHIVE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KBArticleModal;
