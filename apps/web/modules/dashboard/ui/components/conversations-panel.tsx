"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  ListIcon,
  SearchIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
} from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { usePaginatedQuery } from "convex/react";
import {
  getCountryFlagUrl,
  getCountryFromTimezone,
} from "@/lib/country-utils";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import Link from "next/link";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";

export const ConversationsPanel = () => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);
  const [search, setSearch] = useState("");

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status:
        statusFilter === "all"
          ? undefined
          : statusFilter,
    },
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="shrink-0 border-b">
        <div className="flex items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Conversations</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Manage customer conversations
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2.5">
          <div className="flex h-8 items-center gap-2 rounded-md border bg-background px-2.5">
            <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="px-3 pb-3">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as "unresolved" | "escalated" | "resolved" | "all",
              )
            }
          >
            <SelectTrigger className="h-8 w-full border-none bg-muted/40 px-2.5 text-xs shadow-none hover:bg-muted/60 focus:ring-0">
              <SelectValue placeholder="Filter conversations">
                <div className="flex items-center gap-2">
                  {statusFilter === "all" && (
                    <ListIcon className="size-3.5" />
                  )}

                  {statusFilter === "unresolved" && (
                    <ArrowRightIcon className="size-3.5" />
                  )}

                  {statusFilter === "escalated" && (
                    <ArrowUpIcon className="size-3.5" />
                  )}

                  {statusFilter === "resolved" && (
                    <CheckIcon className="size-3.5" />
                  )}

                  <span>
                    {statusFilter === "all" && "All"}
                    {statusFilter === "unresolved" && "Unresolved"}
                    {statusFilter === "escalated" && "Escalated"}
                    {statusFilter === "resolved" && "Resolved"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <ListIcon className="size-3.5" />
                  <span>All</span>
                </div>
              </SelectItem>

              <SelectItem value="unresolved">
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="size-3.5" />
                  <span>Unresolved</span>
                </div>
              </SelectItem>

              <SelectItem value="escalated">
                <div className="flex items-center gap-2">
                  <ArrowUpIcon className="size-3.5" />
                  <span>Escalated</span>
                </div>
              </SelectItem>

              <SelectItem value="resolved">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-3.5" />
                  <span>Resolved</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : (
        /* Conversation list */
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex w-full flex-col text-sm">
            {conversations.results
              .filter((conversation) => {
                const query = search.trim().toLowerCase();

                if (!query) return true;

                const name =
                  conversation.contactSession.name?.toLowerCase() ?? "";
                const email =
                  conversation.contactSession.email?.toLowerCase() ?? "";
                const message =
                  conversation.lastMessage?.text?.toLowerCase() ?? "";

                return (
                  name.includes(query) ||
                  email.includes(query) ||
                  message.includes(query)
                );
              })
              .map((conversation) => {
                const isLastMessageFromOperator =
                  conversation.lastMessage?.message?.role !== "user";

                const country = getCountryFromTimezone(
                  conversation.contactSession.metadata?.timezone,
                );

                const countryFlagUrl = country?.code
                  ? getCountryFlagUrl(country.code)
                  : undefined;

                return (
                  <Link
                    key={conversation._id}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                      pathname === `/conversations/${conversation._id}` &&
                        "bg-accent text-accent-foreground",
                    )}
                    href={`/conversations/${conversation._id}`}
                  >
                    <div
                      className={cn(
                        "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                        pathname === `/conversations/${conversation._id}` &&
                          "opacity-100",
                      )}
                    />

                    <DicebearAvatar
                      seed={conversation.contactSession._id}
                      badgeImageUrl={countryFlagUrl}
                      size={40}
                      className="shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex w-full items-center gap-2">
                        <span className="truncate font-bold">
                          {conversation.contactSession.name}
                        </span>

                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(conversation._creationTime)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex w-0 grow items-center gap-1">
                          {isLastMessageFromOperator && (
                            <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                          )}

                          <span
                            className={cn(
                              "line-clamp-1 text-xs text-muted-foreground",
                              !isLastMessageFromOperator &&
                                "font-bold text-black",
                            )}
                          >
                            {conversation.lastMessage?.text}
                          </span>
                        </div>

                        <ConversationStatusIcon
                          status={conversation.status}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}

            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const SkeletonConversations = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              className="flex items-start gap-3 rounded-lg p-4"
              key={index}
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24"/>
                  <Skeleton className="ml-auto h-3 w-12 shrink-0"/>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};