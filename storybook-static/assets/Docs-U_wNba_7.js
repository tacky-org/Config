import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-BJopkiJD.js";import{M as a,C as s}from"./blocks-D_r2w_Wi.js";import{S as i,a as c}from"./Zod.stories-BlJI1NwW.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";import"./validators-DmaVKS12.js";function t(o){const n={code:"code",h1:"h1",p:"p",pre:"pre",strong:"strong",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:i}),`
`,e.jsx(n.h1,{id:"withzod",children:e.jsx(n.code,{children:"withZod"})}),`
`,e.jsxs(n.p,{children:["Creates a ",e.jsx(n.code,{children:"validate"})," function from any schema that exposes ",e.jsx(n.code,{children:".parse(raw)"}),`.
Works with `,e.jsx(n.strong,{children:"Zod"})," and any compatible library."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { z } from 'zod';
import { withZod } from '@tacky-org/config';

const Schema = z.object({
  host:   z.string(),
  port:   z.number(),
  secure: z.boolean(),
});

const loader = ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withZod(Schema),  // type inferred from the schema
});
`})}),`
`,e.jsxs(n.p,{children:["The adapter is duck-typed — it only requires the ",e.jsx(n.code,{children:".parse(raw)"}),` method, so any
library that matches that shape works without any extra setup.`]}),`
`,e.jsx(s,{of:c})]})}function g(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(t,{...o})}):t(o)}export{g as default};
