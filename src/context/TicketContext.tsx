import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'client' | 'support_tier_1' | 'support_tier_2' | 'manager' | 'developer' | 'cybersecurity';
export type Department = 'IT' | 'Security' | 'Infrastructure' | 'Research' | 'HR';

const API_BASE = 'http://localhost:3041/api';

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
  switchRole: (role: Role) => void; // Keeping for backward compatibility temporarily
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const savedUser = localStorage.getItem('stellar_user');
        if (savedUser && savedUser !== 'undefined') {
            const parsed = JSON.parse(savedUser);
            // Ensure legacy cached users get a default teamId
            if (!parsed.teamId) parsed.teamId = 'TEAM-DEFAULT';
            if (!parsed.layoutPrefs) parsed.layoutPrefs = { showForge: true, showQueue: true, showLogs: parsed.role !== 'client', showKB: true };
            return parsed;
        }
        return null;
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
    }
  });
  const isAuthenticated = currentUser !== null;

  const [departments] = useState<Department[]>(['IT', 'Security', 'Infrastructure', 'Research', 'HR']);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KBArticle[]>([]);

  const refreshData = async () => {
    if (!currentUser) return;
    try {
        const [ticketsRes, activitiesRes, kbRes] = await Promise.all([
            fetch(`${API_BASE}/tickets?teamId=${currentUser.teamId}`),
            fetch(`${API_BASE}/activities?teamId=${currentUser.teamId}`),
            fetch(`${API_BASE}/kb`)
        ]);
        const ticketsData = await ticketsRes.json();
        const activitiesData = await activitiesRes.json();
        const kbData = await kbRes.json();
        
        setTickets(ticketsData);
        setActivities(activitiesData);
        setKnowledgeBase(kbData);
    } catch (err) {
        console.error('BACKEND_FETCH_ERROR:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        refreshData();
        const interval = setInterval(refreshData, 10000);
        return () => clearInterval(interval);
    }
  }, [isAuthenticated, currentUser?.teamId]);

  const login = async (credentials: any) => {
      const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const userData = await res.json();
      const userObj = {
          id: userData.id,
          name: userData.username,
          username: userData.username,
          role: userData.role,
          department: userData.department,
          teamId: userData.teamId,
          layoutPrefs: userData.layoutPrefs
      };
      setCurrentUser(userObj);
      localStorage.setItem('stellar_user', JSON.stringify(userObj));
  };

  const register = async (data: any) => {
      const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Registration failed');
      }
      const userData = await res.json();
      const userObj = {
          id: userData.id,
          name: userData.username,
          username: userData.username,
          role: userData.role,
          department: userData.department,
          teamId: userData.teamId,
          layoutPrefs: userData.layoutPrefs
      };
      setCurrentUser(userObj);
      localStorage.setItem('stellar_user', JSON.stringify(userObj));
  };

  const logout = () => {
      setCurrentUser(null);
      setTickets([]);
      setActivities([]);
      localStorage.removeItem('stellar_user');
  };

  const updateLayoutPrefs = async (prefs: Partial<LayoutPrefs>) => {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/users/${currentUser.id}/layout`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ layoutPrefs: prefs })
        });
        if (res.ok) {
            const updatedUser = await res.json();
            const userObj = {
                ...currentUser,
                layoutPrefs: updatedUser.layoutPrefs
            };
            setCurrentUser(userObj);
            localStorage.setItem('stellar_user', JSON.stringify(userObj));
        }
    } catch (err) { console.error(err); }
  };

  const addTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'comments' | 'isEscalated' | 'teamId'>) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ticketData, teamId: currentUser.teamId })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const updateTicketStatus = async (id: string, status: 'open' | 'closed') => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, modifier: currentUser.name })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const toggleEscalation = async (id: string) => {
    if (!currentUser) return;
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;
    try {
        await fetch(`${API_BASE}/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isEscalated: !ticket.isEscalated, modifier: currentUser.name })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const assignTicket = async (id: string, assignee: string | null) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedTo: assignee, modifier: currentUser.name })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const addComment = async (ticketId: string, commentData: Omit<Comment, 'id' | 'timestamp'>) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const addTask = async (ticketId: string, description: string) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets/${ticketId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const toggleTaskCompletion = async (ticketId: string, taskId: string) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/tickets/${ticketId}/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modifier: currentUser.name })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const addSecurityEvent = async (event: Omit<Activity, 'id' | 'timestamp' | 'type' | 'teamId'>) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...event, teamId: currentUser.teamId })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  const addKBArticle = async (title: string, content: string) => {
    if (!currentUser) return;
    try {
        await fetch(`${API_BASE}/kb`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        await refreshData();
    } catch (err) { console.error(err); }
  };

  // Only keeping this temporarily to not break components that might still call it.
  const switchRole = (role: Role) => {
    if (currentUser) {
       const updatedUser = { ...currentUser, role };
       setCurrentUser(updatedUser);
       localStorage.setItem('stellar_user', JSON.stringify(updatedUser));
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
