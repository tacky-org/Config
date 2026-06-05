import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

// ─── without context ──────────────────────────────────────────────────────────
// configs/appConfig.ts — define once, import anywhere

export const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "app_config",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

// components/ApiStatus.tsx
const ApiStatus = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>Connected to: <strong>{config.apiUrl}</strong></p>;
};

// components/TimeoutBadge.tsx
const TimeoutBadge = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>Timeout: <strong>{config.timeout}ms</strong></p>;
};

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

// ─── with context ─────────────────────────────────────────────────────────────
// configs/langConfig.ts — loader derives cache key from context

interface LangCtx { language: string }

export const langConfigLoader = ConfigLoader.create<AppConfig, AppConfig, LangCtx>({
  key:  (ctx) => ["lang_config", ctx.language],
  // In production: fromFetch('/api/config', { headers: { 'Accept-Language': ctx.language } })()
  load: (ctx) => fromMemory({ ...STATIC_APP_CONFIG, apiUrl: `https://api.example.com/${ctx.language}` })(),
  validate: validateAppConfig,
});

// components/ApiStatusLocalized.tsx
const ApiStatusLocalized = ({ language }: { language: string }) => {
  const { data: config } = useConfigSuspenseQuery(langConfigLoader, { language });
  return <p>Connected to: <strong>{config.apiUrl}</strong></p>;
};

// components/TimeoutBadgeLocalized.tsx
const TimeoutBadgeLocalized = ({ language }: { language: string }) => {
  const { data: config } = useConfigSuspenseQuery(langConfigLoader, { language });
  return <p>Timeout: <strong>{config.timeout}ms</strong></p>;
};

const contextQueryClient = new QueryClient();

export const AppPatternWithContext = () => (
  <QueryClientProvider client={contextQueryClient}>
    <ErrorBoundary>
      <p><strong>EN</strong></p>
      <Suspense fallback={<p>Loading EN config…</p>}>
        <ApiStatusLocalized language="en" />
        <TimeoutBadgeLocalized language="en" />
      </Suspense>
      <p><strong>FR</strong></p>
      <Suspense fallback={<p>Loading FR config…</p>}>
        <ApiStatusLocalized language="fr" />
        <TimeoutBadgeLocalized language="fr" />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
