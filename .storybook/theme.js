import { create } from "storybook/theming";

import pkg from './../package.json' with { type: 'json' }

export default create({
  base: "light",
  brandTitle: pkg.name,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",
});
