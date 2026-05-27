# Project Instructions

## Scope
- Frontend lives in `Frontend/` and uses Expo Router + React Native.
- Backend will live in `Backend/` and should be built with FastAPI + Python.
- Supabase is already configured through [`.vscode/mcp.json`](.vscode/mcp.json).

## Frontend rules
- Use Expo Router file-based routes under `Frontend/app/`.
- Use the `@/*` alias for imports from `Frontend/src/*`.
- Keep UI colors and typography aligned with `Frontend/src/constants/theme.ts`.
- Do not hardcode colors or theme values; respect `useColorScheme()`.
- Keep auth and launch state in Zustand stores such as `Frontend/src/store/useAuthStore.ts`.
- Put shared response/request shapes in `Frontend/src/types/` when backend APIs are added.

## Backend rules
- Build the API in `Backend/` with FastAPI, async-first endpoints where practical.
- Use Supabase as the database layer and validate auth with Supabase JWTs.
- Keep environment values in a backend `.env` file; never hardcode secrets.
- Prefer small route modules, explicit Pydantic schemas, and clear dependency injection.
- Align backend response models with frontend types to avoid contract drift.

## Supabase rules
- Use MCP to inspect the live project before changing database-related code.
- Treat `auth.uid()` and RLS policies as first-class parts of the data model.
- Verify schema assumptions against the connected Supabase project before writing integration code.

## Agent package management
- Agents must use the `uv` package manager for installing and managing agent skills and packages when available.
- If a corresponding skill exists for `uv`, agents should install and prefer it for package operations (e.g., `npx skills add wshobson/agents@uv-package-manager`).
- Agents must not use global `npm` installs or ad-hoc commands for skill management unless `uv` is unavailable or explicitly permitted.

## Commands
- Frontend dev: `cd Frontend && npm start` or `cd Frontend && npx expo start`
- Frontend Android/iOS/Web: `cd Frontend && npx expo start --android`, `cd Frontend && npx expo start --ios`, `cd Frontend && npx expo start --web`
- Backend tests and run commands should be added when `Backend/` is scaffolded.

## Working style
- Prefer minimal, targeted changes.
- Update or add types when API contracts change.
- If a task touches auth, database, or routing, check the related store, theme, or MCP config first.