# TypeScript and API Layer Conventions

This document describes the TypeScript architecture, API layer structure, and type safety conventions for this React application.

## Table of Contents

1. [Runtime Configuration](#runtime-configuration)
2. [API Type Architecture](#api-type-architecture)
3. [Valibot Schemas](#valibot-schemas)
4. [Custom Axios Client](#custom-axios-client)
5. [Query Hooks Pattern](#query-hooks-pattern)
6. [Type Safety Rules](#type-safety-rules)
7. [Future: Orval Integration](#future-orval-integration)

---

## Runtime Configuration

### Why Runtime Config, Not Build-Time Env

This application uses **runtime configuration** via `window.CONFIG` instead of build-time environment variables (`import.meta.env`). This allows the same build artifact to be deployed to multiple environments.

### Configuration Files

Configuration is loaded from `public/config.{MODE}.js` based on the Vite mode:

- `config.development.js` - Development mode
- `config.mock.js` - Mocked API mode
- `config.production.js` - Production (stub, replaced by deployment)

### Type Definition

```typescript
// src/microsite-config.ts
interface MicrositeConfig {
  apiUrl: string;
  environment: 'development' | 'mocked' | 'production';
  features?: {
    enableMockScenarios?: boolean;
    enableDevTools?: boolean;
  };
}
```

### Usage

```typescript
import { getConfig } from '@/microsite-config';

const config = getConfig();
const apiUrl = config.apiUrl;
const isDev = config.environment === 'development';
```

**Never use** `import.meta.env` for application configuration - only for Vite-specific settings.

---

## API Type Architecture

### Source of Truth: Valibot Schemas

Types are **derived from Valibot schemas**, not hand-written. This ensures:
- Runtime validation matches compile-time types
- Single source of truth
- No type/schema drift

### Schema Location

```
src/lib/api/models/
  └── greeting.models.ts   # Schemas and derived types
```

### Example

```typescript
import * as v from 'valibot';

// Define schema
export const GreetingSchema = v.object({
  id: v.number(),
  language: v.string(),
  languageName: v.string(),
  text: v.string(),
  note: v.string(),
});

// Derive type from schema
export type Greeting = v.InferOutput<typeof GreetingSchema>;

// Validation function
export function parseGreeting(data: unknown): Greeting {
  return v.parse(GreetingSchema, data);
}
```

---

## Valibot Schemas

### Why Valibot?

- **Type-first** validation library
- Lightweight and tree-shakeable
- Excellent TypeScript integration with `v.InferOutput<T>`
- Composable schemas

### Schema Patterns

#### Basic Model Schema

```typescript
export const UserSchema = v.object({
  id: v.number(),
  email: v.string(),
  name: v.optional(v.string()),
});

export type User = v.InferOutput<typeof UserSchema>;
```

#### Array Schema

```typescript
export const UsersListSchema = v.array(UserSchema);
export type UsersList = v.InferOutput<typeof UsersListSchema>;
```

#### Validation Functions

```typescript
export function parseUser(data: unknown): User {
  return v.parse(UserSchema, data);
}

export function parseUsersList(data: unknown): UsersList {
  return v.parse(UsersListSchema, data);
}
```

#### Search Param Validation

For route search parameters, use Valibot in `validateSearch`:

```typescript
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

const searchSchema = v.object({
  language: v.optional(v.string(), 'all'),
  page: v.optional(v.number(), 1),
});

export const Route = createFileRoute('/')({
  validateSearch: (search) => v.parse(searchSchema, search),
});
```

---

## Custom Axios Client

### Location

```
src/lib/api/mutator/axiosClient.ts
```

### Features

- **Runtime config integration** - Base URL from `window.CONFIG`
- **Mock scenario support** - `x-mock-scenario` header from sessionStorage
- **Type-safe helpers** - Typed `apiClient.get<T>()`, etc.
- **Orval-ready** - Follows the custom mutator pattern

### Usage

```typescript
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { parseGreeting, type Greeting } from '@/lib/api/models/greeting.models';

async function fetchGreeting(id: string): Promise<Greeting> {
  const data = await apiClient.get<unknown>(`/greetings/${id}.json`);
  return parseGreeting(data);
}
```

### Type Safety Pattern

1. Fetch as `unknown`
2. Validate with Valibot schema
3. Return typed result

This ensures runtime data matches compile-time expectations.

---

## Query Hooks Pattern

### Wrapper Hooks

Wrapper hooks re-export TanStack Query with app-specific defaults:

```typescript
// src/app/api/queries/useGetGreetingsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { parseGreetingsList, type GreetingsList } from '@/lib/api/models/greeting.models';

// Query key factory
export const greetingsQueryKeys = {
  all: ['greetings'] as const,
  lists: () => [...greetingsQueryKeys.all, 'list'] as const,
};

// Fetch function
const fetchGreetings = async (): Promise<GreetingsList> => {
  const data = await apiClient.get<unknown>('/greetings.json');
  return parseGreetingsList(data);
};

// Hook
export function useGetGreetingsQuery() {
  return useQuery({
    queryKey: greetingsQueryKeys.lists(),
    queryFn: fetchGreetings,
    staleTime: 1000 * 60 * 5,
  });
}
```

### Selectors

Selectors transform API responses into derived data:

```typescript
// src/app/api/selectors/greetingSelectors.ts
import type { Greeting, GreetingsList } from '@/lib/api/models/greeting.models';

export function selectGreetingById(
  greetings: GreetingsList,
  id: string
): Greeting | undefined {
  return greetings.find((g) => String(g.id) === id);
}
```

**Keep selector return types derived** - don't restate shapes manually.

---

## Type Safety Rules

### 1. No `any`

**Prefer:**
- `unknown` + narrowing
- Generics
- Discriminated unions
- `satisfies` operator

**Avoid:**
- `any`
- `as` casts (unless unavoidable with clear justification)
- `@ts-expect-error` without explanation

### 2. Derive, Don't Duplicate

**Good:**
```typescript
export type Greeting = v.InferOutput<typeof GreetingSchema>;
export type GreetingId = Greeting['id'];
```

**Bad:**
```typescript
export interface Greeting {
  id: number;
  // ... duplicated shape that can drift
}
```

### 3. Explicit Public Signatures

Keep public function/hook signatures explicit:

```typescript
// Good
export function selectGreetingById(
  greetings: GreetingsList,
  id: string
): Greeting | undefined {
  // ...
}

// Avoid implicit returns in public APIs
export const selectGreetingById = (greetings, id) => 
  greetings.find((g) => String(g.id) === id);
```

### 4. Readonly Where Appropriate

Use `readonly` for data that shouldn't be mutated:

```typescript
interface Props {
  readonly items: readonly Greeting[];
}
```

### 5. Path Alias

Use `@/` for all absolute imports:

```typescript
import { getConfig } from '@/microsite-config';
import { Greeting } from '@/lib/api/models/greeting.models';
```

---

## Future: Orval Integration

### What is Orval?

[Orval](https://orval.dev/) generates TypeScript types, React Query hooks, and MSW handlers from OpenAPI specifications.

### Planned Structure

```
src/lib/api/generated/
  ├── models/
  │   ├── greeting.ts        # Generated from OpenAPI schemas
  │   └── ...
  └── services/
      └── greetings/
          ├── greetings.ts   # Generated React Query hooks
          └── greetings.msw.ts  # Generated MSW handlers
```

### Generation Command

```bash
npx projen gen:api
```

### Integration Points

The current architecture is **Orval-ready**:

1. **Custom mutator** - `axiosClient.ts` follows Orval's mutator pattern
2. **Wrapper hooks** - App-specific wrappers re-export generated hooks
3. **Selectors** - Transform generated model types
4. **Mock handlers** - Will be replaced/extended by generated MSW handlers

### Migration Path

When OpenAPI contracts are available:

1. Add contracts package as dependency
2. Configure Orval in `.projenrc.ts` or `orval.config.ts`
3. Run `npx projen gen:api`
4. Replace manual API models with generated ones
5. Update wrapper hooks to use generated hooks
6. Keep selectors using derived types

### Generated Files

**DO NOT edit generated files** - they are overwritten on each generation.

To change types:
1. Update the OpenAPI contract
2. Regenerate with `npx projen gen:api`

---

## Validation Workflow

### Type Check

```bash
npx tsc --noEmit
```

### Lint

```bash
npx projen eslint
```

### Build

```bash
npm run build
# Runs: tsc --noEmit && vite build
```

### Test (when tests exist)

```bash
npx projen test
# Or: npx vitest run
```

---

## Troubleshooting

### "Property 'CONFIG' does not exist on type 'Window'"

Make sure `src/microsite-config.ts` is imported, which extends the `Window` interface:

```typescript
declare global {
  interface Window {
    CONFIG: MicrositeConfig;
  }
}
```

### Type Drift Between Schema and Usage

Always derive types from schemas:

```typescript
// Correct
export type Greeting = v.InferOutput<typeof GreetingSchema>;

// Wrong - can drift from schema
export interface Greeting {
  id: number;
  // ...
}
```

### Axios Type Errors

Use the typed `apiClient` helpers instead of raw `axios`:

```typescript
// Good
const data = await apiClient.get<unknown>('/endpoint');

// Avoid
const { data } = await axios.get('/endpoint');
```

---

## References

- [Valibot Documentation](https://valibot.dev/)
- [TanStack Query](https://tanstack.com/query)
- [Orval](https://orval.dev/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
