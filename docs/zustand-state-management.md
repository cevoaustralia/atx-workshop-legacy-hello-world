# Zustand State Management

This application uses **Zustand v5** for client/session state management with sessionStorage persistence.

## Store Structure

Stores live in `src/app/stores/` and use:
- **sessionStorage** for persistence (not localStorage)
- **Atomic selectors** for granular subscriptions

### Example: Greetings Store

**src/app/stores/greetingsStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GreetingsState {
  helloCount: number;
  favouriteGreetingId: number | null;
  incrementHelloCount: () => void;
  setFavouriteGreetingId: (id: number | null) => void;
}

export const useGreetingsStore = create<GreetingsState>()(
  persist(
    (set) => ({
      helloCount: 0,
      favouriteGreetingId: null,
      incrementHelloCount: () => 
        set((state) => ({ helloCount: state.helloCount + 1 })),
      setFavouriteGreetingId: (id) => 
        set({ favouriteGreetingId: id }),
    }),
    {
      name: 'greetings-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

// Atomic selectors
export const useHelloCount = () => 
  useGreetingsStore((state) => state.helloCount);
export const useFavouriteGreetingId = () => 
  useGreetingsStore((state) => state.favouriteGreetingId);
export const useIncrementHelloCount = () => 
  useGreetingsStore((state) => state.incrementHelloCount);
export const useSetFavouriteGreetingId = () => 
  useGreetingsStore((state) => state.setFavouriteGreetingId);
```

## Atomic Selectors

**Always export atomic selectors** for each state slice:

```typescript
// ✅ Good - atomic selector (only re-renders when helloCount changes)
const helloCount = useHelloCount();

// ❌ Bad - subscribes to entire store (re-renders on any state change)
const helloCount = useGreetingsStore((state) => state.helloCount);
```

Benefits:
- **Performance** - Components only re-render when their specific data changes
- **Consistency** - Single source of truth for selectors
- **Discoverability** - Easy to find all state accessors

## State Placement Guidelines

Choose the right state management approach:

| State Type | Solution |
|------------|----------|
| Server data (API responses) | TanStack Query |
| Selected domain entity + permissions | Zustand store |
| Ephemeral form state | `useState` / `useReducer` |
| Configuration / theme | React Context |
| URL state | TanStack Router search params |

## sessionStorage vs localStorage

This app uses **sessionStorage** for all Zustand persistence:
- State persists within a browser tab/window
- Cleared when tab/window closes
- Appropriate for session-scoped data (favourites, temporary preferences)

Use localStorage only if data truly needs to persist across sessions.

## Testing with Zustand

Reset stores between tests:

```typescript
import { useGreetingsStore } from '@/app/stores/greetingsStore';

afterEach(() => {
  useGreetingsStore.setState({
    helloCount: 0,
    favouriteGreetingId: null,
  });
});
```

## Example: Using Store in a Component

```typescript
import { 
  useHelloCount, 
  useIncrementHelloCount 
} from '@/app/stores/greetingsStore';

function Header() {
  const helloCount = useHelloCount();
  const incrementHelloCount = useIncrementHelloCount();

  return (
    <div>
      <span>Hellos: {helloCount}</span>
      <button onClick={incrementHelloCount}>Say Hello</button>
    </div>
  );
}
```

## Store Organization

Create separate stores for distinct domains:
- `greetingsStore.ts` - Greeting-related client state
- `userStore.ts` - User preferences and session data
- `uiStore.ts` - UI state (modals, sidebars, etc.)

Don't create a monolithic global store.
