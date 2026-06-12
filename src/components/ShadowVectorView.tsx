import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, AlertTriangle, Terminal, Info } from 'lucide-react';
import { useTickets, type Activity } from '../context/TicketContext';

const SEVERITY_COLORS = {
  critical: '#FF3B30',
  warning: '#FF9500',
  info: 'var(--color-primary)'
};

const ShadowVectorView: React.FC = () => {
  const { activities } = useTickets();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredActivities = activities.filter(a => {
    if (a.type !== 'security_event') return false; // This view is strictly for security events
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const criticalCount = activities.filter(a => a.type === 'security_event' && a.severity === 'critical').length;
  const warningCount = activities.filter(a => a.type === 'security_event' && a.severity === 'warning').length;

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#050505' }}
    >
      {/* High-Tech Header */}
      <div style={{ padding: '30px 40px', borderBottom: '1px solid rgba(255,59,48,0.2)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'radial-gradient(circle at top right, rgba(255,59,48,0.05) 0%, transparent 50%)' }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <Shield size={24} color="#FF3B30" />
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '0.2em' }}>SHADOW VECTOR</h2>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#FF3B30', letterSpacing: '0.3em', margin: 0 }}>CYBERSECURITY EVENT MONITORING // CLASSIFIED ACCESS ONLY</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', display: 'block', letterSpacing: '0.1em' }}>CRITICAL ANOMALIES</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: criticalCount > 0 ? '#FF3B30' : 'rgba(255,255,255,0.2)' }}>{criticalCount}</span>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', display: 'block', letterSpacing: '0.1em' }}>WARNING EVENTS</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: warningCount > 0 ? '#FF9500' : 'rgba(255,255,255,0.2)' }}>{warningCount}</span>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
          <button onClick={() => setFilterSeverity('all')} style={{ background: filterSeverity === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent', color: filterSeverity === 'all' ? 'white' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 15px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>ALL EVENTS</button>
          <button onClick={() => setFilterSeverity('critical')} style={{ background: filterSeverity === 'critical' ? 'rgba(255,59,48,0.2)' : 'transparent', color: filterSeverity === 'critical' ? '#FF3B30' : 'rgba(255,255,255,0.5)', border: filterSeverity === 'critical' ? '1px solid #FF3B30' : '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 15px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>CRITICAL</button>
          <button onClick={() => setFilterSeverity('warning')} style={{ background: filterSeverity === 'warning' ? 'rgba(255,149,0,0.2)' : 'transparent', color: filterSeverity === 'warning' ? '#FF9500' : 'rgba(255,255,255,0.5)', border: filterSeverity === 'warning' ? '1px solid #FF9500' : '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 15px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>WARNING</button>
      </div>

      {/* Terminal Log View */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '30px 40px', fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredActivities.map((activity) => (
                <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ 
                        display: 'flex', alignItems: 'flex-start', gap: '15px', 
                        padding: '10px', background: activity.severity === 'critical' ? 'rgba(255,59,48,0.05)' : 'transparent',
                        borderLeft: `2px solid ${SEVERITY_COLORS[activity.severity]}`
                    }}
                >
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', width: '80px', flexShrink: 0 }}>
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                    
                    <div style={{ width: '20px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                        {activity.severity === 'critical' && <AlertCircle size={12} color="#FF3B30" />}
                        {activity.severity === 'warning' && <AlertTriangle size={12} color="#FF9500" />}
                        {activity.severity === 'info' && <Info size={12} color="var(--color-primary)" />}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <span style={{ fontSize: '12px', color: SEVERITY_COLORS[activity.severity], fontWeight: 700, minWidth: '120px' }}>
                            [{activity.vector?.toUpperCase() || 'SYSTEM'}]
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', minWidth: '150px' }}>
                            SRC: {activity.user}
                        </span>
                        <span style={{ fontSize: '13px', color: 'white', flex: 1 }}>
                            {activity.detail}
                            {activity.ticketId && <span style={{ color: 'var(--color-primary)', marginLeft: '10px' }}>(REF: {activity.ticketId})</span>}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>

        {filteredActivities.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.2 }}>
                <Terminal size={48} style={{ margin: '0 auto 20px auto' }} />
                <h3 style={{ fontSize: '16px', letterSpacing: '0.1em' }}>NO ANOMALIES DETECTED IN CURRENT VIEW</h3>
            </div>
        )}
      </div>

    </motion.div>
  );
};

export default ShadowVectorView;