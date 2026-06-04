import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigQuery, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

const queryClient = new QueryClient();

// ─── useConfigSuspenseQuery ───────────────────────────────────────────────────

const suspenseLoader = ConfigLoader.create<AppConfig>({
  key:      "reading_suspense",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

const SuspenseDisplay = () => {
  const { data: config } = useConfigSuspenseQuery(suspenseLoader);
  // data is always AppConfig — useSuspenseQuery guarantees it
  return <p>API: <strong>{config.apiUrl}</strong> | Timeout: <strong>{config.timeout}ms</strong></p>;
};

export const SuspenseReading = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <SuspenseDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── useConfigQuery ───────────────────────────────────────────────────────────

const inlineLoader = ConfigLoader.create<AppConfig>({
  key:      "reading_inline",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

const InlineDisplay = () => {
  const { data: config, isLoading, isError, error } = useConfigQuery(inlineLoader);

  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p style={{ color: "red" }}>Error: {String(error)}</p>;
  if (!config)   return null;

  return <p>API: <strong>{config.apiUrl}</strong> | Timeout: <strong>{config.timeout}ms</strong></p>;
};

export const InlineReading = () => (
  <QueryClientProvider client={queryClient}>
    <InlineDisplay />
  </QueryClientProvider>
);
