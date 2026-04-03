# Design System: ParadigmOS // Interstellar Tokens

## Design Philosophy: The Motherboard Extension
The UI is not a website; it is hardware. Every element must feel like a physical extension of the user's signal within a space-borne motherboard environment.

---

## 1. Core Visual Tokens

### Interstellar Palette
- **System Primary:** `--color-primary: #007AFF;` (Electric Cyan)
- **Status Accent:** `--color-accent: #FF9500;` (Warning Amber)
- **Background Pure:** `--color-bg-pure: #000000;` (Absolute Void)
- **Glass Base:** `--color-bg-glass: rgba(255, 255, 255, 0.04);` (Physical Glass)
- **Text Anchor:** `--color-text-primary: #FFFFFF;` (Signal White)
- **Text Ghost:** `--color-text-secondary: rgba(255, 255, 255, 0.4);` (Distant Signal)

### Physical Glassmorphism
- **Blur Depth:** `--glass-blur: blur(30px);`
- **Surface Glare:** `--glass-border: 1px solid rgba(255, 255, 255, 0.1);`
- **Shadow Weight:** `--shadow-lifted: 0 20px 100px rgba(0, 0, 0, 0.8);`

### Cinematic Typography
- **Primary Font:** `SF Pro Display, -apple-system, system-ui`
- **Identity Weight:** `900` (Ultra-Bold)
- **Signal Weight:** `500` (Medium)
- **Technical Weight:** `100` (Thin / Detail)

---

## 2. Spatial Layout Tokens

### Dynamic Viewport
- **Mobile Fluidity:** `--viewport-height: 100dvh;` (Ensures perfect fit on mobile hardware)
- **Bento Rhythm:** 12-column grid with 20px dynamic gutter.

### Coordinate Mapping
- **The Macro Center:** 50% X / 50% Y (The Anchor)
- **The Dive Center:** 30% X / 50% Y (Focus Node positioning)

---

## 3. Hardware-Level Throttling (Power Tokens)

- **Starfield Active:** 60FPS motion enabled (Presentation Mode / Active Dashboard).
- **Starfield Passive:** Static Frame capture (Data Suite / Onboarding).
- **GPU Relief:** Removal of standard `filter: blur()` in favor of hardware-accelerated `backdrop-filter`.

---

## 4. Component Manifest

### The Player Card (Authority Anchor)
- **Purpose:** 2-second high-status verification.
- **Vibe:** Character Class selection screen.

### The Constellation (Visual Proof)
- **Logic:** All-to-all connection algorithm.
- **Physics:** Device-aware particle count (400 Mobile / 1200 Desktop).

### The Dossier (Authority Archive)
- **Format:** 1920x1080 (16:9) cinematic landscape.
- **Export Quality:** 2K resolution assembly via `html2canvas`.
