import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as a}from"./index-CWBD0LLT.js";import{M as o,C as t}from"./blocks-BucKGCcb.js";import{S as d,W as i,L as c,a as l,b as h,c as u}from"./Prefetch.stories-XICblIZO.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./AppConfig-BxLLJAGu.js";function s(r){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",...a(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{of:d}),`
`,e.jsx(n.h1,{id:"prefetching",children:"Prefetching"}),`
`,e.jsxs(n.p,{children:[`Populate the TanStack Query cache before a component tree renders by calling
`,e.jsx(n.code,{children:"queryClient.prefetchQuery"})," with ",e.jsx(n.code,{children:"loader.queryOptions()"}),". When ",e.jsx(n.code,{children:"useConfigSuspenseQuery"}),`
then runs, the data is already there — no Suspense fallback, no loading state.`]}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.code,{children:"ensureQueryData"})," instead of ",e.jsx(n.code,{children:"prefetchQuery"})," when you also need the resolved value back."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"beforeload-vs-loader",children:[e.jsx(n.code,{children:"beforeLoad"})," vs ",e.jsx(n.code,{children:"loader"})]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{children:e.jsx("code",{children:"beforeLoad"})}),e.jsx("th",{children:e.jsx("code",{children:"loader"})})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Runs"}),e.jsx("td",{children:"Before route activates — top-down, in series"}),e.jsx("td",{children:"When route is about to render — in parallel with sibling loaders"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Use for"}),e.jsx("td",{children:"Auth guards, redirects, context that child routes depend on"}),e.jsx("td",{children:"Data fetching — preferred for performance"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Return value"}),e.jsx("td",{children:"Not used for data"}),e.jsxs("td",{children:["Available via ",e.jsx("code",{children:"Route.useLoaderData()"})]})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"without-context",children:"Without context"}),`
`,e.jsx(n.h3,{id:"no-prefetch--suspense-fallback-shows",children:"No prefetch — Suspense fallback shows"}),`
`,e.jsx(t,{of:i}),`
`,e.jsxs(n.h3,{id:"prefetch-in-loader--suspense-fallback-never-appears",children:["Prefetch in ",e.jsx(n.code,{children:"loader"})," — Suspense fallback never appears"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(appConfigLoader.queryOptions()),
});
`})}),`
`,e.jsx(t,{of:c}),`
`,e.jsxs(n.h3,{id:"ensurequerydata--value-available-via-useloaderdata",children:[e.jsx(n.code,{children:"ensureQueryData"})," — value available via ",e.jsx(n.code,{children:"useLoaderData"})]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: async ({ context: { queryClient } }) => {
    const config = await queryClient.ensureQueryData(appConfigLoader.queryOptions());
    return { config };
  },
});
`})}),`
`,e.jsx(t,{of:l}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"with-context",children:"With context"}),`
`,e.jsx(n.h3,{id:"no-prefetch--each-context-variant-suspends-independently",children:"No prefetch — each context variant suspends independently"}),`
`,e.jsx(t,{of:h}),`
`,e.jsxs(n.h3,{id:"prefetch-all-variants-in-loader",children:["Prefetch all variants in ",e.jsx(n.code,{children:"loader"})]}),`
`,e.jsx(n.p,{children:"Prefetch each context variant upfront so components never suspend."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.prefetchQuery(langConfigLoader.queryOptions({ language: 'en' })),
      queryClient.prefetchQuery(langConfigLoader.queryOptions({ language: 'fr' })),
    ]),
});
`})}),`
`,e.jsx(t,{of:u})]})}function b(r={}){const{wrapper:n}={...a(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{b as default};
