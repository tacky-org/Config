import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WithoutPrefetch, WithLoader, WithLoaderData, WithoutPrefetchContext, WithLoaderContext } from "./Prefetch";

const meta: Meta = { title: "TanStack/Prefetch" };
export default meta;

export const Without: StoryObj = {
  name: "Without context — no prefetch (Suspense fallback shows)",
  render: () => <WithoutPrefetch />,
};

export const Loader: StoryObj = {
  name: "Without context — prefetch in loader",
  render: () => <WithLoader />,
};

export const LoaderData: StoryObj = {
  name: "Without context — ensureQueryData + useLoaderData",
  render: () => <WithLoaderData />,
};

export const WithoutContext: StoryObj = {
  name: "With context — no prefetch (each language suspends)",
  render: () => <WithoutPrefetchContext />,
};

export const WithContext: StoryObj = {
  name: "With context — prefetch all variants in loader",
  render: () => <WithLoaderContext />,
};
