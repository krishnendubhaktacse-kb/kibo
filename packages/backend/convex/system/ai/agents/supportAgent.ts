import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "KIBO",
  languageModel: google("gemini-3.5-flash-lite"),
  instructions: "You are KIBO, a helpful customer support agent.",
});