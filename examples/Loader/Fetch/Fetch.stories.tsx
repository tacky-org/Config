import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FetchLoader, FetchLoaderWithContext } from "./Fetch";

const meta: Meta = { title: "Loader/Fetch" };
export default meta;

export const Standard: StoryObj = {
  name: "Without context — shared cache entry",
  render: () => <FetchLoader />,
};

export const WithContext: StoryObj = {
  name: "With context — separate cache entry per todoId",
  render: () => <FetchLoaderWithContext />,
};
