
import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
  name: "KIBO",
  languageModel: google("gemini-3.5-flash-lite"),
  instructions: SUPPORT_AGENT_PROMPT,
});
