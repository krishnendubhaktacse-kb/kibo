
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, QueryCtx } from "../_generated/server";

const getOrganizationId = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Identity not found",
    });
  }

  const organizationId = identity.orgId as string;

  if (!organizationId) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Organization not found",
    });
  }

  return organizationId;
};

// Get paginated feedback for the authenticated organization
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    const organizationId = await getOrganizationId(ctx);

    return await ctx.db
      .query("feedback")
      .withIndex("by_organization_id_and_created_at", (q) =>
        q.eq("organizationId", organizationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Get feedback statistics for the authenticated organization
export const summary = query({
  args: {},

  handler: async (ctx) => {
    const organizationId = await getOrganizationId(ctx);

    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();

    const total = feedback.length;

    const totalRating = feedback.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: feedback.filter((item) => item.rating === rating).length,
    }));

    return {
      total,
      averageRating:
        total > 0 ? Number((totalRating / total).toFixed(1)) : 0,
      distribution,
    };
  },
});
