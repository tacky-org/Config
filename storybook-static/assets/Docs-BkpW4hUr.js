import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as o}from"./index-CWBD0LLT.js";import{M as t,C as s}from"./blocks-BucKGCcb.js";import{S as a,I as d,W as c}from"./Invalidate.stories-DLlPIUAS.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./useConfigQuery-BWjCAiTF.js";import"./AppConfig-BxLLJAGu.js";function i(r){const n={code:"code",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{of:a}),`
`,e.jsx(n.h1,{id:"invalidating-config",children:"Invalidating config"}),`
`,e.jsx(n.p,{children:`Config is cached indefinitely — it loads once and never re-fetches on its own.
To force a fresh load, invalidate the cache.`}),`
`,e.jsxs(n.h2,{id:"inside-a-component--useconfiginvalidate",children:["Inside a component — ",e.jsx(n.code,{children:"useConfigInvalidate"})]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const { invalidate, isPending, isError, error } = useConfigInvalidate(appConfigLoader);

invalidate();   // marks stale → triggers a re-fetch
isPending       // true while re-fetching
isError         // true if the new load failed
error           // the ConfigPipelineError, if any
`})}),`
`,e.jsxs(n.h2,{id:"outside-a-component--queryclient-directly",children:["Outside a component — ",e.jsx(n.code,{children:"queryClient"})," directly"]}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.code,{children:"loader.queryOptions()"})," to target a specific cache entry, or ",e.jsx(n.code,{children:"loader.queryKey()"}),`
for prefix-matching to invalidate all variants at once:`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// specific entry
await queryClient.invalidateQueries(appConfigLoader.queryOptions());

// all variants of a context-aware loader (prefix match)
await queryClient.invalidateQueries({ queryKey: todoLoader.queryKey() });
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"with-useconfigquery--inline-error-state",children:["With ",e.jsx(n.code,{children:"useConfigQuery"})," — inline error state"]}),`
`,e.jsxs(n.p,{children:["The simplest approach. ",e.jsx(n.code,{children:"isError"})," / ",e.jsx(n.code,{children:"isLoading"})," / ",e.jsx(n.code,{children:"data"}),` are handled inline —
no boundary to reset.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data, isError, error } = useConfigQuery(appConfigLoader);
const { invalidate } = useConfigInvalidate(appConfigLoader);

{isError && (
  <button onClick={invalidate}>Retry</button>
)}
`})}),`
`,e.jsx(s,{of:d}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"with-useconfigsuspensequery--queryerrorresetboundary",children:["With ",e.jsx(n.code,{children:"useConfigSuspenseQuery"})," — ",e.jsx(n.code,{children:"QueryErrorResetBoundary"})]}),`
`,e.jsxs(n.p,{children:["When using Suspense, an ",e.jsx(n.code,{children:"<ErrorBoundary>"}),` stays in its error state even after
the config recovers — it never sees the successful re-fetch because it stopped
rendering its children.`]}),`
`,e.jsxs(n.p,{children:["The fix is ",e.jsx(n.code,{children:"QueryErrorResetBoundary"})," from TanStack Query. It provides a ",e.jsx(n.code,{children:"reset"}),`
function that clears TanStack's internal error state. Wire it to the boundary's
`,e.jsx(n.code,{children:"onReset"})," so both reset together when the user retries."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { QueryErrorResetBoundary } from '@tanstack/react-query';

<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallback={(error, resetBoundary) => (
        <div>
          <p>{error.message}</p>
          <button onClick={resetBoundary}>Retry</button>
        </div>
      )}
    >
      <Suspense fallback={<p>Loading…</p>}>
        <ConfigDisplay />
      </Suspense>
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"resetBoundary()"})," calls ",e.jsx(n.code,{children:"onReset"}),` (which clears TanStack's error state) and
then clears the boundary's own error state. The boundary remounts its children,
the query re-fetches, and the Suspense fallback shows while loading.`]}),`
`,e.jsx(s,{of:c})]})}function v(r={}){const{wrapper:n}={...o(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{v as default};
