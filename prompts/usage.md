# UiPath Coded Web App Template

This template is a pre-scaffolded React + Vite + TypeScript project wired up to the `@uipath/uipath-typescript` SDK. Use it to build UiPath Coded Web Apps on top of an already-correct auth and build configuration.

## Scaffold Contents

- `package.json` - React 18, Vite 6, Tailwind 4, `@uipath/uipath-typescript`, `path-browserify`, `react-router-dom`
- `vite.config.ts` - SDK-required configuration: `base: './'`, `global: 'globalThis'`, `path` aliased to `path-browserify`, `optimizeDeps` including the SDK
- `src/main.tsx` - React root wired with `<BrowserRouter basename={getAppBase()}>`
- `src/App.tsx` - Placeholder UI wrapped in `<AuthProvider>` with a sign-in gate - replace the body with the application UI
- `src/hooks/useAuth.tsx` - PKCE OAuth hook with React Strict Mode guard and post-callback URL cleanup
- `src/index.css` - Tailwind CSS v4 with a minimal body reset
- `.env` and `uipath.json` - Injected at extraction time with client ID, scopes, org name, tenant name, and base URL

## Authoring Rules

1. Do not reinstall packages, re-run `create-vite`, or rewrite the auth plumbing. Extend the scaffold by adding pages, components, hooks, and service usage.
2. For anything UiPath SDK related (service instantiation, method signatures, scopes, pagination, polling, BPMN rendering, Action Center task embedding), use the bundled `uipath-coded-apps` skill. The Claude Agent SDK auto-loads it from `.nucleus/plugin/`.
3. Never use mock data. Always fetch from the UiPath SDK services documented in the skill.
4. Never hardcode resource IDs (folder IDs, process IDs, queue IDs). Fetch them from the SDK at runtime.
5. Never mix `folderId` (number, Orchestrator) with `folderKey` (string GUID, Maestro).
6. Do not import service classes from the package root. Use subpath imports (e.g. `@uipath/uipath-typescript/assets`).
7. Do not use the deprecated `sdk.entities.getAll()` dot-chain. Use constructor DI: `new Entities(sdk)`.

## Design

- Tailwind utility classes are available globally via `src/index.css`.
- No component library is pre-installed. Build UI primitives inline or add a library on demand if the task requires one.
- Use `getAppBase()` from `@uipath/uipath-typescript` for the router `basename` so the app works at both the local dev root and the deployed sub-path.

## Deploy

The app builds to `dist/` via `vite build` and is published as a Cloudflare Pages static site (`wrangler.jsonc` configures `pages_build_output_dir`).
