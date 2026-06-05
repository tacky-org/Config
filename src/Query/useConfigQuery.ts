import { useQuery } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

type ContextArg<TContext> = TContext extends void ? [] : [ctx: TContext];

/**
 * Reads config from a ConfigLoader.
 * Returns isLoading, isError and error for inline state handling — no <Suspense> needed.
 * Use useConfigSuspenseQuery when you prefer Suspense boundaries.
 *
 * @example
 * const { data: config, isLoading, isError } = useConfigQuery(appConfigLoader);
 * const { data } = useConfigQuery(todoLoader, { language: 'en' });
 */
export function useConfigQuery<TConfig, TRuntime, TContext = void>(
  loader: ConfigLoader<TConfig, TRuntime, TContext>,
  ...[ctx]: ContextArg<TContext>
) {
  return useQuery(loader.queryOptions(...([ctx] as ContextArg<TContext>)));
}
