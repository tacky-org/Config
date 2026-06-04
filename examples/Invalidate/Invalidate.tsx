import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  ConfigLoader,
  ConfigPipelineError,
  useConfigInvalidate,
  useConfigQuery,
  useConfigSuspenseQuery,
} from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { AppConfig, validateAppConfig } from "../_shared/AppConfig";

// Shared broken-then-fixed config source.
let inlineVersion = 1;
let suspenseVersion = 1;

const makeLoader = (getVersion: () => number, key: string) =>
  ConfigLoader.create<AppConfig>({
    key,
    load: () => {
      if (getVersion() === 1) throw new Error("Service temporarily unavailable");
      return { apiUrl: "https://api.example.com", timeout: 3000, darkMode: false };
    },
    validate: validateAppConfig,
  });

const inlineLoader   = makeLoader(() => inlineVersion,   "invalidate_inline");
const suspenseLoader = makeLoader(() => suspenseVersion, "invalidate_suspense");

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

// ─── useConfigQuery — inline states ──────────────────────────────────────────
// Error state is handled inline — no ErrorBoundary to reset.

const InlinePanel = () => {
  const { data: config, isError, error } = useConfigQuery(inlineLoader);
  const invalidate = useConfigInvalidate(inlineLoader);

  return (
    <div>
      {isError && (
        <div>
          <p style={{ color: "red" }}>
            {error instanceof ConfigPipelineError ? error.cause instanceof Error ? error.cause.message : String(error.cause) : String(error)}
          </p>
          <button onClick={() => { inlineVersion = 2; invalidate.invalidate(); }}>
            Fix API and reload
          </button>
        </div>
      )}
      {config && (
        <ul>
          <li>API URL: {config.apiUrl}</li>
          <li>Timeout: {config.timeout}ms</li>
        </ul>
      )}
    </div>
  );
};

export const InlineInvalidate = () => (
  <QueryClientProvider client={queryClient}>
    <InlinePanel />
  </QueryClientProvider>
);

// ─── useSuspenseQuery — QueryErrorResetBoundary ───────────────────────────────
// QueryErrorResetBoundary provides a reset() that clears TanStack's error state.
// Wiring it to ErrorBoundary.onReset lets the boundary remount and the query retry.

const SuspensePanel = () => {
  const { data: config } = useConfigSuspenseQuery(suspenseLoader);
  return (
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
    </ul>
  );
};

export const SuspenseInvalidate = () => (
  <QueryClientProvider client={queryClient}>
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={(error, resetBoundary) => (
            <div>
              <p style={{ color: "red" }}>
                {error instanceof ConfigPipelineError ? error.cause instanceof Error ? error.cause.message : String(error.cause) : error.message}
              </p>
              <button onClick={() => { suspenseVersion = 2; resetBoundary(); }}>
                Fix API and reload
              </button>
            </div>
          )}
        >
          <Suspense fallback={<p>Loading config…</p>}>
            <SuspensePanel />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  </QueryClientProvider>
);
