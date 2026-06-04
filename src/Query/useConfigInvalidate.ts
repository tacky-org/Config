import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigLoader } from "@/Domain/ConfigLoader";

/**
 * Returns an object with an invalidate() method and TanStack mutation status.
 * Calling invalidate() marks the config cache as stale and triggers a fresh load.
 *
 * @example
 * const invalidate = useConfigInvalidate(appConfigLoader);
 *
 * invalidate.invalidate();
 * invalidate.isPending  // true while re-fetching
 * invalidate.isError    // true if the new load failed
 * invalidate.error      // the ConfigPipelineError, if any
 */
export function useConfigInvalidate<TConfig, TRuntime>(
  loader: ConfigLoader<TConfig, TRuntime>,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, error, reset } = useMutation({
    mutationFn: () =>
      queryClient.invalidateQueries({ queryKey: loader.queryKey }),
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
