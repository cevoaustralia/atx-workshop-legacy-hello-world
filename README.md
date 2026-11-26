# Legacy Hello World

A small React SPA that says hello in six languages. It is **deliberately outdated** so it can be used to test the React Modernizer and React Router to TanStack Router agents through ATX.

It works as is: `npm run build` passes (it runs `tsc --noEmit`, then `vite build`), and the app runs without a backend, because the "API" is a static file in `public/api/greetings.json`.

## Run it

```sh
npm ci
npm start          # http://localhost:3000
npm run build
```

## What the app does

- `/` lists the greetings, filters them by language with `?lang=<code>`, and has a "Say hello" counter shown in the header.
- `/greetings/:id` shows one greeting and lets you mark it as your favourite.
- `/about` is a static page. `/home` redirects to `/`. Any other path shows a 404 page.

## Outdated practices, and which agent should fix them

| Area | What is in this app | Target standard | Agent |
|---|---|---|---|
| Routing | React Router v5: `Switch`, `component=` routes, `withRouter`, `props.history.push`, `props.match.params`, `Redirect`, a `path="*"` 404 | TanStack Router file-based routes, typed params, `notFoundComponent`, `redirect` | `react-router-to-tanstack-router`, or `react-modernizer-react-developer` |
| Search params | `?lang=` read with `new URLSearchParams` and written by string concatenation | `validateSearch` with a Valibot schema and typed `navigate({ search })` | Router agents |
| Components | Class components (`Header`, `GreetingPage`), flat `components/` and `pages/` folders | Function components in the atomic-design layout (`atom/`, `molecule/`, `organism/`, `templates/`, pages separate) | `react-modernizer-react-developer` |
| React root | `ReactDOM.render` (deprecated since React 18) | `createRoot` | `react-modernizer-react-developer` |
| State | Redux 4 `createStore` with hand-written action types, `connect`, `mapStateToProps` | Zustand store with atomic selectors and sessionStorage persistence | `react-modernizer-react-developer` |
| Data fetching | `axios` calls in `useEffect` and `componentDidMount`, manual loading and error state, no caching, the detail page refetches the whole list | TanStack Query wrapper hooks and selectors | `react-modernizer-react-developer` |
| Types | `strict: false`, `any` for props, state, API data and Redux | `strict: true`, models derived from schemas, no unsafe `any` | `react-modernizer-typescript-engineer` |
| Config | `import.meta.env.VITE_API_URL` read inside components | Runtime `window.CONFIG` | `react-modernizer-typescript-engineer` |
| API layer | Untyped `axios` calls to a hard-coded path | A typed API client (for example Orval-generated) | `react-modernizer-typescript-engineer` |
| Styling | One global stylesheet plus inline `style={{...}}` everywhere, raw hex colours and pixel values, `!important`, `float` layout | Design tokens (primitive, semantic, component), Tailwind v4, shadcn/ui | `react-modernizer-design-system-engineer` |
| Tooling | Vite 4, TypeScript 4.9, React 18.2 | Vite 7, TypeScript 5.x, React 18 or later | Several agents |
| Tests | None, and no `test` script | Vitest unit tests, Playwright smoke specs, MSW fixtures | `react-modernizer-test-automation-engineer` |

## Using it with ATX

The agents clone a git repository over HTTPS, so this folder must be pushed to **its own repository**, with `package.json` at the root. To let the agents push their changes, put a Git token in Secrets Manager and give its ID when the orchestrator asks. The agents' execution role also needs `secretsmanager:GetSecretValue` on that secret.
