import React, { useState } from 'react';
import { useSovereign } from '../context/SovereignContext';

interface NeuralConsoleProps {
  contextText: string;
}

const NeuralConsole: React.FC<NeuralConsoleProps> = ({ contextText }) => {
  const { BASE_URL } = useSovereign() as any; // Using any for local dev if BASE_URL isn't explicitly typed
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConsoleCommand = async () => {
    if (!consoleInput.trim() || isProcessing) return;
    const command = consoleInput.trim();
    setConsoleInput('');
    setConsoleOutput('PROBING NEURAL INTERFACE...');
    setIsProcessing(true);

    try {
      const r = await fetch(`${BASE_URL || 'http://localhost:3031'}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: contextText, 
          lens: 'cli', 
          customPrompt: command 
        })
      });
      if (!r.ok) throw new Error('Neural interface link failed.');
      const d = await r.json();
      setConsoleOutput(d.summary);
    } catch (e: any) {
      setConsoleOutput(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="console-chat-bar" style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          className="os-input glass-panel" 
          placeholder={isProcessing ? "PROCESSING NEURAL QUERY..." : "RESPOND TO NEURAL OUTPUT..."}
          value={consoleInput}
          onChange={(e) => setConsoleInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConsoleCommand()}
          disabled={isProcessing}
          style={{ width: '100%', paddingLeft: '24px', paddingRight: '80px', borderRadius: '100px', fontWeight: 900 }}
        />
        <button 
          onClick={handleConsoleCommand}
          disabled={isProcessing}
          style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-primary)', 
            fontWeight: 900, 
            cursor: 'pointer', 
            fontSize: '11px', 
            letterSpacing: '0.1em',
            opacity: isProcessing ? 0.3 : 1
          }}
        >
          {isProcessing ? '...' : 'SEND'}
        </button>
      </div>
      {consoleOutput && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: '2px solid var(--color-primary)' }}>
          <span className="section-label" style={{ fontSize: '9px', marginBottom: '8px', display: 'block' }}>NEURAL FEEDBACK</span>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.5' }}>{consoleOutput}</p>
        </div>
      )}
    </div>
  );
};

export default NeuralConsole;
