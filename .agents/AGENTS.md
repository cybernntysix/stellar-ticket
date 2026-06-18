# Stellar Ticket Coding Guidelines & Constraints

When modifying files in this repository, always follow these rules to maintain visual consistency and architecture alignments:

## 1. Aesthetic Integrity
*   **Viewport Locking**: Ensure pages do not overflow the vertical height of the screen. Layout containers must stay within `100dvh` / `100vh` boundaries.
*   **Absolute Void Theme**: Backgrounds must use absolute black (`#000000`) or glassmorphic overlays (`rgba(255,255,255,0.04)`) with electric cyan (#007AFF) or warning orange (#FF9500) highlights.
*   **Backdrop Filter**: Avoid heavy CSS drop shadow or generic blurs that are not hardware-accelerated. Prefer `backdrop-filter: blur(30px)` to optimize GPU performance.

## 2. Code Rules & Comments
*   Do not delete existing comments or certification metadata in file headers or README documents.
*   Retain absolute alignment on component positions to avoid SVG connecting lines overlapping incorrectly in Presentation Mode.

## 3. Data Persistence
*   All state mutations must update the frontend React `Context` APIs AND sync with the Express backend APIs, which write to JSON collections inside `backend/data/`. Do not implement local-only frontend overrides without backend CRUD alignment.
