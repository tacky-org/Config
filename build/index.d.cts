import * as _tanstack_query_core from '@tanstack/query-core';
import * as _tanstack_react_query from '@tanstack/react-query';

/** The prefix applied to every TanStack Query key. */
declare const CONFIG_KEY_PREFIX: "config__";
interface ConfigLoaderOptions<TConfig, TRuntime = TConfig, TContext = void> {
    /**
     * Identifies this loader and controls its TanStack Query cache key.
     *
     * When TContext is void a static string is accepted — one shared cache entry.
     * When TContext is provided the key MUST be a function so the cache key always
     * reflects the context, preventing different contexts from sharing a cache entry.
     *
     * Return a string for a fully dynamic key, or a tuple `[name, ...segments]`
     * to keep the name fixed while splitting the cache by specific context fields.
     *
     * @example
     * // no context — static string
     * key: "app"
     * // → ['config__app']
     *
     * // context — dynamic string
     * key: (ctx) => `todo_${ctx.language}`
     * // → ['config__todo_en']
     *
     * // context — tuple (recommended: fixed name, variable segments)
     * key: (ctx) => ["todo", ctx.language]
     * // → ['config__todo', 'en']
     */
    key: [TContext] extends [void] ? string | ((ctx: TContext) => string | readonly [string, ...unknown[]]) : (ctx: TContext) => string | readonly [string, ...unknown[]];
    /**
     * Function that performs the actual data fetching.
     * Receives context at load time, allowing URLs, headers, or storage keys
     * to be derived dynamically.
     *
     * @example
     * // no context (TContext = void)
     * load: fromFetch('/api/config')
     *
     * // with context
     * load: (ctx) => fromFetch(`/api/config?lang=${ctx.language}`)()
     */
    load: (ctx: TContext) => unknown | Promise<unknown>;
    validate: (raw: unknown) => TConfig;
    map?: (config: TConfig) => TRuntime;
    /**
     * Number of times to retry the load before giving up.
     * Each retry waits 200ms * 2^attempt (exponential backoff).
     * Only the load() step is retried — validate and map failures throw immediately.
     * Defaults to 0.
     */
    retries?: number;
}
/**
 * Extend via declaration merging to get compile-time type safety on config keys.
 *
 * @example
 * // your-app/config.d.ts
 * declare module '@tacky-org/config' {
 *   interface ConfigRegistry {
 *     app_config: AppConfig;
 *     feature_flags: FeatureFlags;
 *   }
 * }
 */
interface ConfigRegistry {
}
/**
 * Resolves to ConfigRegistry[K] when K is a registered key,
 * otherwise falls back to TFallback.
 */
type ResolveConfig<K extends string, TFallback = unknown> = K extends keyof ConfigRegistry ? ConfigRegistry[K] : TFallback;

type ContextArg$3<TContext> = TContext extends void ? [] : [ctx: TContext];
declare class ConfigLoader<TConfig, TRuntime = TConfig, TContext = void> {
    private readonly options;
    constructor(options: ConfigLoaderOptions<TConfig, TRuntime, TContext>);
    static create<TConfig, TRuntime = TConfig, TContext = void>(options: ConfigLoaderOptions<TConfig, TRuntime, TContext>): ConfigLoader<TConfig, TRuntime, TContext>;
    /**
     * Executes the load pipeline: fetch → validate → map.
     * Named to mirror the `queryFn` concept in TanStack Query.
     *
     * @example
     * await appConfigLoader.queryFn();
     * await todoLoader.queryFn({ language: 'en' });
     */
    queryFn(...[ctx]: ContextArg$3<TContext>): Promise<TRuntime>;
    /**
     * TanStack Query key for this loader, derived from the `key` option.
     * Pass context when TContext is not void to get the full specific key.
     * Omit context to get the base key for prefix-matching (e.g. invalidate all variants).
     *
     * @example
     * appConfigLoader.queryKey()                  // ['config__app']
     * todoLoader.queryKey({ language: 'en' })     // ['config__todo', 'en']
     * todoLoader.queryKey()                       // ['config__todo']  — matches all variants
     */
    queryKey(...[ctx]: ContextArg$3<TContext>): readonly [string, ...unknown[]];
    /**
     * Returns a TanStack `queryOptions` object ready to pass to `queryClient` methods
     * or `useQuery` / `useSuspenseQuery` directly.
     * Named to mirror TanStack Query's own `queryOptions()` helper.
     *
     * @example
     * // outside a component
     * await queryClient.prefetchQuery(appConfigLoader.queryOptions());
     * await queryClient.ensureQueryData(todoLoader.queryOptions({ language: 'en' }));
     * await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en' }));
     *
     * // invalidate all variants at once
     * await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });
     *
     * // inside a component (hooks are usually cleaner)
     * const { data } = useSuspenseQuery(appConfigLoader.queryOptions());
     */
    queryOptions(...[ctx]: ContextArg$3<TContext>): _tanstack_query_core.OmitKeyof<_tanstack_react_query.UseQueryOptions<TRuntime, Error, TRuntime, readonly [string, ...unknown[]]>, "queryFn"> & {
        queryFn?: _tanstack_query_core.QueryFunction<TRuntime, readonly [string, ...unknown[]], never> | undefined;
    } & {
        queryKey: readonly [string, ...unknown[]] & {
            [dataTagSymbol]: TRuntime;
            [dataTagErrorSymbol]: Error;
        };
    };
}

type ConfigPipelineStep = "load" | "validate" | "map";
/**
 * Thrown when any step of the ConfigLoader pipeline fails.
 * Inspect `step` to know where the failure occurred and `cause` for the original error.
 *
 * @example
 * try {
 *   await loader.load();
 * } catch (err) {
 *   if (err instanceof ConfigPipelineError) {
 *     console.error(`Failed at step "${err.step}":`, err.cause);
 *   }
 * }
 */
declare class ConfigPipelineError extends Error {
    readonly step: ConfigPipelineStep;
    constructor(step: ConfigPipelineStep, cause: unknown);
}

type ContextArg$2<TContext> = TContext extends void ? [] : [ctx: TContext];
/**
 * Reads config from a ConfigLoader.
 * Returns isLoading, isError and error for inline state handling — no <Suspense> needed.
 * Use useConfigSuspenseQuery when you prefer Suspense boundaries.
 *
 * @example
 * const { data: config, isLoading, isError } = useConfigQuery(appConfigLoader);
 * const { data } = useConfigQuery(todoLoader, { language: 'en' });
 */
declare function useConfigQuery<TConfig, TRuntime, TContext = void>(loader: ConfigLoader<TConfig, TRuntime, TContext>, ...[ctx]: ContextArg$2<TContext>): _tanstack_react_query.UseQueryResult<NoInfer<TRuntime>, Error>;

type ContextArg$1<TContext> = TContext extends void ? [] : [ctx: TContext];
/**
 * Reads config from a ConfigLoader via Suspense.
 * Must be wrapped in a <Suspense> boundary.
 * Use useConfigQuery for inline loading/error states without Suspense.
 *
 * @example
 * const { data: config } = useConfigSuspenseQuery(appConfigLoader);
 * const { data } = useConfigSuspenseQuery(todoLoader, { language: 'en' });
 */
declare function useConfigSuspenseQuery<TConfig, TRuntime, TContext = void>(loader: ConfigLoader<TConfig, TRuntime, TContext>, ...[ctx]: ContextArg$1<TContext>): _tanstack_react_query.UseSuspenseQueryResult<TRuntime, Error>;

type ContextArg<TContext> = TContext extends void ? [] : [ctx: TContext];
/**
 * Returns an object with an invalidate() method and TanStack mutation status.
 * Calling invalidate() marks the config cache as stale and triggers a fresh load.
 *
 * Omit ctx to invalidate all cache entries for the loader (prefix match).
 * Pass ctx to target a specific cache entry.
 *
 * @example
 * const { invalidate } = useConfigInvalidate(appConfigLoader);
 * const { invalidate } = useConfigInvalidate(todoLoader, { language: 'en' });
 *
 * invalidate.isPending  // true while re-fetching
 * invalidate.isError    // true if the new load failed
 */
declare function useConfigInvalidate<TConfig, TRuntime, TContext = void>(loader: ConfigLoader<TConfig, TRuntime, TContext>, ...[ctx]: ContextArg<TContext>): {
    invalidate: () => void;
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    reset: () => void;
};

interface FromFetchOptions extends RequestInit {
    /**
     * Custom error message prefix. Defaults to the URL.
     */
    errorPrefix?: string;
}
/**
 * Creates a load function that fetches a JSON endpoint.
 * Throws on non-2xx responses so errors surface to TanStack as query errors.
 *
 * @example
 * // static
 * ConfigLoader.create({ key: 'app', load: fromFetch('/api/config'), validate: withZod(AppConfigSchema) });
 *
 * // with context — call fromFetch inside the load function to use ctx values
 * ConfigLoader.create({
 *   key:  (ctx) => ['app', ctx.language],
 *   load: (ctx) => fromFetch(`/api/config?lang=${ctx.language}`)(),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function fromFetch(url: string, options?: FromFetchOptions): () => Promise<unknown>;
/**
 * Creates a load function that reads and JSON-parses an entry from any
 * Web Storage API implementation — pass localStorage or sessionStorage directly.
 * Throws if the key is missing or the value is invalid JSON.
 *
 * @example
 * ConfigLoader.create({ key: 'app',   load: fromStorage(localStorage,  'app_config'),    validate: withZod(AppConfigSchema) });
 * ConfigLoader.create({ key: 'flags', load: fromStorage(sessionStorage, 'feature_flags'), validate: withZod(FeatureFlagsSchema) });
 */
declare function fromStorage(storage: Storage, key: string): () => unknown;
/**
 * Creates a load function that reads a value injected onto window.
 * Common SSR pattern: the server embeds config into the HTML as a global,
 * avoiding a second network round-trip on the client.
 *
 * @example
 * // <script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };</script>
 * ConfigLoader.create({ key: 'app', load: fromWindow('__APP_CONFIG__'), validate: withZod(AppConfigSchema) });
 */
declare function fromWindow(key: string): () => unknown;
/**
 * Creates a load function that reads and JSON-parses an inline
 * `<script type="application/json">` tag by its id.
 * Useful for SSR config embedding without polluting the global scope.
 *
 * @example
 * // <script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}</script>
 * ConfigLoader.create({ key: 'app', load: fromScript('app-config'), validate: withZod(AppConfigSchema) });
 */
declare function fromScript(id: string): () => unknown;
/**
 * Creates a load function that returns a static in-memory value.
 * Useful for tests and Storybook where you want a known config without any network access.
 *
 * @example
 * ConfigLoader.create({
 *   key:      'app',
 *   load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 5000 }),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function fromMemory(value: unknown): () => unknown;

/**
 * Duck-typed Zod schema interface.
 * Matches any library that exposes a `.parse()` method (Zod, Yup via .cast(), etc).
 * Keeps zod out of our dependency tree.
 */
interface ParseableSchema<T> {
    parse: (raw: unknown) => T;
}
/**
 * Creates a validate function from any Zod-compatible schema.
 * The schema's `.parse()` method is called directly — if validation fails
 * the schema throws, which propagates to TanStack as a query error.
 *
 * @example
 * import { z } from 'zod';
 *
 * const AppConfigSchema = z.object({ apiUrl: z.string(), timeout: z.number() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function withZod<T>(schema: ParseableSchema<T>): (raw: unknown) => T;
/**
 * Duck-typed Yup schema interface.
 * Uses validateSync so the validate function stays synchronous.
 */
interface YupSchema<T> {
    validateSync: (value: unknown, options?: object) => T;
}
/**
 * Creates a validate function from a Yup schema.
 * Uses `validateSync` — throws a `ValidationError` if the data is invalid.
 *
 * @example
 * import { object, string, number } from 'yup';
 *
 * const AppConfigSchema = object({ apiUrl: string().required(), timeout: number().required() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withYup(AppConfigSchema),
 * });
 */
declare function withYup<T>(schema: YupSchema<T>): (raw: unknown) => T;
/**
 * Duck-typed Joi schema interface.
 * Joi's validate() returns { error?, value } rather than throwing directly.
 */
interface JoiSchema<T> {
    validate: (value: unknown, options?: object) => {
        error?: Error;
        value: T;
    };
}
/**
 * Creates a validate function from a Joi schema.
 * Checks the returned `error` and throws it so failures surface to TanStack
 * as query errors, consistent with the other adapters.
 *
 * @example
 * import Joi from 'joi';
 *
 * const AppConfigSchema = Joi.object({ apiUrl: Joi.string().uri().required(), timeout: Joi.number().required() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withJoi(AppConfigSchema),
 * });
 */
declare function withJoi<T>(schema: JoiSchema<T>): (raw: unknown) => T;
/**
 * Duck-typed Valibot-compatible parse function.
 * Valibot's API is parse(schema, data) rather than schema.parse(data),
 * so we accept a bound function instead.
 */
type ValibotParser<T> = (data: unknown) => T;
/**
 * Creates a validate function from a Valibot schema.
 * Pass a pre-bound parse call: `withValibot((data) => v.parse(MySchema, data))`
 *
 * @example
 * import * as v from 'valibot';
 *
 * const AppConfigSchema = v.object({ apiUrl: v.string(), timeout: v.number() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withValibot((data) => v.parse(AppConfigSchema, data)),
 * });
 */
declare function withValibot<T>(parser: ValibotParser<T>): (raw: unknown) => T;

export { CONFIG_KEY_PREFIX, ConfigLoader, type ConfigLoaderOptions, ConfigPipelineError, type ConfigPipelineStep, type ConfigRegistry, type FromFetchOptions, type ResolveConfig, fromFetch, fromMemory, fromScript, fromStorage, fromWindow, useConfigInvalidate, useConfigQuery, useConfigSuspenseQuery, withJoi, withValibot, withYup, withZod };
