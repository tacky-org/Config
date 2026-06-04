import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as o}from"./index-CCCadtBi.js";import{M as d,C as s}from"./blocks-BeiQrR73.js";import{S as t,a as c,I as a}from"./Reading.stories-Cb_nq6Cw.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./useConfigQuery-BdHcCb8r.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function i(r){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:t}),`
`,e.jsx(n.h1,{id:"reading",children:"Reading"}),`
`,e.jsxs(n.p,{children:["Two hooks for reading from a ",e.jsx(n.code,{children:"ConfigLoader"}),", matching TanStack Query's own naming:"]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hook"}),e.jsx("th",{children:"Use when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"useConfigSuspenseQuery"})}),e.jsxs("td",{children:["You want Suspense — wrap with ",e.jsx("code",{children:"<Suspense>"})," and ",e.jsx("code",{children:"<ErrorBoundary>"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"useConfigQuery"})}),e.jsx("td",{children:"You want inline loading / error states, no boundaries needed"})]})]})]}),`
`,e.jsxs(n.p,{children:["Config is cached indefinitely (",e.jsx(n.code,{children:"staleTime: Infinity"}),`) — it is loaded once per session
and never re-fetched unless explicitly invalidated.`]}),`
`,e.jsx(n.h2,{id:"useconfigsuspensequery",children:e.jsx(n.code,{children:"useConfigSuspenseQuery"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"data"})," is always ",e.jsx(n.code,{children:"TRuntime"}),` — the Suspense boundary guarantees the component
only renders after the config has loaded.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data: config } = useConfigSuspenseQuery(appConfigLoader);
return <p>{config.apiUrl}</p>;
`})}),`
`,e.jsx(s,{of:c}),`
`,e.jsxs(n.h2,{id:"useconfigquery--inline-states",children:[e.jsx(n.code,{children:"useConfigQuery"})," — inline states"]}),`
`,e.jsxs(n.p,{children:["No ",e.jsx(n.code,{children:"<Suspense>"})," or ",e.jsx(n.code,{children:"<ErrorBoundary>"})," needed."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data: config, isLoading, isError, error } = useConfigQuery(appConfigLoader);

if (isLoading) return <Spinner />;
if (isError)   return <p>Error: {String(error)}</p>;
return <p>{config!.apiUrl}</p>;
`})}),`
`,e.jsx(s,{of:a})]})}function S(r={}){const{wrapper:n}={...o(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{S as default};
