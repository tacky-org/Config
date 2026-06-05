import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

type ContextArg<TContext> = TContext extends void ? [] : [ctx: TContext];

/**
 * Returns an object with an invalidate() method and TanStack mutation status.
 * Calling invalidate() marks the config cache as stale and triggers a fresh load.
 *
 * Omit ctx to invalidate all cache entries for the loader (prefix match).
 * Pass ctx to target a specific cache entry.
 *
 * @example
 * const { invalidate } = useConfigInvalidate(appConfigLoader);
 * const { invalidate } = useConfigInvalidate(todoLoader, { language: 'en' });
 *
 * invalidate.isPending  // true while re-fetching
 * invalidate.isError    // true if the new load failed
 */
export function useConfigInvalidate<TConfig, TRuntime, TContext = void>(
  loader: ConfigLoader<TConfig, TRuntime, TContext>,
  ...[ctx]: ContextArg<TContext>
) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, error, reset } = useMutation({
    mutationFn: () =>
      queryClient.invalidateQueries({
        queryKey: loader.queryKey(...([ctx] as ContextArg<TContext>)),
      }),
  });

  return {
    invalidate: () => mutate(),
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  };
}
