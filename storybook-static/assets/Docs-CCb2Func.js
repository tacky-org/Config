import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as n}from"./index-BJopkiJD.js";import{M as s,C as a}from"./blocks-D_r2w_Wi.js";import{S as c,a as i}from"./Storage.stories-Bxy7jwg_.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";function t(r){const o={a:"a",code:"code",h1:"h1",p:"p",pre:"pre",...n(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{of:c}),`
`,e.jsx(o.h1,{id:"fromstorage",children:e.jsx(o.code,{children:"fromStorage"})}),`
`,e.jsxs(o.p,{children:["Reads and JSON-parses an entry from any ",e.jsx(o.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Storage",rel:"nofollow",children:e.jsx(o.code,{children:"Storage"})}),` implementation.
Pass `,e.jsx(o.code,{children:"localStorage"})," or ",e.jsx(o.code,{children:"sessionStorage"})," directly."]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`import { fromStorage } from '@tacky-org/config';

// Persists across browser sessions
fromStorage(localStorage, 'app_config')

// Cleared when the tab closes
fromStorage(sessionStorage, 'feature_flags')
`})}),`
`,e.jsxs(o.p,{children:["Because the adapter accepts the ",e.jsx(o.code,{children:"Storage"})," interface it also works with any polyfill or test stub:"]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`const stub: Storage = {
  getItem:    (k) => store.get(k) ?? null,
  setItem:    (k, v) => store.set(k, v),
  removeItem: (k) => store.delete(k),
  clear:      () => store.clear(),
  get length() { return store.size; },
  key:        (i) => [...store.keys()][i] ?? null,
};

fromStorage(stub, 'app_config')
`})}),`
`,e.jsx(a,{of:i})]})}function j(r={}){const{wrapper:o}={...n(),...r.components};return o?e.jsx(o,{...r,children:e.jsx(t,{...r})}):t(r)}export{j as default};
