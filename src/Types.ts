/** The prefix applied to every TanStack Query key. */
export const CONFIG_KEY_PREFIX = "config__" as const;

// ─── loader ───────────────────────────────────────────────────────────────────

export interface ConfigLoaderOptions<TConfig, TRuntime = TConfig> {
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
