import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Example } from "./Example";

const meta: Meta<typeof Example> = {
  title: "Example 1",
  component: Example,
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Example>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {
  name: "Continent",
  args: {},
  render: (args) => <Example />,
};
