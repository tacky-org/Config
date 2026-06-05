import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppPattern, AppPatternWithContext } from "./Pattern";

const meta: Meta = { title: "Pattern/App Structure" };
export default meta;

export const Standard: StoryObj = {
  name: "Without context — multiple components sharing one loader",
  render: () => <AppPattern />,
};

export const WithContext: StoryObj = {
  name: "With context — multiple components sharing one context-aware loader",
  render: () => <AppPatternWithContext />,
};
