import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transforms, TransformsWithContext } from "./Transforms";

const meta: Meta = { title: "Transforms" };
export default meta;

export const MapTransform: StoryObj = {
  name: "Without context — map snake_case API to runtime shape",
  render: () => <Transforms />,
};

export const WithContext: StoryObj = {
  name: "With context — feature flags vary by environment",
  render: () => <TransformsWithContext />,
};
