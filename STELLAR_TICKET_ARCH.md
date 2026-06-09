# Stellar Ticket Architecture & Design Document

## 1. Vision & Background
**Stellar Ticket** is an immersive, high-fidelity ticketing platform that merges the functional robustness of **osTicket** with the cinematic "node constellation" aesthetic of **ParadigmOS**. 

This application serves as a Capstone project for IT Support, with a long-term goal of supporting Cybersecurity operations through robust event logging, role-based monitoring, and a visually intuitive "command and control" interface.

---

## 2. Core Architectural Principles

### 2.1 Aesthetic Foundation: "The Neural Motherboard"
- **Visual Style:** Glassmorphism, interstellar starfields, and high-status typography.
- **Interactive Logic:** Data is represented as a living constellation of nodes.
- **Spatial UI:** Uses a "Bento Box" grid for the dashboard and a multi-layered spatial zoom for presentation mode.

### 2.2 Data Model & Roles
The system is built to support a diverse set of users with varying degrees of authority:
- **Clients:** Can create and track their own tickets.
- **IT Support (Tier 1 & 2):** Resolve technical issues and manage ticket lifecycles.
- **Managers:** Oversee department performance and resource allocation.
- **Developers:** Address system-level bugs and feature requests.
- **Cybersecurity Professionals:** Monitor "Shadow Vectors" (event logs) for anomalies and security events.

---

## 3. Key Features

### 3.1 Neural Presentation Mode (Department Drill-down)
Instead of a generic list, tickets are visualized in a 3D-like constellation space.
- **Macro Level:** Displays "Department Hubs" (IT, Security, Research, etc.).
- **Constellation Level:** Zooming into a Hub reveals the specific tickets for that department as interactive nodes.
- **Node Detail:** Clicking a ticket node opens a cinematic "Authority Archive" showing full ticket history and controls.

### 3.2 Dynamic Bento Dashboard
A central command center composed of modular "Bento Boxes":
1.  **Active Queue:** A scrolling priority list of recent tickets.
2.  **System Logs:** Real-time event tracking for IT and Security events.
3.  **Knowledge Base Marquee:** A sliding ticker of insights that expands into full-screen articles upon interaction.
4.  **Neural Forge:** The mini-constellation view for quick spatial navigation.

### 3.3 New Ticket Forge (Modal Overlay)
A high-gloss modal interface for rapid ticket creation, ensuring the dashboard context is never lost.

---

## 4. Technical Roadmap & Completed Phases

### Phase 1: Foundational Intelligence [COMPLETED]
- [x] Implement `TicketContext` with Department and Role awareness.
- [x] Seed the system with diverse ticket data and security events.

### Phase 2: Spatial Navigation [COMPLETED]
- [x] Implement Department-to-Ticket zoom logic in `PresentationForge`.
- [x] Update `NeuralConstellation` to handle priority-colored nodes dynamically.

### Phase 3: Interactive Dashboards & Knowledge Base [COMPLETED]
- [x] Build the `NewTicketModal` with glassmorphism effects.
- [x] Implement cinematic, full-screen expansions for Knowledge Base articles.
- [x] Refactor Client dashboard to a streamlined 'Cinematic Request Portal'.

### Phase 4: Enterprise Operations & Sub-Tasks [COMPLETED]
- [x] Implement 'Authority Archive' detail views with osTicket functional depth (Command Ribbon, Metadata Matrix).
- [x] Build 'Sub-Tasks Engine' with interactive checklists and progress bar visualization.
- [x] Implement Ticket Assignment (Claim/Assign) and secure Internal Notes.

### Phase 5: Backend Persistence [COMPLETED]
- [x] Expand Node.js API with full CRUD endpoints for tickets and activities.
- [x] Establish JSON-based persistent file storage (`tickets.json`, `activities.json`).
- [x] Implement frontend live sync and auto-refresh loops.

---

## 5. Ongoing Expansion: The Cybersecurity Vector
The "Shadow Vector" (System Logs) bento has evolved into a sophisticated monitoring tool.
- **Event Correlation:** Real-time filtering implemented to isolate high-severity security events.
- **Visual Alerting:** The constellation pulses and triggers a CSS glitch state during active 'Critical Breaches'.
- **Role-Based Views:** RBAC strictly isolates specific "Shadow Data" within the constellation, ensuring only Cyber/Support roles see internal operational vectors.
