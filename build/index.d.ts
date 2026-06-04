import * as _tanstack_query_core from '@tanstack/query-core';
import * as _tanstack_react_query from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

/** The prefix applied to every TanStack Query key. */
declare const CONFIG_KEY_PREFIX: "config__";
interface ConfigLoaderOptions<TConfig, TRuntime = TConfig> {
    /** Identifier for this loader — used as the TanStack Query key (`config__<key>`). */
    key: string;
    load: () => unknown | Promise<unknown>;
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

declare class ConfigLoader<TConfig, TRuntime = TConfig> {
    private readonly options;
    constructor(options: ConfigLoaderOptions<TConfig, TRuntime>);
    static create<TConfig, TRuntime = TConfig>(options: ConfigLoaderOptions<TConfig, TRuntime>): ConfigLoader<TConfig, TRuntime>;
    load(): Promise<TRuntime>;
    /** The TanStack Query key for this loader: `config__<key>`. */
    get queryKey(): readonly [string];
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

interface CreateConfigQueryOptions {
    /**
     * How long (ms) the config is considered fresh. Defaults to Infinity
     * since config is typically static for the lifetime of a session.
     */
    staleTime?: number;
}
/**
 * Wraps a ConfigLoader into a TanStack Query options object.
 * The query key is derived from the loader's key.
 *
 * Useful for advanced TanStack patterns (prefetching, queryClient.fetchQuery, etc.).
 * For component usage prefer useConfigQuery or useConfigSuspenseQuery directly.
 *
 * @example
 * const appConfigQuery = createConfigQuery(appConfigLoader);
 *
 * // prefetch outside a component:
 * await queryClient.prefetchQuery(appConfigQuery);
 */
declare function createConfigQuery<TConfig, TRuntime>(loader: ConfigLoader<TConfig, TRuntime>, options?: CreateConfigQueryOptions): _tanstack_query_core.OmitKeyof<_tanstack_react_query.UseQueryOptions<TRuntime, Error, TRuntime, readonly [string]>, "queryFn"> & {
    queryFn?: _tanstack_query_core.QueryFunction<TRuntime, readonly [string], never> | undefined;
} & {
    queryKey: readonly [string] & {
        [dataTagSymbol]: TRuntime;
        [dataTagErrorSymbol]: Error;
    };
};

/**
 * Ensures config is in the TanStack Query cache before a route renders.
 * Returns cached data immediately if already loaded, otherwise fetches and caches it.
 *
 * Use in TanStack Router's beforeLoad or loader to guarantee config is available
 * the moment a component calls useConfigSuspenseQuery.
 *
 * @example
 * // route.ts
 * export const Route = createFileRoute('/app')({
 *   beforeLoad: ({ context: { queryClient } }) =>
 *     prefetchConfig(appConfigLoader, queryClient),
 * });
 */
declare function prefetchConfig<TConfig, TRuntime>(loader: ConfigLoader<TConfig, TRuntime>, queryClient: QueryClient): Promise<TRuntime>;

/**
 * Reads config from a ConfigLoader.
 * Returns isLoading, isError and error for inline state handling — no <Suspense> needed.
 * Use useConfigSuspenseQuery when you prefer Suspense boundaries.
 *
 * @example
 * const { data: config, isLoading, isError } = useConfigQuery(appConfigLoader);
 */
declare function useConfigQuery<TConfig, TRuntime>(loader: ConfigLoader<TConfig, TRuntime>): _tanstack_react_query.UseQueryResult<NoInfer<TRuntime>, Error>;

/**
 * Reads config from a ConfigLoader via Suspense.
 * Must be wrapped in a <Suspense> boundary.
 * Use useConfigQuery for inline loading/error states without Suspense.
 *
 * @example
 * const { data: config } = useConfigSuspenseQuery(appConfigLoader);
 */
declare function useConfigSuspenseQuery<TConfig, TRuntime>(loader: ConfigLoader<TConfig, TRuntime>): _tanstack_react_query.UseSuspenseQueryResult<TRuntime, Error>;

/**
 * Returns an object with an invalidate() method and TanStack mutation status.
 * Calling invalidate() marks the config cache as stale and triggers a fresh load.
 *
 * @example
 * const invalidate = useConfigInvalidate(appConfigLoader);
 *
 * invalidate.invalidate();
 * invalidate.isPending  // true while re-fetching
 * invalidate.isError    // true if the new load failed
 * invalidate.error      // the ConfigPipelineError, if any
 */
declare function useConfigInvalidate<TConfig, TRuntime>(loader: ConfigLoader<TConfig, TRuntime>): {
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
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
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
 * const loader = ConfigLoader.create({
 *   load: fromStorage(localStorage, 'app_config'),
 *   validate: withZod(AppConfigSchema),
 * });
 *
 * // sessionStorage — scoped to the browser tab
 * const loader = ConfigLoader.create({
 *   load: fromStorage(sessionStorage, 'feature_flags'),
 *   validate: withZod(FeatureFlagsSchema),
 * });
 */
declare function fromStorage(storage: Storage, key: string): () => unknown;
/**
 * Creates a load function that reads a value injected onto window.
 * Common SSR pattern: the server embeds config into the HTML as a global,
 * avoiding a second network round-trip on the client.
 *
 * @example
 * // In your server-rendered HTML:
 * // <script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };</script>
 *
 * const loader = ConfigLoader.create({
 *   load: fromWindow('__APP_CONFIG__'),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function fromWindow(key: string): () => unknown;
/**
 * Creates a load function that reads and JSON-parses an inline
 * <script type="application/json"> tag by its id.
 * Useful for SSR config embedding without polluting the global scope.
 *
 * @example
 * // In your server-rendered HTML:
 * // <script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}</script>
 *
 * const loader = ConfigLoader.create({
 *   load: fromScript('app-config'),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function fromScript(id: string): () => unknown;
/**
 * Creates a load function that returns a static in-memory value.
 * Useful for tests and Storybook where you want to provide a known config
 * without any network or filesystem access.
 *
 * @example
 * const loader = ConfigLoader.create({
 *   load: fromMemory({ apiUrl: 'https://api.example.com', timeout: 5000 }),
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

export { CONFIG_KEY_PREFIX, ConfigLoader, type ConfigLoaderOptions, ConfigPipelineError, type ConfigPipelineStep, type ConfigRegistry, type CreateConfigQueryOptions, type FromFetchOptions, type ResolveConfig, createConfigQuery, fromFetch, fromMemory, fromScript, fromStorage, fromWindow, prefetchConfig, useConfigInvalidate, useConfigQuery, useConfigSuspenseQuery, withJoi, withValibot, withYup, withZod };
