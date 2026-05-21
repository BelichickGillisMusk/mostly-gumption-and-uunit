# Project Context: Rent-Ruby

This document tracks persistent enhancements and project-specific rules for the Rent-Ruby application.

## Core Aesthetic: Giants-Inspired Modern
- **Color Palette**: Vibrant Orange (`#FF5F1F` / `app-accent`), Black/Deep Navy (`#0B1A2D`), and White.
- **Typography**: 
  - Headings: Bold, tight-tracking sans-serif (Inter/font-sans).
  - Accents: Elegant serif italics for subheadings and distances.
  - Metadata: Bold, small-caps, wide-tracking for descriptions and badges.
- **Layout Patterns**: 
  - Use `rounded-sm` for technical badges (e.g., "EST. 1924").
  - Use `rounded-[2rem]` or `rounded-[2.5rem]` for main cards and sections.
  - High-contrast elements with subtle glassmorphism (`bg-white/5 backdrop-blur-md`).

## Key Features & Enhancements

### 1. The Info Nook (Tenant Portal)
- **Purpose**: A central hub for tenant documents, forms, and building knowledge.
- **Location**: `src/components/TenantPortal.tsx` (activeTab: `info-nook`).
- **Content**: 
  - Move-Out Checklist (Required).
  - Building Rules 2026.
  - Parking & Transit Maps.
  - Trash & Recycling Schedule (AI-monitored smart bins).
  - Quick Forms (Sublet, Pet registration, etc.).

### 2. Navigation & UX
- **Simplified Nav**: The "Platform" link has been removed from the main navigation to focus on the Hub, Amenities, Neighborhood, and Gallery.
- **View Toggles**: The app supports three distinct views: Hub (Landing), Admin (Management), and Tenant (Portal).

### 3. Hero Section Specifics
- **Tagline**: "POSITIVE VIBES LIVE HERE STORY." (Blue text + White/40 label).
- **Status Indicator**: "ONLY 2 UNITS LEFT" with a pulsing ruby dot.

## Development Rules
- **Icons**: Always use `lucide-react`.
- **Animations**: Always use `motion/react`.
- **Styling**: Strictly Tailwind CSS.
- **Data**: Prefer real-time patterns with `onSnapshot` if Firebase is used.

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Dev server (Express + Vite) | `npm run dev` | 3000 | Serves React SPA + all `/api/*` REST endpoints |

### Key commands

- **Lint**: `npm run lint` (runs `tsc --noEmit`)
- **Build**: `npm run build` (Vite production build)
- **Dev**: `npm run dev` (Express + Vite dev server via `tsx server.ts`)

### Non-obvious notes

- The dev server is a single process (`tsx server.ts`) that runs both the Express API backend and the Vite dev middleware for the React frontend.
- SQLite database (`rentroll_v3.db`) is auto-created and seeded on first server start — no migration step needed.
- The `/api/units` route does not exist; use `/api/rent-roll` for unit/tenant data.
- `GEMINI_API_KEY` env var is optional — the app runs fully without it but AI features (image generation, CEO briefing, marketing) will fail gracefully.
- Firebase Auth and Firestore are optional cloud dependencies used only for mailbox customization persistence; core app works without them.
- The Rent Roll in the Admin view is security-gated behind a double-click interaction on the "Double Click for Rent Roll" button.
