import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorageLoader } from "./Storage";

const meta: Meta<typeof StorageLoader> = {
  title: "Loaders/fromStorage",
  component: StorageLoader,
};
export default meta;

export const Standard: StoryObj<typeof StorageLoader> = { name: "localStorage + sessionStorage" };
