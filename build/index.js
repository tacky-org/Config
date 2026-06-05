import { queryOptions, useQuery, useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/Types.ts
var CONFIG_KEY_PREFIX = "config__";

// src/Errors/ConfigPipelineError.ts
var _ConfigPipelineError = class _ConfigPipelineError extends Error {
  constructor(step, cause) {
    super(
      `Config pipeline failed at step "${step}": ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause }
    );
    this.name = "ConfigPipelineError";
    this.step = step;
  }
};
__name(_ConfigPipelineError, "ConfigPipelineError");
var ConfigPipelineError = _ConfigPipelineError;

// src/Domain/ConfigLoader.ts
var wait = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "wait");
var _ConfigLoader = class _ConfigLoader {
  constructor(options) {
    this.options = options;
  }
  static create(options) {
    return new _ConfigLoader(options);
  }
  /**
   * Executes the load pipeline: fetch → validate → map.
   * Named to mirror the `queryFn` concept in TanStack Query.
   *
   * @example
   * await appConfigLoader.queryFn();
   * await todoLoader.queryFn({ language: 'en' });
   */
  async queryFn(...[ctx]) {
    const resolvedCtx = ctx;
    const maxRetries = this.options.retries ?? 0;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let raw;
      try {
        raw = await this.options.load(resolvedCtx);
      } catch (cause) {
        lastError = new ConfigPipelineError("load", cause);
        if (attempt < maxRetries) {
          await wait(200 * 2 ** attempt);
        }
        continue;
      }
      let config;
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
      return config;
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
  queryKey(...[ctx]) {
    const resolvedCtx = ctx;
    const { key } = this.options;
    if (typeof key === "string") {
      return [`${CONFIG_KEY_PREFIX}${key}`];
    }
    if (resolvedCtx === void 0) {
      return [`${CONFIG_KEY_PREFIX}`];
    }
    const result = key(resolvedCtx);
    if (typeof result === "string") {
      return [`${CONFIG_KEY_PREFIX}${result}`];
    }
    const [name, ...rest] = result;
    return [`${CONFIG_KEY_PREFIX}${name}`, ...rest];
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
  queryOptions(...[ctx]) {
    const resolvedCtx = ctx;
    return queryOptions({
      queryKey: this.queryKey(...[resolvedCtx]),
      queryFn: /* @__PURE__ */ __name(() => this.queryFn(...[resolvedCtx]), "queryFn"),
      staleTime: Infinity
    });
  }
};
__name(_ConfigLoader, "ConfigLoader");
var ConfigLoader = _ConfigLoader;
function useConfigQuery(loader, ...[ctx]) {
  return useQuery(loader.queryOptions(...[ctx]));
}
__name(useConfigQuery, "useConfigQuery");
function useConfigSuspenseQuery(loader, ...[ctx]) {
  return useSuspenseQuery(
    loader.queryOptions(...[ctx])
  );
}
__name(useConfigSuspenseQuery, "useConfigSuspenseQuery");
function useConfigInvalidate(loader, ...[ctx]) {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, isSuccess, error, reset } = useMutation({
    mutationFn: /* @__PURE__ */ __name(() => queryClient.invalidateQueries({
      queryKey: loader.queryKey(...[ctx])
    }), "mutationFn")
  });
  return {
    invalidate: /* @__PURE__ */ __name(() => mutate(), "invalidate"),
    isPending,
    isError,
    isSuccess,
    error,
    reset
  };
}
__name(useConfigInvalidate, "useConfigInvalidate");

// src/Adapters/loaders.ts
function fromFetch(url, options = {}) {
  const { errorPrefix, ...init } = options;
  return () => fetch(url, init).then((res) => {
    if (!res.ok) {
      const prefix = errorPrefix ?? url;
      throw new Error(`${prefix}: HTTP ${res.status}`);
    }
    return res.json();
  });
}
__name(fromFetch, "fromFetch");
function fromStorage(storage, key) {
  return () => {
    const item = storage.getItem(key);
    if (item === null) throw new Error(`Storage key "${key}" not found`);
    try {
      return JSON.parse(item);
    } catch {
      throw new Error(`Storage key "${key}" contains invalid JSON`);
    }
  };
}
__name(fromStorage, "fromStorage");
function fromWindow(key) {
  return () => {
    const value = window[key];
    if (value === void 0) {
      throw new Error(
        `window.${key} is not defined. Make sure the server embeds it before this script runs.`
      );
    }
    return value;
  };
}
__name(fromWindow, "fromWindow");
function fromScript(id) {
  return () => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`<script id="${id}"> not found in the document`);
    try {
      return JSON.parse(el.textContent ?? "");
    } catch {
      throw new Error(`<script id="${id}"> contains invalid JSON`);
    }
  };
}
__name(fromScript, "fromScript");
function fromMemory(value) {
  return () => value;
}
__name(fromMemory, "fromMemory");

// src/Adapters/validators.ts
function withZod(schema) {
  return (raw) => schema.parse(raw);
}
__name(withZod, "withZod");
function withYup(schema) {
  return (raw) => schema.validateSync(raw);
}
__name(withYup, "withYup");
function withJoi(schema) {
  return (raw) => {
    const { error, value } = schema.validate(raw);
    if (error) throw error;
    return value;
  };
}
__name(withJoi, "withJoi");
function withValibot(parser) {
  return (raw) => parser(raw);
}
__name(withValibot, "withValibot");

export { CONFIG_KEY_PREFIX, ConfigLoader, ConfigPipelineError, fromFetch, fromMemory, fromScript, fromStorage, fromWindow, useConfigInvalidate, useConfigQuery, useConfigSuspenseQuery, withJoi, withValibot, withYup, withZod };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map