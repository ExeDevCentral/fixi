# App-First Interactive Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform FIXI into a distinctive 'App-First' platform featuring an end-to-end interactive simulation of the complete service lifecycle (request -> dispatch & dual security/email preview -> multiplatform payment -> completion & rating).

**Architecture:** A finite state machine engine (`FixiSimulatorEngine`) built with React and Framer Motion orchestrating 4 distinct lifecycle stages: Configuration, Dispatch & Dual View (App tracking + Official Security Email with PIN and duration), Multiplatform Payment (Card, Bank Transfer/MODO, Cash with PIN), and Final Rating with digital receipt. The main landing page is restructured so this interactive experience is the primary hero, with the traditional provider directory cleanly accessible via a secondary toggle.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, Vite.

**Spec:** [docs/superpowers/specs/2026-10-11-app-first-interactive-flow-design.md](file:///c:/Users/exeme/Desktop/Fixi/docs/superpowers/specs/2026-10-11-app-first-interactive-flow-design.md)

## Global Constraints
- Modern, distinctive aesthetics: dark graphite background (`bg-slate-950`), emerald and warm amber glow accents, zero generic card repetition.
- Full responsive design for desktop, tablet, and mobile.
- Zero breaking changes to existing Supabase auth or directory functionality.
- Smooth Framer Motion transitions between simulator states.
- Clean TypeScript types without any compile errors.

## Review Focus
1. State reset consistency: Restarting the simulation from the final review screen must cleanly restore initial defaults without lingering state.
2. Dual View toggle responsiveness: Seamless instant toggle between "Vista App" and "Vista Email Oficial" during the tracking step.
3. Payment method switching: Selecting Card, Bank Transfer, or Cash must dynamically adapt the form and validation state.
4. Input sanitization in simulation: Card numbers, pin inputs, and amounts must handle formatting and limits gracefully.
5. Directory toggle preservation: Switching between "Experiencia en Vivo" and "Directorio de Profesionales" must preserve user scroll and state.

---

### Task 1: Type Definitions and Mock Specialists Dataset

**Files:**
- Create: `src/types/simulator.types.ts`
- Create: `src/lib/mockSpecialists.ts`

**Interfaces:**
- Consumes: `src/types/database.types.ts`
- Produces: `SimulatorState`, `FixiOrder`, `SpecialistProfile`, `PaymentMethodType`, `RatingPayload`

- [ ] **Step 1: Define TypeScript models and enums**
  Define `SimulatorState` enum (`CONFIGURING`, `DISPATCHING`, `DISPATCHED_TRACKING`, `IN_PROGRESS`, `PAYMENT_GATEWAY`, `COMPLETED_REVIEW`), `SpecialistProfile`, and payment interfaces in `src/types/simulator.types.ts`.
- [ ] **Step 2: Create curated realistic specialist profiles**
  Create rich mock profiles in `src/lib/mockSpecialists.ts` with authentic details (verified DNI, photo, rating, vehicle, tools, average completion time).
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 4: Commit**
  Run: `git add src/types/simulator.types.ts src/lib/mockSpecialists.ts && git commit -m "feat(simulator): add simulator types and specialist dataset"`

---

### Task 2: Official Arrival Email Preview Component

**Files:**
- Create: `src/components/simulator/EmailNotificationPreview.tsx`

**Interfaces:**
- Consumes: `SpecialistProfile`, `FixiOrder` from `src/types/simulator.types.ts`
- Produces: `EmailNotificationPreview: React.FC<{ specialist: SpecialistProfile; order: FixiOrder }>`

- [ ] **Step 1: Implement EmailNotificationPreview**
  Build the corporate email card with FIXI branding, security badges, specialist photo, verified DNI, vehicle details, arrival ETA, estimated work duration, and one-click PIN copy button.
- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 3: Commit**
  Run: `git add src/components/simulator/EmailNotificationPreview.tsx && git commit -m "feat(simulator): add official arrival email preview component"`

---

### Task 3: Multiplatform Payment Gateway Simulator Component

**Files:**
- Create: `src/components/simulator/PaymentGatewaySimulator.tsx`

**Interfaces:**
- Consumes: `PaymentMethodType`, `FixiOrder` from `src/types/simulator.types.ts`
- Produces: `PaymentGatewaySimulator: React.FC<{ order: FixiOrder; onPaymentSuccess: () => void }>`

- [ ] **Step 1: Implement interactive payment platform switcher**
  Create 3 tabbed payment options:
  1. Credit/Debit Card: Interactive card visual with auto-detected Visa/Mastercard badge, expiration, and CVV.
  2. Bank Transfer / MODO: Alias `fixi.pagos.oficial`, CBU, BCRA interoperable QR mockup, and "Subir Comprobante" button.
  3. Cash on Delivery: 4-digit PIN verification code handover to specialist.
- [ ] **Step 2: Add payment simulation feedback and loader**
  Implement realistic 1-second simulated secure processing state with success checkmark.
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 4: Commit**
  Run: `git add src/components/simulator/PaymentGatewaySimulator.tsx && git commit -m "feat(simulator): add multiplatform payment gateway component"`

---

### Task 4: Completion & Star Rating Component

**Files:**
- Create: `src/components/simulator/CompletedReviewCard.tsx`

**Interfaces:**
- Consumes: `SpecialistProfile`, `FixiOrder` from `src/types/simulator.types.ts`
- Produces: `CompletedReviewCard: React.FC<{ specialist: SpecialistProfile; order: FixiOrder; onRestart: () => void; onViewDirectory: () => void }>`

- [ ] **Step 1: Implement rating, quality badges, tip and confetti trigger**
  Create interactive 1-5 star selector with hover feedback, positive attribute tags ("Puntual", "Prolijo", "Precio justo"), tip selector ($500, $1000, $2000), digital receipt summary, and confetti fireworks on submit.
- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 3: Commit**
  Run: `git add src/components/simulator/CompletedReviewCard.tsx && git commit -m "feat(simulator): add completed review and rating component"`

---

### Task 5: Master Simulator Orchestrator (`FixiSimulatorEngine`)

**Files:**
- Create: `src/components/simulator/FixiSimulatorEngine.tsx`

**Interfaces:**
- Consumes: All subcomponents from Tasks 1-4
- Produces: `FixiSimulatorEngine: React.FC<{ onViewDirectory: () => void }>`

- [ ] **Step 1: Implement state machine and motion transitions**
  Connect `CONFIGURING` -> `DISPATCHING` (radar animation) -> `DISPATCHED_TRACKING` (dual view: App tracking + Email preview) -> `IN_PROGRESS` (live work stopwatch) -> `PAYMENT_GATEWAY` -> `COMPLETED_REVIEW`.
- [ ] **Step 2: Integrate step progress bar and quick presets**
  Add intuitive step indicators and realistic category presets (Electricidad, Plomería, Gas, Jardinería, Cerrajería, Fletes).
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 4: Commit**
  Run: `git add src/components/simulator/FixiSimulatorEngine.tsx && git commit -m "feat(simulator): implement FixiSimulatorEngine master orchestrator"`

---

### Task 6: Home Redesign & App-First Integration

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `FixiSimulatorEngine` from Task 5, existing components
- Produces: Clean App-First landing experience with dual view switcher

- [ ] **Step 1: Add mode switcher in Navbar / Top section**
  Add high-visibility toggle between `[ ✨ Experiencia en Vivo / Pedir FIXI ]` and `[ 🔍 Directorio de Profesionales ]`.
- [ ] **Step 2: Integrate FixiSimulatorEngine as Hero centerpiece**
  Replace generic card-heavy first impression with the interactive live engine in Home.tsx.
- [ ] **Step 3: Verify build and test all simulator flows**
  Run: `npm run build`
  Expected: PASS with 0 errors.
- [ ] **Step 4: Commit & Push**
  Run: `git add . && git commit -m "feat(ui): complete app-first redesign with interactive fixi simulator" && git push`
