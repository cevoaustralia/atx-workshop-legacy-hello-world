# Orval-Generated API Models

This directory will contain auto-generated TypeScript types from OpenAPI specifications.

## Usage

When an OpenAPI contract is available, run:
```bash
npx projen gen:api
```

## Generated Structure

- `models/*.ts` - Type definitions from OpenAPI schemas
- `services/*/*.ts` - React Query hooks and MSW handlers per API tag

## Important

**DO NOT edit generated files manually** - they will be overwritten on the next generation.

To change types:
1. Update the OpenAPI contract in the contracts package
2. Bump the contracts package version
3. Run `npx projen gen:api`
