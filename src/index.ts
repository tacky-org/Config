// ─── core ─────────────────────────────────────────────────────────────────────
export { ConfigLoader } from "./Domain/ConfigLoader";

// ─── tanstack query integration ───────────────────────────────────────────────
export { createConfigQuery } from "./Query/createConfigQuery";
export type { CreateConfigQueryOptions } from "./Query/createConfigQuery";

// ─── load adapters ────────────────────────────────────────────────────────────
export {
  fromFetch,
  fromStorage,
  fromWindow,
  fromScript,
  fromJsonFile,
  fromEnv,
  fromPublicEnv,
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
