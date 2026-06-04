import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromFetch, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

// fromFetch fetches a JSON endpoint. Throws on non-2xx responses.
// Reads from a public API for demonstration purposes.

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const todoLoader = ConfigLoader.create<Todo>({
  key:  "todo",
  load: fromFetch("https://jsonplaceholder.typicode.com/todos/1"),
  validate: (raw) => {
    const r = raw as Todo;
    if (typeof r?.id !== "number")    throw new Error("Invalid id");
    if (typeof r?.title !== "string") throw new Error("Invalid title");
    return r;
  },
});

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Display = () => {
  const { data: todo } = useConfigSuspenseQuery(todoLoader);
  return (
    <ul>
      <li>ID: {todo.id}</li>
      <li>Title: {todo.title}</li>
      <li>Completed: {todo.completed ? "Yes" : "No"}</li>
    </ul>
  );
};

export const FetchLoader = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <Display />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
