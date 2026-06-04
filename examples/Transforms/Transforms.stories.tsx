import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transforms } from "./Transforms";

const meta: Meta<typeof Transforms> = {
  title: "Transforms",
  component: Transforms,
};
export default meta;

export const MapTransform: StoryObj<typeof Transforms> = {
  name: "map — snake_case API to runtime shape",
};
