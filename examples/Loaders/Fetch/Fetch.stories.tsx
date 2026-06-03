import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FetchLoader } from "./Fetch";

const meta: Meta<typeof FetchLoader> = {
  title: "Loaders/fromFetch",
  component: FetchLoader,
};
export default meta;

export const Standard: StoryObj<typeof FetchLoader> = { name: "fromFetch" };
