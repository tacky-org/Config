import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-CCCadtBi.js";import{M as o,C as s}from"./blocks-BeiQrR73.js";import{S as a,I as d,W as c}from"./Invalidate.stories-D5zDL0IX.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./useConfigQuery-BdHcCb8r.js";import"./AppConfig-BxLLJAGu.js";function i(r){const n={code:"code",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",...t(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{of:a}),`
`,e.jsx(n.h1,{id:"invalidating-config",children:"Invalidating config"}),`
`,e.jsx(n.p,{children:`Config is cached indefinitely — it loads once and never re-fetches on its own.
To force a fresh load, invalidate the cache.`}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const invalidate = useConfigInvalidate(appConfigLoader);

invalidate.invalidate();  // marks stale → triggers a re-fetch
invalidate.isPending      // true while re-fetching
invalidate.isError        // true if the new load failed
invalidate.error          // the ConfigPipelineError, if any
`})}),`
`,e.jsx(n.p,{children:"Outside a component, use the query client directly:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`queryClient.invalidateQueries({ queryKey: appConfigLoader.queryKey });
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h2,{id:"with-useconfigquery--inline-error-state",children:["With ",e.jsx(n.code,{children:"useConfigQuery"})," — inline error state"]}),`
`,e.jsxs(n.p,{children:["The simplest approach. ",e.jsx(n.code,{children:"isError"})," / ",e.jsx(n.code,{children:"isLoading"})," / ",e.jsx(n.code,{children:"data"}),` are handled inline —
no boundary to reset.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data, isError, error } = useConfigQuery(appConfigLoader);
const invalidate = useConfigInvalidate(appConfigLoader);

{isError && (
  <button onClick={() => invalidate.invalidate()}>Retry</button>
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
`,e.jsx(s,{of:c})]})}function v(r={}){const{wrapper:n}={...t(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{v as default};
