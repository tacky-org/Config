/** The prefix applied to every TanStack Query key. */
export const CONFIG_KEY_PREFIX = "config__" as const;

// ─── loader ───────────────────────────────────────────────────────────────────

export interface ConfigLoaderOptions<
  TConfig,
  TRuntime = TConfig,
  TContext = void,
> {
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
  key: [TContext] extends [void]
    ? string | ((ctx: TContext) => string | readonly [string, ...unknown[]])
    : (ctx: TContext) => string | readonly [string, ...unknown[]];
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

// ─── typed registry ───────────────────────────────────────────────────────────

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
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigRegistry {}

/**
 * Resolves to ConfigRegistry[K] when K is a registered key,
 * otherwise falls back to TFallback.
 */
export type ResolveConfig<
  K extends string,
  TFallback = unknown,
> = K extends keyof ConfigRegistry ? ConfigRegistry[K] : TFallback;
