require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3041;

// --- CONFIG & STORAGE ---
const DATA_DIR = path.join(__dirname, 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');
const KB_FILE = path.join(DATA_DIR, 'kb.json');

fs.ensureDirSync(DATA_DIR);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// --- DATA HELPERS ---
const readJsonFile = async (file, defaultVal = []) => {
    if (!(await fs.pathExists(file))) return defaultVal;
    return await fs.readJson(file);
};
const writeJsonFile = async (file, data) => {
    await fs.writeJson(file, data, { spaces: 2 });
};

// --- AUTHENTICATION & TEAMS API ---

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role, department, teamName, isNewTeam, teamIdToJoin } = req.body;
        const users = await readJsonFile(USERS_FILE);
        const teams = await readJsonFile(TEAMS_FILE);

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        let teamId = teamIdToJoin;

        if (isNewTeam) {
            teamId = `TEAM-${Date.now()}`;
            teams.push({ id: teamId, name: teamName, createdAt: new Date().toISOString() });
            await writeJsonFile(TEAMS_FILE, teams);
        } else if (!teams.find(t => t.id === teamId)) {
            return res.status(400).json({ error: 'Team not found' });
        }

        const newUser = {
            id: `U-${Date.now()}`,
            username,
            password, // In a real app, hash this!
            role,
            department,
            teamId,
            layoutPrefs: { showForge: true, showQueue: true, showLogs: role !== 'client', showKB: true }
        };

        users.push(newUser);
        await writeJsonFile(USERS_FILE, users);

        const { password: _, ...userWithoutPassword } = newUser;
        res.json(userWithoutPassword);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await readJsonFile(USERS_FILE);

        const user = users.find(u => u.username === username && u.password === password);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/teams', async (req, res) => {
    try {
        const teams = await readJsonFile(TEAMS_FILE);
        res.json(teams);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/users/:id/layout', async (req, res) => {
    try {
        const { id } = req.params;
        const { layoutPrefs } = req.body;
        const users = await readJsonFile(USERS_FILE);
        
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        users[userIndex].layoutPrefs = { ...users[userIndex].layoutPrefs, ...layoutPrefs };
        await writeJsonFile(USERS_FILE, users);

        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json(userWithoutPassword);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- TICKETS API (Multi-Tenant) ---

app.get('/api/tickets', async (req, res) => {
    try {
        const { teamId } = req.query;
        if (!teamId) return res.status(400).json({ error: 'teamId is required' });

        const tickets = await readJsonFile(TICKETS_FILE);
        res.json(tickets.filter(t => t.teamId === teamId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { teamId, ...ticketData } = req.body;
        if (!teamId) return res.status(400).json({ error: 'teamId is required' });

        const tickets = await readJsonFile(TICKETS_FILE);
        const newTicket = {
            ...ticketData,
            teamId,
            id: `T-${1000 + tickets.length + 1}`,
            createdAt: new Date().toISOString(),
            comments: [],
            isEscalated: false
        };
        tickets.unshift(newTicket);
        await writeJsonFile(TICKETS_FILE, tickets);

        // Auto-log activity
        const activities = await readJsonFile(ACTIVITIES_FILE);
        activities.unshift({
            id: `A-${Date.now()}`,
            teamId,
            type: 'ticket_created',
            ticketId: newTicket.id,
            ticketTitle: newTicket.title,
            user: newTicket.user,
            timestamp: newTicket.createdAt,
            detail: 'Ticket initialized.',
            severity: newTicket.priority === 'emergency' ? 'critical' : (newTicket.priority === 'high' ? 'warning' : 'info'),
            vector: 'system'
        });
        await writeJsonFile(ACTIVITIES_FILE, activities);

        res.json(newTicket);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const tickets = await readJsonFile(TICKETS_FILE);
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

        const oldTicket = tickets[index];
        tickets[index] = { ...oldTicket, ...updates };
        await writeJsonFile(TICKETS_FILE, tickets);

        const activities = await readJsonFile(ACTIVITIES_FILE);
        const teamId = oldTicket.teamId;

        if (updates.status && updates.status !== oldTicket.status) {
            activities.unshift({
                id: `A-${Date.now()}`,
                teamId,
                type: 'status_change',
                ticketId: id,
                ticketTitle: oldTicket.title,
                user: updates.modifier || 'System',
                timestamp: new Date().toISOString(),
                detail: `Status changed to ${updates.status}.`,
                severity: 'info',
                vector: 'system'
            });
        }
        if (updates.isEscalated !== undefined && updates.isEscalated !== oldTicket.isEscalated) {
            activities.unshift({
                id: `A-${Date.now()}`,
                teamId,
                type: 'status_change',
                ticketId: id,
                ticketTitle: oldTicket.title,
                user: updates.modifier || 'System',
                timestamp: new Date().toISOString(),
                detail: `Ticket escalation ${updates.isEscalated ? 'activated' : 'deactivated'}.`,
                severity: updates.isEscalated ? 'warning' : 'info',
                vector: 'system'
            });
        }
        if (updates.assignedTo !== undefined && updates.assignedTo !== oldTicket.assignedTo) {
            activities.unshift({
                id: `A-${Date.now()}`,
                teamId,
                type: 'status_change',
                ticketId: id,
                ticketTitle: oldTicket.title,
                user: updates.modifier || 'System',
                timestamp: new Date().toISOString(),
                detail: updates.assignedTo ? `Ticket assigned to ${updates.assignedTo}.` : 'Ticket unassigned.',
                severity: 'info',
                vector: 'system'
            });
        }
        await writeJsonFile(ACTIVITIES_FILE, activities);

        res.json(tickets[index]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tickets/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const commentData = req.body;
        const tickets = await readJsonFile(TICKETS_FILE);
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

        const newComment = {
            ...commentData,
            id: `C-${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        tickets[index].comments.push(newComment);
        await writeJsonFile(TICKETS_FILE, tickets);

        const activities = await readJsonFile(ACTIVITIES_FILE);
        activities.unshift({
            id: `A-${Date.now()}`,
            teamId: tickets[index].teamId,
            type: 'comment_added',
            ticketId: id,
            ticketTitle: tickets[index].title,
            user: newComment.user,
            timestamp: newComment.timestamp,
            detail: 'New comment registered.',
            severity: 'info',
            vector: 'system'
        });
        await writeJsonFile(ACTIVITIES_FILE, activities);

        res.json(newComment);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tickets/:id/tasks', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const tickets = await readJsonFile(TICKETS_FILE);
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

        if (!tickets[index].tasks) tickets[index].tasks = [];
        
        const newTask = {
            id: `TSK-${Date.now()}`,
            description,
            isComplete: false,
            createdAt: new Date().toISOString()
        };
        tickets[index].tasks.push(newTask);
        await writeJsonFile(TICKETS_FILE, tickets);

        res.json(newTask);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/tickets/:id/tasks/:taskId/toggle', async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const { modifier } = req.body;
        const tickets = await readJsonFile(TICKETS_FILE);
        const ticketIndex = tickets.findIndex(t => t.id === id);
        if (ticketIndex === -1) return res.status(404).json({ error: 'Ticket not found' });

        const ticket = tickets[ticketIndex];
        if (!ticket.tasks) return res.status(404).json({ error: 'Tasks not found' });

        const taskIndex = ticket.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

        ticket.tasks[taskIndex].isComplete = !ticket.tasks[taskIndex].isComplete;
        await writeJsonFile(TICKETS_FILE, tickets);

        const activities = await readJsonFile(ACTIVITIES_FILE);
        activities.unshift({
            id: `A-${Date.now()}`,
            teamId: ticket.teamId,
            type: 'status_change',
            ticketId: id,
            ticketTitle: ticket.title,
            user: modifier || 'System',
            timestamp: new Date().toISOString(),
            detail: `Sub-task '${ticket.tasks[taskIndex].description}' marked as ${ticket.tasks[taskIndex].isComplete ? 'complete' : 'incomplete'}.`,
            severity: 'info',
            vector: 'system'
        });
        await writeJsonFile(ACTIVITIES_FILE, activities);

        res.json(ticket.tasks[taskIndex]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ACTIVITIES API (Multi-Tenant) ---

app.get('/api/activities', async (req, res) => {
    try {
        const { teamId } = req.query;
        if (!teamId) return res.status(400).json({ error: 'teamId is required' });

        const activities = await readJsonFile(ACTIVITIES_FILE);
        res.json(activities.filter(a => a.teamId === teamId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/activities', async (req, res) => {
    try {
        const { teamId, ...activityData } = req.body;
        if (!teamId) return res.status(400).json({ error: 'teamId is required' });

        const activities = await readJsonFile(ACTIVITIES_FILE);
        const newActivity = {
            ...activityData,
            teamId,
            id: `A-${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        activities.unshift(newActivity);
        await writeJsonFile(ACTIVITIES_FILE, activities);
        res.json(newActivity);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- KNOWLEDGE BASE API ---

app.get('/api/kb', async (req, res) => {
    try {
        const kb = await readJsonFile(KB_FILE);
        res.json(kb);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/kb', async (req, res) => {
    try {
        const { title, content } = req.body;
        const kb = await readJsonFile(KB_FILE);
        
        const newArticle = {
            id: `KB-${1000 + kb.length + 1}`,
            title,
            content,
            createdAt: new Date().toISOString()
        };
        
        kb.unshift(newArticle);
        await writeJsonFile(KB_FILE, kb);
        res.json(newArticle);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SEEDING (FOR INITIAL STARTUP) ---
const seedData = async () => {
    const DEFAULT_TEAM_ID = 'TEAM-DEFAULT';
    
    if (!(await fs.pathExists(TEAMS_FILE))) {
        await writeJsonFile(TEAMS_FILE, [{ id: DEFAULT_TEAM_ID, name: 'Default Organization', createdAt: new Date().toISOString() }]);
    }
    
    if (!(await fs.pathExists(USERS_FILE))) {
        await writeJsonFile(USERS_FILE, [
            { id: 'U-001', username: 'anthonycyber', password: 'password', role: 'cybersecurity', department: 'Security', teamId: DEFAULT_TEAM_ID, layoutPrefs: { showForge: true, showQueue: true, showLogs: true, showKB: true } },
            { id: 'U-002', username: 'clientuser', password: 'password', role: 'client', department: 'IT', teamId: DEFAULT_TEAM_ID, layoutPrefs: { showForge: true, showQueue: true, showLogs: false, showKB: true } }
        ]);
    }

    if (!(await fs.pathExists(TICKETS_FILE))) {
        const initialTickets = [
            {
                id: 'T-1001',
                teamId: DEFAULT_TEAM_ID,
                title: 'SYSTEM LATENCY IN NEURAL CORE',
                description: 'The neural core is experiencing significant lag during high-load processing cycles.',
                priority: 'high',
                status: 'open',
                isEscalated: false,
                user: 'Alpha-01',
                department: 'Infrastructure',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                comments: [{ id: 'C-1', user: 'System', text: 'Auto-detected latency spike.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }]
            },
            {
                id: 'T-1002',
                teamId: DEFAULT_TEAM_ID,
                title: 'UI GLITCH IN BENTO GRID',
                description: 'Bento boxes are not aligning correctly on mobile viewports.',
                priority: 'normal',
                status: 'open',
                isEscalated: true,
                user: 'Beta-02',
                department: 'IT',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                comments: []
            },
            {
                id: 'T-1003',
                teamId: DEFAULT_TEAM_ID,
                title: 'CRITICAL SECURITY BREACH ATTEMPT',
                description: 'Detected unauthorized access attempt from external node 192.168.1.50.',
                priority: 'emergency',
                status: 'open',
                isEscalated: false,
                user: 'Sentinel-X',
                department: 'Security',
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                comments: []
            }
        ];
        await writeJsonFile(TICKETS_FILE, initialTickets);
    }

    if (!(await fs.pathExists(ACTIVITIES_FILE))) {
        const initialActivities = [
            {
                id: 'A-1',
                teamId: DEFAULT_TEAM_ID,
                type: 'security_event',
                user: 'GATEKEEPER-01',
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                detail: 'Lateral movement attempt detected via SMB.',
                severity: 'critical',
                vector: 'network'
            },
            {
                id: 'A-2',
                teamId: DEFAULT_TEAM_ID,
                type: 'security_event',
                user: 'SENTRY-V',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                detail: 'Recursive SSH login failure from unknown IP.',
                severity: 'warning',
                vector: 'access'
            }
        ];
        await writeJsonFile(ACTIVITIES_FILE, initialActivities);
    }

    if (!(await fs.pathExists(KB_FILE))) {
        const initialKB = [
            { id: 'KB-1001', title: 'OPTIMIZING NEURAL THROUGHPUT', content: 'Guidelines for maximizing core performance and reducing node latency in high-demand environments. Ensure all auxiliary processes are suspended before initiating a core flush.', createdAt: new Date().toISOString() },
            { id: 'KB-1002', title: 'SECURITY PROTOCOL 7', content: 'Mandatory steps for handling unauthorized access attempts and isolating compromised sectors. Disconnect all external networking nodes immediately.', createdAt: new Date().toISOString() },
            { id: 'KB-1003', title: 'BENTO GRID ALIGNMENT', content: 'Fixing layout issues on fluid viewports and ensuring responsive element visibility. Verify CSS Grid constraints and remove static height definitions.', createdAt: new Date().toISOString() },
            { id: 'KB-1004', title: 'MALWARE QUARANTINE', content: 'Procedure for isolating suspicious binaries and initiating deep heuristic scans. Use the Shadow Vector terminal to trace execution origin.', createdAt: new Date().toISOString() }
        ];
        await writeJsonFile(KB_FILE, initialKB);
    }
};

seedData().then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`SYSTEM: active on port ${PORT}`));
});