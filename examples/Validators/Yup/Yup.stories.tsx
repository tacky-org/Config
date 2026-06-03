import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { YupValidator } from "./Yup";

const meta: Meta<typeof YupValidator> = {
  title: "Validators/withYup",
  component: YupValidator,
};
export default meta;

export const Standard: StoryObj<typeof YupValidator> = { name: "withYup" };
