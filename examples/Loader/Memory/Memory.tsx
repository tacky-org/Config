import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../../_shared/AppConfig";

// ─── without context — single shared cache entry ──────────────────────────────

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "app_config",
  load:     fromMemory(STATIC_APP_CONFIG),
  validate: validateAppConfig,
});

const queryClient = new QueryClient();

const Display = ({ config }: { config: AppConfig }) => (
  <ul>
    <li>API URL: {config.apiUrl}</li>
    <li>Timeout: {config.timeout}ms</li>
    <li>Dark mode: {config.darkMode ? "On" : "Off"}</li>
  </ul>
);

const AppConfigDisplay = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <Display config={config} />;
};

export const MemoryLoader = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <AppConfigDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── with context — separate cache entry per theme ────────────────────────────

interface ThemeCtx { darkMode: boolean }

const themedConfigLoader = ConfigLoader.create<AppConfig, AppConfig, ThemeCtx>({
  key:      (ctx) => ["app_config", ctx.darkMode ? "dark" : "light"],
  load:     (ctx) => fromMemory({ ...STATIC_APP_CONFIG, darkMode: ctx.darkMode })(),
  validate: validateAppConfig,
});

const contextQueryClient = new QueryClient();

const ThemedDisplay = ({ darkMode }: { darkMode: boolean }) => {
  const { data: config } = useConfigSuspenseQuery(themedConfigLoader, { darkMode });
  return (
    <div style={{ background: config.darkMode ? "#222" : "#fff", color: config.darkMode ? "#fff" : "#222", padding: "8px 12px", borderRadius: 4 }}>
      <Display config={config} />
    </div>
  );
};

export const MemoryLoaderWithContext = () => (
  <QueryClientProvider client={contextQueryClient}>
    <ErrorBoundary>
      <p><strong>Light theme</strong></p>
      <Suspense fallback={<p>Loading…</p>}>
        <ThemedDisplay darkMode={false} />
      </Suspense>
      <p><strong>Dark theme</strong></p>
      <Suspense fallback={<p>Loading…</p>}>
        <ThemedDisplay darkMode={true} />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
