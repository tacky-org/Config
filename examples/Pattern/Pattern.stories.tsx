import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppPattern } from "./Pattern";

const meta: Meta<typeof AppPattern> = {
  title: "Pattern/App Structure",
  component: AppPattern,
};
export default meta;

export const Standard: StoryObj<typeof AppPattern> = {
  name: "Multiple components sharing one loader",
};
