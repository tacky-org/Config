import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-CCCadtBi.js";import{M as d,C as o}from"./blocks-BeiQrR73.js";import{S as t,L as a,V as c}from"./Errors.stories-BXey951q.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function s(n){const r={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:t}),`
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
`,e.jsxs(r.h2,{id:"load-step-error--http-404",children:[e.jsx(r.code,{children:"load"})," step error — HTTP 404"]}),`
`,e.jsx(o,{of:a}),`
`,e.jsxs(r.h2,{id:"validate-step-error--wrong-shape",children:[e.jsx(r.code,{children:"validate"})," step error — wrong shape"]}),`
`,e.jsx(o,{of:c})]})}function y(n={}){const{wrapper:r}={...i(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(s,{...n})}):s(n)}export{y as default};
