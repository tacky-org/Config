import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-CCCadtBi.js";import{M as i,C as s}from"./blocks-BeiQrR73.js";import{S as a,a as c}from"./Fetch.stories-BosqfV0p.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./loaders-Ba8cVKf-.js";function r(o){const n={code:"code",h1:"h1",h3:"h3",p:"p",pre:"pre",...t(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{of:a}),`
`,e.jsx(n.h1,{id:"fromfetch",children:e.jsx(n.code,{children:"fromFetch"})}),`
`,e.jsxs(n.p,{children:["Fetches a JSON endpoint. Throws a ",e.jsx(n.code,{children:"ConfigPipelineError('load', ...)"}),` on network
failures or non-2xx responses.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { ConfigLoader, fromFetch } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,e.jsxs(n.p,{children:["Pass standard ",e.jsx(n.code,{children:"RequestInit"})," options for auth headers, CORS mode, etc.:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:"fromFetch('/api/config', {\n  headers: { Authorization: `Bearer ${token}` },\n})\n"})}),`
`,e.jsx(n.h3,{id:"retries",children:"Retries"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"retries"}),` option for transient network failures.
Only the `,e.jsx(n.code,{children:"load"})," step is retried — ",e.jsx(n.code,{children:"validate"})," and ",e.jsx(n.code,{children:"map"})," failures throw immediately."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const appConfigLoader = ConfigLoader.create({
  key:     'app_config',
  load:    fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
  retries: 3,  // retries with exponential backoff: 200ms, 400ms, 800ms
});
`})}),`
`,e.jsx(s,{of:c})]})}function u(o={}){const{wrapper:n}={...t(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{u as default};
