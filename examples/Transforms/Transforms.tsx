import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";

interface RawConfig {
  api_url: string;
  timeout_ms: number;
  feature_flags: string[];
}

interface AppConfig {
  apiUrl: string;
  timeout: number;
  features: Set<string>;
  hasFeature: (flag: string) => boolean;
}

const validateRaw = (raw: unknown): RawConfig => {
  const r = raw as RawConfig;
  if (typeof r?.api_url !== "string")      throw new Error("Invalid api_url");
  if (typeof r?.timeout_ms !== "number")   throw new Error("Invalid timeout_ms");
  if (!Array.isArray(r?.feature_flags))    throw new Error("Invalid feature_flags");
  return r;
};

const toAppConfig = ({ api_url, timeout_ms, feature_flags }: RawConfig): AppConfig => {
  const features = new Set(feature_flags);
  return { apiUrl: api_url, timeout: timeout_ms, features, hasFeature: (f) => features.has(f) };
};

// ─── without context ──────────────────────────────────────────────────────────

const configLoader = ConfigLoader.create<RawConfig, AppConfig>({
  key:      "transforms_config",
  load:     fromMemory({
    api_url:       "https://api.example.com",
    timeout_ms:    5000,
    feature_flags: ["dark_mode", "new_dashboard"],
  } satisfies RawConfig),
  validate: validateRaw,
  map:      toAppConfig,
});

const queryClient = new QueryClient();

const Display = ({ config }: { config: AppConfig }) => (
  <ul>
    <li>API URL: {config.apiUrl}</li>
    <li>Timeout: {config.timeout}ms</li>
    <li>dark_mode: {config.hasFeature("dark_mode") ? "✓ enabled" : "disabled"}</li>
    <li>new_dashboard: {config.hasFeature("new_dashboard") ? "✓ enabled" : "disabled"}</li>
    <li>beta: {config.hasFeature("beta") ? "✓ enabled" : "disabled"}</li>
  </ul>
);

const ConfigDisplay = () => {
  const { data: config } = useConfigSuspenseQuery(configLoader);
  return <Display config={config} />;
};

export const Transforms = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <ConfigDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── with context — feature flags vary by environment ─────────────────────────

interface EnvCtx { env: "production" | "staging" }

const RAW_BY_ENV: Record<string, RawConfig> = {
  production: { api_url: "https://api.example.com",         timeout_ms: 5000, feature_flags: ["dark_mode"] },
  staging:    { api_url: "https://staging.api.example.com", timeout_ms: 3000, feature_flags: ["dark_mode", "new_dashboard", "beta"] },
};

const ctxConfigLoader = ConfigLoader.create<RawConfig, AppConfig, EnvCtx>({
  key:      (ctx) => ["transforms_config", ctx.env],
  load:     (ctx) => fromMemory(RAW_BY_ENV[ctx.env])(),
  validate: validateRaw,
  map:      toAppConfig,
});

const contextQueryClient = new QueryClient();

const EnvDisplay = ({ env }: { env: "production" | "staging" }) => {
  const { data: config } = useConfigSuspenseQuery(ctxConfigLoader, { env });
  return <Display config={config} />;
};

export const TransformsWithContext = () => (
  <QueryClientProvider client={contextQueryClient}>
    <ErrorBoundary>
      <p><strong>Production</strong></p>
      <Suspense fallback={<p>Loading…</p>}>
        <EnvDisplay env="production" />
      </Suspense>
      <p><strong>Staging</strong></p>
      <Suspense fallback={<p>Loading…</p>}>
        <EnvDisplay env="staging" />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
