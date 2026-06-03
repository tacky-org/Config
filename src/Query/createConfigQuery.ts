import { queryOptions } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";
import { ResolveConfig } from "@/Types";

export interface CreateConfigQueryOptions {
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
export function createConfigQuery<TConfig, TRuntime, K extends string = string>(
  id: K,
  loader: ConfigLoader<TConfig, TRuntime>,
  options: CreateConfigQueryOptions = {},
) {
  return queryOptions<ResolveConfig<K, TRuntime>>({
    queryKey: [id] as const,
    queryFn: () => loader.load() as Promise<ResolveConfig<K, TRuntime>>,
    staleTime: options.staleTime ?? Infinity,
  });
}
