import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ConfigLoader, createConfigQuery, fromFetch } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface RawTodo { id: number; title: string; completed: boolean }
interface AppConfig { taskId: number; taskTitle: string; isDone: boolean }

const loader = ConfigLoader.create<RawTodo, AppConfig>({
  load: fromFetch("https://jsonplaceholder.typicode.com/todos/1"),
  validate: (raw) => {
    const r = raw as RawTodo;
    if (typeof r?.id !== "number" || typeof r?.title !== "string") {
      throw new Error("Unexpected response shape");
    }
    return r;
  },
  map: (todo) => ({ taskId: todo.id, taskTitle: todo.title, isDone: todo.completed }),
});

const query = createConfigQuery("fetch_loader", loader);
const queryClient = new QueryClient();

const Display = () => {
  const { data: config } = useSuspenseQuery(query);
  return (
    <ul>
      <li>Task ID: {config.taskId}</li>
      <li>Title: {config.taskTitle}</li>
      <li>Done: {config.isDone ? "Yes" : "No"}</li>
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
