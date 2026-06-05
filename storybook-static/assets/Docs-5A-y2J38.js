import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-CWBD0LLT.js";import{M as s,C as o}from"./blocks-BucKGCcb.js";import{S as d,L as a,V as c,W as l}from"./Errors.stories-lC52eVIi.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function t(n){const r={code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{of:d}),`
`,e.jsxs(r.h1,{id:"errors-and-configpipelineerror",children:["Errors and ",e.jsx(r.code,{children:"ConfigPipelineError"})]}),`
`,e.jsxs(r.p,{children:["Every step of the load pipeline throws a ",e.jsx(r.code,{children:"ConfigPipelineError"}),` on failure.
Catch it in an `,e.jsx(r.code,{children:"<ErrorBoundary>"})," and inspect ",e.jsx(r.code,{children:"error.step"})," to know exactly where it failed."]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Step"}),e.jsx("th",{children:"When"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"load"})}),e.jsx("td",{children:"The load function threw — network failure, HTTP error, missing window global"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"validate"})}),e.jsxs("td",{children:["The ",e.jsx("code",{children:"validate"})," function threw — response shape is wrong"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"map"})}),e.jsxs("td",{children:["The ",e.jsx("code",{children:"map"})," function threw"]})]})]})]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`import { ConfigPipelineError } from '@tacky-org/config';

const fallback = (error: Error) => {
  if (error instanceof ConfigPipelineError) {
    return (
      <div>
        <p>Config failed at step: <strong>{error.step}</strong></p>
        <p>{error.message}</p>
      </div>
    );
  }
  return <p>{error.message}</p>;
};

<ErrorBoundary fallback={fallback}>
  <Suspense fallback={<p>Loading…</p>}>
    <MyComponent />
  </Suspense>
</ErrorBoundary>
`})}),`
`,e.jsxs(r.h3,{id:"retries--load-step-only",children:["Retries — ",e.jsx(r.code,{children:"load"})," step only"]}),`
`,e.jsxs(r.p,{children:["Only the ",e.jsx(r.code,{children:"load"})," step is retried. ",e.jsx(r.code,{children:"validate"})," and ",e.jsx(r.code,{children:"map"}),` failures throw immediately
because they are deterministic — retrying would produce the same error.`]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-ts",children:`ConfigLoader.create({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  retries:  3,  // 200ms, 400ms, 800ms backoff
});
`})}),`
`,e.jsx(r.hr,{}),`
`,e.jsxs(r.h2,{id:"without-context--load-step-error-http-404",children:["Without context — ",e.jsx(r.code,{children:"load"})," step error (HTTP 404)"]}),`
`,e.jsx(o,{of:a}),`
`,e.jsxs(r.h2,{id:"without-context--validate-step-error-wrong-shape",children:["Without context — ",e.jsx(r.code,{children:"validate"})," step error (wrong shape)"]}),`
`,e.jsx(o,{of:c}),`
`,e.jsx(r.h2,{id:"with-context--load-error-per-context-variant",children:"With context — load error per context variant"}),`
`,e.jsxs(r.p,{children:["Each context variant (",e.jsx(r.code,{children:"todoId: 1"}),", ",e.jsx(r.code,{children:"todoId: 2"}),`) has its own cache entry and its own
error state. One failing variant does not affect the others.`]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-ts",children:`interface TodoCtx { todoId: number }

const loader = ConfigLoader.create<Todo, Todo, TodoCtx>({
  key:      (ctx) => ['todo', ctx.todoId],
  load:     (ctx) => fromFetch(\`/api/todos/\${ctx.todoId}\`)(),
  validate: validateTodo,
});
`})}),`
`,e.jsx(o,{of:l})]})}function C(n={}){const{wrapper:r}={...i(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(t,{...n})}):t(n)}export{C as default};
