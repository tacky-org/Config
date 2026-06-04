import { QueryClient } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";
import { createConfigQuery } from "./createConfigQuery";

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
export function prefetchConfig<TConfig, TRuntime>(
  loader: ConfigLoader<TConfig, TRuntime>,
  queryClient: QueryClient,
): Promise<TRuntime> {
  return queryClient.ensureQueryData(createConfigQuery(loader));
}
