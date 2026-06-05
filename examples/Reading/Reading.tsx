import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigQuery, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

const queryClient = new QueryClient();

// ─── useConfigSuspenseQuery — without context ─────────────────────────────────

const suspenseLoader = ConfigLoader.create<AppConfig>({
  key:      "reading_suspense",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

const SuspenseDisplay = () => {
  const { data: config } = useConfigSuspenseQuery(suspenseLoader);
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

// ─── useConfigQuery — without context ────────────────────────────────────────

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

// ─── useConfigSuspenseQuery — with context ────────────────────────────────────

interface ThemeCtx { darkMode: boolean }

const suspenseCtxLoader = ConfigLoader.create<AppConfig, AppConfig, ThemeCtx>({
  key:      (ctx) => ["reading_suspense_ctx", ctx.darkMode ? "dark" : "light"],
  load:     (ctx) => fromMemory({ ...STATIC_APP_CONFIG, darkMode: ctx.darkMode })(),
  validate: validateAppConfig,
});

const SuspenseCtxDisplay = ({ darkMode }: { darkMode: boolean }) => {
  const { data: config } = useConfigSuspenseQuery(suspenseCtxLoader, { darkMode });
  return <p>Dark mode: <strong>{config.darkMode ? "On" : "Off"}</strong> | Timeout: <strong>{config.timeout}ms</strong></p>;
};

export const SuspenseReadingWithContext = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading light…</p>}>
        <SuspenseCtxDisplay darkMode={false} />
      </Suspense>
      <Suspense fallback={<p>Loading dark…</p>}>
        <SuspenseCtxDisplay darkMode={true} />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── useConfigQuery — with context ───────────────────────────────────────────

const inlineCtxLoader = ConfigLoader.create<AppConfig, AppConfig, ThemeCtx>({
  key:      (ctx) => ["reading_inline_ctx", ctx.darkMode ? "dark" : "light"],
  load:     (ctx) => fromMemory({ ...STATIC_APP_CONFIG, darkMode: ctx.darkMode })(),
  validate: validateAppConfig,
});

const InlineCtxDisplay = ({ darkMode }: { darkMode: boolean }) => {
  const { data: config, isLoading, isError, error } = useConfigQuery(inlineCtxLoader, { darkMode });
  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p style={{ color: "red" }}>Error: {String(error)}</p>;
  if (!config)   return null;
  return <p>Dark mode: <strong>{config.darkMode ? "On" : "Off"}</strong> | Timeout: <strong>{config.timeout}ms</strong></p>;
};

export const InlineReadingWithContext = () => (
  <QueryClientProvider client={queryClient}>
    <InlineCtxDisplay darkMode={false} />
    <InlineCtxDisplay darkMode={true} />
  </QueryClientProvider>
);
