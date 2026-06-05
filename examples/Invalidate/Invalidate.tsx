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

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

// ─── without context — useConfigQuery inline ──────────────────────────────────

let inlineVersion = 1;

const inlineLoader = ConfigLoader.create<AppConfig>({
  key: "invalidate_inline",
  load: () => {
    if (inlineVersion === 1) throw new Error("Service temporarily unavailable");
    return { apiUrl: "https://api.example.com", timeout: 3000, darkMode: false };
  },
  validate: validateAppConfig,
});

const InlinePanel = () => {
  const { data: config, isError, error } = useConfigQuery(inlineLoader);
  const { invalidate } = useConfigInvalidate(inlineLoader);
  return (
    <div>
      {isError && (
        <div>
          <p style={{ color: "red" }}>
            {error instanceof ConfigPipelineError && error.cause instanceof Error
              ? error.cause.message
              : String(error)}
          </p>
          <button onClick={() => { inlineVersion = 2; invalidate(); }}>Fix API and reload</button>
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

// ─── without context — useConfigSuspenseQuery + boundary ─────────────────────

let suspenseVersion = 1;

const suspenseLoader = ConfigLoader.create<AppConfig>({
  key: "invalidate_suspense",
  load: () => {
    if (suspenseVersion === 1) throw new Error("Service temporarily unavailable");
    return { apiUrl: "https://api.example.com", timeout: 3000, darkMode: false };
  },
  validate: validateAppConfig,
});

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
                {error instanceof ConfigPipelineError && error.cause instanceof Error
                  ? error.cause.message
                  : error.message}
              </p>
              <button onClick={() => { suspenseVersion = 2; resetBoundary(); }}>Fix API and reload</button>
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

// ─── with context — invalidate a specific entry ───────────────────────────────

interface LangCtx { language: string }

let enVersion = 1;
let frVersion = 1;

const ctxLoader = ConfigLoader.create<AppConfig, AppConfig, LangCtx>({
  key:  (ctx) => ["invalidate_ctx", ctx.language],
  load: (ctx) => {
    const version = ctx.language === "en" ? enVersion : frVersion;
    if (version === 1) throw new Error(`${ctx.language.toUpperCase()} service unavailable`);
    return { apiUrl: `https://api.example.com/${ctx.language}`, timeout: 3000, darkMode: false };
  },
  validate: validateAppConfig,
});

const CtxPanel = ({ language }: { language: string }) => {
  const { data: config, isError, error } = useConfigQuery(ctxLoader, { language });
  const { invalidate } = useConfigInvalidate(ctxLoader, { language });
  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{language.toUpperCase()}:</strong>{" "}
      {isError && (
        <>
          <span style={{ color: "red" }}>
            {error instanceof ConfigPipelineError && error.cause instanceof Error
              ? error.cause.message
              : String(error)}
          </span>{" "}
          <button onClick={() => {
            if (language === "en") enVersion = 2; else frVersion = 2;
            invalidate();
          }}>Fix and reload</button>
        </>
      )}
      {config && <span>{config.apiUrl}</span>}
    </div>
  );
};

const contextQueryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export const ContextInvalidate = () => (
  <QueryClientProvider client={contextQueryClient}>
    <CtxPanel language="en" />
    <CtxPanel language="fr" />
  </QueryClientProvider>
);
