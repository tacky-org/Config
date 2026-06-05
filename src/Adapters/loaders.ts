// ─── fromFetch ────────────────────────────────────────────────────────────────

export interface FromFetchOptions extends RequestInit {
  /**
   * Custom error message prefix. Defaults to the URL.
   */
  errorPrefix?: string;
}

/**
 * Creates a load function that fetches a JSON endpoint.
 * Throws on non-2xx responses so errors surface to TanStack as query errors.
 *
 * @example
 * // static
 * ConfigLoader.create({ key: 'app', load: fromFetch('/api/config'), validate: withZod(AppConfigSchema) });
 *
 * // with context — call fromFetch inside the load function to use ctx values
 * ConfigLoader.create({
 *   key:  (ctx) => ['app', ctx.language],
 *   load: (ctx) => fromFetch(`/api/config?lang=${ctx.language}`)(),
 *   validate: withZod(AppConfigSchema),
 * });
 */
export function fromFetch(
  url: string,
  options: FromFetchOptions = {},
): () => Promise<unknown> {
  const { errorPrefix, ...init } = options;
  return () =>
    fetch(url, init).then((res) => {
      if (!res.ok) {
        const prefix = errorPrefix ?? url;
        throw new Error(`${prefix}: HTTP ${res.status}`);
      }
      return res.json() as Promise<unknown>;
    });
}

// ─── fromStorage ──────────────────────────────────────────────────────────────

/**
 * Creates a load function that reads and JSON-parses an entry from any
 * Web Storage API implementation — pass localStorage or sessionStorage directly.
 * Throws if the key is missing or the value is invalid JSON.
 *
 * @example
 * ConfigLoader.create({ key: 'app',   load: fromStorage(localStorage,  'app_config'),    validate: withZod(AppConfigSchema) });
 * ConfigLoader.create({ key: 'flags', load: fromStorage(sessionStorage, 'feature_flags'), validate: withZod(FeatureFlagsSchema) });
 */
export function fromStorage(storage: Storage, key: string): () => unknown {
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

// ─── fromWindow ───────────────────────────────────────────────────────────────

/**
 * Creates a load function that reads a value injected onto window.
 * Common SSR pattern: the server embeds config into the HTML as a global,
 * avoiding a second network round-trip on the client.
 *
 * @example
 * // <script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };</script>
 * ConfigLoader.create({ key: 'app', load: fromWindow('__APP_CONFIG__'), validate: withZod(AppConfigSchema) });
 */
export function fromWindow(key: string): () => unknown {
  return () => {
    const value = (window as unknown as Record<string, unknown>)[key];
    if (value === undefined) {
      throw new Error(
        `window.${key} is not defined. Make sure the server embeds it before this script runs.`,
      );
    }
    return value;
  };
}

// ─── fromScript ───────────────────────────────────────────────────────────────

/**
 * Creates a load function that reads and JSON-parses an inline
 * `<script type="application/json">` tag by its id.
 * Useful for SSR config embedding without polluting the global scope.
 *
 * @example
 * // <script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}</script>
 * ConfigLoader.create({ key: 'app', load: fromScript('app-config'), validate: withZod(AppConfigSchema) });
 */
export function fromScript(id: string): () => unknown {
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

// ─── fromMemory ───────────────────────────────────────────────────────────────

/**
 * Creates a load function that returns a static in-memory value.
 * Useful for tests and Storybook where you want a known config without any network access.
 *
 * @example
 * ConfigLoader.create({
 *   key:      'app',
 *   load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 5000 }),
 *   validate: withZod(AppConfigSchema),
 * });
 */
export function fromMemory(value: unknown): () => unknown {
  return () => value;
}
