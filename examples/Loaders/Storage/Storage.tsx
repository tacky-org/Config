import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromStorage } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface AppConfig { theme: "light" | "dark"; language: string; notifications: boolean }

const validate = (raw: unknown): AppConfig => {
  const r = raw as AppConfig;
  if (!["light", "dark"].includes(r?.theme)) throw new Error("Invalid theme");
  if (typeof r?.language !== "string")       throw new Error("Invalid language");
  if (typeof r?.notifications !== "boolean") throw new Error("Invalid notifications");
  return r;
};

const localLoader   = ConfigLoader.create<AppConfig>({ load: fromStorage(localStorage,   "demo_local"),   validate });
const sessionLoader = ConfigLoader.create<AppConfig>({ load: fromStorage(sessionStorage, "demo_session"), validate });

const localQuery   = createConfigQuery("storage_local",   localLoader);
const sessionQuery = createConfigQuery("storage_session", sessionLoader);

const queryClient = new QueryClient();

const Row = ({ label, query }: { label: string; query: typeof localQuery }) => {
  const { data: c } = useSuspenseQuery(query);
  return (
    <tr>
      <td><code>{label}</code></td>
      <td>{c.theme}</td>
      <td>{c.language}</td>
      <td>{c.notifications ? "On" : "Off"}</td>
    </tr>
  );
};

const Display = () => (
  <table>
    <thead><tr><th>Source</th><th>Theme</th><th>Language</th><th>Notifications</th></tr></thead>
    <tbody>
      <Row label="localStorage"   query={localQuery} />
      <Row label="sessionStorage" query={sessionQuery} />
    </tbody>
  </table>
);

export const StorageLoader = () => {
  useEffect(() => {
    localStorage.setItem("demo_local",     JSON.stringify({ theme: "dark",  language: "en", notifications: true  }));
    sessionStorage.setItem("demo_session", JSON.stringify({ theme: "light", language: "fr", notifications: false }));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<p>Loading…</p>}>
          <Display />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
