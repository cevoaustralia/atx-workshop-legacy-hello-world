# Contributing Guide

Welcome! This guide covers the architecture, conventions, and development workflow for this modernized React application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Component Patterns](#component-patterns)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Testing Strategy](#testing-strategy)
10. [Commit Conventions](#commit-conventions)

---

## Quick Start

```bash
# Install dependencies
npm ci

# Development server
npm start

# Development with MSW mocking
npm run start:mock

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Architecture Overview

This application uses a **modern React architecture** with:

- **React 18** with function components and hooks
- **TypeScript 5.9+** with strict mode enabled
- **TanStack Router** (v1) for file-based routing
- **TanStack Query** (v5) for server state management
- **Zustand** for client state with sessionStorage persistence
- **Valibot** for runtime validation and type inference
- **MSW** for API mocking in development
- **Vite** for fast builds and HMR

### Key Architectural Decisions

1. **Runtime Configuration** - Config injected via `window.CONFIG`, not build-time env vars
2. **Schema-Derived Types** - Types inferred from Valibot schemas, not hand-written
3. **Atomic Design** - Components organized by complexity (atom/molecule/organism/template)
4. **Wrapper Hook Pattern** - App-specific hooks wrap generated/library hooks
5. **Fail-Closed Patterns** - Feature flags and scenario lookups default to safe values

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── queries/           # TanStack Query wrapper hooks
│   │   ├── selectors/         # Data transformation functions
│   │   └── types.ts           # (deprecated - use lib/api/models)
│   ├── components/
│   │   ├── atom/              # Single-element components (Link)
│   │   ├── molecule/          # Multi-atom components (GreetingCard)
│   │   ├── organism/          # Complex components (Header)
│   │   └── templates/         # Page layouts (Layout)
│   ├── featureFlag/
│   │   └── featureFlagStore.ts
│   ├── routePaths/            # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx / index.lazy.tsx
│   │   ├── about.tsx / about.lazy.tsx
│   │   └── greetings.$id.tsx / greetings.$id.lazy.tsx
│   ├── routeTree/
│   │   └── routeTree.gen.ts   # Generated - do not edit
│   ├── scenarioTesting/       # MSW scenario infrastructure
│   └── stores/                # Zustand stores
├── lib/
│   ├── api/
│   │   ├── generated/         # Future Orval-generated code
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── models/            # Valibot schemas and types
│   │   └── mutator/
│   │       └── axiosClient.ts # Custom Axios instance
│   └── mock-service/
│       ├── browser.ts         # MSW browser worker
│       ├── handlers.ts        # MSW request handlers
│       └── fixtures/          # Mock data
├── main.tsx                   # Application entry point
├── microsite-config.ts        # Runtime config types
└── styles.css

public/
├── api/                       # Static JSON files (dev fallback)
├── config.development.js      # Runtime config - development
├── config.mock.js             # Runtime config - mocked mode
├── config.production.js       # Runtime config stub (replaced by deployment)
└── mockServiceWorker.js       # MSW service worker

docs/
└── typescript-api-conventions.md  # Detailed TypeScript/API guide

specs/
└── README.md                  # OpenAPI integration guide (future)
```

---

## Development Workflow

### Local Development

```bash
# Start dev server (uses public/api/*.json)
npm start

# Start with MSW mocking (uses handlers.ts)
npm run start:mock
```

In **mock mode**, MSW intercepts API calls and responds with fixtures. Use the `x-mock-scenario` header (via sessionStorage) to test different API states.

### Type Checking

```bash
# Type check only
npx tsc --noEmit

# Full build (type check + bundle)
npm run build
```

### Code Quality

We use **TypeScript strict mode** with additional checks:
- `noUnusedLocals` / `noUnusedParameters`
- `noImplicitReturns`
- `noUncheckedIndexedAccess`
- `noPropertyAccessFromIndexSignature`

All code must pass `tsc --noEmit` with zero errors.

---

## TypeScript Guidelines

See **[docs/typescript-api-conventions.md](./docs/typescript-api-conventions.md)** for comprehensive guidelines.

### Quick Rules

1. **No `any`** - Use `unknown` + narrowing or generics
2. **Derive types from schemas** - Use `v.InferOutput<typeof Schema>`
3. **Never edit generated files** - Fix the source and regenerate
4. **Use `@/` path alias** - `import { X } from '@/lib/api/models'`
5. **Explicit public signatures** - Don't rely on inference for exports

### Runtime Config

**Always** use `window.CONFIG`, **never** `import.meta.env` for app config:

```typescript
import { getConfig } from '@/microsite-config';

const config = getConfig();
const apiUrl = config.apiUrl;
```

---

## Component Patterns

### Atomic Design Structure

- **Atom** - Single element, no internal state (e.g., `Link`)
- **Molecule** - Combines atoms, may have local state (e.g., `GreetingCard`)
- **Organism** - Complex logic, connects to stores/queries (e.g., `Header`)
- **Template** - Page layout, defines structure (e.g., `Layout`)

### Component Example

```typescript
import type { Greeting } from '@/lib/api/models';

interface GreetingCardProps {
  greeting: Greeting;
  favourite?: boolean;
  onClick?: () => void;
}

export function GreetingCard({ greeting, favourite, onClick }: GreetingCardProps) {
  return (
    <div onClick={onClick}>
      <h3>{greeting.text}</h3>
      {favourite && <span>⭐</span>}
    </div>
  );
}
```

**Use function declarations** for exported components, not arrow functions - better for debugging.

---

## State Management

### Server State (TanStack Query)

```typescript
// src/app/api/queries/useGetGreetingsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { parseGreetingsList, type GreetingsList } from '@/lib/api/models';

export const greetingsQueryKeys = {
  all: ['greetings'] as const,
  lists: () => [...greetingsQueryKeys.all, 'list'] as const,
};

export function useGetGreetingsQuery() {
  return useQuery({
    queryKey: greetingsQueryKeys.lists(),
    queryFn: async () => {
      const data = await apiClient.get<unknown>('/greetings.json');
      return parseGreetingsList(data);
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

### Client State (Zustand)

```typescript
// src/app/stores/greetingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GreetingsState {
  favouriteGreetingId: number | null;
  setFavouriteGreetingId: (id: number | null) => void;
}

export const useGreetingsStore = create<GreetingsState>()(
  persist(
    (set) => ({
      favouriteGreetingId: null,
      setFavouriteGreetingId: (id) => set({ favouriteGreetingId: id }),
    }),
    {
      name: 'greetings-storage',
      storage: {
        getItem: (name) => JSON.parse(sessionStorage.getItem(name) || 'null'),
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

// Atomic selector
export const useFavouriteGreetingId = () => 
  useGreetingsStore((state) => state.favouriteGreetingId);
```

---

## API Integration

### 1. Define Valibot Schema

```typescript
// src/lib/api/models/greeting.models.ts
import * as v from 'valibot';

export const GreetingSchema = v.object({
  id: v.number(),
  language: v.string(),
  text: v.string(),
});

export type Greeting = v.InferOutput<typeof GreetingSchema>;

export function parseGreeting(data: unknown): Greeting {
  return v.parse(GreetingSchema, data);
}
```

### 2. Create Wrapper Hook

```typescript
// src/app/api/queries/useGetGreetingQuery.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { parseGreeting, type Greeting } from '@/lib/api/models';

export function useGetGreetingQuery(id: string) {
  return useQuery({
    queryKey: ['greeting', id],
    queryFn: async () => {
      const data = await apiClient.get<unknown>(`/greetings/${id}.json`);
      return parseGreeting(data);
    },
  });
}
```

### 3. Use in Component

```typescript
import { useGetGreetingQuery } from '@/app/api/queries';

function GreetingPage() {
  const { data, isLoading, error } = useGetGreetingQuery('1');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  
  return <div>{data?.text}</div>;
}
```

---

## Testing Strategy

### Unit Tests (Future)

- **Vitest** for fast unit tests
- Test selectors and pure functions
- Mock MSW for integration tests

### MSW Scenarios

Use `x-mock-scenario` header to test different API states:

```typescript
// In browser console or test setup
sessionStorage.setItem('mockScenario', 'greetings.state=empty');
```

Scenarios are defined in `src/app/scenarioTesting/scenarios/`.

---

## Commit Conventions

We use **Conventional Commits** with **PascalCase scopes**:

```
<type>(<scope>): <subject>

[optional body]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `docs` - Documentation only
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Scopes (PascalCase)

- `Api` - API layer changes
- `Components` - Component changes
- `Routes` - Routing changes
- `TypeScript` - Type system improvements
- `Config` - Configuration changes

### Examples

```
feat(Api): Add user authentication endpoint
refactor(Components): Migrate Button to atomic structure
docs(TypeScript): Add Valibot schema guidelines
fix(Routes): Handle missing greeting ID gracefully
```

**Never add AI-tool attribution or co-author trailers.**

---

## Questions?

- Check **[docs/typescript-api-conventions.md](./docs/typescript-api-conventions.md)** for TypeScript/API details
- Review existing code for patterns
- Ask in team chat for clarification

Happy coding! 🚀
