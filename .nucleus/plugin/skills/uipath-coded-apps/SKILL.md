---
name: uipath-coded-apps
description: "UiPath Coded Web Apps — author React/TypeScript apps that use the @uipath/uipath-typescript SDK. Scaffold is already in place; this skill covers SDK usage, auth patterns, and UI patterns (polling, BPMN, HITL)."
---

# UiPath Coded Web Apps

Author UiPath Coded Web Applications using the `@uipath/uipath-typescript` SDK on top of the pre-scaffolded React + Vite + TypeScript project in this workspace.

## Environment

The working directory is already a complete UiPath Coded Web App scaffold:

- `package.json` with `@uipath/uipath-typescript` and Tailwind installed
- `vite.config.ts` with the `path-browserify` alias, `global: 'globalThis'`, and `base: './'` already configured
- `src/hooks/useAuth.tsx` providing `AuthProvider` and `useAuth()` (PKCE OAuth)
- `src/App.tsx` wrapping the app in `<AuthProvider>` and gating on `isAuthenticated`
- `.env` and `uipath.json` with the correct client ID, scopes, org, tenant, and base URL already injected

Do **not** reinstall packages, re-run `create-vite`, or re-write auth plumbing. Extend the scaffold: add pages, components, hooks, and service usage.

## Preview URL & Output Routing

This workspace is served by the Vite dev server. The user's preview URL resolves to `/` on that server — which serves `index.html`. **Anything you build must be reachable from that root URL**, otherwise the user sees an empty scaffold even though your files exist on disk.

Pick one of these patterns based on what the user asked for:

- **Static single-file HTML prototype** (user says "single-file HTML", "self-contained prototype", "hard-coded data", etc.). Replace the contents of `index.html` with your prototype. Remove the `<script type="module" src="/src/main.tsx"></script>` line so Vite does not mount React on top of your markup. The UiPath SDK / auth scaffold is not needed for this case and can be bypassed.
- **React app** (with or without UiPath SDK). Leave `index.html` alone — the existing Vite entry is correct. Build the UI as React components under `src/`, starting by editing `src/App.tsx` or by creating new files under `src/components/`.
- **Mixed / static assets.** Non-HTML static files (images, JSON, etc.) go in `public/` — Vite serves that directory at root. Additional `.html` files are acceptable only if `index.html` explicitly links to them (e.g. a navigation anchor). Orphan `.html` files at workspace root are unreachable.

**Never write a new `.html` file at workspace root unless `index.html` links to it.** If you find yourself wanting to create `dashboard.html`, `app.html`, `demo.html`, etc. without linking from `index.html`, you are about to produce output the preview URL cannot reach — write into `index.html` instead.

## When to Use This Skill

Whenever you:

- Call any method on the UiPath TypeScript SDK
- Instantiate a service class (`Assets`, `Queues`, `Tasks`, `Entities`, `MaestroProcesses`, `Cases`, `ConversationalAgent`, etc.)
- Need OAuth scopes for a specific SDK method
- Render BPMN diagrams, poll for updates, or embed Action Center tasks in the UI

## Critical Rules

1. **`vite.config.ts` must always set `base: './'`.** The platform handles URL routing — apps must use relative asset paths. Already set in the scaffold; do not change.
2. **Use `getAppBase()` for client-side router basename.** Import from `@uipath/uipath-typescript`. It reads `uipath:app-base` at runtime and falls back to `'/'` locally. Never hardcode a path as the router basename.
3. **Never call `sdk.initialize()` more than once** — it triggers the OAuth redirect. Use `useAuth().isAuthenticated` or `sdk.isAuthenticated()` to check state. The provided `AuthProvider` already handles initialization.
4. **Never mix `folderId` (number) with `folderKey` (string).** Orchestrator services (`Assets`, `Queues`, `Buckets`, `Processes`) take numeric `folderId`. Maestro services (`ProcessInstances`, `CaseInstances`) take string `folderKey`. Using the wrong type will silently fail or return empty results.
5. **Never hardcode resource IDs** (folder IDs, process IDs, queue IDs, etc.) — always fetch them from the SDK at runtime.
6. **Never access `result.value` on SDK responses.** Paginated responses use `result.items`; non-paginated responses may return an array directly.
7. **Treat `references/sdk/*.md` as the authoritative SDK documentation.** Method signatures, response types, option shapes, and import paths listed there are accurate. Write code directly from them — do not cross-check against `node_modules/@uipath/uipath-typescript` as a precaution. Read the SDK's own `.d.ts` files only when a compile error, runtime error, or failing test specifically points you at a type or method the skill references do not cover.

## Task Navigation

| I want to... | Read this |
|---|---|
| Look up SDK import paths & subpath exports | [references/sdk/imports.md](references/sdk/imports.md) |
| Use Assets, Queues, Buckets, Processes, Jobs, Attachments | [references/sdk/orchestrator.md](references/sdk/orchestrator.md) |
| Use Data Fabric (Entities, ChoiceSets) | [references/sdk/data-fabric.md](references/sdk/data-fabric.md) |
| Use Maestro (Processes, Cases) | [references/sdk/maestro.md](references/sdk/maestro.md) |
| Use Action Center Tasks (create, assign, complete, embed) | [references/sdk/action-center.md](references/sdk/action-center.md) |
| Use the Conversational Agent | [references/sdk/conversational-agent.md](references/sdk/conversational-agent.md) |
| Paginate correctly (cursor, jump-to-page, type narrowing) | [references/sdk/pagination.md](references/sdk/pagination.md) |
| Look up OAuth scopes for a specific SDK method | [references/oauth-scopes.md](references/oauth-scopes.md) |
| Implement polling, BPMN rendering, or HITL task embedding | [references/patterns.md](references/patterns.md) |

## Core Concepts

### `useAuth` hook

Already provided at `src/hooks/useAuth.tsx`. Consume it in any component:

```typescript
const { isAuthenticated, isLoading, sdk, login, logout, error } = useAuth();
```

| Field | Type | Description |
|---|---|---|
| `isAuthenticated` | `boolean` | Whether the user has a valid token |
| `isLoading` | `boolean` | True during login or initialization |
| `sdk` | `UiPath` | The SDK instance — pass to service constructors |
| `login` | `() => Promise<void>` | Triggers the OAuth login flow |
| `logout` | `() => void` | Clears authentication state |
| `error` | `string \| null` | Auth error message, if any |

Token refresh is automatic inside the SDK. Tokens persist in `sessionStorage`.

### Service instantiation

Always use constructor-based DI. Never use the deprecated `sdk.entities.getAll()` dot-chain.

```typescript
import { useAuth } from './hooks/useAuth';
import { Assets } from '@uipath/uipath-typescript/assets';
import { useMemo } from 'react';

function MyComponent() {
  const { sdk } = useAuth();
  const assets = useMemo(() => new Assets(sdk), [sdk]);
  // ...
}
```

See [references/sdk/imports.md](references/sdk/imports.md) for the full subpath ↔ class mapping.

### Type-driven development

1. **Always import the response type** from the same subpath as the service class.
   ```typescript
   import type { AssetGetResponse } from '@uipath/uipath-typescript/assets';
   ```
2. **Import option types** for method parameters.
3. **Import enums** from the SDK for any field that uses an enum value (e.g. `TaskStatus`, `TaskPriority`).
4. **Use `OperationResponse<T>`** (from the package root) for mutation results.
5. **Reference files are the authoritative source.** Do not explore `node_modules` unless a reference file is silent on what you need.

### Data fetching rules

1. **Always paginate when the service supports it.** Pass `pageSize` and build pagination controls; never call `getAll()` without pagination for methods that support it.
2. **Show data as it arrives.** Use independent loading states per data source so each section renders as soon as its data is ready.
3. **Fetch in parallel.** Use `Promise.all()` or separate `useEffect` hooks — never serialize unrelated fetches.
4. **Most Orchestrator `getAll()` methods accept `folderId` as optional.** Make an initial unscoped fetch to discover folders, then scope after the user selects one. Never block the first data load on a folderId.

### Error handling

All SDK errors extend `UiPathError` (import from `@uipath/uipath-typescript/core`). Specific subtypes: `AuthenticationError`, `AuthorizationError`, `ValidationError`, `NotFoundError`, `RateLimitError`, `ServerError`, `NetworkError`.

```typescript
import { UiPathError, NotFoundError } from '@uipath/uipath-typescript/core';

try {
  const result = await service.getById(id, folderId);
} catch (err) {
  if (err instanceof NotFoundError) {
    // Resource not found
  } else if (err instanceof UiPathError) {
    console.error(err.message);
  }
}
```

## Anti-patterns

- **Do not import service classes from the package root** (`import { Entities } from '@uipath/uipath-typescript'` — wrong). Use subpath imports.
- **Do not use the deprecated `sdk.entities.getAll()` dot-chain.** Use `new Entities(sdk)`.
- **Do not guess response field names.** Import the response type and read its interface.
- **Do not call paginated methods without `pageSize`** in production UI code.
- **Do not mix `folderId` (number) with `folderKey` (string GUID).** They are not interchangeable. To bridge from a Maestro `folderKey` to an Orchestrator `folderId`, see [references/sdk/maestro.md](references/sdk/maestro.md) — never `parseInt(folderKey)`.
- **Do not hardcode resource IDs.** Fetch them from the SDK at runtime and let the user select from real data.
- **Do not reinstall dependencies or rewrite the scaffold.** Everything under `vite.config.ts`, `src/hooks/useAuth.tsx`, `.env`, and `uipath.json` is already correct.
