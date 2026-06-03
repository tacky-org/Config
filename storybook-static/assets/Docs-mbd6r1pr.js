import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-BJopkiJD.js";import{M as i,C as s}from"./blocks-D_r2w_Wi.js";import{S as a,a as c}from"./Joi.stories-CAiwXgL_.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";import"./validators-DmaVKS12.js";function n(r){const o={code:"code",h1:"h1",p:"p",pre:"pre",...t(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{of:a}),`
`,e.jsx(o.h1,{id:"withjoi",children:e.jsx(o.code,{children:"withJoi"})}),`
`,e.jsxs(o.p,{children:["Creates a ",e.jsx(o.code,{children:"validate"})," function from a Joi schema."]}),`
`,e.jsxs(o.p,{children:["Joi's ",e.jsx(o.code,{children:".validate()"})," returns ",e.jsx(o.code,{children:"{ error?, value }"}),` rather than throwing directly.
`,e.jsx(o.code,{children:"withJoi"}),` checks the result and throws the error for you, keeping the behaviour
consistent with the other adapters.`]}),`
`,e.jsx(o.pre,{children:e.jsx(o.code,{className:"language-ts",children:`import Joi from 'joi';
import { withJoi } from '@tacky-org/config';

const Schema = Joi.object({
  host:   Joi.string().required(),
  port:   Joi.number().required(),
  secure: Joi.boolean().required(),
});

const loader = ConfigLoader.create({
  load:     fromFetch('/api/config'),
  validate: withJoi(Schema),
});
`})}),`
`,e.jsx(s,{of:c})]})}function J(r={}){const{wrapper:o}={...t(),...r.components};return o?e.jsx(o,{...r,children:e.jsx(n,{...r})}):n(r)}export{J as default};
