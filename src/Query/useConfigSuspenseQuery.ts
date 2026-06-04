import { useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

/**
 * Reads config from a ConfigLoader via Suspense.
 * Must be wrapped in a <Suspense> boundary.
 * Use useConfigQuery for inline loading/error states without Suspense.
 *
 * @example
 * const { data: config } = useConfigSuspenseQuery(appConfigLoader);
 */
export function useConfigSuspenseQuery<TConfig, TRuntime>(
  loader: ConfigLoader<TConfig, TRuntime>,
) {
  return useSuspenseQuery({
    queryKey: loader.queryKey,
    queryFn: () => loader.load(),
    staleTime: Infinity,
  });
}
