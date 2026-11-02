
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const submit = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    rating: v.number(),
    comment: v.optional(v.string()),
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

    if (
      !Number.isInteger(args.rating) ||
      args.rating < 1 ||
      args.rating > 5
    ) {
      throw new ConvexError({
        code: "INVALID_RATING",
        message: "Rating must be between 1 and 5",
      });
    }

    const comment = args.comment?.trim();

    if (comment && comment.length > 1000) {
      throw new ConvexError({
        code: "INVALID_COMMENT",
        message: "Feedback must not exceed 1000 characters",
      });
    }

    return await ctx.db.insert("feedback", {
      organizationId: args.organizationId,
      contactSessionId: args.contactSessionId,
      rating: args.rating,
      comment: comment || undefined,
      createdAt: Date.now(),
    });
  },
});
