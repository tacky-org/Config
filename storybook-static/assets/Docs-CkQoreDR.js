import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as a}from"./index-BJopkiJD.js";import{M as r,C as s}from"./blocks-D_r2w_Wi.js";import{S as i,a as c}from"./Valibot.stories-UAr6JdwB.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";import"./validators-DmaVKS12.js";function t(o){const n={code:"code",h1:"h1",p:"p",pre:"pre",...a(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{of:i}),`
`,e.jsx(n.h1,{id:"withvalibot",children:e.jsx(n.code,{children:"withValibot"})}),`
`,e.jsxs(n.p,{children:["Creates a ",e.jsx(n.code,{children:"validate"})," function for use with Valibot."]}),`
`,e.jsxs(n.p,{children:["Valibot's API is ",e.jsx(n.code,{children:"v.parse(schema, data)"})," rather than ",e.jsx(n.code,{children:"schema.parse(data)"}),`, so
`,e.jsx(n.code,{children:"withValibot"})," accepts a pre-bound ",e.jsx(n.code,{children:"(data: unknown) => T"}),` function instead of a
schema object directly.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import * as v from 'valibot';
import { withValibot } from '@tacky-org/config';

const Schema = v.object({
  host:   v.string(),
  port:   v.number(),
  secure: v.boolean(),
});

const loader = ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withValibot((data) => v.parse(Schema, data)),
});
`})}),`
`,e.jsxs(n.p,{children:["Throws Valibot's ",e.jsx(n.code,{children:"ValiError"})," on failure, which TanStack surfaces as a query error."]}),`
`,e.jsx(s,{of:c})]})}function b(o={}){const{wrapper:n}={...a(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(t,{...o})}):t(o)}export{b as default};
