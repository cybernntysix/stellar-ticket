import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'client' | 'support_tier_1' | 'support_tier_2' | 'manager' | 'developer' | 'cybersecurity';
export type Department = 'IT' | 'Security' | 'Infrastructure' | 'Research' | 'HR';

export interface LayoutPrefs {
  showForge: boolean;
  showQueue: boolean;
  showLogs: boolean;
  showKB: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  department: Department;
  teamId: string;
  layoutPrefs?: LayoutPrefs;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface Task {
  id: string;
  description: string;
  isComplete: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  status: 'open' | 'closed';
  isEscalated: boolean;
  user: string;
  assignedTo?: string | null;
  department: Department;
  teamId: string;
  createdAt: string;
  comments: Comment[];
  tasks?: Task[];
}

export interface Activity {
  id: string;
  type: 'status_change' | 'comment_added' | 'ticket_created' | 'security_event';
  ticketId?: string;
  ticketTitle?: string;
  teamId: string;
  user: string;
  timestamp: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  vector?: 'network' | 'endpoint' | 'access' | 'system';
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
}

export const SLA_LIMITS = {
  emergency: 1, // hours
  high: 4,
  normal: 24,
  low: 48
};

export const getSLAStatus = (ticket: Ticket) => {
  if (ticket.status === 'closed') return 'resolved';
  const ageMs = Date.now() - new Date(ticket.createdAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  const limit = SLA_LIMITS[ticket.priority];
  
  if (ageHours >= limit) return 'breached';
  if (ageHours >= limit * 0.75) return 'warning';
  return 'optimal';
};

interface TicketContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  tickets: Ticket[];
  activities: Activity[];
  knowledgeBase: KBArticle[];
  departments: Department[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'comments' | 'isEscalated' | 'teamId'>) => Promise<void>;
  updateTicketStatus: (id: string, status: 'open' | 'closed') => Promise<void>;
  toggleEscalation: (id: string) => Promise<void>;
  assignTicket: (id: string, assignee: string | null) => Promise<void>;
  addComment: (ticketId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => Promise<void>;
  addTask: (ticketId: string, description: string) => Promise<void>;
  toggleTaskCompletion: (ticketId: string, taskId: string) => Promise<void>;
  addSecurityEvent: (event: Omit<Activity, 'id' | 'timestamp' | 'type' | 'teamId'>) => Promise<void>;
  addKBArticle: (title: string, content: string) => Promise<void>;
  updateLayoutPrefs: (prefs: Partial<LayoutPrefs>) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  switchRole: (role: Role) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// MOCK DATA FOR DEMO
const INITIAL_TICKETS: Ticket[] = [
    {
        id: 'TKT-001',
        title: 'Mainframe Database Sync Failure',
        description: 'Cluster nodes are failing to synchronize. The replication lag is increasing exponentially.',
        priority: 'emergency',
        status: 'open',
        isEscalated: true,
        user: 'system_monitor',
        assignedTo: 'anthonycyber',
        department: 'Infrastructure',
        teamId: 'DEMO',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        comments: [{ id: 'c1', user: 'system_monitor', text: 'Lag exceeded 5000ms. Immediate attention required.', timestamp: new Date(Date.now() - 3500000).toISOString() }],
        tasks: [{ id: 'tsk1', description: 'Check replication logs', isComplete: false, createdAt: new Date(Date.now() - 3500000).toISOString() }]
    },
    {
        id: 'TKT-002',
        title: 'VPN Access Denied for Remote Engineering Team',
        description: 'Multiple engineers reporting authentication failures when connecting via the Chicago proxy. RADIUS server timeouts suspected.',
        priority: 'high',
        status: 'open',
        isEscalated: false,
        user: 'j.smith',
        department: 'IT',
        teamId: 'DEMO',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        comments: [],
        tasks: []
    },
    {
        id: 'TKT-003',
        title: 'Phishing Email Campaign Detected',
        description: 'Multiple users received spoofed emails asking for their Office 365 credentials. Three users clicked the link.',
        priority: 'emergency',
        status: 'open',
        isEscalated: true,
        user: 'm.johnson',
        assignedTo: 'security_team',
        department: 'Security',
        teamId: 'DEMO',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        comments: [{ id: 'c2', user: 'sec_ops', text: 'Initiated forced password reset for affected accounts.', timestamp: new Date(Date.now() - 900000).toISOString() }],
        tasks: [{ id: 'tsk2', description: 'Block sender IP range on firewall', isComplete: true, createdAt: new Date(Date.now() - 1700000).toISOString() }]
    },
    {
        id: 'TKT-004',
        title: 'Software License Renewal for Design Team',
        description: 'Adobe Creative Cloud licenses for the marketing and design teams are expiring in 3 days.',
        priority: 'normal',
        status: 'open',
        isEscalated: false,
        user: 'k.williams',
        department: 'IT',
        teamId: 'DEMO',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        comments: [],
        tasks: []
    },
    {
        id: 'TKT-005',
        title: 'Network Printer Offline in Building C',
        description: 'The main color printer on the 3rd floor of Building C is showing a paper jam error and is offline.',
        priority: 'low',
        status: 'closed',
        isEscalated: false,
        user: 'r.davis',
        department: 'IT',
        teamId: 'DEMO',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        comments: [{ id: 'c3', user: 'helpdesk', text: 'Cleared paper jam and restarted spooler service.', timestamp: new Date(Date.now() - 200000000).toISOString() }],
        tasks: []
    }
];

const INITIAL_ACTIVITIES: Activity[] = [
    {
        id: 'ACT-001',
        type: 'security_event',
        teamId: 'DEMO',
        user: 'system',
        timestamp: new Date().toISOString(),
        detail: 'Multiple failed SSH attempts detected on Gateway-Alpha.',
        severity: 'warning',
        vector: 'network'
    }
];

const INITIAL_KB: KBArticle[] = [
    {
        id: 'KB-001',
        title: 'Resolving Core Database Sync Latency',
        content: 'When the replication lag exceeds 1000ms, immediately isolate the lagging node and manually force a resync using the admin CLI tools.'
    },
    {
        id: 'KB-002',
        title: 'Storage Drive Troubleshooting & Replacement',
        content: 'When removing or replacing a storage drive (e.g., SATA SSD), always verify the computer is powered off and use anti-static precautions before handling internal components. Re-verify SATA data and power cable seating before closing the chassis.'
    },
    {
        id: 'KB-003',
        title: 'CPU/RAM Installation & Post-Assembly Verification',
        content: 'When installing RAM modules, ensure they are lined up with the notches in the slots and pressed down until fully seated to enable Dual Channel mode. Always check motherboard alignment and fan header connections before booting.'
    },
    {
        id: 'KB-004',
        title: 'Ticketing Categorization Strategies',
        content: 'Categorize tickets by impact and reach to establish escalation levels effectively. This gives clarity on which tickets to prioritize and can reveal a larger, more connected issue beyond individual isolated incidents.'
    },
    {
        id: 'KB-005',
        title: 'Principle of Least Privilege in Support Roles',
        content: 'Role-based access is crucial in ticketing systems. Practicing the principle of Least Privilege ensures scope remains clear, preventing confusion, chain-of-custody violations, and ultimately mitigating human error and system vulnerabilities.'
    }
];

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Ephemeral, no localstorage
  const isAuthenticated = currentUser !== null;

  const [departments] = useState<Department[]>(['IT', 'Security', 'Infrastructure', 'Research', 'HR']);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [knowledgeBase, setKnowledgeBase] = useState<KBArticle[]>(INITIAL_KB);

  const refreshData = async () => {
    // In ephemeral demo, we don't fetch from backend. State is kept in React memory.
  };

  const login = async (credentials: any) => {
      // Bypass Backend Completely for Demo
      const userObj: User = {
          id: 'demo-user-1',
          name: credentials.username || 'Demo User',
          username: credentials.username || 'demo_user',
          role: credentials.role || 'support_tier_1',
          department: credentials.department || 'IT',
          teamId: 'DEMO',
          layoutPrefs: { showForge: true, showQueue: true, showLogs: true, showKB: true }
      };
      setCurrentUser(userObj);
  };

  const register = async (data: any) => {
      await login(data);
  };

  const logout = () => {
      setCurrentUser(null);
      // Reset state to initial mock data
      setTickets(INITIAL_TICKETS);
      setActivities(INITIAL_ACTIVITIES);
  };

  const updateLayoutPrefs = async (prefs: Partial<LayoutPrefs>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, layoutPrefs: { ...currentUser.layoutPrefs, ...prefs } as LayoutPrefs });
  };

  const addTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'comments' | 'isEscalated' | 'teamId'>) => {
    if (!currentUser) return;
    const newTicket: Ticket = {
        ...ticketData,
        id: `TKT-${Math.floor(Math.random() * 10000)}`,
        teamId: currentUser.teamId,
        createdAt: new Date().toISOString(),
        comments: [],
        tasks: []
    };
    setTickets(prev => [newTicket, ...prev]);
    addActivity({
        type: 'ticket_created',
        ticketId: newTicket.id,
        ticketTitle: newTicket.title,
        detail: `Ticket created by ${currentUser.name}`,
        severity: 'info'
    });
  };

  const updateTicketStatus = async (id: string, status: 'open' | 'closed') => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addActivity({
        type: 'status_change',
        ticketId: id,
        detail: `Status changed to ${status}`,
        severity: status === 'closed' ? 'info' : 'warning'
    });
  };

  const toggleEscalation = async (id: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => t.id === id ? { ...t, isEscalated: !t.isEscalated } : t));
  };

  const assignTicket = async (id: string, assignee: string | null) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: assignee } : t));
  };

  const addComment = async (ticketId: string, commentData: Omit<Comment, 'id' | 'timestamp'>) => {
    if (!currentUser) return;
    const newComment: Comment = {
        ...commentData,
        id: `C-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString()
    };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, comments: [...t.comments, newComment] } : t));
  };

  const addTask = async (ticketId: string, description: string) => {
    if (!currentUser) return;
    const newTask: Task = {
        id: `TSK-${Math.floor(Math.random() * 10000)}`,
        description,
        isComplete: false,
        createdAt: new Date().toISOString()
    };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, tasks: [...(t.tasks || []), newTask] } : t));
  };

  const toggleTaskCompletion = async (ticketId: string, taskId: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
        if (t.id === ticketId && t.tasks) {
            return {
                ...t,
                tasks: t.tasks.map(tsk => tsk.id === taskId ? { ...tsk, isComplete: !tsk.isComplete } : tsk)
            };
        }
        return t;
    }));
  };

  const addActivity = (event: Omit<Activity, 'id' | 'timestamp' | 'teamId' | 'user'>) => {
      if (!currentUser) return;
      const newAct: Activity = {
          ...event,
          id: `ACT-${Math.floor(Math.random() * 10000)}`,
          teamId: currentUser.teamId,
          user: currentUser.name,
          timestamp: new Date().toISOString()
      };
      setActivities(prev => [newAct, ...prev]);
  };

  const addSecurityEvent = async (event: Omit<Activity, 'id' | 'timestamp' | 'type' | 'teamId'>) => {
    if (!currentUser) return;
    addActivity({ ...event, type: 'security_event' });
  };

  const addKBArticle = async (title: string, content: string) => {
    if (!currentUser) return;
    const newKB: KBArticle = {
        id: `KB-${Math.floor(Math.random() * 10000)}`,
        title,
        content
    };
    setKnowledgeBase(prev => [newKB, ...prev]);
  };

  const switchRole = (role: Role) => {
    if (currentUser) {
       setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <TicketContext.Provider value={{ 
        currentUser, isAuthenticated, tickets, activities, knowledgeBase, departments, 
        addTicket, updateTicketStatus, toggleEscalation, assignTicket, addComment, 
        addTask, toggleTaskCompletion, addSecurityEvent, addKBArticle, updateLayoutPrefs, login, register, logout, refreshData, switchRole 
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
