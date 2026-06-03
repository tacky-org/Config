import { queryOptions } from '@tanstack/react-query';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
      try {
        const raw = await this.options.load();
        const config = this.options.validate(raw);
        return this.options.map ? this.options.map(config) : config;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await wait(200 * 2 ** attempt);
        }
      }
    }
    throw lastError;
  }
};
__name(_ConfigLoader, "ConfigLoader");
var ConfigLoader = _ConfigLoader;
function createConfigQuery(id, loader, options = {}) {
  return queryOptions({
    queryKey: [id],
    queryFn: /* @__PURE__ */ __name(() => loader.load(), "queryFn"),
    staleTime: options.staleTime ?? Infinity
  });
}
__name(createConfigQuery, "createConfigQuery");

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
function fromJsonFile(path) {
  return async () => {
    const { readFile } = await import('fs/promises');
    let raw;
    try {
      raw = await readFile(path, "utf8");
    } catch {
      throw new Error(`Config file not found: ${path}`);
    }
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(`Config file contains invalid JSON: ${path}`);
    }
  };
}
__name(fromJsonFile, "fromJsonFile");
function fromEnv(keys) {
  return () => {
    const result = {};
    const missing = [];
    for (const key of keys) {
      const value = process.env[key];
      if (value === void 0) {
        missing.push(key);
      } else {
        result[key] = value;
      }
    }
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }
    return result;
  };
}
__name(fromEnv, "fromEnv");
function fromPublicEnv(prefix) {
  return () => {
    const result = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(prefix) && value !== void 0) {
        result[key.slice(prefix.length)] = value;
      }
    }
    if (Object.keys(result).length === 0) {
      throw new Error(`No environment variables found with prefix "${prefix}"`);
    }
    return result;
  };
}
__name(fromPublicEnv, "fromPublicEnv");
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

export { ConfigLoader, createConfigQuery, fromEnv, fromFetch, fromJsonFile, fromMemory, fromPublicEnv, fromScript, fromStorage, fromWindow, withJoi, withValibot, withYup, withZod };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map