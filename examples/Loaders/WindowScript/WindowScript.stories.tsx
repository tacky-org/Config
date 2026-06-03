import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WindowScriptLoader } from "./WindowScript";

const meta: Meta<typeof WindowScriptLoader> = {
  title: "Loaders/fromWindow + fromScript",
  component: WindowScriptLoader,
};
export default meta;

export const Standard: StoryObj<typeof WindowScriptLoader> = { name: "Server-injected config" };
