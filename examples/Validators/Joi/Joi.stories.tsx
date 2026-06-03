import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { JoiValidator } from "./Joi";

const meta: Meta<typeof JoiValidator> = {
  title: "Validators/withJoi",
  component: JoiValidator,
};
export default meta;

export const Standard: StoryObj<typeof JoiValidator> = { name: "withJoi" };
