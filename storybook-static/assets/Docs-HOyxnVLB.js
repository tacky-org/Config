import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-CWBD0LLT.js";import{M as s,C as t}from"./blocks-BucKGCcb.js";import{S as i,a as d,W as c}from"./Memory.stories-60U_1pKA.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function a(o){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{of:i}),`
`,e.jsx(n.h1,{id:"frommemory",children:e.jsx(n.code,{children:"fromMemory"})}),`
`,e.jsxs(n.p,{children:[`Returns a static in-memory value. No network, no filesystem.
The go-to loader for `,e.jsx(n.strong,{children:"tests"})," and ",e.jsx(n.strong,{children:"Storybook"}),"."]}),`
`,e.jsx(n.h2,{id:"without-context--static-value-one-shared-cache-entry",children:"Without context — static value, one shared cache entry"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { ConfigLoader, fromMemory } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      'app_config',
  load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 3000, darkMode: false }),
  validate: validateAppConfig,
});
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data: config } = useConfigSuspenseQuery(appConfigLoader);
`})}),`
`,e.jsx(t,{of:d}),`
`,e.jsx(n.h2,{id:"with-context--separate-cache-entry-per-theme",children:"With context — separate cache entry per theme"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`interface ThemeCtx { darkMode: boolean }

const themedConfigLoader = ConfigLoader.create<AppConfig, AppConfig, ThemeCtx>({
  key:      (ctx) => ['app_config', ctx.darkMode ? 'dark' : 'light'],
  load:     (ctx) => fromMemory({ ...baseConfig, darkMode: ctx.darkMode })(),
  validate: validateAppConfig,
});
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Each theme variant is cached independently
const { data: light } = useConfigSuspenseQuery(themedConfigLoader, { darkMode: false });
const { data: dark  } = useConfigSuspenseQuery(themedConfigLoader, { darkMode: true });
`})}),`
`,e.jsx(t,{of:c}),`
`,e.jsx(n.h2,{id:"tests",children:"Tests"}),`
`,e.jsx(n.p,{children:"Swap the loader for a known value without mocking fetch:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const testLoader = ConfigLoader.create<AppConfig>({
  key:      'app_config',
  load:     fromMemory({ apiUrl: 'http://localhost', timeout: 100, darkMode: true }),
  validate: validateAppConfig,
});
`})})]})}function y(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(a,{...o})}):a(o)}export{y as default};
