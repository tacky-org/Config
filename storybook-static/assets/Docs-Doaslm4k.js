import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-CCCadtBi.js";import{M as i,C as a}from"./blocks-BeiQrR73.js";import{S as c,a as s}from"./Pattern.stories-BgaGuwUS.js";import"./iframe-BCnnWq58.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BccInxdw.js";import"./ErrorBoundary-BVcqnUid.js";import"./loaders-Ba8cVKf-.js";import"./AppConfig-BxLLJAGu.js";function r(o){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...t(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{of:c}),`
`,e.jsx(n.h1,{id:"app-structure-pattern",children:"App structure pattern"}),`
`,e.jsxs(n.p,{children:["The recommended pattern is a ",e.jsx(n.code,{children:"configs/"}),` folder with one file per config.
Each file exports the loader. Components import it directly — no prop drilling, no context.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`src/
  configs/
    appConfig.ts
    featureFlags.ts
  components/
    ApiStatus.tsx
    FeatureGate.tsx
`})}),`
`,e.jsx(n.h2,{id:"configsappconfigts",children:e.jsx(n.code,{children:"configs/appConfig.ts"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { ConfigLoader, fromFetch } from '@tacky-org/config';
import { z } from 'zod';

const AppConfigSchema = z.object({
  apiUrl:   z.string().url(),
  timeout:  z.number(),
  darkMode: z.boolean(),
});

type AppConfig = z.infer<typeof AppConfigSchema>;

export const appConfigLoader = ConfigLoader.create<AppConfig>({
  key:      'app_config',
  load:     fromFetch('/api/config'),
  validate: withZod(AppConfigSchema),
});
`})}),`
`,e.jsx(n.h2,{id:"componentsapistatustsx",children:e.jsx(n.code,{children:"components/ApiStatus.tsx"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useConfigSuspenseQuery } from '@tacky-org/config';
import { appConfigLoader } from '../configs/appConfig';

export function ApiStatus() {
  const { data: config } = useConfigSuspenseQuery(appConfigLoader);
  return <p>Connected to: {config.apiUrl}</p>;
}
`})}),`
`,e.jsx(n.p,{children:`Any number of components can import the same loader. The config is fetched once
and cached indefinitely — no duplicate requests.`}),`
`,e.jsxs(n.h2,{id:"tanstack-router--beforeload",children:["TanStack Router — ",e.jsx(n.code,{children:"beforeLoad"})]}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.code,{children:"prefetchConfig"})," in ",e.jsx(n.code,{children:"beforeLoad"})," or ",e.jsx(n.code,{children:"loader"}),` to ensure config is in the cache
before the route renders. Components calling `,e.jsx(n.code,{children:"useConfigSuspenseQuery"}),` will never
suspend — the data is already there.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { prefetchConfig } from '@tacky-org/config';
import { appConfigLoader } from '../configs/appConfig';

export const Route = createFileRoute('/app')({
  beforeLoad: ({ context: { queryClient } }) =>
    prefetchConfig(appConfigLoader, queryClient),
});
`})}),`
`,e.jsx(n.p,{children:"Multiple loaders in parallel:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`beforeLoad: ({ context: { queryClient } }) =>
  Promise.all([
    prefetchConfig(appConfigLoader,    queryClient),
    prefetchConfig(featureFlagsLoader, queryClient),
  ]),
`})}),`
`,e.jsx(a,{of:s})]})}function j(o={}){const{wrapper:n}={...t(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{j as default};
