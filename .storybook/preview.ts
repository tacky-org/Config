import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Loader",   ["Memory", "Fetch"],
          "Reading",
          "Transforms",
          "Errors",
          "TanStack", ["Invalidate", "Prefetch"],
          "Pattern",  ["App Structure"],
        ],
      },
    },
  },
};

export default preview;
