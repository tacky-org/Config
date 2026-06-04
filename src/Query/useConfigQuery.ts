import { useQuery } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

/**
 * Reads config from a ConfigLoader.
 * Returns isLoading, isError and error for inline state handling — no <Suspense> needed.
 * Use useConfigSuspenseQuery when you prefer Suspense boundaries.
 *
 * @example
 * const { data: config, isLoading, isError } = useConfigQuery(appConfigLoader);
 */
export function useConfigQuery<TConfig, TRuntime>(
  loader: ConfigLoader<TConfig, TRuntime>,
) {
  return useQuery({
    queryKey: loader.queryKey,
    queryFn: () => loader.load(),
    staleTime: Infinity,
  });
}
