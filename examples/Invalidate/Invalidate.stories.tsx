import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineInvalidate, SuspenseInvalidate } from "./Invalidate";

const meta: Meta = { title: "TanStack/Invalidate" };
export default meta;

export const Inline: StoryObj = {
  name: "useConfigQuery — inline error state",
  render: () => <InlineInvalidate />,
};

export const WithBoundary: StoryObj = {
  name: "useConfigSuspenseQuery — QueryErrorResetBoundary",
  render: () => <SuspenseInvalidate />,
};
