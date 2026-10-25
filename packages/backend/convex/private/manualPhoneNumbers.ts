import { ConvexError, v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "../_generated/server";

async function getOrganizationId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Identity not found",
    });
  }

  const orgId = identity.orgId as string | undefined;

  if (!orgId) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Organization not found",
    });
  }

  return orgId;
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const organizationId = await getOrganizationId(ctx);

    return await ctx.db
      .query("manualPhoneNumbers")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const organizationId = await getOrganizationId(ctx);
    const name = args.name.trim();
    const phoneNumber = args.phoneNumber.trim();

    if (!name || !phoneNumber) {
      throw new ConvexError("Name and phone number are required");
    }

    await ctx.db.insert("manualPhoneNumbers", {
      organizationId,
      name,
      phoneNumber,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("manualPhoneNumbers"),
  },
  handler: async (ctx, args) => {
    const organizationId = await getOrganizationId(ctx);
    const entry = await ctx.db.get(args.id);

    if (!entry || entry.organizationId !== organizationId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Phone number not found",
      });
    }

    await ctx.db.delete(args.id);
  },
});