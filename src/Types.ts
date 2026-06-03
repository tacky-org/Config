// ─── loader ───────────────────────────────────────────────────────────────────

export interface ConfigLoaderOptions<TConfig, TRuntime = TConfig> {
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

// ─── typed registry ───────────────────────────────────────────────────────────

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
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigRegistry {}

/**
 * Resolves to ConfigRegistry[K] when K is a registered id,
 * otherwise falls back to TFallback.
 */
export type ResolveConfig<
  K extends string,
  TFallback = unknown,
> = K extends keyof ConfigRegistry ? ConfigRegistry[K] : TFallback;
