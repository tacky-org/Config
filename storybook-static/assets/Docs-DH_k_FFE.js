import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-CWBD0LLT.js";import{M as i,C as a}from"./blocks-BucKGCcb.js";import{S as s,M as c,W as d}from"./Transforms.stories-DTtQKueq.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./loaders-Ba8cVKf-.js";function o(t){const n={code:"code",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{of:s}),`
`,e.jsx(n.h1,{id:"map",children:e.jsx(n.code,{children:"map"})}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.code,{children:"map"}),` when the shape you want to work with in components differs from the
raw JSON returned by the config source.`]}),`
`,e.jsxs(n.p,{children:["Config is ",e.jsx(n.strong,{children:"readonly"})," — there is no ",e.jsx(n.code,{children:"unmap"}),". The full pipeline is:"]}),`
`,e.jsx(n.p,{children:e.jsx(n.code,{children:"load → validate → map → TRuntime"})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"without-context",children:"Without context"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const configLoader = ConfigLoader.create<RawConfig, AppConfig>({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(RawConfigSchema),

  map: ({ api_url, timeout_ms, feature_flags }) => {
    const features = new Set(feature_flags);
    return {
      apiUrl:     api_url,
      timeout:    timeout_ms,
      features,
      hasFeature: (flag) => features.has(flag),
    };
  },
});
`})}),`
`,e.jsxs(n.p,{children:["The raw JSON (",e.jsx(n.code,{children:"api_url"}),", ",e.jsx(n.code,{children:"feature_flags"}),") is only ever referenced in ",e.jsx(n.code,{children:"validate"}),`
and `,e.jsx(n.code,{children:"map"}),". Components only see the clean runtime shape."]}),`
`,e.jsx(a,{of:c}),`
`,e.jsx(n.h2,{id:"with-context--feature-flags-vary-by-environment",children:"With context — feature flags vary by environment"}),`
`,e.jsxs(n.p,{children:["The same ",e.jsx(n.code,{children:"map"})," function applies regardless of context — ",e.jsx(n.code,{children:"map"})," is always ",e.jsx(n.code,{children:"TConfig → TRuntime"}),`.
The ctx is used in `,e.jsx(n.code,{children:"load"})," to fetch the right raw data per environment."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`interface EnvCtx { env: 'production' | 'staging' }

const configLoader = ConfigLoader.create<RawConfig, AppConfig, EnvCtx>({
  key:      (ctx) => ['app_config', ctx.env],
  load:     (ctx) => fromFetch(\`/api/config?env=\${ctx.env}\`)(),
  validate: withZod(RawConfigSchema),
  map:      ({ api_url, timeout_ms, feature_flags }) => {
    const features = new Set(feature_flags);
    return { apiUrl: api_url, timeout: timeout_ms, features, hasFeature: (f) => features.has(f) };
  },
});
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data: config } = useConfigSuspenseQuery(configLoader, { env: 'staging' });
config.hasFeature('beta'); // true in staging, false in production
`})}),`
`,e.jsx(a,{of:d})]})}function C(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(o,{...t})}):o(t)}export{C as default};
