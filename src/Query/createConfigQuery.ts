import { queryOptions } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

export interface CreateConfigQueryOptions {
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
export function createConfigQuery<TConfig, TRuntime>(
  loader: ConfigLoader<TConfig, TRuntime>,
  options: CreateConfigQueryOptions = {},
) {
  return queryOptions({
    queryKey: loader.queryKey,
    queryFn: () => loader.load(),
    staleTime: options.staleTime ?? Infinity,
  });
}
