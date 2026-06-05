import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as d}from"./index-CWBD0LLT.js";import{M as r,C as t}from"./blocks-BucKGCcb.js";import{S as c,a,W as i}from"./Fetch.stories-CM5vszCc.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./loaders-Ba8cVKf-.js";function s(n){const o={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...d(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{of:c}),`
`,e.jsx(o.h1,{id:"fromfetch",children:e.jsx(o.code,{children:"fromFetch"})}),`
`,e.jsxs(o.p,{children:["Fetches a JSON endpoint. Throws a ",e.jsx(o.code,{children:"ConfigPipelineError('load', ...)"}),` on network
failures or non-2xx responses.`]}),`
`,e.jsx(o.h2,{id:"without-context--static-key-one-shared-cache-entry",children:"Without context — static key, one shared cache entry"}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`import { ConfigLoader, fromFetch } from '@tacky-org/config';

const todoLoader = ConfigLoader.create<Todo>({
  key:      'todo',
  load:     fromFetch('https://jsonplaceholder.typicode.com/todos/1'),
  validate: validateTodo,
});
`})}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-tsx",children:`const { data: todo } = useConfigSuspenseQuery(todoLoader);
`})}),`
`,e.jsx(t,{of:a}),`
`,e.jsxs(o.h2,{id:"with-context--separate-cache-entry-per-todoid",children:["With context — separate cache entry per ",e.jsx(o.code,{children:"todoId"})]}),`
`,e.jsxs(o.p,{children:["When the URL depends on runtime values, pass a ",e.jsx(o.code,{children:"TContext"})," generic. The ",e.jsx(o.code,{children:"key"}),`
function must be a function — the type system prevents a static string here to
avoid a ctx mismatch.`]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`interface TodoCtx { todoId: number }

const todoByIdLoader = ConfigLoader.create<Todo, Todo, TodoCtx>({
  key:      (ctx) => ['todo', ctx.todoId],   // ['config__todo', 1], ['config__todo', 2], …
  load:     (ctx) => fromFetch(\`https://jsonplaceholder.typicode.com/todos/\${ctx.todoId}\`)(),
  validate: validateTodo,
});
`})}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-tsx",children:`// Each todoId gets its own cache entry — both fetch concurrently
const { data: todo1 } = useConfigSuspenseQuery(todoByIdLoader, { todoId: 1 });
const { data: todo2 } = useConfigSuspenseQuery(todoByIdLoader, { todoId: 2 });
`})}),`
`,e.jsx(t,{of:i}),`
`,e.jsx(o.h2,{id:"options",children:"Options"}),`
`,e.jsxs(o.p,{children:["Pass standard ",e.jsx(o.code,{children:"RequestInit"})," options for auth headers, CORS mode, etc.:"]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:"fromFetch('/api/config', {\n  headers: { Authorization: `Bearer ${token}` },\n})\n"})}),`
`,e.jsx(o.h2,{id:"retries",children:"Retries"}),`
`,e.jsxs(o.p,{children:["Use the ",e.jsx(o.code,{children:"retries"}),` option for transient network failures.
Only the `,e.jsx(o.code,{children:"load"})," step is retried — ",e.jsx(o.code,{children:"validate"})," and ",e.jsx(o.code,{children:"map"})," failures throw immediately."]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`ConfigLoader.create({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  retries:  3,  // 200ms, 400ms, 800ms backoff
});
`})})]})}function y(n={}){const{wrapper:o}={...d(),...n.components};return o?e.jsx(o,{...n,children:e.jsx(s,{...n})}):s(n)}export{y as default};
