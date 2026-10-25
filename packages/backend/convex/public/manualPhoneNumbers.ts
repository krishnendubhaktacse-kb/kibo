
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getAllByOrganizationId = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("manualPhoneNumbers")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .collect();

    return contacts.map((contact) => ({
      _id: contact._id,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
    }));
  },
});
