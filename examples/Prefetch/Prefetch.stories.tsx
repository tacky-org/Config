import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WithoutPrefetch, WithLoader, WithLoaderData } from "./Prefetch";

const meta: Meta = { title: "TanStack/Prefetch" };
export default meta;

export const Without: StoryObj = {
  name: "Without prefetch — Suspense fallback shows",
  render: () => <WithoutPrefetch />,
};

export const Loader: StoryObj = {
  name: "loader — data in cache before render",
  render: () => <WithLoader />,
};

export const LoaderData: StoryObj = {
  name: "loader — return value via useLoaderData",
  render: () => <WithLoaderData />,
};
