import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-CWBD0LLT.js";import{M as t,C as r}from"./blocks-BucKGCcb.js";import{S as d,a as c,I as a,b as h,c as l}from"./Reading.stories-Bh8NNT72.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./useConfigQuery-BWjCAiTF.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function o(s){const n={code:"code",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",...i(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{of:d}),`
`,e.jsx(n.h1,{id:"reading",children:"Reading"}),`
`,e.jsxs(n.p,{children:["Two hooks for reading from a ",e.jsx(n.code,{children:"ConfigLoader"}),", matching TanStack Query's own naming:"]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hook"}),e.jsx("th",{children:"Use when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"useConfigSuspenseQuery"})}),e.jsxs("td",{children:["You want Suspense — wrap with ",e.jsx("code",{children:"<Suspense>"})," and ",e.jsx("code",{children:"<ErrorBoundary>"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"useConfigQuery"})}),e.jsx("td",{children:"You want inline loading / error states, no boundaries needed"})]})]})]}),`
`,e.jsxs(n.p,{children:["Config is cached indefinitely (",e.jsx(n.code,{children:"staleTime: Infinity"}),`) — it is loaded once per session
and never re-fetched unless explicitly invalidated.`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"useconfigsuspensequery--without-context",children:[e.jsx(n.code,{children:"useConfigSuspenseQuery"})," — without context"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"data"})," is always ",e.jsx(n.code,{children:"TRuntime"}),` — the Suspense boundary guarantees the component
only renders after the config has loaded.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const suspenseLoader = ConfigLoader.create<AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

const { data: config } = useConfigSuspenseQuery(suspenseLoader);
return <p>{config.apiUrl}</p>;
`})}),`
`,e.jsx(r,{of:c}),`
`,e.jsxs(n.h2,{id:"useconfigquery--without-context",children:[e.jsx(n.code,{children:"useConfigQuery"})," — without context"]}),`
`,e.jsxs(n.p,{children:["No ",e.jsx(n.code,{children:"<Suspense>"})," or ",e.jsx(n.code,{children:"<ErrorBoundary>"})," needed."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const inlineLoader = ConfigLoader.create<AppConfig>({
  key:      'app',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});

const { data: config, isLoading, isError, error } = useConfigQuery(inlineLoader);

if (isLoading) return <Spinner />;
if (isError)   return <p>Error: {String(error)}</p>;
return <p>{config!.apiUrl}</p>;
`})}),`
`,e.jsx(r,{of:a}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"useconfigsuspensequery--with-context",children:[e.jsx(n.code,{children:"useConfigSuspenseQuery"})," — with context"]}),`
`,e.jsx(n.p,{children:`When ctx is provided it is required as the second argument — the type system enforces it.
Each distinct context value gets its own cache entry.`}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`interface ThemeCtx { darkMode: boolean }

const themedLoader = ConfigLoader.create<AppConfig, AppConfig, ThemeCtx>({
  key:      (ctx) => ['app', ctx.darkMode ? 'dark' : 'light'],
  load:     (ctx) => fromFetch(\`/api/config?theme=\${ctx.darkMode ? 'dark' : 'light'}\`)(),
  validate: withZod(AppConfigSchema),
});

const { data: config } = useConfigSuspenseQuery(themedLoader, { darkMode: true });
`})}),`
`,e.jsx(r,{of:h}),`
`,e.jsxs(n.h2,{id:"useconfigquery--with-context",children:[e.jsx(n.code,{children:"useConfigQuery"})," — with context"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data: config, isLoading } = useConfigQuery(themedLoader, { darkMode: false });
`})}),`
`,e.jsx(r,{of:l})]})}function L(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}export{L as default};
