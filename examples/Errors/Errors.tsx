import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, ConfigPipelineError, fromFetch, fromMemory, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";
import { validateAppConfig } from "../_shared/AppConfig";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const PipelineFallback = ({ error }: { error: Error }) => {
  if (!(error instanceof ConfigPipelineError)) {
    return <p style={{ color: "red" }}>Unexpected error: {error.message}</p>;
  }
  return (
    <div style={{ color: "red", fontFamily: "monospace" }}>
      <strong>ConfigPipelineError</strong>
      <ul>
        <li>step: <code>{error.step}</code></li>
        <li>message: {error.message}</li>
        <li>cause: {String(error.cause)}</li>
      </ul>
    </div>
  );
};

// ─── load step error ──────────────────────────────────────────────────────────

const loadErrorLoader = ConfigLoader.create({
  key:      "error_load",
  load:     fromFetch("https://jsonplaceholder.typicode.com/does-not-exist-404"),
  validate: validateAppConfig,
});

const LoadErrorDisplay = () => {
  const { data } = useConfigSuspenseQuery(loadErrorLoader);
  return <p>{String(data)}</p>;
};

export const LoadError = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary fallback={(e: Error) => <PipelineFallback error={e} />}>
      <Suspense fallback={<p>Loading…</p>}>
        <LoadErrorDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── validate step error ──────────────────────────────────────────────────────

const validateErrorLoader = ConfigLoader.create({
  key:      "error_validate",
  load:     fromMemory({ apiUrl: 42, timeout: "wrong", darkMode: "yes" }),
  validate: validateAppConfig,
});

const ValidateErrorDisplay = () => {
  const { data } = useConfigSuspenseQuery(validateErrorLoader);
  return <p>{String(data)}</p>;
};

export const ValidateError = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary fallback={(e: Error) => <PipelineFallback error={e} />}>
      <Suspense fallback={<p>Loading…</p>}>
        <ValidateErrorDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
