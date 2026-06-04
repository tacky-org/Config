import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-CCCadtBi.js";import{M as a,C as s}from"./blocks-BeiQrR73.js";import{S as i,a as m}from"./Memory.stories-CAKnwJtw.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function t(n){const e={code:"code",h1:"h1",p:"p",pre:"pre",strong:"strong",...r(),...n.components};return o.jsxs(o.Fragment,{children:[o.jsx(a,{of:i}),`
`,o.jsx(e.h1,{id:"frommemory",children:o.jsx(e.code,{children:"fromMemory"})}),`
`,o.jsxs(e.p,{children:[`Returns a static in-memory value. No network, no filesystem.
The go-to loader for `,o.jsx(e.strong,{children:"tests"})," and ",o.jsx(e.strong,{children:"Storybook"}),"."]}),`
`,o.jsx(e.pre,{children:o.jsx(e.code,{className:"language-ts",children:`import { ConfigLoader, fromMemory } from '@tacky-org/config';

const appConfigLoader = ConfigLoader.create({
  key:      'app_config',
  load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 3000, darkMode: false }),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,o.jsx(e.pre,{children:o.jsx(e.code,{className:"language-ts",children:`// In tests — swap the loader for a known value without mocking fetch
const testLoader = ConfigLoader.create({
  key:      'app_config',
  load:     fromMemory({ apiUrl: 'http://localhost', timeout: 100, darkMode: true }),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,o.jsx(s,{of:m})]})}function y(n={}){const{wrapper:e}={...r(),...n.components};return e?o.jsx(e,{...n,children:o.jsx(t,{...n})}):t(n)}export{y as default};
