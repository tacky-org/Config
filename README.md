# Tacky Config

Config management for React apps — a thin `load → validate → map` pipeline that plugs directly into **TanStack Query**.

## Why

Config loading is just a data-fetch with two extra steps: you need to validate that the response matches your expected shape, and you often need to map the raw API/file format into the runtime shape your app actually uses. This package provides that pipeline. Everything else — caching, Suspense, retry, SSR hydration, devtools — is delegated to TanStack Query.

---

## Installation

```bash
pnpm add @tacky-org/config @tanstack/react-query
```

---

## Core concepts

### `ConfigLoader`

The loader encapsulates three steps:

| Step | Required | Purpose |
|---|---|---|
| `load` | ✓ | fetch the raw data — API call, file read, env vars, etc. |
| `validate` | ✓ | assert the raw shape is what you expect; throw if not |
| `map` | optional | transform the validated raw type into your runtime type |

```ts
import { ConfigLoader } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create<RawConfig, AppConfig>({
  load:     () => fetch('/api/config').then(r => r.json()),
  validate: (raw) => AppConfigSchema.parse(raw),  // Zod, Valibot, manual — anything that throws
  map:      (raw) => ({ apiUrl: raw.api_url, timeout: raw.timeout_ms }),
});
```

### `createConfigQuery`

Wraps a loader into a TanStack Query options object. Pass it directly to `useQuery` or `useSuspenseQuery`.

```ts
import { createConfigQuery } from '@tacky-org/config';

const appConfigQuery = createConfigQuery('app_config', appConfigLoader);
```

Defaults to `staleTime: Infinity` — config is treated as static for the lifetime of the session. Override via the third argument:

```ts
const appConfigQuery = createConfigQuery('app_config', appConfigLoader, {
  staleTime: 60_000, // re-fetch after 1 minute
});
```

---

## Usage

### Basic — `useSuspenseQuery`

```tsx
import { QueryClient, QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query';
import { ConfigLoader, createConfigQuery, ConfigErrorBoundary, fromFetch, withZod } from '@tacky-org/config';

const loader = ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  map:      (raw) => ({ apiUrl: raw.api_url }),
});

const appConfigQuery = createConfigQuery('app_config', loader);

const MyComponent = () => {
  const { data: config } = useSuspenseQuery(appConfigQuery);
  return <p>{config.apiUrl}</p>; // config is always defined here
};

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigErrorBoundary fallback={(e) => <p>Error: {e.message}</p>}>
      <Suspense fallback={<p>Loading…</p>}>
        <MyComponent />
      </Suspense>
    </ConfigErrorBoundary>
  </QueryClientProvider>
);
```

### With loading states — `useQuery`

No `<Suspense>` boundary needed:

```tsx
const MyComponent = () => {
  const { data: config, isLoading, isError, error } = useQuery(appConfigQuery);

  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p>Error: {String(error)}</p>;

  return <p>{config!.apiUrl}</p>;
};
```

### SSR — prefetch + hydrate

```tsx
// app/layout.tsx (Next.js App Router — server component)
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createConfigQuery } from '@tacky-org/config';

export default async function Layout({ children }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(appConfigQuery);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
```

### Retry

TanStack Query handles retry at the query level:

```ts
const { data } = useQuery({ ...appConfigQuery, retry: 3 });
```

Use `retries` on the loader to retry only the `load()` call, before `validate` and `map` run:

```ts
const loader = ConfigLoader.create({
  load: fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  retries: 2, // 3 total attempts, 200ms → 400ms backoff
});
```

### Invalidate (reload)

```tsx
const queryClient = useQueryClient();
queryClient.invalidateQueries(appConfigQuery);
```

---

## Load adapters

Helpers that create the `load` function for common sources.

### Browser

#### `fromFetch(url, options?)`

Fetches a JSON endpoint. Throws on non-2xx responses.

```ts
ConfigLoader.create({
  load: fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

// With request options
ConfigLoader.create({
  load: fromFetch('/api/config', {
    headers: { Authorization: `Bearer ${token}` },
    errorPrefix: 'App config',
  }),
  validate: withZod(AppConfigSchema),
});
```

#### `fromStorage(storage, key)`

Reads and JSON-parses an entry from any [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) implementation. Pass `localStorage` or `sessionStorage` directly.

```ts
// Persisted across sessions
ConfigLoader.create({
  load: fromStorage(localStorage, 'app_config'),
  validate: withZod(AppConfigSchema),
});

// Scoped to the browser tab — cleared when the tab closes
ConfigLoader.create({
  load: fromStorage(sessionStorage, 'feature_flags'),
  validate: withZod(FeatureFlagsSchema),
});
```

#### `fromWindow(key)`

Reads a value injected onto `window` by the server. Avoids a second network round-trip for config that is already known at render time.

```html
<!-- Server-rendered HTML -->
<script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };</script>
```

```ts
ConfigLoader.create({
  load: fromWindow('__APP_CONFIG__'),
  validate: withZod(AppConfigSchema),
});
```

#### `fromScript(id)`

Reads and JSON-parses an inline `<script type="application/json">` tag. Same SSR embedding pattern as `fromWindow` but without polluting the global scope.

```html
<!-- Server-rendered HTML -->
<script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}</script>
```

```ts
ConfigLoader.create({
  load: fromScript('app-config'),
  validate: withZod(AppConfigSchema),
});
```

### Node.js

#### `fromJsonFile(path)`

Reads and JSON-parses a file from the filesystem.

```ts
ConfigLoader.create({
  load: fromJsonFile('./config/app.config.json'),
  validate: withZod(AppConfigSchema),
});
```

#### `fromEnv(keys)`

Reads a specific set of environment variables. Throws listing all missing keys at once.

```ts
ConfigLoader.create({
  load: fromEnv(['API_URL', 'API_TIMEOUT']),
  validate: (raw) => raw as Record<string, string>,
  map: (env) => ({ apiUrl: env.API_URL, timeout: Number(env.API_TIMEOUT) }),
});
```

#### `fromPublicEnv(prefix)`

Reads all env vars matching a prefix and strips the prefix from the keys.
Works with `VITE_`, `NEXT_PUBLIC_`, or any custom prefix.

```ts
// Given: VITE_API_URL=https://api.example.com  VITE_TIMEOUT=5000
ConfigLoader.create({
  load: fromPublicEnv('VITE_'),
  validate: (raw) => raw as { API_URL: string; TIMEOUT: string },
  map: (env) => ({ apiUrl: env.API_URL, timeout: Number(env.TIMEOUT) }),
});
```

### Universal

#### `fromMemory(value)`

Returns a static in-memory value. Useful for tests and Storybook where you want a known config without any network or filesystem access.

```ts
ConfigLoader.create({
  load: fromMemory({ apiUrl: 'https://api.example.com', timeout: 5000 }),
  validate: withZod(AppConfigSchema),
});
```

---

## Validation adapters

Helpers that create the `validate` function from a schema library.

### `withZod(schema)`

Works with any library that exposes `.parse(raw)` — Zod, Yup (via `.cast()`), etc.

```ts
import { z } from 'zod';
import { withZod } from '@tacky-org/config';

const AppConfigSchema = z.object({
  apiUrl: z.string().url(),
  timeout: z.number().positive(),
});

ConfigLoader.create({
  load: fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});
```

### `withYup(schema)`

Uses `schema.validateSync()` which throws a `ValidationError` on failure.

```ts
import { object, string, number } from 'yup';
import { withYup } from '@tacky-org/config';

const AppConfigSchema = object({
  apiUrl:  string().required().url(),
  timeout: number().required().positive(),
});

ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withYup(AppConfigSchema),
});
```

### `withJoi(schema)`

Joi's `.validate()` returns `{ error?, value }` rather than throwing directly.
`withJoi` checks the result and throws the error for you.

```ts
import Joi from 'joi';
import { withJoi } from '@tacky-org/config';

const AppConfigSchema = Joi.object({
  apiUrl:  Joi.string().uri().required(),
  timeout: Joi.number().required(),
});

ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withJoi(AppConfigSchema),
});
```

### `withValibot(parser)`

Valibot uses `v.parse(schema, data)` rather than `schema.parse(data)`, so pass a pre-bound function:

```ts
import * as v from 'valibot';
import { withValibot } from '@tacky-org/config';

const AppConfigSchema = v.object({
  apiUrl:  v.string(),
  timeout: v.number(),
});

ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withValibot((data) => v.parse(AppConfigSchema, data)),
});
```

---

## Typed config registry

Declare config types once via module augmentation — `useQuery` return types are inferred automatically without explicit type parameters.

```ts
// config.d.ts (anywhere in your app)
declare module '@tacky-org/config' {
  interface ConfigRegistry {
    app_config:    AppConfig;
    feature_flags: FeatureFlags;
  }
}
```

```ts
const appConfigQuery    = createConfigQuery('app_config',    appConfigLoader);
const featureFlagsQuery = createConfigQuery('feature_flags', featureFlagsLoader);

const { data: config } = useSuspenseQuery(appConfigQuery);
//           ^ AppConfig — inferred from the registry, no explicit type param
```

---

## API reference

### `ConfigLoader.create(options)`

| Option | Type | Required | Description |
|---|---|---|---|
| `load` | `() => unknown \| Promise<unknown>` | ✓ | Fetches the raw data |
| `validate` | `(raw: unknown) => TConfig` | ✓ | Validates shape; throw to signal failure |
| `map` | `(config: TConfig) => TRuntime` | — | Transforms to runtime shape |
| `retries` | `number` | — | Loader-level retries with exponential backoff. Default `0` |

### `createConfigQuery(id, loader, options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `staleTime` | `number` | `Infinity` | How long (ms) the config is considered fresh |

Returns a TanStack `queryOptions` object — pass directly to `useQuery` / `useSuspenseQuery` / `queryClient.prefetchQuery`.

### `fromFetch(url, options?)`

| Option | Type | Description |
|---|---|---|
| `errorPrefix` | `string` | Prefix for the error message. Defaults to the URL |
| `...RequestInit` | | Any standard `fetch` init options |

### `fromEnv(keys)`

Reads `keys` from `process.env`. Throws a single error listing all missing keys.

### `ConfigErrorBoundary`

| Prop | Type | Default | Description |
|---|---|---|---|
| `fallback` | `ReactNode \| (error: Error) => ReactNode` | red `<p>` | Rendered on error |
