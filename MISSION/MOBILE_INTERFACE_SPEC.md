# ParadigmOS: Mobile Interface Specification (9:16)
## Vibe: Tactical Handheld Motherboard

---

## 1. Visual Hierarchy (The Vertical Stack)

### **A. Tactical Map (Top 60%)**
- **Element:** The Neural Constellation.
- **Interaction:** Pinch-to-zoom and Pan enabled. 
- **Focus:** The central pulsing orb (Core Identity Anchor) remains centered. 8 nodes orbit in a tighter radius optimized for phone widths.

### **B. Core Signal (Pinned)**
- **Element:** Core Identity Statement.
- **Style:** High-status typography, 18px-24px, centered.
- **Position:** Directly below the Tactical Map.

### **C. Intelligence Feed (Bottom Scroll)**
- **Element:** Curated Insights & Neural Bridges.
- **Layout:** Vertical list of "Intel Cards" (The Mobile Bento).
- **Style:** Glass panels with reduced blur (for GPU efficiency) and increased vertical padding.

---

## 2. Navigation: The Command Bar (Fixed Bottom)

| Icon | Label | Action |
| :--- | :--- | :--- |
| `Layers` | Map | Resets view to main Constellation. |
| `Zap` | Dive | Triggers Presentation Mode (Full-screen). |
| `FileText` | Data | Opens full-screen Data Suite overlay. |
| `ImageIcon` | Visuals | Opens full-screen Visual Suite overlay. |
| `Clock` | Memory | Opens slide-up Memory Archive drawer. |

---

## 3. Interaction Calibration

- **The "Dive" (Touch):** Tapping a node in the map triggers an immediate full-screen zoom past the constellation into the Node Detail view.
- **Node Detail (Mobile):** The enlarged node stays at the top; the metrics and visual proof scroll vertically below it.
- **Gestures:** 
    - Swipe down on a Suite to close it.
    - Double-tap the background to hide/show the UI for "Pure Starfield" mode.

---

## 4. Technical Strategy: CSS Container Queries

We will not use standard media queries. We will use **Container Queries** and **Flex-Direction: Column** to ensure that when the screen shrinks, the grid automatically breaks into the tactical stack described above.

**Status:** DRAFTING COMPLETE // READY FOR IMPLEMENTATION.
