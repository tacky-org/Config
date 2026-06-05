import { queryOptions } from "@tanstack/react-query";
import { CONFIG_KEY_PREFIX, ConfigLoaderOptions } from "@/Types";
import { ConfigPipelineError } from "@/Errors/ConfigPipelineError";

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type ContextArg<TContext> = TContext extends void ? [] : [ctx: TContext];

export class ConfigLoader<TConfig, TRuntime = TConfig, TContext = void> {
  private readonly options: ConfigLoaderOptions<TConfig, TRuntime, TContext>;

  constructor(options: ConfigLoaderOptions<TConfig, TRuntime, TContext>) {
    this.options = options;
  }

  static create<TConfig, TRuntime = TConfig, TContext = void>(
    options: ConfigLoaderOptions<TConfig, TRuntime, TContext>,
  ): ConfigLoader<TConfig, TRuntime, TContext> {
    return new ConfigLoader(options);
  }

  /**
   * Executes the load pipeline: fetch → validate → map.
   * Named to mirror the `queryFn` concept in TanStack Query.
   *
   * @example
   * await appConfigLoader.queryFn();
   * await todoLoader.queryFn({ language: 'en' });
   */
  async queryFn(...[ctx]: ContextArg<TContext>): Promise<TRuntime> {
    const resolvedCtx = ctx as TContext;
    const maxRetries = this.options.retries ?? 0;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let raw: unknown;

      try {
        raw = await this.options.load(resolvedCtx);
      } catch (cause) {
        lastError = new ConfigPipelineError("load", cause);
        if (attempt < maxRetries) {
          await wait(200 * 2 ** attempt);
        }
        continue;
      }

      // validate and map are deterministic — do not retry, throw immediately
      let config: TConfig;
      try {
        config = this.options.validate(raw);
      } catch (cause) {
        throw new ConfigPipelineError("validate", cause);
      }

      if (this.options.map) {
        try {
          return this.options.map(config);
        } catch (cause) {
          throw new ConfigPipelineError("map", cause);
        }
      }

      return config as unknown as TRuntime;
    }

    throw lastError;
  }

  /**
   * TanStack Query key for this loader, derived from the `key` option.
   * Pass context when TContext is not void to get the full specific key.
   * Omit context to get the base key for prefix-matching (e.g. invalidate all variants).
   *
   * @example
   * appConfigLoader.queryKey()                  // ['config__app']
   * todoLoader.queryKey({ language: 'en' })     // ['config__todo', 'en']
   * todoLoader.queryKey()                       // ['config__todo']  — matches all variants
   */
  queryKey(...[ctx]: ContextArg<TContext>): readonly [string, ...unknown[]] {
    const resolvedCtx = ctx as TContext;
    const { key } = this.options;
    if (typeof key === "string") {
      return [`${CONFIG_KEY_PREFIX}${key}`] as const;
    }
    // No ctx — return base key for prefix-matching
    if (resolvedCtx === undefined) {
      return [`${CONFIG_KEY_PREFIX}`] as const;
    }
    const result = key(resolvedCtx);
    if (typeof result === "string") {
      return [`${CONFIG_KEY_PREFIX}${result}`] as const;
    }
    const [name, ...rest] = result;
    return [`${CONFIG_KEY_PREFIX}${name}`, ...rest] as const;
  }

  /**
   * Returns a TanStack `queryOptions` object ready to pass to `queryClient` methods
   * or `useQuery` / `useSuspenseQuery` directly.
   * Named to mirror TanStack Query's own `queryOptions()` helper.
   *
   * @example
   * // outside a component
   * await queryClient.prefetchQuery(appConfigLoader.queryOptions());
   * await queryClient.ensureQueryData(todoLoader.queryOptions({ language: 'en' }));
   * await queryClient.invalidateQueries(todoLoader.queryOptions({ language: 'en' }));
   *
   * // invalidate all variants at once
   * await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });
   *
   * // inside a component (hooks are usually cleaner)
   * const { data } = useSuspenseQuery(appConfigLoader.queryOptions());
   */
  queryOptions(...[ctx]: ContextArg<TContext>) {
    const resolvedCtx = ctx as TContext;
    return queryOptions({
      queryKey: this.queryKey(...([resolvedCtx] as ContextArg<TContext>)),
      queryFn: () => this.queryFn(...([resolvedCtx] as ContextArg<TContext>)),
      staleTime: Infinity,
    });
  }
}
