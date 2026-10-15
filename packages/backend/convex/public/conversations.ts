import { mutation, query, action } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { internal, components } from "../_generated/api";

export const create = mutation({
  args: {
    contactSessionId: v.id("contactSessions"),
    organizationId: v.string(),
  },

  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found",
      });
    }

    if (contactSession.organizationId !== args.organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session does not belong to this organization",
      });
    }

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.contactSessionId,
    });

    const conversationId = await ctx.db.insert("conversations", {
      threadId,
      organizationId: args.organizationId,
      contactSessionId: args.contactSessionId,
      status: "unresolved",
    });

    return conversationId;
  },
});

export const sendWelcomeMessage = action({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
    organizationId: v.string(),
  },

  handler: async (ctx, args) => {
    const conversation = await ctx.runQuery(
      internal.system.conversations.getOne,
      {
        conversationId: args.conversationId,
        contactSessionId: args.contactSessionId,
      },
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    const widgetSettings = await ctx.runQuery(
      internal.private.widgetSettings.getByOrganization,
      { organizationId: args.organizationId },
    );

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      message: {
        role: "assistant",
        content: widgetSettings?.greetMessage || "Hello there! I'm KIBO. How can I help you today?",
      },
    });
  },
});

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationsWithAdditionalData = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: {
            numItems: 1,
            cursor: null,
          },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          ...conversation,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationsWithAdditionalData,
    };
  },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },

  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.contactSessionId !== args.contactSessionId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Conversation does not belong to this contact session",
      });
    }

    return conversation;
  },
});