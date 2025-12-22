
# SPRINT 1 — AUTHENTICATED TODO + ADMIN (FOUNDATION)

> Purpose  
This sprint establishes the **true foundation** of the product.  
At the end of this sprint, the system has:
- Real users (auth)
- User-owned todos
- Admin-managed user tiers
- NO Stripe (manual tier only)

This document is **high-level**, optimized for **AI coding agents**, and broken into **small steps** to avoid large code changes per iteration.

---

## Tech Stack (Fixed)

### Monorepo
- Turborepo
- Shared TypeScript config

### Frontend
- User App: Next.js, TypeScript, Tailwind, shadcn/ui
- State:
  - TanStack Query (server data)
  - Zustand (UI / auth state)
- Forms: react-hook-form

### Admin App
- Vite + React
- TypeScript
- Tailwind

### Backend
- NestJS
- TypeORM
- PostgreSQL

---

## Sprint Goal

By the end of Sprint 1:
- Users can register & log in
- Users can manage their own todos
- Admin can manage users and update tiers manually
- Tier is enforced by backend guards

---

## User Tiers (Manual Only)

- normal
- premium
- pro

> Tier is an internal system state.  
> Payment and Stripe are NOT part of this sprint.

---

## STEP BREAKDOWN (VERY IMPORTANT)

### Step 1 — User Domain (No Auth Yet)
**Goal:** Introduce user as a first-class entity.

- User entity exists
- Todo belongs to a user
- Seed:
  - 1 admin user
  - 1 normal user

✅ Exit:
- Todos are user-scoped

---

### Step 2 — Authentication (Login)
**Goal:** Allow existing users to log in.

- Login API
- Access token
- Protect todo APIs

❌ No register yet

✅ Exit:
- User must log in to access todos

---

### Step 3 — Registration
**Goal:** Allow new users to sign up.

- Register API
- Password hashing
- Email uniqueness

✅ Exit:
- New user can register and log in

---

### Step 4 — User Todo (Authenticated)
**Goal:** Core product usage.

- CRUD todo (user-owned)
- Todo fields:
  - title
  - status: todo | doing | done
  - dueDate (optional)

✅ Exit:
- User can fully use todo app after login

---

### Step 5 — Admin Role & Access
**Goal:** Introduce admin capability.

- Admin role
- Admin-only guard
- Admin login

✅ Exit:
- Admin can access admin APIs

---

### Step 6 — Admin User Management
**Goal:** Manual tier & control.

- Admin user list
- View user detail
- Update user tier (normal / premium / pro)
- Ban / unban user

✅ Exit:
- Admin fully controls user state

---

### Step 7 — Tier Enforcement (Backend)
**Goal:** Make tier meaningful.

- Tier-based guard
- Feature restriction logic (backend)
- FE only reflects backend decision

✅ Exit:
- Tier affects behavior

---

## Out of Scope (STRICT)

- Stripe / payment
- Subscription lifecycle
- Analytics
- Realtime / collaboration
- Advanced UI polish

---

## Rules for AI Coding Agents

- Implement **one step at a time**
- Do NOT jump ahead
- Do NOT introduce Stripe
- Do NOT refactor unrelated code
- Each step should be:
  - reviewable
  - testable
  - small in diff size

---

## Sprint Completion Criteria

Sprint 1 is complete when:
- Auth works end-to-end
- Admin can manage user tiers
- Todos are user-isolated
- System is ready for Stripe in future sprint

---

END OF DOCUMENT
