import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-BJopkiJD.js";import{M as a,C as s}from"./blocks-D_r2w_Wi.js";import{S as t,a as d,Q as c,N as l,V as u,R as h}from"./Patterns.stories-BjWgnQ4s.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";function o(n){const r={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:t}),`
`,e.jsx(r.h1,{id:"tanstack-query-patterns",children:"TanStack Query patterns"}),`
`,e.jsxs(r.p,{children:[e.jsx(r.code,{children:"createConfigQuery"})," returns a standard TanStack ",e.jsx(r.code,{children:"queryOptions"}),` object.
Every pattern that works with `,e.jsx(r.code,{children:"useQuery"})," works here."]}),`
`,e.jsxs(r.h2,{id:"usesuspensequery--suspense-driven",children:[e.jsx(r.code,{children:"useSuspenseQuery"})," — Suspense-driven"]}),`
`,e.jsxs(r.p,{children:[e.jsx(r.code,{children:"data"}),` is always defined when the component renders.
Wrap with `,e.jsx(r.code,{children:"<Suspense>"})," and ",e.jsx(r.code,{children:"<ErrorBoundary>"})," to handle loading and errors declaratively."]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`const { data: config } = useSuspenseQuery(appConfigQuery);
return <p>{config.apiUrl}</p>;
`})}),`
`,e.jsx(s,{of:d}),`
`,e.jsxs(r.h2,{id:"usequery--inline-loading-states",children:[e.jsx(r.code,{children:"useQuery"})," — inline loading states"]}),`
`,e.jsxs(r.p,{children:["No ",e.jsx(r.code,{children:"<Suspense>"})," or ",e.jsx(r.code,{children:"<ErrorBoundary>"}),` needed.
Handle loading and errors inline, just like any `,e.jsx(r.code,{children:"useQuery"})," call."]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`const { data: config, isLoading, isError, error } = useQuery(appConfigQuery);
if (isLoading) return <p>Loading…</p>;
if (isError)   return <p>Error: {String(error)}</p>;
return <p>{config!.apiUrl}</p>;
`})}),`
`,e.jsx(s,{of:c}),`
`,e.jsx(r.h2,{id:"error--network-failure",children:"Error — network failure"}),`
`,e.jsxs(r.p,{children:["The error is caught by the nearest ",e.jsx(r.code,{children:"<ErrorBoundary>"}),"."]}),`
`,e.jsx(s,{of:l}),`
`,e.jsx(r.h2,{id:"error--validation-failure",children:"Error — validation failure"}),`
`,e.jsxs(r.p,{children:["If ",e.jsx(r.code,{children:"validate"})," throws, the error propagates to TanStack and surfaces at the boundary."]}),`
`,e.jsx(s,{of:u}),`
`,e.jsx(r.h2,{id:"retry",children:"Retry"}),`
`,e.jsxs(r.p,{children:["Use TanStack's built-in ",e.jsx(r.code,{children:"refetch()"})," or ",e.jsx(r.code,{children:"invalidateQueries()"})," — no custom retry logic needed."]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`const { isError, refetch } = useQuery(appConfigQuery);
// or
queryClient.invalidateQueries(appConfigQuery);
`})}),`
`,e.jsx(s,{of:h})]})}function E(n={}){const{wrapper:r}={...i(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(o,{...n})}):o(n)}export{E as default};
