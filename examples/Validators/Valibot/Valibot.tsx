import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromMemory, withValibot } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface ServerConfig { host: string; port: number; secure: boolean }

const validate = (raw: unknown): ServerConfig => {
  const r = raw as ServerConfig;
  if (typeof r?.host !== "string")    throw new Error("Invalid host");
  if (typeof r?.port !== "number")    throw new Error("Invalid port");
  if (typeof r?.secure !== "boolean") throw new Error("Invalid secure");
  return r;
};

// withValibot accepts a pre-bound (data: unknown) => T function,
// matching how Valibot's v.parse(schema, data) is used in practice.
const loader = ConfigLoader.create<ServerConfig>({
  load:     fromMemory({ host: "api.example.com", port: 443, secure: true }),
  validate: withValibot(validate),
});

const query = createConfigQuery("validator_valibot", loader);
const queryClient = new QueryClient();

const Display = () => {
  const { data: config } = useSuspenseQuery(query);
  return (
    <ul>
      <li>Host: {config.host}</li>
      <li>Port: {config.port}</li>
      <li>Secure: {config.secure ? "Yes" : "No"}</li>
    </ul>
  );
};

export const ValibotValidator = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
