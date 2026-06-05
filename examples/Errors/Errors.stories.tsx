import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadError, ValidateError, ContextLoadError } from "./Errors";

const meta: Meta = { title: "Errors" };
export default meta;

export const Load: StoryObj = {
  name: "Without context — load step (HTTP 404)",
  render: () => <LoadError />,
};

export const Validate: StoryObj = {
  name: "Without context — validate step (wrong shape)",
  render: () => <ValidateError />,
};

export const WithContext: StoryObj = {
  name: "With context — load error per context variant",
  render: () => <ContextLoadError />,
};
