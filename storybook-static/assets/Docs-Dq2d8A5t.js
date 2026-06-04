import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as o}from"./index-CCCadtBi.js";import{M as t,C as s}from"./blocks-BeiQrR73.js";import{S as i,M as c}from"./Transforms.stories-BhpTBamS.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./loaders-Ba8cVKf-.js";function a(r){const n={code:"code",h1:"h1",p:"p",pre:"pre",strong:"strong",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{of:i}),`
`,e.jsx(n.h1,{id:"map",children:e.jsx(n.code,{children:"map"})}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.code,{children:"map"}),` when the shape you want to work with in components differs from the
raw JSON returned by the config source.`]}),`
`,e.jsxs(n.p,{children:["Config is ",e.jsx(n.strong,{children:"readonly"})," — there is no ",e.jsx(n.code,{children:"unmap"}),". The full pipeline is:"]}),`
`,e.jsx(n.p,{children:e.jsx(n.code,{children:"load → validate → map → TRuntime"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`interface RawConfig  { api_url: string; feature_flags: string[] }
interface AppConfig  { apiUrl: string; features: Set<string>; hasFeature(f: string): boolean }

const appConfigLoader = ConfigLoader.create<RawConfig, AppConfig>({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(RawConfigSchema),

  map: ({ api_url, feature_flags }) => {
    const features = new Set(feature_flags);
    return {
      apiUrl:     api_url,
      features,
      hasFeature: (flag) => features.has(flag),
    };
  },
});
`})}),`
`,e.jsxs(n.p,{children:["The raw JSON (",e.jsx(n.code,{children:"api_url"}),", ",e.jsx(n.code,{children:"feature_flags"}),") is only ever referenced in ",e.jsx(n.code,{children:"validate"}),`
and `,e.jsx(n.code,{children:"map"}),". Components only see the clean runtime shape."]}),`
`,e.jsx(s,{of:c})]})}function j(r={}){const{wrapper:n}={...o(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(a,{...r})}):a(r)}export{j as default};
