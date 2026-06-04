import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as o}from"./index-CCCadtBi.js";import{M as a,C as t}from"./blocks-BeiQrR73.js";import{S as i,W as d,L as c,a as l}from"./Prefetch.stories-QMYu9pmc.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./AppConfig-BxLLJAGu.js";function s(r){const n={code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:i}),`
`,e.jsx(n.h1,{id:"prefetchconfig",children:e.jsx(n.code,{children:"prefetchConfig"})}),`
`,e.jsxs(n.p,{children:[`Populates the TanStack Query cache before a component tree renders.
When `,e.jsx(n.code,{children:"useConfigSuspenseQuery"}),` then runs, the data is already there —
no Suspense fallback, no loading state.`]}),`
`,e.jsxs(n.p,{children:["Uses ",e.jsx(n.code,{children:"ensureQueryData"}),` internally — if the config is already cached it returns
immediately, so navigating back to a route costs nothing.`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"beforeload-vs-loader",children:[e.jsx(n.code,{children:"beforeLoad"})," vs ",e.jsx(n.code,{children:"loader"})]}),`
`,e.jsxs(n.p,{children:["Both receive ",e.jsx(n.code,{children:"{ context: { queryClient } }"})," and work identically with ",e.jsx(n.code,{children:"prefetchConfig"}),"."]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{children:e.jsx("code",{children:"beforeLoad"})}),e.jsx("th",{children:e.jsx("code",{children:"loader"})})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Runs"}),e.jsx("td",{children:"Before route activates — top-down, in series"}),e.jsx("td",{children:"When route is about to render — in parallel with sibling loaders"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Use for"}),e.jsx("td",{children:"Auth guards, redirects, context that child routes depend on"}),e.jsx("td",{children:"Data fetching — preferred for performance"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Return value"}),e.jsx("td",{children:"Not used for data"}),e.jsxs("td",{children:["Available via ",e.jsx("code",{children:"Route.useLoaderData()"})]})]})]})]}),`
`,e.jsxs(n.p,{children:["For config fetching, ",e.jsxs(n.strong,{children:[e.jsx(n.code,{children:"loader"})," is the right choice"]})," — it runs in parallel with other loaders and doesn't block sibling routes."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient } }) =>
    prefetchConfig(appConfigLoader, queryClient),
});
`})}),`
`,e.jsx(n.p,{children:"Multiple loaders in parallel:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`loader: ({ context: { queryClient } }) =>
  Promise.all([
    prefetchConfig(appConfigLoader,    queryClient),
    prefetchConfig(featureFlagsLoader, queryClient),
  ]),
`})}),`
`,e.jsx(n.h2,{id:"without-prefetch",children:"Without prefetch"}),`
`,e.jsx(n.p,{children:"The Suspense fallback shows until the config finishes loading (~800ms here)."}),`
`,e.jsx(t,{of:d}),`
`,e.jsxs(n.h2,{id:"with-loader",children:["With ",e.jsx(n.code,{children:"loader"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"prefetchConfig"}),` runs in the loader before the component tree mounts.
By the time `,e.jsx(n.code,{children:"useConfigSuspenseQuery"}),` runs the data is already in the cache —
the Suspense fallback never appears.`]}),`
`,e.jsx(t,{of:c}),`
`,e.jsxs(n.h2,{id:"loader-return-value--useloaderdata",children:[e.jsx(n.code,{children:"loader"})," return value — ",e.jsx(n.code,{children:"useLoaderData"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"loader"})," can also ",e.jsx(n.em,{children:"return"}),` the prefetched config, making it available via
`,e.jsx(n.code,{children:"Route.useLoaderData()"})," alongside ",e.jsx(n.code,{children:"useConfigSuspenseQuery"}),`.
Both read from the same cached value — no duplicate fetch.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: async ({ context: { queryClient } }) => {
    const config = await prefetchConfig(appConfigLoader, queryClient);
    return { config };
  },
});

// In the component — two ways to read the same data:
const { config } = Route.useLoaderData();                     // direct, type-safe
const { data: config } = useConfigSuspenseQuery(appConfigLoader); // works anywhere in the tree
`})}),`
`,e.jsxs(n.p,{children:["Prefer ",e.jsx(n.code,{children:"useConfigSuspenseQuery"})," for deeply nested components and ",e.jsx(n.code,{children:"useLoaderData"}),`
when you want the data available at the route level without importing the loader.`]}),`
`,e.jsx(t,{of:l})]})}function C(r={}){const{wrapper:n}={...o(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{C as default};
