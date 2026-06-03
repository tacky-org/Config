import React, { Suspense } from "react";
import {
  QueryClient, QueryClientProvider,
  useQuery, useSuspenseQuery,
} from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromFetch, fromMemory } from "@/index";
import { ErrorBoundary } from "../_shared/ErrorBoundary";

// ─── shared setup ─────────────────────────────────────────────────────────────

interface AppConfig { id: number; title: string; completed: boolean }

const validate = (raw: unknown): AppConfig => {
  const r = raw as AppConfig;
  if (typeof r?.id !== "number" || typeof r?.title !== "string") throw new Error("Invalid shape");
  return r;
};

const appLoader    = ConfigLoader.create<AppConfig>({ load: fromFetch("https://jsonplaceholder.typicode.com/todos/1"), validate });
const brokenLoader = ConfigLoader.create<AppConfig>({ load: fromFetch("https://jsonplaceholder.typicode.com/does-not-exist"), validate, retries: 1 });
const invalidLoader = ConfigLoader.create<AppConfig>({
  load: fromMemory({ id: 1, title: "test" }),
  validate: () => { throw new Error("Validation failed: missing required fields"); },
});

const appQuery     = createConfigQuery("pattern_app",     appLoader);
const brokenQuery  = createConfigQuery("pattern_broken",  brokenLoader);
const invalidQuery = createConfigQuery("pattern_invalid", invalidLoader);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// ─── useSuspenseQuery ─────────────────────────────────────────────────────────

const SuspenseDisplay = () => {
  const { data: config } = useSuspenseQuery(appQuery);
  return <p>Title: {config.title} — Done: {config.completed ? "Yes" : "No"}</p>;
};

export const SuspensePattern = () => (
  <Wrap>
    <ErrorBoundary fallback={(e: Error) => <p style={{ color: "red" }}>{e.message}</p>}>
      <Suspense fallback={<p>Loading…</p>}>
        <SuspenseDisplay />
      </Suspense>
    </ErrorBoundary>
  </Wrap>
);

// ─── useQuery ─────────────────────────────────────────────────────────────────

const QueryDisplay = () => {
  const { data: config, isLoading, isError, error } = useQuery(appQuery);
  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p style={{ color: "red" }}>Error: {String(error)}</p>;
  return <p>Title: {config!.title} — Done: {config!.completed ? "Yes" : "No"}</p>;
};

export const QueryPattern = () => (
  <Wrap><QueryDisplay /></Wrap>
);

// ─── network error ────────────────────────────────────────────────────────────

const BrokenDisplay = () => {
  const { data: config } = useSuspenseQuery(brokenQuery);
  return <p>{config.title}</p>;
};

export const NetworkErrorPattern = () => (
  <Wrap>
    <ErrorBoundary fallback={(e: Error) => <p style={{ color: "red" }}>Network error: {e.message}</p>}>
      <Suspense fallback={<p>Loading…</p>}>
        <BrokenDisplay />
      </Suspense>
    </ErrorBoundary>
  </Wrap>
);

// ─── validation error ─────────────────────────────────────────────────────────

const InvalidDisplay = () => {
  const { data: config } = useSuspenseQuery(invalidQuery);
  return <p>{config.title}</p>;
};

export const ValidationErrorPattern = () => (
  <Wrap>
    <ErrorBoundary fallback={(e: Error) => <p style={{ color: "red" }}>Validation error: {e.message}</p>}>
      <Suspense fallback={<p>Loading…</p>}>
        <InvalidDisplay />
      </Suspense>
    </ErrorBoundary>
  </Wrap>
);

// ─── retry ────────────────────────────────────────────────────────────────────

export const RetryPattern = () => {
  const RetryDisplay = () => {
    const { data: config, isError, error, refetch, isFetching } = useQuery({
      ...brokenQuery,
      queryKey: ["pattern_retry"],
      retry: false,
    });
    if (isFetching) return <p>Loading…</p>;
    if (isError)    return (
      <div>
        <p style={{ color: "red" }}>Error: {String(error)}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
    return <p>{config!.title}</p>;
  };
  return <Wrap><RetryDisplay /></Wrap>;
};
