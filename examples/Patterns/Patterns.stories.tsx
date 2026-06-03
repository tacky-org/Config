import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SuspensePattern,
  QueryPattern,
  NetworkErrorPattern,
  ValidationErrorPattern,
  RetryPattern,
} from "./Patterns";

const meta: Meta<typeof SuspensePattern> = {
  title: "Patterns/TanStack Query",
  component: SuspensePattern,
};
export default meta;

export const Suspense: StoryObj<typeof SuspensePattern> = {
  name: "useSuspenseQuery",
};

export const Query: StoryObj<typeof QueryPattern> = {
  name: "useQuery — inline loading states",
  render: () => <QueryPattern />,
};

export const NetworkError: StoryObj<typeof NetworkErrorPattern> = {
  name: "Error — network failure",
  render: () => <NetworkErrorPattern />,
};

export const ValidationError: StoryObj<typeof ValidationErrorPattern> = {
  name: "Error — validation failure",
  render: () => <ValidationErrorPattern />,
};

export const Retry: StoryObj<typeof RetryPattern> = {
  name: "Retry with refetch()",
  render: () => <RetryPattern />,
};
