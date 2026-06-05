import React, { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, STATIC_APP_CONFIG, validateAppConfig } from "../_shared/AppConfig";

const slowLoad = (): Promise<AppConfig> =>
  new Promise((resolve) => setTimeout(() => resolve(STATIC_APP_CONFIG), 800));

// ─── without context ──────────────────────────────────────────────────────────

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      "prefetch_demo",
  load:     slowLoad,
  validate: validateAppConfig,
});

const Display = ({ config }: { config: AppConfig }) => (
  <ul>
    <li>API URL: {config.apiUrl}</li>
    <li>Timeout: {config.timeout}ms</li>
  </ul>
);

const AppDisplay = () => {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <Display config={config} />;
};

// Without prefetch — Suspense fallback shows for ~800ms
const withoutQueryClient = new QueryClient();

export const WithoutPrefetch = () => (
  <QueryClientProvider client={withoutQueryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p><em>Loading config… (no prefetch)</em></p>}>
        <AppDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// With loader — router waits, then renders without suspend
const loaderQueryClient = new QueryClient();

export const WithLoader = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulates: loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(appConfigLoader.queryOptions())
    loaderQueryClient.prefetchQuery(appConfigLoader.queryOptions()).then(() => setReady(true));
  }, []);

  if (!ready) return <p><em>Route loader running…</em></p>;

  return (
    <QueryClientProvider client={loaderQueryClient}>
      <ErrorBoundary>
        <Suspense fallback={<p>This should not appear</p>}>
          <AppDisplay />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

// Loader with return value — data also available via useLoaderData()
const loaderDataQueryClient = new QueryClient();

export const WithLoaderData = () => {
  const [loaderData, setLoaderData] = useState<AppConfig | null>(null);

  useEffect(() => {
    // Simulates:
    // loader: async ({ context: { queryClient } }) => {
    //   const config = await queryClient.ensureQueryData(appConfigLoader.queryOptions());
    //   return { config };
    // }
    loaderDataQueryClient.ensureQueryData(appConfigLoader.queryOptions()).then((config) => {
      setLoaderData(config as AppConfig);
    });
  }, []);

  if (!loaderData) return <p><em>Route loader running…</em></p>;

  return (
    <QueryClientProvider client={loaderDataQueryClient}>
      <ErrorBoundary>
        <Display config={loaderData} />
        <p><strong>From useConfigSuspenseQuery() — same cached value:</strong></p>
        <Suspense fallback={null}>
          <AppDisplay />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

// ─── with context ─────────────────────────────────────────────────────────────

interface LangCtx { language: string }

const slowLoadByLang = (language: string): Promise<AppConfig> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ ...STATIC_APP_CONFIG, apiUrl: `https://api.example.com/${language}` }), 600),
  );

const langConfigLoader = ConfigLoader.create<AppConfig, AppConfig, LangCtx>({
  key:      (ctx) => ["prefetch_demo_ctx", ctx.language],
  load:     (ctx) => slowLoadByLang(ctx.language),
  validate: validateAppConfig,
});

const LangDisplay = ({ language }: { language: string }) => {
  const { data: config } = useConfigSuspenseQuery(langConfigLoader, { language });
  return <Display config={config} />;
};

// Without prefetch — each language suspends independently
const withoutCtxQueryClient = new QueryClient();

export const WithoutPrefetchContext = () => (
  <QueryClientProvider client={withoutCtxQueryClient}>
    <ErrorBoundary>
      <p><strong>EN</strong></p>
      <Suspense fallback={<p><em>Loading EN config…</em></p>}>
        <LangDisplay language="en" />
      </Suspense>
      <p><strong>FR</strong></p>
      <Suspense fallback={<p><em>Loading FR config…</em></p>}>
        <LangDisplay language="fr" />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// With prefetch — both language variants loaded before render
const ctxLoaderQueryClient = new QueryClient();

export const WithLoaderContext = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulates:
    // loader: ({ context: { queryClient }, search }) =>
    //   Promise.all([
    //     queryClient.prefetchQuery(langConfigLoader.queryOptions({ language: 'en' })),
    //     queryClient.prefetchQuery(langConfigLoader.queryOptions({ language: 'fr' })),
    //   ])
    Promise.all([
      ctxLoaderQueryClient.prefetchQuery(langConfigLoader.queryOptions({ language: "en" })),
      ctxLoaderQueryClient.prefetchQuery(langConfigLoader.queryOptions({ language: "fr" })),
    ]).then(() => setReady(true));
  }, []);

  if (!ready) return <p><em>Route loader running…</em></p>;

  return (
    <QueryClientProvider client={ctxLoaderQueryClient}>
      <ErrorBoundary>
        <p><strong>EN</strong></p>
        <Suspense fallback={<p>This should not appear</p>}>
          <LangDisplay language="en" />
        </Suspense>
        <p><strong>FR</strong></p>
        <Suspense fallback={<p>This should not appear</p>}>
          <LangDisplay language="fr" />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
