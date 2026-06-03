import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-BJopkiJD.js";import{M as d,C as c}from"./blocks-D_r2w_Wi.js";import{S as t,a as o}from"./WindowScript.stories-DfyUlUvU.js";import"./iframe-t41Shdxt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-s4dg2dbQ.js";import"./ErrorBoundary-D0T1vCxW.js";function s(r){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:t}),`
`,e.jsxs(n.h1,{id:"fromwindow--fromscript",children:[e.jsx(n.code,{children:"fromWindow"})," + ",e.jsx(n.code,{children:"fromScript"})]}),`
`,e.jsx(n.p,{children:`Two patterns for reading config the server has already embedded in the HTML —
no extra network round-trip on the client.`}),`
`,e.jsx(n.h2,{id:"fromwindowkey",children:e.jsx(n.code,{children:"fromWindow(key)"})}),`
`,e.jsx(n.p,{children:"The server writes config to a global before the app script loads."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-html",children:`<script>window.__APP_CONFIG__ = { apiUrl: "https://api.example.com" };<\/script>
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`fromWindow('__APP_CONFIG__')
`})}),`
`,e.jsx(n.h2,{id:"fromscriptid",children:e.jsx(n.code,{children:"fromScript(id)"})}),`
`,e.jsxs(n.p,{children:["The server embeds config in a ",e.jsx(n.code,{children:'<script type="application/json">'}),` tag.
Avoids polluting the global scope and is unaffected by `,e.jsx(n.code,{children:"script-src"})," CSP rules."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-html",children:`<script id="app-config" type="application/json">{"apiUrl":"https://api.example.com"}<\/script>
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`fromScript('app-config')
`})}),`
`,e.jsx(n.h2,{id:"when-to-use-which",children:"When to use which"}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{children:e.jsx("code",{children:"fromWindow"})}),e.jsx("th",{children:e.jsx("code",{children:"fromScript"})})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Global scope pollution"}),e.jsx("td",{children:"Yes"}),e.jsx("td",{children:"No"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Works before DOM ready"}),e.jsx("td",{children:"Yes"}),e.jsx("td",{children:"No — needs DOM"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Readable in DevTools"}),e.jsx("td",{children:"As a JS variable"}),e.jsx("td",{children:"As an element"})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:["CSP ",e.jsx("code",{children:"script-src"})," impact"]}),e.jsx("td",{children:"Yes"}),e.jsx("td",{children:"No (not executable)"})]})]})]}),`
`,e.jsx(c,{of:o})]})}function u(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{u as default};
