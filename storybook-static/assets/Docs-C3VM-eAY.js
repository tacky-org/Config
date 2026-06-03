import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as s}from"./index-BJopkiJD.js";import{M as i}from"./blocks-D_r2w_Wi.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";function r(o){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...s(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Loaders/Node (fromJsonFile · fromEnv · fromPublicEnv)"}),`
`,e.jsx(n.h1,{id:"nodejs-loaders",children:"Node.js loaders"}),`
`,e.jsx(n.p,{children:"These loaders run in Node.js only and cannot be demoed in the browser."}),`
`,e.jsx(n.h2,{id:"fromjsonfilepath",children:e.jsx(n.code,{children:"fromJsonFile(path)"})}),`
`,e.jsxs(n.p,{children:["Reads and JSON-parses a file from the filesystem using ",e.jsx(n.code,{children:"fs/promises"}),"."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { ConfigLoader, createConfigQuery, fromJsonFile, withZod } from '@tacky-org/config';

const loader = ConfigLoader.create({
  load:     fromJsonFile('./config/app.config.json'),
  validate: withZod(AppConfigSchema),
});

export const appConfigQuery = createConfigQuery('app_config', loader);
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"fromJsonFile"})," uses a dynamic ",e.jsx(n.code,{children:"import('fs/promises')"}),` so it tree-shakes cleanly
out of browser bundles.`]}),`
`,e.jsx(n.h2,{id:"fromenvkeys",children:e.jsx(n.code,{children:"fromEnv(keys)"})}),`
`,e.jsxs(n.p,{children:["Reads a specific set of env vars. Throws a single error listing ",e.jsx(n.strong,{children:"all"}),` missing
keys at once so you fix everything in one go.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { fromEnv } from '@tacky-org/config';

const loader = ConfigLoader.create({
  load:     fromEnv(['API_URL', 'API_KEY', 'TIMEOUT_MS']),
  validate: (raw) => raw as Record<string, string>,
  map: (env) => ({
    apiUrl:  env.API_URL,
    apiKey:  env.API_KEY,
    timeout: Number(env.TIMEOUT_MS),
  }),
});
`})}),`
`,e.jsx(n.h2,{id:"frompublicenvprefix",children:e.jsx(n.code,{children:"fromPublicEnv(prefix)"})}),`
`,e.jsxs(n.p,{children:[`Reads all env vars that start with a given prefix and strips the prefix from the keys.
Works with `,e.jsx(n.code,{children:"VITE_"}),", ",e.jsx(n.code,{children:"NEXT_PUBLIC_"}),", or any custom convention."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { fromPublicEnv } from '@tacky-org/config';

// Given: VITE_API_URL=https://api.example.com  VITE_TIMEOUT=5000
const loader = ConfigLoader.create({
  load:     fromPublicEnv('VITE_'),
  validate: (raw) => raw as { API_URL: string; TIMEOUT: string },
  map: (env) => ({ apiUrl: env.API_URL, timeout: Number(env.TIMEOUT) }),
});
// Produces: { API_URL: 'https://api.example.com', TIMEOUT: '5000' }
`})})]})}function p(o={}){const{wrapper:n}={...s(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{p as default};
