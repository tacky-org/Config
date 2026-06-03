import * as _tanstack_query_core from '@tanstack/query-core';
import * as _tanstack_react_query from '@tanstack/react-query';

interface ConfigLoaderOptions<TConfig, TRuntime = TConfig> {
    load: () => unknown | Promise<unknown>;
    validate: (raw: unknown) => TConfig;
    map?: (config: TConfig) => TRuntime;
    /**
     * Number of times to retry the load before giving up.
     * Each retry waits 200ms * 2^attempt (exponential backoff).
     * Note: TanStack's own `retry` option retries the full queryFn.
     * This retries only the load() call, before validate/map run.
     * Defaults to 0.
     */
    retries?: number;
}
/**
 * Extend via declaration merging to get compile-time type safety on query ids.
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
 * Resolves to ConfigRegistry[K] when K is a registered id,
 * otherwise falls back to TFallback.
 */
type ResolveConfig<K extends string, TFallback = unknown> = K extends keyof ConfigRegistry ? ConfigRegistry[K] : TFallback;

declare class ConfigLoader<TConfig, TRuntime = TConfig> {
    private readonly options;
    constructor(options: ConfigLoaderOptions<TConfig, TRuntime>);
    static create<TConfig, TRuntime = TConfig>(options: ConfigLoaderOptions<TConfig, TRuntime>): ConfigLoader<TConfig, TRuntime>;
    load(): Promise<TRuntime>;
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
 * Pass the result directly to useQuery or useSuspenseQuery.
 *
 * @example
 * const appConfigQuery = createConfigQuery('app_config', appConfigLoader);
 *
 * // anywhere in your component tree:
 * const { data: config } = useQuery(appConfigQuery);
 * const { data: config } = useSuspenseQuery(appConfigQuery);
 */
declare function createConfigQuery<TConfig, TRuntime, K extends string = string>(id: K, loader: ConfigLoader<TConfig, TRuntime>, options?: CreateConfigQueryOptions): _tanstack_query_core.OmitKeyof<_tanstack_react_query.UseQueryOptions<ResolveConfig<K, TRuntime>, Error, ResolveConfig<K, TRuntime>, readonly unknown[]>, "queryFn"> & {
    queryFn?: _tanstack_query_core.QueryFunction<ResolveConfig<K, TRuntime>, readonly unknown[], never> | undefined;
} & {
    queryKey: readonly unknown[] & {
        [dataTagSymbol]: ResolveConfig<K, TRuntime>;
        [dataTagErrorSymbol]: Error;
    };
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
 * Creates a load function that reads and JSON-parses a file from the filesystem.
 * Node.js only. Uses `fs/promises` — throws if the file is missing or invalid JSON.
 *
 * @example
 * const loader = ConfigLoader.create({
 *   load: fromJsonFile('./config/app.config.json'),
 *   validate: withZod(AppConfigSchema),
 * });
 */
declare function fromJsonFile(path: string): () => Promise<unknown>;
/**
 * Creates a load function that reads a set of environment variables (Node.js).
 * Throws a single error listing all missing keys at once.
 *
 * @example
 * const loader = ConfigLoader.create({
 *   load: fromEnv(['API_URL', 'API_TIMEOUT']),
 *   validate: (raw) => raw as { API_URL: string; API_TIMEOUT: string },
 *   map: (env) => ({ apiUrl: env.API_URL, timeout: Number(env.API_TIMEOUT) }),
 * });
 */
declare function fromEnv(keys: string[]): () => Record<string, string>;
/**
 * Creates a load function that reads all environment variables matching a prefix.
 * Strips the prefix from the returned keys.
 * Works with Vite (VITE_), Next.js (NEXT_PUBLIC_), and similar conventions.
 *
 * @example
 * // Given: VITE_API_URL=https://api.example.com  VITE_TIMEOUT=5000
 * const loader = ConfigLoader.create({
 *   load: fromPublicEnv('VITE_'),
 *   validate: (raw) => raw as { API_URL: string; TIMEOUT: string },
 *   map: (env) => ({ apiUrl: env.API_URL, timeout: Number(env.TIMEOUT) }),
 * });
 * // Produces: { API_URL: 'https://api.example.com', TIMEOUT: '5000' }
 */
declare function fromPublicEnv(prefix: string): () => Record<string, string>;
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

export { ConfigLoader, type ConfigLoaderOptions, type ConfigRegistry, type CreateConfigQueryOptions, type FromFetchOptions, type ResolveConfig, createConfigQuery, fromEnv, fromFetch, fromJsonFile, fromMemory, fromPublicEnv, fromScript, fromStorage, fromWindow, withJoi, withValibot, withYup, withZod };
