import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-BJopkiJD.js";import{M as s,C as i}from"./blocks-D_r2w_Wi.js";import{S as a,a as c}from"./Yup.stories-H3N6mtWu.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";import"./validators-DmaVKS12.js";function o(r){const n={code:"code",h1:"h1",p:"p",pre:"pre",...t(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{of:a}),`
`,e.jsx(n.h1,{id:"withyup",children:e.jsx(n.code,{children:"withYup"})}),`
`,e.jsxs(n.p,{children:["Creates a ",e.jsx(n.code,{children:"validate"})," function from a Yup schema using ",e.jsx(n.code,{children:".validateSync()"}),`.
Keeps the validate step synchronous — Yup's async `,e.jsx(n.code,{children:".validate()"})," is not used."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { object, string, number, boolean } from 'yup';
import { withYup } from '@tacky-org/config';

const Schema = object({
  host:   string().required(),
  port:   number().required().positive().integer(),
  secure: boolean().required(),
});

const loader = ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withYup(Schema),
});
`})}),`
`,e.jsxs(n.p,{children:["Throws Yup's ",e.jsx(n.code,{children:"ValidationError"})," on failure, which TanStack surfaces as a query error."]}),`
`,e.jsx(i,{of:c})]})}function g(r={}){const{wrapper:n}={...t(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(o,{...r})}):o(r)}export{g as default};
