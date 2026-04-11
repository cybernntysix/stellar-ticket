import React from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', style }) => {
  const positionStyles: any = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '15px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '15px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '15px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '15px' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        background: 'rgba(0, 122, 255, 0.15)',
        border: '1px solid var(--color-primary)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '10px',
        fontWeight: 900,
        letterSpacing: '0.1em',
        textAlign: 'center',
        width: 'max-content',
        maxWidth: '200px',
        zIndex: 100000,
        pointerEvents: 'none',
        boxShadow: '0 0 20px rgba(0, 122, 255, 0.3)',
        ...positionStyles[position],
        ...style
      }}
    >
      {text}
      {/* Pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: -1, left: -1, right: -1, bottom: -1,
          border: '1px solid var(--color-primary)',
          borderRadius: '12px',
          zIndex: -1
        }}
      />
    </motion.div>
  );
};

export default Tooltip;