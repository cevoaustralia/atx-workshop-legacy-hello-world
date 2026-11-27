# Project Overview

A modern React 18 + TypeScript + Vite application demonstrating multilingual greetings.

## Tech Stack

- **React 18** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 4** - Build tool and dev server
- **TanStack Router 1.87** - Type-safe file-based routing
- **TanStack Query 5.62** - Server state management
- **Zustand 5** - Client state with sessionStorage persistence
- **Valibot 0.42** - Schema validation for search params
- **MSW 2.15** - API mocking for development and testing
- **Axios 0.27** - HTTP client

## Architecture

### Routing
- **File-based routing** with TanStack Router in `src/app/routePaths/`
- Routes auto-generate type-safe navigation
- Search params validated with Valibot schemas

### State Management
- **Server state**: TanStack Query wrapper hooks
- **Client state**: Zustand stores with atomic selectors and sessionStorage persistence
- **URL state**: TanStack Router search params

### Component Structure
Atomic Design pattern in `src/app/components/`:
- `atom/` - Single-element wrappers (Link)
- `molecule/` - Multi-atom components (GreetingCard)
- `organism/` - Complex sections with logic (Header)
- `templates/` - Page layouts (Layout)

Feature pages live in `src/app/pages/` (not in components).

### API Layer
- Wrapper hooks in `src/app/api/queries/` and `src/app/api/mutations/`
- Data selectors in `src/app/api/selectors/`
- Type definitions in `src/app/api/types.ts`

### Mocking
- MSW handlers in `src/lib/mock-service/`
- Fixtures in `src/lib/mock-service/fixtures/`
- Scenario-based testing with `x-mock-scenario` header

### Feature Flags
- Zustand-based feature flag system in `src/app/featureFlag/`
- Environment-aware defaults (demo/dev/prod)
- Fail-closed behavior (missing flags default to false)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── queries/           # TanStack Query wrapper hooks
│   │   ├── mutations/         # Mutation wrapper hooks
│   │   ├── selectors/         # Data transform functions
│   │   └── types.ts           # API type definitions
│   ├── components/
│   │   ├── atom/              # Single-element components
│   │   ├── molecule/          # Multi-atom components
│   │   ├── organism/          # Complex components with logic
│   │   ├── templates/         # Page layout components
│   │   └── README.md          # Atomic design guide
│   ├── featureFlag/
│   │   └── featureFlagStore.ts
│   ├── pages/                 # Feature pages (not components)
│   ├── routePaths/            # TanStack Router file-based routes
│   ├── routeTree/
│   │   └── routeTree.gen.ts   # Auto-generated route tree
│   └── stores/                # Zustand stores
├── lib/
│   └── mock-service/
│       ├── browser.ts         # MSW worker setup
│       ├── handlers.ts        # Request handlers
│       └── fixtures/          # Mock data
├── main.tsx                   # Application entry point
└── styles.css                 # Global styles
```

## Available Scripts

```bash
# Development server
npm start

# Development with MSW mocking
npm run start:mock

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Workflow

1. **Routes**: Create in `src/app/routePaths/` with `.tsx` config + `.lazy.tsx` component
2. **Components**: Place at correct atomic level, reuse existing atoms/molecules
3. **API calls**: Create wrapper hooks in `src/app/api/queries/`
4. **State**: Use Zustand for client state, TanStack Query for server state
5. **Mocking**: Add fixtures and handlers in `src/lib/mock-service/`
6. **Feature flags**: Gate new features in `src/app/featureFlag/featureFlagStore.ts`

## Key Conventions

- **Path alias**: `@/` → `src/`
- **Never hand-edit**: `routeTree.gen.ts` (auto-generated)
- **Atomic selectors**: Export granular Zustand selectors, not raw store access
- **Wrapper hooks**: Always use wrappers, never generated/raw API hooks
- **sessionStorage**: Zustand persistence uses sessionStorage (not localStorage)
- **Fail closed**: Feature flags default to `false` for safety

## Documentation

Detailed guides in `docs/`:
- [TanStack Router](docs/tanstack-router.md) - File-based routing and navigation
- [TanStack Query](docs/tanstack-query.md) - Data fetching and wrapper hooks
- [Zustand State Management](docs/zustand-state-management.md) - Client state patterns
- [Feature Flagging](docs/feature-flagging.md) - Feature flag usage
- [Test Scenario Overrides](docs/test-scenario-overrides.md) - MSW mocking and scenarios

## Component Guide

See [src/app/components/README.md](src/app/components/README.md) for atomic design placement rules.
