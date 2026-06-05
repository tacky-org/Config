import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as s}from"./index-CWBD0LLT.js";import{M as i,C as t}from"./blocks-BucKGCcb.js";import{S as r,a as c,W as d}from"./Pattern.stories-DhSiguWo.js";import"./iframe-BVUERBcb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Kx-y3ZXm.js";import"./ErrorBoundary-Dxf0YgTc.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function a(o){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",...s(),...o.components};return n.jsxs(n.Fragment,{children:[n.jsx(i,{of:r}),`
`,n.jsx(e.h1,{id:"app-structure-pattern",children:"App structure pattern"}),`
`,n.jsxs(e.p,{children:["The recommended pattern is a ",n.jsx(e.code,{children:"configs/"}),` folder with one file per loader.
Each file exports the loader. Components import it directly — no prop drilling, no context.`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/
  configs/
    appConfig.ts
    langConfig.ts
  components/
    ApiStatus.tsx
    TimeoutBadge.tsx
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"without-context",children:"Without context"}),`
`,n.jsx(e.h3,{id:"configsappconfigts",children:n.jsx(e.code,{children:"configs/appConfig.ts"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`import { ConfigLoader, fromFetch, withZod } from '@tacky-org/config';

export const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,n.jsx(e.h3,{id:"components",children:"Components"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ApiStatus.tsx
const { data: config } = useConfigSuspenseQuery(appConfigLoader);

// TimeoutBadge.tsx
const { data: config } = useConfigSuspenseQuery(appConfigLoader);
`})}),`
`,n.jsx(e.p,{children:`Any number of components can import the same loader. The config is fetched once
and cached indefinitely — no duplicate requests.`}),`
`,n.jsx(t,{of:c}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"with-context",children:"With context"}),`
`,n.jsx(e.h3,{id:"configslangconfigts",children:n.jsx(e.code,{children:"configs/langConfig.ts"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`interface LangCtx { language: string }

export const langConfigLoader = ConfigLoader.create<AppConfig, AppConfig, LangCtx>({
  key:  (ctx) => ['lang_config', ctx.language],
  load: (ctx) => fromFetch('/api/config', {
    headers: { 'Accept-Language': ctx.language },
  })(),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,n.jsx(e.h3,{id:"components-1",children:"Components"}),`
`,n.jsx(e.p,{children:"Each component passes ctx as the second argument — the type system requires it:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ApiStatusLocalized.tsx
const { data: config } = useConfigSuspenseQuery(langConfigLoader, { language });

// TimeoutBadgeLocalized.tsx
const { data: config } = useConfigSuspenseQuery(langConfigLoader, { language });
`})}),`
`,n.jsx(e.p,{children:"Multiple components using the same loader + same ctx share a single cache entry — no duplicate requests."}),`
`,n.jsxs(e.h3,{id:"tanstack-router--prefetch-in-loader",children:["TanStack Router — prefetch in ",n.jsx(e.code,{children:"loader"})]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`export const Route = createFileRoute('/app')({
  loader: ({ context: { queryClient }, search }) =>
    queryClient.prefetchQuery(langConfigLoader.queryOptions({ language: search.lang })),
});
`})}),`
`,n.jsx(t,{of:d})]})}function y(o={}){const{wrapper:e}={...s(),...o.components};return e?n.jsx(e,{...o,children:n.jsx(a,{...o})}):a(o)}export{y as default};
