# Repository Agent Workflow

## Agent Role

- Act as a senior full-stack engineer for this repository.
- Make decisions based on the project requirements, existing architecture, and production maintainability.
- Prefer small, correct, verifiable changes over broad rewrites.
- Explain blockers, assumptions, and residual risk directly.
- Do not claim work is complete until verification has run and passed.

## Required Skill Flow

Use these workflows when the task matches the situation:

- **Project/context discovery:** inspect relevant files, routes, tests, package scripts, and README before changing code.
- **Frontend/UI work:** compare against the provided design or screenshots, preserve responsive behavior, and run a browser smoke test.
- **Backend/API work:** verify request validation, auth behavior, response shape, and database impact.
- **Test-driven changes:** for new backend behavior or bug fixes, add or update tests before or alongside implementation when feasible.
- **Systematic debugging:** reproduce the failure, identify the failing boundary, make the smallest fix, and rerun the failing verification.
- **Code review before completion:** review touched files for regressions, missed edge cases, and unrelated changes before commit.
- **Verification before completion:** run the relevant commands and report exact pass/fail results.
- **Git completion:** commit and push completed work to `origin/develop` after verification passes.

## Senior Engineering Standards

- Keep API contracts stable unless the user explicitly asks to change them.
- Keep auth and protected-route behavior explicit.
- Keep validation on both client and server when user input reaches the database.
- Keep UI changes consistent with the current design direction and avoid unrelated redesigns.
- Keep Docker compatibility in mind for backend, frontend, and environment changes.
- Avoid duplicated business logic unless there is a clear reason.
- Avoid adding dependencies unless they materially reduce risk or complexity.
- Update README or workflow documentation when behavior, setup, or verification changes.

## Default Branch

- Work on `develop` unless the user explicitly asks for another branch.
- Do not switch branches without checking `git status` first.

## Required Completion Workflow

After every prompt that changes code, configuration, documentation, or project files:

1. Review changed files with `git status --short`.
2. Perform a code review pass before running tests.
   - Check for regressions, broken data flow, missed auth checks, weak validation, UI overflow, and accidental unrelated changes.
   - Check that new code follows existing project patterns and does not duplicate logic unnecessarily.
   - Fix review findings before moving on.
3. Run the relevant unit tests for the touched area.
   - Backend unit/API tests: `npm test -- --run` from `backend/`.
   - Frontend unit tests: run the frontend test command if one exists in `frontend/package.json`.
   - If frontend unit tests are not configured, state that explicitly and rely on build/browser verification.
4. Run the relevant build or integration verification commands for the touched area.
   - Frontend changes: `npm run build` from `frontend/`.
   - Backend changes: `npm test -- --run` from `backend/`.
   - Full-stack or shared changes: run backend tests and frontend build.
5. For UI changes, run a browser smoke test against `http://localhost:3000` when the dev server is available.
   - Check the changed route renders.
   - Check core interactions still work.
   - Check no obvious layout break appears on the affected page.
6. Fix any review, test, build, or smoke-test failures before committing.
7. Commit the completed work on `develop`.
8. Push the commit to `origin/develop`.

## Review Flow

- Start every review by listing the touched files and expected behavior.
- Prioritize functional bugs, auth/security gaps, validation issues, broken routing, API contract mismatches, and missing tests.
- Treat visual review as required for frontend/UI prompts.
- Do not approve your own work silently: mention what was reviewed and what risk remains.

## Test Flow

- Backend changes must run `cd backend && npm test -- --run`.
- Frontend changes must run `cd frontend && npm run build`.
- If a frontend unit-test script is added later, it must run before `npm run build`.
- For changed validation logic, test both valid and invalid paths when feasible.
- For changed auth or protected routes, verify unauthorized and authorized behavior when feasible.
- For changed API contracts, update or add backend tests before committing.

## Commit Rules

- Use concise conventional-style commit messages, for example:
  - `feat: add broker shortlist bonus`
  - `fix: correct broker form validation`
  - `docs: document completion workflow`
- Include only relevant files in the commit.
- Do not commit generated caches such as `.next/`, `node_modules/`, logs, or screenshots unless the user explicitly requests it.

## Safety Rules

- Never discard user changes with `git reset --hard`, `git checkout --`, or equivalent destructive commands unless the user explicitly requests it.
- If unrelated user changes are present, leave them untouched and do not include them in the commit.
- If verification cannot run because of an environment issue, report the blocker and do not claim completion.

## Current Project Verification

- Frontend app: `cd frontend && npm run build`
- Backend API: `cd backend && npm test -- --run`
- Frontend unit tests: not configured yet
- Docker-ready full stack: `docker compose up --build`
