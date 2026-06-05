import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SuspenseReading, InlineReading, SuspenseReadingWithContext, InlineReadingWithContext } from "./Reading";

const meta: Meta = { title: "Reading" };
export default meta;

export const Suspense: StoryObj = {
  name: "useConfigSuspenseQuery — without context",
  render: () => <SuspenseReading />,
};

export const Inline: StoryObj = {
  name: "useConfigQuery — without context",
  render: () => <InlineReading />,
};

export const SuspenseWithContext: StoryObj = {
  name: "useConfigSuspenseQuery — with context",
  render: () => <SuspenseReadingWithContext />,
};

export const InlineWithContext: StoryObj = {
  name: "useConfigQuery — with context",
  render: () => <InlineReadingWithContext />,
};
