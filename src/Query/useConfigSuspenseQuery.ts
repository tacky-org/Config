import { useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

type ContextArg<TContext> = TContext extends void ? [] : [ctx: TContext];

/**
 * Reads config from a ConfigLoader via Suspense.
 * Must be wrapped in a <Suspense> boundary.
 * Use useConfigQuery for inline loading/error states without Suspense.
 *
 * @example
 * const { data: config } = useConfigSuspenseQuery(appConfigLoader);
 * const { data } = useConfigSuspenseQuery(todoLoader, { language: 'en' });
 */
export function useConfigSuspenseQuery<TConfig, TRuntime, TContext = void>(
  loader: ConfigLoader<TConfig, TRuntime, TContext>,
  ...[ctx]: ContextArg<TContext>
) {
  return useSuspenseQuery(
    loader.queryOptions(...([ctx] as ContextArg<TContext>)),
  );
}
