import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadError, ValidateError } from "./Errors";

const meta: Meta = { title: "Errors" };
export default meta;

export const Load: StoryObj = {
  name: "load step — HTTP 404",
  render: () => <LoadError />,
};

export const Validate: StoryObj = {
  name: "validate step — wrong shape",
  render: () => <ValidateError />,
};
