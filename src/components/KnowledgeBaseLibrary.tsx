import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Shield, Zap, Terminal, Plus } from 'lucide-react';
import { useTickets, type KBArticle } from '../context/TicketContext';
import KBArticleModal from './KBArticleModal';
import NewKBArticleModal from './NewKBArticleModal';

const CATEGORY_ICONS: Record<string, any> = {
    'OPTIMIZATION': Zap,
    'SECURITY': Shield,
    'SYSTEM': Terminal,
    'GENERAL': BookOpen
};

const getCategoryForArticle = (title: string): string => {
    if (title.includes('OPTIMIZING') || title.includes('LATENCY')) return 'OPTIMIZATION';
    if (title.includes('SECURITY') || title.includes('MALWARE')) return 'SECURITY';
    if (title.includes('BENTO') || title.includes('GRID')) return 'SYSTEM';
    return 'GENERAL';
};

const KnowledgeBaseLibrary: React.FC = () => {
  const { knowledgeBase, currentUser } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [isNewKBModalOpen, setIsNewKBModalOpen] = useState(false);

  const isClient = currentUser?.role === 'client';

  const filteredArticles = knowledgeBase.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kb-library-container"
        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* Header & Search */}
      <div style={{ padding: '0 20px 30px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.15em', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>NEURAL INSIGHTS ARCHIVE</h2>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>SYSTEM DOCUMENTATION // THREAT VECTORS // PROTOCOLS</p>
            </div>
            {!isClient && (
                <button 
                    className="primary-action-btn" 
                    style={{ padding: '10px 20px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setIsNewKBModalOpen(true)}
                >
                    <Plus size={14} /> CREATE INSIGHT
                </button>
            )}
        </div>

        <div style={{ position: 'relative', maxWidth: '600px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
                type="text" 
                placeholder="SEARCH PROTOCOLS OR INSIGHTS..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 16px 16px 45px', color: 'white', fontSize: '12px', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
        </div>
      </div>

      {/* Article Grid */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 20px 40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredArticles.map((article, i) => {
                const category = getCategoryForArticle(article.title);
                const Icon = CATEGORY_ICONS[category];

                return (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedArticle(article)}
                        className="glass-panel"
                        style={{ 
                            background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', 
                            border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '15px', height: '220px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em' }}>{article.id}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                                <Icon size={10} color="rgba(255,255,255,0.5)" />
                                <span style={{ fontSize: '8px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{category}</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0, lineHeight: '1.3' }}>{article.title}</h3>
                        
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.content}
                        </p>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '4px', height: '4px', background: 'var(--color-success)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-success)' }} />
                            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>SYSTEM VERIFIED</span>
                        </div>
                    </motion.div>
                )
            })}
        </div>
        
        {filteredArticles.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.3 }}>
                <BookOpen size={48} style={{ margin: '0 auto 20px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.2em', margin: '0 0 10px 0' }}>NO INSIGHTS FOUND</h3>
                <p style={{ fontSize: '12px', letterSpacing: '0.1em' }}>ADJUST SEARCH PARAMETERS</p>
            </div>
        )}
      </div>

      <KBArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <NewKBArticleModal 
        isOpen={isNewKBModalOpen}
        onClose={() => setIsNewKBModalOpen(false)}
      />
    </motion.div>
  );
};

export default KnowledgeBaseLibrary;
