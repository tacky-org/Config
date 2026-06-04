import React, { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, prefetchConfig, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

// Simulate an async config load (e.g. fromFetch) with a short delay.
const slowLoad = (): Promise<AppConfig> =>
  new Promise((resolve) => setTimeout(() => resolve(STATIC_APP_CONFIG), 800));

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "prefetch_demo",
  load:     slowLoad,
  validate: validateAppConfig,
});

const Display = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return (
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
    </ul>
  );
};

// ─── without prefetch — Suspense fallback shows for ~800ms ───────────────────

const withoutQueryClient = new QueryClient();

export const WithoutPrefetch = () => (
  <QueryClientProvider client={withoutQueryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p><em>Loading config… (no prefetch)</em></p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── with loader — router waits, then renders without suspend ─────────────────
// Simulates TanStack Router's loader: prefetchConfig runs in the loader,
// the router waits for it to resolve, then mounts the route component.
// By the time the component tree renders, data is already in cache.

const loaderQueryClient = new QueryClient();

export const WithLoader = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulates: loader: ({ context: { queryClient } }) => prefetchConfig(appConfigLoader, queryClient)
    prefetchConfig(appConfigLoader, loaderQueryClient).then(() => setReady(true));
  }, []);

  if (!ready) return <p><em>Route loader running…</em></p>;

  return (
    <QueryClientProvider client={loaderQueryClient}>
      <ErrorBoundary>
        {/* Suspense fallback never shows — data is already in cache */}
        <Suspense fallback={<p>This should not appear</p>}>
          <Display />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

// ─── loader with return value — data also available via useLoaderData() ───────
// loader can return the prefetched config directly.
// Components can then read it via Route.useLoaderData() instead of (or alongside)
// useConfigSuspenseQuery — both point at the same cached value.

const loaderDataQueryClient = new QueryClient();

const DisplayFromLoaderData = ({ config }: { config: AppConfig }) => (
  <div>
    <p><strong>From useLoaderData():</strong></p>
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
    </ul>
  </div>
);

export const WithLoaderData = () => {
  const [loaderData, setLoaderData] = useState<AppConfig | null>(null);

  useEffect(() => {
    // Simulates:
    // loader: async ({ context: { queryClient } }) => {
    //   const config = await prefetchConfig(appConfigLoader, queryClient);
    //   return { config }; // available via Route.useLoaderData()
    // }
    prefetchConfig(appConfigLoader, loaderDataQueryClient).then((config) => {
      setLoaderData(config);
    });
  }, []);

  if (!loaderData) return <p><em>Route loader running…</em></p>;

  return (
    <QueryClientProvider client={loaderDataQueryClient}>
      <ErrorBoundary>
        <DisplayFromLoaderData config={loaderData} />
        <p><strong>From useConfigSuspenseQuery() — same cached value:</strong></p>
        <Suspense fallback={null}>
          <Display />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
