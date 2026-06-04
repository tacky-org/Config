// ─── core ─────────────────────────────────────────────────────────────────────
export { ConfigLoader } from "./Domain/ConfigLoader";
export { ConfigPipelineError } from "./Errors/ConfigPipelineError";
export type { ConfigPipelineStep } from "./Errors/ConfigPipelineError";

// ─── tanstack query integration ───────────────────────────────────────────────
export { createConfigQuery } from "./Query/createConfigQuery";
export { prefetchConfig } from "./Query/prefetchConfig";
export type { CreateConfigQueryOptions } from "./Query/createConfigQuery";
export { useConfigQuery } from "./Query/useConfigQuery";
export { useConfigSuspenseQuery } from "./Query/useConfigSuspenseQuery";
export { useConfigInvalidate } from "./Query/useConfigInvalidate";

// ─── load adapters ────────────────────────────────────────────────────────────
export {
  fromFetch,
  fromStorage,
  fromWindow,
  fromScript,
  fromMemory,
} from "./Adapters/loaders";
export type { FromFetchOptions } from "./Adapters/loaders";

// ─── validation adapters ──────────────────────────────────────────────────────
export { withZod, withYup, withJoi, withValibot } from "./Adapters/validators";

// ─── types ────────────────────────────────────────────────────────────────────
export type {
  ConfigLoaderOptions,
  ConfigRegistry,
  ResolveConfig,
} from "./Types";
export { CONFIG_KEY_PREFIX } from "./Types";
