import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-BJopkiJD.js";import{M as a,C as i}from"./blocks-D_r2w_Wi.js";import{S as s,a as c}from"./Fetch.stories-C7UZKnik.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";function r(o){const n={code:"code",h1:"h1",p:"p",pre:"pre",...t(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:s}),`
`,e.jsx(n.h1,{id:"fromfetch",children:e.jsx(n.code,{children:"fromFetch"})}),`
`,e.jsxs(n.p,{children:["Creates a ",e.jsx(n.code,{children:"load"})," function that fetches a JSON endpoint and throws on non-2xx responses."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { ConfigLoader, createConfigQuery, fromFetch } from '@tacky-org/config';

const loader = ConfigLoader.create<RawConfig, AppConfig>({
  load:     fromFetch('/api/config'),
  validate: (raw) => raw as RawConfig,
  map:      (raw) => ({ apiUrl: raw.api_url }),
});

export const appConfigQuery = createConfigQuery('app_config', loader);
`})}),`
`,e.jsx(n.p,{children:"With request options:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`fromFetch('/api/config', {
  headers:     { Authorization: \`Bearer \${token}\` },
  errorPrefix: 'App config',   // prefix for the thrown error message
})
`})}),`
`,e.jsx(i,{of:c})]})}function u(o={}){const{wrapper:n}={...t(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{u as default};
