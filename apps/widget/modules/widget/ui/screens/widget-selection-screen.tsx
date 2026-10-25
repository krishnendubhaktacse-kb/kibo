"use client";

import {
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  hasVapiSecretsAtom,
  manualPhoneNumbersAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const manualPhoneNumbers = useAtomValue(manualPhoneNumbersAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const createConversation = useMutation(api.public.conversations.create);
  const sendWelcomeMessage = useAction(
    api.public.conversations.sendWelcomeMessage
  );
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization ID");
      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);

    try {
        const conversationId = await createConversation({
          contactSessionId,
          organizationId,
        });

        await sendWelcomeMessage({
          conversationId,
          contactSessionId,
          organizationId,
        });

        setConversationId(conversationId);
        setScreen("chat");
      } catch {
        setScreen("auth");
      } finally {
        setIsPending(false);
      }
  }

  return (
    <>
      <WidgetHeader>
        <div className="rounded-t-xl bg-gradient-to-b from-blue-500 to-sky-500 px-5 py-6 text-white">
          <h1 className="text-3xl font-bold">
            Hi there! <span>👋</span>
          </h1>

          <p className="mt-2 text-sm text-blue-100">
            How can we help you today?
          </p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col gap-y-3 overflow-y-auto bg-muted p-4">
        {/* Start Chat */}
        <Button
          variant="outline"
          className="h-16 w-full justify-between rounded-lg bg-background px-4 shadow-sm"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-3">
            <MessageSquareTextIcon className="size-4 text-muted-foreground" />

            <span className="text-sm font-normal">
              Start chat
            </span>
          </div>

          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>

        {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
        <Button
          variant="outline"
          className="h-16 w-full justify-between rounded-lg bg-background px-4 shadow-sm"
          onClick={() => setScreen("voice")}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-3">
            <MicIcon className="size-4 text-muted-foreground" />

            <span className="text-sm font-normal">
              Start voice call
            </span>
          </div>

          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>
        )}

        {manualPhoneNumbers.length > 0 && (
        <Button
          variant="outline"
          className="h-16 w-full justify-between rounded-lg bg-background px-4 shadow-sm"
          onClick={() => setScreen("contact")}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-3">
            <PhoneIcon className="size-4 text-muted-foreground" />

            <span className="text-sm font-normal">
              Call us
            </span>
          </div>

          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};