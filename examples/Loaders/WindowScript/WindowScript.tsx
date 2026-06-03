import React, { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromWindow, fromScript } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface AppConfig { apiUrl: string; region: string }

const validate = (raw: unknown): AppConfig => {
  const r = raw as AppConfig;
  if (typeof r?.apiUrl !== "string") throw new Error("Invalid apiUrl");
  if (typeof r?.region !== "string") throw new Error("Invalid region");
  return r;
};

declare global { interface Window { __APP_CONFIG__?: AppConfig } }

const SCRIPT_ID = "storybook-app-config";

const windowLoader = ConfigLoader.create<AppConfig>({ load: fromWindow("__APP_CONFIG__"), validate });
const scriptLoader = ConfigLoader.create<AppConfig>({ load: fromScript(SCRIPT_ID),        validate });

const windowQuery = createConfigQuery("window_loader", windowLoader);
const scriptQuery = createConfigQuery("script_loader", scriptLoader);

const queryClient = new QueryClient();

const Row = ({ label, query }: { label: string; query: typeof windowQuery }) => {
  const { data: c } = useSuspenseQuery(query);
  return (
    <tr>
      <td><code>{label}</code></td>
      <td>{c.apiUrl}</td>
      <td>{c.region}</td>
    </tr>
  );
};

const Display = () => (
  <table>
    <thead><tr><th>Source</th><th>API URL</th><th>Region</th></tr></thead>
    <tbody>
      <Row label="fromWindow" query={windowQuery} />
      <Row label="fromScript" query={scriptQuery} />
    </tbody>
  </table>
);

export const WindowScriptLoader = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.__APP_CONFIG__ = { apiUrl: "https://api.example.com", region: "eu-west-1" };

    if (!document.getElementById(SCRIPT_ID)) {
      const el = document.createElement("script");
      el.id = SCRIPT_ID;
      el.type = "application/json";
      el.textContent = JSON.stringify({ apiUrl: "https://cdn.example.com", region: "us-east-1" });
      document.head.appendChild(el);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

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
