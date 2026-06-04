import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SuspenseReading, InlineReading } from "./Reading";

const meta: Meta = { title: "Reading" };
export default meta;

export const Suspense: StoryObj = {
  name: "useConfigSuspenseQuery",
  render: () => <SuspenseReading />,
};

export const Inline: StoryObj = {
  name: "useConfigQuery — inline states",
  render: () => <InlineReading />,
};
