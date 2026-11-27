# Hello World - Modernized React SPA

A modern React 18 + TypeScript + Vite application that says hello in six languages.

**Status**: Successfully modernized with TanStack Router, TanStack Query, Zustand, atomic-design components, MSW mocking, and feature flags.

## Tech Stack

- **React 18.2** with modern patterns (function components, hooks)
- **TypeScript 5.7** with strict mode
- **Vite 4.5** for build and dev server
- **TanStack Router 1.87** - Type-safe file-based routing
- **TanStack Query 5.62** - Server state management with wrapper hooks
- **Zustand 5** - Client state with atomic selectors and sessionStorage persistence
- **Valibot 0.42** - Search param validation
- **MSW 2.15** - API mocking for development and testing

## Quick Start

```sh
npm ci
npm start              # Development server at http://localhost:3000
npm run start:mock     # Development with MSW mocking
npm run build          # Production build
npm run preview        # Preview production build
```

## Application Features

- **`/`** - Lists greetings, filters by language (`?lang=<code>`), "Say hello" counter in header
- **`/greetings/:id`** - View greeting detail and mark as favourite
- **`/about`** - Static about page
- Type-safe routing with TanStack Router
- State persists in sessionStorage (favourites, hello count)

## Architecture

### Modern React Patterns

✅ **File-based routing** with TanStack Router
✅ **Atomic-design components** (atom/molecule/organism/templates)
✅ **Wrapper hooks pattern** for API calls
✅ **Atomic Zustand selectors** for granular state subscriptions
✅ **sessionStorage persistence** for client state
✅ **Valibot schema validation** for search params
✅ **MSW mocking** with scenario support
✅ **Feature flags** with environment-aware defaults

### Project Structure

```
src/
├── app/
│   ├── api/              # TanStack Query hooks and selectors
│   ├── components/       # Atomic-design structure
│   ├── featureFlag/      # Feature flag system
│   ├── routePaths/       # File-based routes
│   └── stores/           # Zustand stores
├── lib/mock-service/     # MSW handlers and fixtures
└── main.tsx              # App entry with providers
```

## Documentation

Comprehensive guides in [`docs/`](docs/):

- [Project Overview](docs/project-overview.md) - Architecture and conventions
- [TanStack Router](docs/tanstack-router.md) - File-based routing guide
- [TanStack Query](docs/tanstack-query.md) - Data fetching patterns
- [Zustand State Management](docs/zustand-state-management.md) - Client state guide
- [Feature Flagging](docs/feature-flagging.md) - Feature flag usage
- [Test Scenario Overrides](docs/test-scenario-overrides.md) - MSW mocking guide
- [Component Structure](src/app/components/README.md) - Atomic design placement

## Development

### Adding a Route

1. Create config: `src/app/routePaths/my-route.tsx`
2. Create lazy component: `src/app/routePaths/my-route.lazy.tsx`
3. Route tree regenerates automatically

### Adding a Component

Place at the correct atomic level:
- `atom/` - Single-element wrappers
- `molecule/` - Multi-atom components
- `organism/` - Complex sections with logic
- `templates/` - Page layouts

### Adding an API Call

1. Create wrapper hook in `src/app/api/queries/`
2. Add selectors in `src/app/api/selectors/`
3. Use in components via wrapper hooks

### Mocking APIs

Run `npm run start:mock` to use MSW mocks. Add handlers in `src/lib/mock-service/handlers.ts` and fixtures in `fixtures/`.

## Modernization Summary

| Area | Before | After |
|------|--------|-------|
| Routing | React Router v5 | TanStack Router file-based |
| Search params | Manual URLSearchParams | Valibot schema validation |
| Components | Class components | Function components with hooks |
| Component layout | Flat folders | Atomic-design structure |
| React root | `ReactDOM.render` | `createRoot` |
| State | Redux with connect/mapStateToProps | Zustand with atomic selectors |
| Data fetching | Manual axios in useEffect | TanStack Query wrapper hooks |
| TypeScript | `strict: false`, `any` everywhere | `strict: true`, proper types |
| Mocking | None | MSW with scenario support |

## Key Conventions

- **Path alias**: `@/` → `src/`
- **Never hand-edit**: `routeTree.gen.ts`
- **Atomic selectors**: Export granular Zustand selectors
- **Wrapper hooks**: Always use wrappers, not raw API calls
- **sessionStorage**: Client state persists per-session only
- **Fail closed**: Feature flags default to false

## Legacy History

This app was deliberately outdated (React Router v5, Redux, class components) for testing React modernization tools. It has been successfully modernized to current best practices.

The "API" is a static file at `public/api/greetings.json` - no backend needed.
