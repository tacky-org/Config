import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ZodValidator } from "./Zod";

const meta: Meta<typeof ZodValidator> = {
  title: "Validators/withZod",
  component: ZodValidator,
};
export default meta;

export const Standard: StoryObj<typeof ZodValidator> = { name: "withZod" };
