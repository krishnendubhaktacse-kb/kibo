import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const search = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user questions.",

  inputSchema: z.object({
    query: z
      .string()
      .describe("The search query to find relevant information"),
  }),

  execute: async (ctx, args): Promise<string> => {
    if (!ctx.threadId) {
      return "Missing thread ID.";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId },
    );

    if (!conversation) {
      return "Conversation not found.";
    }

    const orgId = conversation.organizationId;

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    if (!searchResult.text.trim()) {
      return "No relevant information was found in the knowledge base.";
    }

    const titles = searchResult.entries
      .map((entry) => entry.title)
      .filter((title): title is string => Boolean(title));

    const contextText = `
Knowledge base sources: ${titles.join(", ") || "Untitled sources"}

Retrieved context:
${searchResult.text}
`;

    const response = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system: SEARCH_INTERPRETER_PROMPT,
      prompt: `User question: ${args.query}

${contextText}`,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });

    return response.text;
  },
});