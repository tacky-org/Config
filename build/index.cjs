'use strict';

var reactQuery = require('@tanstack/react-query');

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
  async load() {
    const maxRetries = this.options.retries ?? 0;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let raw;
      try {
        raw = await this.options.load();
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
  /** The TanStack Query key for this loader: `config__<key>`. */
  get queryKey() {
    return [`${CONFIG_KEY_PREFIX}${this.options.key}`];
  }
};
__name(_ConfigLoader, "ConfigLoader");
var ConfigLoader = _ConfigLoader;
function createConfigQuery(loader, options = {}) {
  return reactQuery.queryOptions({
    queryKey: loader.queryKey,
    queryFn: /* @__PURE__ */ __name(() => loader.load(), "queryFn"),
    staleTime: options.staleTime ?? Infinity
  });
}
__name(createConfigQuery, "createConfigQuery");

// src/Query/prefetchConfig.ts
function prefetchConfig(loader, queryClient) {
  return queryClient.ensureQueryData(createConfigQuery(loader));
}
__name(prefetchConfig, "prefetchConfig");
function useConfigQuery(loader) {
  return reactQuery.useQuery({
    queryKey: loader.queryKey,
    queryFn: /* @__PURE__ */ __name(() => loader.load(), "queryFn"),
    staleTime: Infinity
  });
}
__name(useConfigQuery, "useConfigQuery");
function useConfigSuspenseQuery(loader) {
  return reactQuery.useSuspenseQuery({
    queryKey: loader.queryKey,
    queryFn: /* @__PURE__ */ __name(() => loader.load(), "queryFn"),
    staleTime: Infinity
  });
}
__name(useConfigSuspenseQuery, "useConfigSuspenseQuery");
function useConfigInvalidate(loader) {
  const queryClient = reactQuery.useQueryClient();
  const { mutate, isPending, isError, isSuccess, error, reset } = reactQuery.useMutation({
    mutationFn: /* @__PURE__ */ __name(() => queryClient.invalidateQueries({ queryKey: loader.queryKey }), "mutationFn")
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

exports.CONFIG_KEY_PREFIX = CONFIG_KEY_PREFIX;
exports.ConfigLoader = ConfigLoader;
exports.ConfigPipelineError = ConfigPipelineError;
exports.createConfigQuery = createConfigQuery;
exports.fromFetch = fromFetch;
exports.fromMemory = fromMemory;
exports.fromScript = fromScript;
exports.fromStorage = fromStorage;
exports.fromWindow = fromWindow;
exports.prefetchConfig = prefetchConfig;
exports.useConfigInvalidate = useConfigInvalidate;
exports.useConfigQuery = useConfigQuery;
exports.useConfigSuspenseQuery = useConfigSuspenseQuery;
exports.withJoi = withJoi;
exports.withValibot = withValibot;
exports.withYup = withYup;
exports.withZod = withZod;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map