# Feature Flagging

This application uses a Zustand-based feature flag system with environment-aware defaults.

## Feature Flag Store

Feature flags are defined in `src/app/featureFlag/featureFlagStore.ts`.

### Flag Definition

```typescript
export const FEATURE_FLAG_KEYS = {
  GREETINGS_LIST: 'greetings_list',
  GREETING_DETAIL: 'greeting_detail',
  FAVOURITE_FEATURE: 'favourite_feature',
} as const;

const FEATURE_FLAGS: Record<string, { demo: boolean; dev: boolean; prod: boolean }> = {
  [FEATURE_FLAG_KEYS.GREETINGS_LIST]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.GREETING_DETAIL]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.FAVOURITE_FEATURE]: { demo: true, dev: true, prod: true },
};
```

### Environment Mapping

- `local` / `mock` / `mocked` / `dev` / `demo` → use `demo` configuration
- `prod` → use `prod` configuration

## Usage in Components

### JSX Feature Gating

Use `<FeatureFlagGate>` for conditional rendering:

```typescript
import { FeatureFlagGate, FEATURE_FLAG_KEYS } from '@/app/featureFlag/featureFlagStore';

function MyComponent() {
  return (
    <FeatureFlagGate 
      featureKey={FEATURE_FLAG_KEYS.FAVOURITE_FEATURE}
      fallback={<div>Feature not available</div>}
    >
      <FavouriteButton />
    </FeatureFlagGate>
  );
}
```

### Logic Feature Gating

Use `isFeatureEnabled()` for conditional logic:

```typescript
import { isFeatureEnabled, FEATURE_FLAG_KEYS } from '@/app/featureFlag/featureFlagStore';

function MyComponent() {
  const handleClick = () => {
    if (isFeatureEnabled(FEATURE_FLAG_KEYS.FAVOURITE_FEATURE)) {
      // Feature-gated logic
      saveFavourite();
    }
  };
  
  return <button onClick={handleClick}>Save</button>;
}
```

## Fail-Closed Behavior

Feature flags **fail closed** - missing or undefined keys return `false`:

```typescript
isFeatureEnabled('nonexistent_feature'); // returns false
```

This ensures safe defaults when flags are misconfigured.

## Runtime Overrides

Overrides only work in `local` / `mock` / `mocked` environments:

```typescript
import { useFeatureFlagStore } from '@/app/featureFlag/featureFlagStore';

// In development tools or admin panel
const { setOverride, clearOverride } = useFeatureFlagStore();

setOverride(FEATURE_FLAG_KEYS.FAVOURITE_FEATURE, false);
clearOverride(FEATURE_FLAG_KEYS.FAVOURITE_FEATURE);
```

Overrides **do not work** in `dev` or `prod` environments (service would throw).

## Adding a New Feature Flag

1. Add key to `FEATURE_FLAG_KEYS`:
```typescript
export const FEATURE_FLAG_KEYS = {
  // ... existing flags
  NEW_FEATURE: 'new_feature',
} as const;
```

2. Add configuration to `FEATURE_FLAGS`:
```typescript
const FEATURE_FLAGS = {
  // ... existing flags
  [FEATURE_FLAG_KEYS.NEW_FEATURE]: { 
    demo: true,  // Enabled in dev/demo
    dev: true,
    prod: false  // Disabled in production
  },
};
```

3. Use in components:
```typescript
<FeatureFlagGate featureKey={FEATURE_FLAG_KEYS.NEW_FEATURE}>
  <NewFeature />
</FeatureFlagGate>
```

## Best Practices

1. **Descriptive names** - Use clear, descriptive flag keys
2. **Conservative defaults** - Start with `prod: false` for new features
3. **Clean up** - Remove flags once features are fully rolled out
4. **Document flags** - Comment why a flag exists and when it can be removed
5. **Test both states** - Verify behavior with flag on and off

## Testing with Feature Flags

Override flags in tests:

```typescript
import { useFeatureFlagStore } from '@/app/featureFlag/featureFlagStore';

beforeEach(() => {
  useFeatureFlagStore.setState({
    overrides: {
      [FEATURE_FLAG_KEYS.FAVOURITE_FEATURE]: true,
    },
  });
});
```
