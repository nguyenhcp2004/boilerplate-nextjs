# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest test suite

## Architecture

### Tech Stack
- **Next.js 16** (App Router, React 19) with the **root-level `app/` directory** as the sole router
- **Feature-Sliced Design (FSD)** layers in `src/`: `app` → `screens` → `features` → `entities` → `shared`
- **next-intl v4** for internationalization with `[locale]` routing (`vi` default, `en`)
- **shadcn/ui** (New York style) primitives in `src/shared/ui/`
- **TanStack Query v5** (queryOptions pattern); **Better Auth** cookie sessions (no client-side auth store)
- **react-hook-form + Zod** for form validation
- **Tailwind CSS v4** for styling; **sonner** for toasts; **next-themes** for theming

### App Directory Split (critical)

Next.js prioritizes `./app` over `./src/app` when both exist. This project uses:

- **`app/` (root)** — all route files: `app/[locale]/page.tsx`, `app/[locale]/login/page.tsx`, etc. Route components stay thin: import a screen from `src/screens/<name>` and render it.
- **`src/app/`** — non-route modules only: `providers.tsx` (QueryClientProvider, ThemeProvider, Toaster) and `styles/globals.css`. Never put `page.tsx`/`layout.tsx` here; Next.js will silently ignore them.

### Feature-Sliced Design Layers

- `src/screens/<name>/` - Route-level compositions (one per app route); renders features
- `src/features/<name>/` - Business features: `ui/`, `model/` (hooks), `api/`, `i18n/`
- `src/entities/<name>/` - Domain entities: `model/` (types, Zustand store), `api/` (HTTP + query keys)
- `src/shared/` - Framework-agnostic kit: `ui/`, `lib/` (http, env, utils), `config/`, `constants/`, `types/`, `segments/` (shared i18n)
- `src/widgets/` - Large composite widgets (empty, reserved)

Import rule: a layer may only import from layers below it (`app → screens → widgets → features → entities → shared`). Never import upward or sideways.

### Internationalization (i18n)

Locales: Vietnamese (`vi`, default) and English (`en`). Routing config: `src/shared/config/i18n/routing.ts`; locale-aware navigation (`Link`, `redirect`, `useRouter`): `src/shared/config/i18n/navigation.ts`.

Locale JSON files live next to their feature (FSD):
- `src/shared/segments/common/{locale}.json` - Shared translations
- `src/features/<name>/i18n/{locale}.json` - Feature-specific translations

Adding translations for a new feature:
1. Create `{vi,en}.json` under `src/features/<name>/i18n/`
2. Register the segment in `src/shared/config/i18n/request.ts` (the config `src/i18n/request.ts` re-exports)

Locale-prefixed routes (e.g. `/vi/login`, `/en/login`) are handled by the next-intl proxy in the root `proxy.ts` (also does the optimistic session check).

### HTTP Client

`src/shared/lib/http/http.ts` provides a typed HTTP client for application routes (`/api/v1/*` on the NestJS backend):
- Cookie-based auth (`credentials: 'include'`) — no token handling
- Support for JSON and FormData bodies
- Custom error classes (`HttpError`, `EntityError` for 422)
- Configurable `baseUrl` per request (defaults to `env.NEXT_PUBLIC_API_ENDPOINT`)

Environment variables are validated at runtime via `@t3-oss/env-nextjs` in `src/shared/lib/env/env.ts`.

### Auth Flow (Better Auth)

Authentication lives on the NestJS backend (`boilerplate-nestjs`): Better Auth handler at `/api/auth/*`, HttpOnly cookie sessions (`better-auth.session_token`) in Redis. The frontend never touches the token.

- Client: `entities/user/api/auth-client.ts` (`authClient` — createAuthClient from `better-auth/react`, additional fields `username`/`bio` hand-declared to mirror the backend config; update both sides when fields change)
- Login: `features/auth/model/use-login.ts` — `authClient.signIn.email`; Better Auth error codes map to i18n keys, unknown codes fall back to `Auth.loginFailed`
- Session state: `authClient.useSession()` (reactive nanostores) — no Zustand store
- Guard hooks: `features/auth/model/use-auth.ts` (`useAuth().requireAuth`, `logout`)
- Profile updates: `authClient.updateUser` / `authClient.changePassword` (`features/auth/api/`)
- Route protection: root `proxy.ts` — `getSessionCookie` optimistic check (signed-in users are redirected away from login); real checks stay server-side per-route
- Application user routes: `entities/user/api/index.ts` (`/api/v1/users/*`, cookie-authed)
- Route constants: `src/shared/config/routes.ts` (`ROUTES` object)

Env: `NEXT_PUBLIC_API_ENDPOINT` (backend origin), `BETTER_AUTH_SECRET` (must match the backend's; used only by the proxy for cookie verification).

### Git Workflow

Husky for git hooks; Commitlint for conventional commits.

**Commit format:** `<type>(<scope>): <subject>`

Allowed types: `feat`, `fix`, `improve`, `refactor`, `docs`, `chore`, `style`, `test`, `revert`, `ci`, `build`

- `pre-commit` - Runs `npm run lint`
- `commit-msg` - Validates commit message format
- `pre-push` - Blocks direct pushes to `main` and `develop` branches

### TypeScript Path Aliases

Explicit layer aliases configured in `tsconfig.json` (also mirrored in `jest.config.ts`):
- `@/app/*`, `@/screens/*`, `@/widgets/*`, `@/features/*`, `@/entities/*`, `@/shared/*`

Note: the generic `@/*` alias does not exist - always use the layer-specific alias.
