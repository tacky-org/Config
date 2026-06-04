import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";

// map transforms validated TConfig into a richer runtime shape.
// Config is readonly so there is no unmap.

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

const configLoader = ConfigLoader.create<RawConfig, AppConfig>({
  key: "transforms_config",
  load: fromMemory({
    api_url: "https://api.example.com",
    timeout_ms: 5000,
    feature_flags: ["dark_mode", "new_dashboard"],
  } satisfies RawConfig),

  validate: (raw) => {
    const r = raw as RawConfig;
    if (typeof r?.api_url !== "string") throw new Error("Invalid api_url");
    if (typeof r?.timeout_ms !== "number") throw new Error("Invalid timeout_ms");
    if (!Array.isArray(r?.feature_flags)) throw new Error("Invalid feature_flags");
    return r;
  },

  // map: RawConfig → AppConfig (camelCase + Set + helper)
  map: ({ api_url, timeout_ms, feature_flags }) => {
    const features = new Set(feature_flags);
    return {
      apiUrl:     api_url,
      timeout:    timeout_ms,
      features,
      hasFeature: (flag) => features.has(flag),
    };
  },
});

const queryClient = new QueryClient();

const Display = () => {
  const { data: config } = useConfigSuspenseQuery(configLoader);
  return (
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
      <li>dark_mode: {config.hasFeature("dark_mode") ? "✓ enabled" : "disabled"}</li>
      <li>new_dashboard: {config.hasFeature("new_dashboard") ? "✓ enabled" : "disabled"}</li>
      <li>beta: {config.hasFeature("beta") ? "✓ enabled" : "disabled"}</li>
    </ul>
  );
};

export const Transforms = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
