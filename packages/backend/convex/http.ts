import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { createClerkClient } from "@clerk/backend";
import { internal } from "./_generated/api";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const requestId = crypto.randomUUID();
console.log("CLERK_WEBHOOK_REQUEST_START", requestId);

const event = await validateRequest(request);

console.log("CLERK_WEBHOOK_EVENT_RESULT", {
  requestId,
  hasEvent: Boolean(event),
  eventType: event?.type ?? null,
});

  if (!event) {
    console.error("CLERK_WEBHOOK_VALIDATION_FAILED_CHECK_HTTP");
    return new Response("Webhook validation failed", { status: 400 });
  }
    switch (event.type) {
      case "subscription.updated": {
        const subscription = event.data as {
          status: string;
          payer?: {
            organization_id: string;
          }
        };

        const organizationId = subscription.payer?.organization_id;

        if (!organizationId) {
            return new Response("Missing Organization ID", { status: 400 });
        }

        const newMaxAllowedMemberships = subscription.status === "active" ? 5 : 1;

        await clerkClient.organizations.updateOrganization(organizationId, {
            maxAllowedMemberships: newMaxAllowedMemberships,
        });

        await ctx.runMutation(internal.system.subscriptions.upsert, {
            organizationId,
            status: subscription.status,
        });

        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret || !secret.startsWith("whsec_")) {
    console.error("WEBHOOK_SECRET_CHECK_FAILED");
    return null;
  }

  if (
    !svixHeaders["svix-id"] ||
    !svixHeaders["svix-timestamp"] ||
    !svixHeaders["svix-signature"]
  ) {
    console.error("WEBHOOK_HEADERS_CHECK_FAILED");
    return null;
  }

  try {
    const wh = new Webhook(secret);

    // Verify the signature; throws if invalid.
    wh.verify(payloadString, svixHeaders);
    console.log("SVIX_VERIFY_SUCCESS");

    // Parse the verified JSON payload.
    return JSON.parse(payloadString) as WebhookEvent;
  } catch (error) {
    console.error(
      "SVIX_VERIFY_ERROR:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export default http;