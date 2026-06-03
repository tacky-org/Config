import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromMemory } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface AppConfig { apiUrl: string; timeout: number; darkMode: boolean }

const loader = ConfigLoader.create<AppConfig>({
  load: fromMemory({ apiUrl: "https://api.example.com", timeout: 3000, darkMode: true }),
  validate: (raw) => {
    const r = raw as AppConfig;
    if (typeof r?.apiUrl !== "string")   throw new Error("Invalid apiUrl");
    if (typeof r?.timeout !== "number")  throw new Error("Invalid timeout");
    if (typeof r?.darkMode !== "boolean") throw new Error("Invalid darkMode");
    return r;
  },
});

const query = createConfigQuery("memory_loader", loader);
const queryClient = new QueryClient();

const Display = () => {
  const { data: config } = useSuspenseQuery(query);
  return (
    <ul>
      <li>API URL: {config.apiUrl}</li>
      <li>Timeout: {config.timeout}ms</li>
      <li>Dark mode: {config.darkMode ? "On" : "Off"}</li>
    </ul>
  );
};

export const MemoryLoader = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
