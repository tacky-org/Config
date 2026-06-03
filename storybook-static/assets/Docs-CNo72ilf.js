import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-BJopkiJD.js";import{M as s,C as a}from"./blocks-D_r2w_Wi.js";import{S as i,a as m}from"./Memory.stories-CMcnFd0M.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";function t(n){const o={code:"code",h1:"h1",p:"p",pre:"pre",strong:"strong",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{of:i}),`
`,e.jsx(o.h1,{id:"frommemory",children:e.jsx(o.code,{children:"fromMemory"})}),`
`,e.jsxs(o.p,{children:[`Returns a static in-memory value. No network, no filesystem, no environment setup.
The go-to loader for `,e.jsx(o.strong,{children:"tests"})," and ",e.jsx(o.strong,{children:"Storybook"}),"."]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`import { fromMemory } from '@tacky-org/config';

const loader = ConfigLoader.create({
  load:     fromMemory({ apiUrl: 'https://api.example.com', timeout: 3000 }),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,e.jsxs(o.p,{children:["In tests, swap the loader for a known value without mocking ",e.jsx(o.code,{children:"fetch"})," or the filesystem:"]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`// my-component.test.tsx
const testLoader = ConfigLoader.create({
  load:     fromMemory({ apiUrl: 'http://localhost', timeout: 100 }),
  validate: withZod(AppConfigSchema),
});

renderWithClient(<MyComponent />, {
  queries: [createConfigQuery('app_config', testLoader)],
});
`})}),`
`,e.jsx(a,{of:m})]})}function u(n={}){const{wrapper:o}={...r(),...n.components};return o?e.jsx(o,{...n,children:e.jsx(t,{...n})}):t(n)}export{u as default};
