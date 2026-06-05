# @tacky-org/config — AI guidance

This project uses `@tacky-org/config` for config management. Follow these rules exactly when writing or editing config loaders.

## Core API

### `ConfigLoader.create`

Always provide the `key` option. The `key` type depends on whether context is used:

```ts
// No context — static string is fine
ConfigLoader.create<AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

// With context — key MUST be a function (TypeScript enforces this)
ConfigLoader.create<Todo, Todo, { language: string }>({
  key:      (ctx) => ['todo', ctx.language],
  load:     (ctx) => fromFetch('/api/config', {
    headers: { 'Accept-Language': ctx.language },
  })(),
  validate: withZod(TodoSchema),
});
```

### `key` rules

- **No context (`TContext = void`)**: `key` may be a static string or a function.
- **With context**: `key` MUST be a function — a static string is a TypeScript error. This prevents different contexts from sharing the same cache entry.
- **Tuple form** `(ctx) => ['name', ctx.language]` is preferred when you need to invalidate all variants at once (TanStack prefix-matches on `['config__name']`).
- **String form** `(ctx) => 'name_en'` is fine when you never need to bulk-invalidate.

### `load` with context

Always pass ctx values as headers, not query params, where the API supports it:

```ts
// ✓ preferred
load: (ctx) => fromFetch('/api/config', {
  headers: { 'Accept-Language': ctx.language },
})()

// acceptable when the API requires it
load: (ctx) => fromFetch(`/api/config?lang=${ctx.language}`)()
```

### `validate` and `map`

- `validate` must not use ctx — it validates raw data shape only.
- `map` must not use ctx — it transforms `TConfig → TRuntime` only.
- If ctx is needed in the transformation, do it in `load` instead.

## Hooks (inside components)

```ts
// No context
const { data } = useConfigSuspenseQuery(appConfigLoader);
const { data, isLoading, isError } = useConfigQuery(appConfigLoader);

// With context — second argument is required and type-checked
const { data } = useConfigSuspenseQuery(todoLoader, { language: 'en' });
const { data } = useConfigQuery(todoLoader, { language: 'en' });
```

Use `useConfigSuspenseQuery` inside a `<Suspense>` boundary. Use `useConfigQuery` for inline loading/error states without a boundary.

## Outside components — use `queryClient` directly

Never call `queryClient` with a raw string key. Always derive the key from the loader:

```ts
// ✓ correct
await queryClient.prefetchQuery(appConfigLoader.queryOptions());
await queryClient.prefetchQuery(todoLoader.queryOptions({ language: 'en' }));
await queryClient.ensureQueryData(todoLoader.queryOptions({ language: 'en' }));
await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en' }));

// invalidate ALL variants of a tuple-key loader
await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });

// ✗ never do this
await queryClient.invalidateQueries({ queryKey: ['config__todo', 'en'] });
```

## TanStack Router

```ts
export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(appConfigLoader.queryOptions()),
});

// With context from search params
export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient }, search }) =>
    queryClient.prefetchQuery(todoLoader.queryOptions({ language: search.lang })),
});

// Multiple loaders in parallel
loader: ({ context: { queryClient } }) =>
  Promise.all([
    queryClient.prefetchQuery(appConfigLoader.queryOptions()),
    queryClient.prefetchQuery(featureFlagsLoader.queryOptions()),
  ]),
```

## Invalidation (inside components)

```ts
const { invalidate, isPending } = useConfigInvalidate(appConfigLoader);

// With context — invalidates only that specific cache entry
const { invalidate } = useConfigInvalidate(todoLoader, { language: 'en' });
```

## Common mistakes

| ✗ Wrong | ✓ Correct |
|---|---|
| `key: 'todo'` with TContext provided | `key: (ctx) => ['todo', ctx.language]` |
| `validate: (raw, ctx) => ...` | `validate: (raw) => ...` — ctx not available here |
| `queryClient.invalidateQueries({ queryKey: ['config__todo'] })` manually | `queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() })` |
| `queryClient.prefetchQuery({ queryKey: [...], queryFn: ... })` manually | `queryClient.prefetchQuery(loader.queryOptions(ctx))` |
| Calling `loader.queryFn()` directly in a component | Use `useConfigSuspenseQuery` or `useConfigQuery` |

## TypeScript generics

```ts
ConfigLoader.create<TConfig>({ ... })
// TConfig   — the validated raw shape
// TRuntime  — the mapped runtime shape (defaults to TConfig)
// TContext  — runtime context object (defaults to void = no context)

ConfigLoader.create<TConfig, TRuntime, TContext>({ ... })
```

## `fromFetch` options

```ts
fromFetch(url, options?)
// options extends RequestInit — any standard fetch init option
// options.errorPrefix — custom error message prefix (defaults to the URL)
```
