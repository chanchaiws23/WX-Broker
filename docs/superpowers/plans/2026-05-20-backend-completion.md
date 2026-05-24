# Backend Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the backend contract so Docker can run the API/database reliably while frontend work can proceed against stable endpoints.

**Architecture:** Convert the Express bootstrap into an app factory, keep route modules focused, add shared auth/error middleware, and cover the API through integration-style route tests with an injected in-memory Prisma-compatible test double. Docker startup runs migrations before starting the compiled API.

**Tech Stack:** Express, TypeScript, Prisma, PostgreSQL, JWT cookies, Zod, Vitest, Supertest, Docker Compose.

---

### Task 1: Test Harness And App Factory

**Files:**
- Create: `backend/src/app.ts`
- Modify: `backend/src/index.ts`
- Modify: `backend/package.json`
- Create: `backend/src/test/test-prisma.ts`
- Create: `backend/src/test/app.test.ts`

- [ ] Install `vitest`, `supertest`, and `@types/supertest`.
- [ ] Add scripts `test` and `test:run` to `backend/package.json`.
- [ ] Extract Express middleware and route mounting into `createApp({ prisma })`.
- [ ] Keep `backend/src/index.ts` responsible only for `createApp().listen(...)`.
- [ ] Write the first failing test for `GET /api/health`.
- [ ] Implement `GET /api/health` to return `{ ok: true }`.

### Task 2: Auth Contract

**Files:**
- Modify: `backend/src/routes/auth.ts`
- Modify: `backend/src/lib/auth.ts`
- Test: `backend/src/test/app.test.ts`

- [ ] Add failing tests for register duplicate email, login cookie, `GET /api/me`, and `POST /api/logout`.
- [ ] Implement normalized auth responses without returning password hashes.
- [ ] Add `GET /api/me` using the JWT cookie.
- [ ] Add `POST /api/logout` clearing the token cookie.
- [ ] Make soft-deleted users unable to log in.

### Task 3: Broker Contract

**Files:**
- Modify: `backend/src/routes/brokers.ts`
- Test: `backend/src/test/app.test.ts`

- [ ] Add failing tests for protected create, missing fields, duplicate slug, valid create, list search/filter, and detail not found.
- [ ] Implement strict broker validation with trimmed inputs.
- [ ] Implement case-insensitive name search and exact broker type filtering.
- [ ] Keep `POST /api/brokers` protected by JWT cookie.
- [ ] Return consistent success and error payloads.

### Task 4: Docker Readiness

**Files:**
- Modify: `backend/Dockerfile`
- Modify: `docker-compose.yml`
- Modify: `README.md`

- [ ] Add Docker command that runs `prisma migrate deploy` before `node dist/index.js`.
- [ ] Add API healthcheck using `GET /api/health`.
- [ ] Make `web` depend on healthy `api`.
- [ ] Document backend endpoints and Docker startup.

### Task 5: Verification

**Files:**
- All backend and Docker files touched above.

- [ ] Run `npm install` in `backend`.
- [ ] Run `npm run test:run` in `backend`.
- [ ] Run `npm run build` in `backend`.
- [ ] Run `docker compose config`.
- [ ] Report any remaining frontend-facing gaps explicitly.
