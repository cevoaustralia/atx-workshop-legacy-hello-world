# Hello World - Modernized React SPA

A modern React 18 + TypeScript + Vite application that says hello in six languages.

**Status**: Successfully modernized with TanStack Router, TanStack Query, Zustand, Valibot schemas, runtime configuration, and comprehensive type safety.

## Tech Stack

- **React 18.2** with modern patterns (function components, hooks)
- **TypeScript 5.9+** with strictest mode enabled
- **Vite 4.5** for build and dev server
- **TanStack Router 1.170** - Type-safe file-based routing
- **TanStack Query 5.108** - Server state management with wrapper hooks
- **Zustand 5.1** - Client state with atomic selectors and sessionStorage persistence
- **Valibot 0.42** - Runtime validation and type inference
- **MSW 2.15** - API mocking for development and testing
- **Axios 0.27** - Custom HTTP client with typed mutator

## Quick Start

```bash
npm ci
npm start              # Development server at http://localhost:5173
npm run start:mock     # Development with MSW mocking
npm run build          # Production build (type check + bundle)
npm run preview        # Preview production build

# Testing
npm test               # Run unit & integration tests (Vitest)
npm run test:watch     # Run tests in watch mode
npm run playwright:run:smoke  # Run E2E smoke tests (Playwright)
npm run smoke:check-coverage  # Check route coverage
```

## Application Features

- **`/`** - Lists greetings, filters by language (`?lang=<code>`), "Say hello" counter in header
- **`/greetings/:id`** - View greeting detail and mark as favourite
- **`/about`** - Static about page
- Type-safe routing with TanStack Router
- State persists in sessionStorage (favourites, hello count)
- Runtime configuration via `window.CONFIG`

## Architecture Highlights

### TypeScript & Type Safety

✅ **Schema-derived types** - Types inferred from Valibot schemas, not hand-written  
✅ **Runtime config** - `window.CONFIG` instead of build-time environment variables  
✅ **Strictest TypeScript** - `strict: true` + `noUncheckedIndexedAccess` and more  
✅ **Custom Axios mutator** - Typed HTTP client with mock scenario support  
✅ **Orval-ready** - Infrastructure prepared for OpenAPI code generation  
✅ **Zero `any`** - All code passes strict type checking  

### Modern React Patterns

✅ **File-based routing** with TanStack Router  
✅ **Atomic-design components** (atom/molecule/organism/templates)  
✅ **Wrapper hooks pattern** for API calls with derived types  
✅ **Atomic Zustand selectors** for granular state subscriptions  
✅ **sessionStorage persistence** for client state  
✅ **Valibot validation** for search params and API responses  
✅ **MSW mocking** with scenario support via `x-mock-scenario` header  
✅ **Feature flags** with environment-aware defaults and fail-closed lookups  

### Test Coverage

✅ **64 unit/integration tests** (Vitest + @testing-library/react)  
✅ **14 E2E smoke tests** (Playwright)  
✅ **100% route coverage** (3/3 routes)  
✅ **Fixture-first testing** - Reusable test data builders  
✅ **MSW mocking** for deterministic API responses  
✅ **Coverage tracking** - Automated smoke route coverage checks  

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── queries/           # TanStack Query wrapper hooks
│   │   ├── selectors/         # Data transformation functions
│   │   └── types.ts           # (deprecated - use lib/api/models)
│   ├── components/            # Atomic-design structure
│   │   ├── atom/              # Single elements (Link)
│   │   ├── molecule/          # Multi-atom (GreetingCard)
│   │   ├── organism/          # Complex logic (Header)
│   │   └── templates/         # Layouts (Layout)
│   ├── featureFlag/           # Feature flag system
│   ├── routePaths/            # File-based routes
│   ├── scenarioTesting/       # MSW scenario infrastructure
│   └── stores/                # Zustand stores
├── lib/
│   ├── api/
│   │   ├── generated/         # Future Orval-generated code
│   │   ├── models/            # Valibot schemas (source of truth)
│   │   └── mutator/           # Custom Axios client
│   ├── mock-service/          # MSW handlers and fixtures
│   └── testing/               # Test infrastructure
│       ├── fixtures/          # Test data builders
│       ├── mswServer.ts       # MSW server for tests
│       └── setup.ts           # Vitest setup
├── main.tsx                   # App entry with providers
├── microsite-config.ts        # Runtime config types
└── styles.css

e2e/
└── smoke/                     # Playwright smoke tests (E2E)
    ├── about/                 # About page tests
    ├── greetings/             # Greeting detail tests
    ├── home/                  # Home page tests
    └── utils/                 # Test utilities & coverage tracking

public/
├── api/                       # Static JSON (dev fallback)
├── config.development.js      # Runtime config - development
├── config.mock.js             # Runtime config - mocked mode
└── config.production.js       # Runtime config stub
```

## Documentation

Comprehensive guides:

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Architecture, patterns, and workflow
- **[docs/test-automation.md](docs/test-automation.md)** - Testing infrastructure (Vitest, Playwright, MSW)
- **[docs/typescript-api-conventions.md](docs/typescript-api-conventions.md)** - TypeScript & API layer guide
- [docs/project-overview.md](docs/project-overview.md) - Architecture overview
- [docs/tanstack-router.md](docs/tanstack-router.md) - File-based routing
- [docs/tanstack-query.md](docs/tanstack-query.md) - Data fetching patterns
- [docs/zustand-state-management.md](docs/zustand-state-management.md) - Client state
- [docs/feature-flagging.md](docs/feature-flagging.md) - Feature flags
- [docs/test-scenario-overrides.md](docs/test-scenario-overrides.md) - MSW mocking
- [docs/mock-personas.md](docs/mock-personas.md) - Mock data reference
- [src/app/components/README.md](src/app/components/README.md) - Component structure

## Development Guide

### Runtime Configuration

Configuration is **injected at runtime** via `window.CONFIG`, not build-time environment variables. This allows the same build artifact to work in multiple environments.

```typescript
import { getConfig } from '@/microsite-config';

const config = getConfig();
const apiUrl = config.apiUrl;
```

Config files: `public/config.{development|mock|production}.js`

### Type Safety Rules

1. **No `any`** - Use `unknown` + narrowing or generics
2. **Derive types from Valibot schemas** - Use `v.InferOutput<typeof Schema>`
3. **Never edit generated files** - Fix the source and regenerate
4. **Use `@/` path alias** - `import { X } from '@/lib/api/models'`
5. **Explicit public signatures** - Don't rely on inference for exports

### Adding an API Endpoint

1. **Define Valibot schema** in `src/lib/api/models/`
2. **Create wrapper hook** in `src/app/api/queries/`
3. **Add selectors** (if needed) in `src/app/api/selectors/`
4. **Add MSW handler** (for mocking) in `src/lib/mock-service/handlers.ts`

Example:

```typescript
// 1. Schema (lib/api/models/greeting.models.ts)
import * as v from 'valibot';

export const GreetingSchema = v.object({
  id: v.number(),
  text: v.string(),
});

export type Greeting = v.InferOutput<typeof GreetingSchema>;

export function parseGreeting(data: unknown): Greeting {
  return v.parse(GreetingSchema, data);
}

// 2. Wrapper hook (app/api/queries/useGetGreetingQuery.ts)
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { parseGreeting } from '@/lib/api/models';

export function useGetGreetingQuery(id: string) {
  return useQuery({
    queryKey: ['greeting', id],
    queryFn: async () => {
      const data = await apiClient.get<unknown>(`/greetings/${id}`);
      return parseGreeting(data);
    },
  });
}

// 3. Use in component
const { data, isLoading } = useGetGreetingQuery('1');
```

### Adding a Route

1. Create config: `src/app/routePaths/my-route.tsx`
2. Create lazy component: `src/app/routePaths/my-route.lazy.tsx`
3. Route tree regenerates automatically on save

### Adding a Component

Place at the correct atomic level:
- **`atom/`** - Single-element wrappers (Link, Button)
- **`molecule/`** - Multi-atom components (GreetingCard, SearchForm)
- **`organism/`** - Complex sections with logic (Header, Sidebar)
- **`templates/`** - Page layouts (Layout, ErrorBoundary)

### Mocking APIs with MSW

```bash
npm run start:mock
```

Add handlers in `src/lib/mock-service/handlers.ts`. Use `x-mock-scenario` header (via sessionStorage) to test different API states:

```typescript
// In browser console
sessionStorage.setItem('mockScenario', 'greetings.state=empty');
```

## Modernization Summary

| Area | Before | After |
|------|--------|-------|
| **Routing** | React Router v5 | TanStack Router file-based |
| **Search params** | Manual URLSearchParams | Valibot schema validation |
| **Components** | Class components | Function components with hooks |
| **Component layout** | Flat folders | Atomic-design structure |
| **React root** | `ReactDOM.render` | `createRoot` |
| **State** | Redux with connect/mapStateToProps | Zustand with atomic selectors |
| **Data fetching** | Manual axios in useEffect | TanStack Query wrapper hooks |
| **TypeScript** | `strict: false`, `any` everywhere | Strictest mode, zero `any` |
| **Configuration** | Build-time `import.meta.env` | Runtime `window.CONFIG` |
| **Type definitions** | Hand-written interfaces | Valibot schema-derived |
| **API client** | Raw axios | Custom mutator with typed helpers |
| **Mocking** | None | MSW with scenario support |

## Key Conventions

- **Path alias**: `@/` → `src/`
- **Never hand-edit**: `routeTree.gen.ts`, generated API files
- **Atomic selectors**: Export granular Zustand selectors
- **Wrapper hooks**: Always use wrappers, derive types from schemas
- **sessionStorage**: Client state persists per-session only
- **Fail closed**: Feature flags default to false
- **Runtime config**: Use `window.CONFIG`, not `import.meta.env`

## Future: Orval Integration

The API layer is **ready for Orval** - automated TypeScript, React Query hooks, and MSW handler generation from OpenAPI specs.

When OpenAPI contracts are available:
1. Install `orval` and configure `orval.config.ts`
2. Run `npx orval` to generate types and hooks
3. Generated code appears in `src/lib/api/generated/`

The custom Axios mutator and wrapper hook pattern already follow the Orval conventions.

See: [docs/typescript-api-conventions.md](docs/typescript-api-conventions.md)

## Commit Conventions

**Conventional Commits** with **PascalCase scopes**:

```
feat(Api): Add user authentication endpoint
refactor(Components): Migrate Button to atomic structure
docs(TypeScript): Add Valibot schema guidelines
```

Never add AI-tool attribution.

## Legacy History

This app was deliberately outdated (React Router v5, Redux, class components, `strict: false`) for testing React modernization tools. It has been successfully modernized to current best practices with comprehensive type safety.

The "API" is a static file at `public/api/greetings.json` - no backend needed.

---

**Happy coding!** 🚀 Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
