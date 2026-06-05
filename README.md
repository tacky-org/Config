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

The loader encapsulates three steps and its own cache key:

| Option | Required | Purpose |
|---|---|---|
| `key` | ✓ | Cache key for TanStack Query — string or context-aware function |
| `load` | ✓ | Fetch the raw data — API call, storage, env vars, etc. (called `queryFn` internally) |
| `validate` | ✓ | Assert the raw shape is what you expect; throw if not |
| `map` | — | Transform the validated type into your runtime type |

```ts
import { ConfigLoader, fromFetch, withZod } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create<RawConfig, AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  map:      (raw) => ({ apiUrl: raw.api_url, timeout: raw.timeout_ms }),
});
```

### Query hooks

The package ships hooks that wire a loader directly into TanStack Query:

```ts
import { useConfigSuspenseQuery, useConfigQuery } from '@tacky-org/config';

// Suspense — must be inside a <Suspense> boundary
const { data: config } = useConfigSuspenseQuery(appConfigLoader);

// Non-Suspense — inline loading and error states
const { data: config, isLoading, isError } = useConfigQuery(appConfigLoader);
```

### `loader.queryOptions(ctx?)`

For advanced patterns — call `queryClient` methods directly using `loader.queryOptions()`:

```ts
// prefetch before a component mounts
await queryClient.prefetchQuery(appConfigLoader.queryOptions());

// ensure data is cached (returns it if already fresh)
const config = await queryClient.ensureQueryData(appConfigLoader.queryOptions());

// invalidate a specific entry
await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en' }));

// invalidate all variants of a loader at once (prefix match)
await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });

// compose with TanStack hooks directly
const { data } = useSuspenseQuery(appConfigLoader.queryOptions());
```

---

## Context — dynamic load & cache key

When the URL, headers, or any other load parameter depends on runtime values (current user, locale, tenant), pass a `TContext` generic. The `key` function derives the cache key from context, and `load` receives it at call time.

### `key` option forms

When `TContext` is not void, `key` **must** be a function — the type system enforces this, preventing a static key from silently ignoring context and causing different contexts to share a cache entry.

#### Static string — no context, one shared cache entry

```ts
const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

// queryKey → ['config__app']
useConfigSuspenseQuery(appConfigLoader);
```

#### Dynamic string — full key derived from context

Use this when every context value should produce a completely distinct key and you never need to bulk-invalidate:

```ts
interface Ctx { tenantId: string; language: string }

const tenantConfigLoader = ConfigLoader.create<TenantConfig, TenantConfig, Ctx>({
  key:      (ctx) => `tenant_${ctx.tenantId}_${ctx.language}`,
  load:     (ctx) => fromFetch(`/api/config/${ctx.tenantId}?lang=${ctx.language}`)(),
  validate: withZod(TenantConfigSchema),
});

// queryKey → ['config__tenant_acme_en']
useConfigSuspenseQuery(tenantConfigLoader, { tenantId: 'acme', language: 'en' });
```

#### Tuple — fixed name, extra segments split the cache

Recommended when you want to invalidate all variants under the same loader at once:

```ts
interface Ctx { language: string }

const todoLoader = ConfigLoader.create<Todo, Todo, Ctx>({
  key:      (ctx) => ['todo', ctx.language],
  load:     (ctx) => fromFetch(`/api/todos?lang=${ctx.language}`)(),
  validate: withZod(TodoSchema),
});

// queryKey → ['config__todo', 'en']
useConfigSuspenseQuery(todoLoader, { language: 'en' });
// queryKey → ['config__todo', 'fr'] — separate cache entry
useConfigSuspenseQuery(todoLoader, { language: 'fr' });

// Invalidate all language variants in one call
queryClient.invalidateQueries({ queryKey: ['config__todo'] });
```

Context can carry multiple values — only the parts returned from `key` affect caching:

```ts
interface Ctx { language: string; userId: number }

const todoLoader = ConfigLoader.create<Todo, Todo, Ctx>({
  // userId is used by load but not included in the key —
  // all users share one cache entry per language
  key:      (ctx) => ['todo', ctx.language],
  load:     (ctx) => fromFetch(`/api/todos?lang=${ctx.language}&user=${ctx.userId}`)(),
  validate: withZod(TodoSchema),
});
```

### Using context in hooks

Pass context as the second argument — it's required when `TContext` is not void, and the type system enforces it:

```ts
const { data } = useConfigSuspenseQuery(todoLoader, { language: 'en', userId: 42 });
const { data } = useConfigQuery(todoLoader, { language: 'en', userId: 42 });
```

The same applies to `loader.queryOptions()` and `useConfigInvalidate`:

```ts
// prefetch or invalidate outside a component
await queryClient.prefetchQuery(todoLoader.queryOptions({ language: 'en', userId: 42 }));
await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en', userId: 42 }));

// hook inside a component
const { invalidate } = useConfigInvalidate(todoLoader, { language: 'en', userId: 42 });
```

---

## Usage

### Basic — `useConfigSuspenseQuery`

```tsx
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigLoader, useConfigSuspenseQuery, fromFetch, withZod } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

const MyComponent = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>{config.apiUrl}</p>;
};

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<p>Loading…</p>}>
      <MyComponent />
    </Suspense>
  </QueryClientProvider>
);
```

### With loading states — `useConfigQuery`

No `<Suspense>` boundary needed:

```tsx
const MyComponent = () => {
  const { data: config, isLoading, isError, error } = useConfigQuery(appConfigLoader);

  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p>Error: {String(error)}</p>;

  return <p>{config!.apiUrl}</p>;
};
```

### With context

```tsx
const MyComponent = ({ language }: { language: string }) => {
  const { data: todo } = useConfigSuspenseQuery(todoLoader, { language });
  return <p>{todo.title}</p>;
};
```

### SSR — prefetch + hydrate

```tsx
// app/layout.tsx (Next.js App Router — server component)
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Layout({ children }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(appConfigLoader.queryOptions());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
```

With context (e.g. from request headers):

```tsx
await queryClient.prefetchQuery(todoLoader.queryOptions({ language: req.headers['accept-language'] ?? 'en' }));
```

### TanStack Router — prefetch in `beforeLoad`

```ts
export const Route = createFileRoute('/app')({
  beforeLoad: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(appConfigLoader.queryOptions()),
});

// With context from route search params
export const Route = createFileRoute('/app')({
  beforeLoad: ({ context: { queryClient }, search }) =>
    queryClient.prefetchQuery(todoLoader.queryOptions({ language: search.lang })),
});
```

### Invalidate (reload)

Inside a component, use the `useConfigInvalidate` hook:

```tsx
const { invalidate } = useConfigInvalidate(appConfigLoader);
invalidate(); // marks stale and triggers a background re-fetch

// With context — invalidates only that cache entry
const { invalidate } = useConfigInvalidate(todoLoader, { language: 'en' });
```

Outside a component, use `queryClient` directly via `loader.queryOptions()`:

```ts
// specific cache entry
await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en' }));

// all variants at once (prefix match)
await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });
```

### Retry

Use `retries` on the loader to retry the `load()` step before `validate` and `map` run:

```ts
const loader = ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  retries:  2, // 3 total attempts, 200ms → 400ms exponential backoff
});
```

TanStack Query retry (retries the full query including validate):

```ts
const { data } = useQuery({ ...appConfigLoader.queryOptions(), retry: 3 });
```

---

## Load adapters

### Browser

#### `fromFetch(url, options?)`

Fetches a JSON endpoint. Throws on non-2xx responses.

```ts
ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

// With request options
ConfigLoader.create({
  key:  'app',
  load: fromFetch('/api/config', {
    headers:     { Authorization: `Bearer ${token}` },
    errorPrefix: 'App config',
  }),
  validate: withZod(AppConfigSchema),
});

// With context
ConfigLoader.create<AppConfig, AppConfig, { language: string }>({
  key:  (ctx) => ['app', ctx.language],
  load: (ctx) => fromFetch(`/api/config?lang=${ctx.language}`)(),
  validate: withZod(AppConfigSchema),
});
```

#### `fromStorage(storage, key)`

Reads and JSON-parses an entry from any [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) implementation.

```ts
// Persisted across sessions
ConfigLoader.create({
  key:      'app',
  load:     fromStorage(localStorage, 'app_config'),
  validate: withZod(AppConfigSchema),
});

// Scoped to the browser tab
ConfigLoader.create({
  key:      'flags',
  load:     fromStorage(sessionStorage, 'feature_flags'),
  validate: withZod(FeatureFlagsSchema),
});
```

#### `fromWindow(key)`

Reads a value injected onto `window` by the server. Avoids a second network round-trip.

```html
<script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };</script>
```

```ts
ConfigLoader.create({
  key:      'app',
  load:     fromWindow('__APP_CONFIG__'),
  validate: withZod(AppConfigSchema),
});
```

#### `fromScript(id)`

Reads and JSON-parses an inline `<script type="application/json">` tag. Same SSR embedding pattern as `fromWindow` but without polluting the global scope.

```html
<script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}</script>
```

```ts
ConfigLoader.create({
  key:      'app',
  load:     fromScript('app-config'),
  validate: withZod(AppConfigSchema),
});
```

### Universal

#### `fromMemory(value)`

Returns a static in-memory value. Useful for tests and Storybook.

```ts
ConfigLoader.create({
  key:      'app',
  load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 5000 }),
  validate: withZod(AppConfigSchema),
});
```

---

## Validation adapters

### `withZod(schema)`

Works with any library that exposes `.parse(raw)` — Zod, Yup (via `.cast()`), etc.

```ts
import { z } from 'zod';

const AppConfigSchema = z.object({
  apiUrl:  z.string().url(),
  timeout: z.number().positive(),
});

ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});
```

### `withYup(schema)`

```ts
import { object, string, number } from 'yup';

ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withYup(object({ apiUrl: string().required(), timeout: number().required() })),
});
```

### `withJoi(schema)`

```ts
import Joi from 'joi';

ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withJoi(Joi.object({ apiUrl: Joi.string().uri().required() })),
});
```

### `withValibot(parser)`

Valibot uses `v.parse(schema, data)` rather than `schema.parse(data)`, so pass a pre-bound function:

```ts
import * as v from 'valibot';

const AppConfigSchema = v.object({ apiUrl: v.string(), timeout: v.number() });

ConfigLoader.create({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withValibot((data) => v.parse(AppConfigSchema, data)),
});
```

---

## Typed config registry

Declare config types once via module augmentation — return types are inferred automatically.

```ts
// config.d.ts (anywhere in your app)
declare module '@tacky-org/config' {
  interface ConfigRegistry {
    app:   AppConfig;
    flags: FeatureFlags;
  }
}
```

---

## API reference

### `ConfigLoader.create(options)`

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` (no ctx) or `(ctx: TContext) => string \| readonly [string, ...unknown[]]` (with ctx) | ✓ | Cache key — static string for context-free loaders, required function when TContext is provided |
| `load` | `(ctx: TContext) => unknown \| Promise<unknown>` | ✓ | Fetches the raw data — exposed as `loader.queryFn()` |
| `validate` | `(raw: unknown) => TConfig` | ✓ | Validates shape; throw to signal failure |
| `map` | `(config: TConfig) => TRuntime` | — | Transforms to runtime shape |
| `retries` | `number` | — | Loader-level retries with exponential backoff. Default `0` |

### `loader.queryOptions(ctx?)`

Returns a TanStack `queryOptions` object (`staleTime: Infinity`). Pass it directly to any `queryClient` method or TanStack hook.

```ts
queryClient.prefetchQuery(loader.queryOptions());
queryClient.ensureQueryData(loader.queryOptions());
queryClient.invalidateQueries(loader.queryOptions());
useSuspenseQuery(loader.queryOptions());
```

### `loader.queryKey(ctx?)`

Returns the raw TanStack Query key. Useful for prefix-matching (e.g. invalidate all variants):

```ts
queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });
```

### `useConfigQuery(loader, ctx?)`
### `useConfigSuspenseQuery(loader, ctx?)`

Pass `ctx` when `TContext` is not void — the type system enforces it.

`useConfigSuspenseQuery` must be inside a `<Suspense>` boundary.
`useConfigQuery` returns `isLoading` / `isError` for inline state handling.

### `useConfigInvalidate(loader, ctx?)`

Returns `{ invalidate, isPending, isError, isSuccess, error, reset }`.

### `fromFetch(url, options?)`

| Option | Type | Description |
|---|---|---|
| `errorPrefix` | `string` | Prefix for the error message. Defaults to the URL |
| `...RequestInit` | | Any standard `fetch` init options |
