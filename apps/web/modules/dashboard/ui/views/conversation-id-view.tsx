"use client";

import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  ArrowLeftIcon,
  ContactRoundIcon,
  MoreHorizontalIcon,
  XIcon,
  Wand2Icon,
} from "lucide-react";
import { ContactPanel } from "../components/contact-panel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
    AIInput,
    AIInputButton,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools,
} from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const router = useRouter();
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation
      ? { threadId: conversation.threadId }
      : "skip",
    {
      initialNumItems: 10,
    }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
  } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");

    try {
      const response = await enhanceResponse({ prompt: currentValue });

      form.setValue("message", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const createMessage = useMutation(api.private.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateConversationStatus = useMutation(api.private.conversations.updateStatus);
  const handleToggleStatus = async () => {
      if (!conversation) {
          return;
      }

      setIsUpdatingStatus(true);

      let newStatus: "unresolved" | "resolved" | "escalated";

      // Cycle through states: unresolved -> escalated -> resolved -> unresolved
      if (conversation.status === "unresolved") {
          newStatus = "escalated";
      } else if (conversation.status === "escalated") {
          newStatus = "resolved";
      } else {
          newStatus = "unresolved";
      }

      try {
        await updateConversationStatus({
            conversationId,
            status: newStatus,
        });
      } catch (error) {
          console.error(error);
      } finally {
        setIsUpdatingStatus(false);
      }
    };

    if (conversation === undefined) {
  return <ConversationIdViewLoading />;
}

if (conversation === null) {
  return (
    <div className="flex h-full items-center justify-center">
      Conversation not found or you don't have access.
    </div>
  );
}

if (messages.status === "LoadingFirstPage") {
  return <ConversationIdViewLoading />;
}

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-muted">
      <header className="flex items-center border-b bg-background p-2.5">
        {/* Mobile back button */}
        <Button
          className="md:hidden"
          size="icon"
          variant="ghost"
          onClick={() => router.push("/conversations")}
          aria-label="Back to conversations"
        >
          <ArrowLeftIcon className="size-5" />
        </Button>

        {/* Desktop more button */}
        <Button
          className="hidden md:inline-flex"
          size="sm"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>

        {/* Desktop status button */}
        {!!conversation && (
          <div className="ml-auto hidden md:flex">
            <ConversationStatusButton
              onClick={handleToggleStatus}
              status={conversation.status}
              disabled={isUpdatingStatus}
            />
          </div>
        )}

        {/* Mobile status button */}
        {!!conversation && (
          <div className="ml-auto md:hidden">
            <ConversationStatusButton
              onClick={handleToggleStatus}
              status={conversation.status}
              disabled={isUpdatingStatus}
            />
          </div>
        )}

        {/* Mobile contact button */}
        <Button
          className="ml-2 md:hidden"
          size="icon"
          variant="ghost"
          onClick={() => setIsContactPanelOpen(true)}
          aria-label="Open contact details"
        >
          <ContactRoundIcon className="size-5" />
        </Button>
      </header>
      <AIConversation className="min-h-0 min-w-0 flex-1">
        <AIConversationContent className="min-w-0">
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
        />
        
          {toUIMessages(messages.results ?? []).map((message) => {
            const textParts = message.parts.filter(
              (part) => part.type === "text"
            );

            const nonEmptyTextParts = textParts.filter(
              (part) => part.text.trim().length > 0
            );

            if (nonEmptyTextParts.length === 0) {
              return null;
            }

            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>
                    {nonEmptyTextParts.map((part) => part.text).join("")}
                  </AIResponse>
                </AIMessageContent>

                {message.role === "user" ? (
                  <DicebearAvatar
                    seed={conversation?.contactSessionId ?? "user"}
                    size={32}
                  />
                ) : (
                  <img
                    src="/logo.png"
                    alt="KIBO"
                    className="size-8 rounded-full object-cover"
                  />
                )}
              </AIMessage>
            );
          })}

        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting
                    // TODO: OR if enhancing prompt
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : "Type your response as an operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                >
                  <Wand2Icon />
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
      {isContactPanelOpen && (
  <div className="fixed inset-0 z-50 bg-background md:hidden">
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Contact Details</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsContactPanelOpen(false)}
          aria-label="Close contact details"
        >
          <XIcon className="size-5" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ContactPanel />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="min-h-0 min-w-0 flex-1">
          <AIConversationContent className="min-w-0">
      {Array.from({ length: 8 }, (_, index) => {
        const isUser = index % 2 === 0;
        const widths = ["w-48", "w-60", "w-72"];
        const width = widths[index % widths.length];

        return (
          <div
            className={cn(
              "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
              isUser ? "is-user" : "is-assistant flex-row-reverse"
            )}
            key={index}
          >
            <Skeleton className={`h-9 ${width} rounded-lg bg-neutral-200`} />
            <Skeleton className="size-8 rounded-full bg-neutral-200" />
          </div>
        );
      })}
    </AIConversationContent>
      </AIConversation>

      <div className="p-2">
      <AIInput>
        <AIInputTextarea
          disabled
          placeholder="Type your response as an operator..."
        />
        <AIInputToolbar>
          <AIInputTools />
          <AIInputSubmit disabled status="ready" />
        </AIInputToolbar>
      </AIInput>
    </div>
    </div>
  );
};