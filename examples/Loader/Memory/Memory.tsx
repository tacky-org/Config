import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../../_shared/AppConfig";

// fromMemory returns a static value — no network, no filesystem.
// The go-to loader for tests and Storybook.

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "app_config",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

const queryClient = new QueryClient();

const Display = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return (
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
      <li>Dark mode: {config.darkMode ? "On" : "Off"}</li>
    </ul>
  );
};

export const MemoryLoader = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
