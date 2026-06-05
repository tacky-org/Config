import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryLoader, MemoryLoaderWithContext } from "./Memory";

const meta: Meta = { title: "Loader/Memory" };
export default meta;

export const Standard: StoryObj = {
  name: "Without context — static in-memory value",
  render: () => <MemoryLoader />,
};

export const WithContext: StoryObj = {
  name: "With context — separate cache entry per theme",
  render: () => <MemoryLoaderWithContext />,
};
