import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigLoader, fromFetch, useConfigSuspenseQuery } from "@/index";
import { ErrorBoundary } from "../../_shared/ErrorBoundary";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const validateTodo = (raw: unknown): Todo => {
  const r = raw as Todo;
  if (typeof r?.id !== "number")    throw new Error("Invalid id");
  if (typeof r?.title !== "string") throw new Error("Invalid title");
  return r;
};

// ─── without context — single shared cache entry ──────────────────────────────

const todoLoader = ConfigLoader.create<Todo>({
  key:      "todo",
  load:     fromFetch("https://jsonplaceholder.typicode.com/todos/1"),
  validate: validateTodo,
});

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Display = ({ todo }: { todo: Todo }) => (
  <ul>
    <li>ID: {todo.id}</li>
    <li>Title: {todo.title}</li>
    <li>Completed: {todo.completed ? "Yes" : "No"}</li>
  </ul>
);

const TodoDisplay = () => {
  const { data: todo } = useConfigSuspenseQuery(todoLoader);
  return <Display todo={todo} />;
};

export const FetchLoader = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Suspense fallback={<p>Loading…</p>}>
        <TodoDisplay />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);

// ─── with context — separate cache entry per todoId ───────────────────────────

interface TodoCtx { todoId: number }

const todoByIdLoader = ConfigLoader.create<Todo, Todo, TodoCtx>({
  key:      (ctx) => ["todo", ctx.todoId],
  load:     (ctx) => fromFetch(`https://jsonplaceholder.typicode.com/todos/${ctx.todoId}`)(),
  validate: validateTodo,
});

const contextQueryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const TodoByIdDisplay = ({ todoId }: { todoId: number }) => {
  const { data: todo } = useConfigSuspenseQuery(todoByIdLoader, { todoId });
  return <Display todo={todo} />;
};

export const FetchLoaderWithContext = () => (
  <QueryClientProvider client={contextQueryClient}>
    <ErrorBoundary>
      <p><strong>Todo #1</strong></p>
      <Suspense fallback={<p>Loading todo #1…</p>}>
        <TodoByIdDisplay todoId={1} />
      </Suspense>
      <p><strong>Todo #2</strong></p>
      <Suspense fallback={<p>Loading todo #2…</p>}>
        <TodoByIdDisplay todoId={2} />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
);
