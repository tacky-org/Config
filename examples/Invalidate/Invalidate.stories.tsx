import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineInvalidate, SuspenseInvalidate, ContextInvalidate } from "./Invalidate";

const meta: Meta = { title: "TanStack/Invalidate" };
export default meta;

export const Inline: StoryObj = {
  name: "Without context — useConfigQuery inline",
  render: () => <InlineInvalidate />,
};

export const WithBoundary: StoryObj = {
  name: "Without context — useConfigSuspenseQuery + boundary",
  render: () => <SuspenseInvalidate />,
};

export const WithContext: StoryObj = {
  name: "With context — invalidate a specific cache entry",
  render: () => <ContextInvalidate />,
};
