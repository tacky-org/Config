import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ValibotValidator } from "./Valibot";

const meta: Meta<typeof ValibotValidator> = {
  title: "Validators/withValibot",
  component: ValibotValidator,
};
export default meta;

export const Standard: StoryObj<typeof ValibotValidator> = { name: "withValibot" };
