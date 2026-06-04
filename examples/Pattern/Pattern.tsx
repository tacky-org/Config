import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

// ─── configs/appConfig.ts ─────────────────────────────────────────────────────
// Define your loader once. Import it anywhere.

export const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "app_config",
  load:     fromMemory(STATIC_APP_CONFIG), // replace with fromFetch('/api/config') in production
  validate: validateAppConfig,
});

// ─── components/ApiStatus.tsx ─────────────────────────────────────────────────

const ApiStatus = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>Connected to: <strong>{config.apiUrl}</strong></p>;
};

// ─── components/TimeoutBadge.tsx ──────────────────────────────────────────────

const TimeoutBadge = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>Timeout: <strong>{config.timeout}ms</strong></p>;
};

// ─── App ─────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

export const AppPattern = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading config…</p>}>
        <ApiStatus />
        <TimeoutBadge />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
