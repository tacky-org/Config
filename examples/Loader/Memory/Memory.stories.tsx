import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryLoader } from "./Memory";

const meta: Meta<typeof MemoryLoader> = {
  title: "Loader/Memory",
  component: MemoryLoader,
};
export default meta;

export const Standard: StoryObj<typeof MemoryLoader> = {
  name: "Static in-memory value",
};
