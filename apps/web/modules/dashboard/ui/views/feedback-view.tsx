
"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { StarIcon, MessageSquareTextIcon } from "lucide-react";

export const FeedbackView = () => {
  const feedback = usePaginatedQuery(
    api.private.feedback.list,
    {},
    {
      initialNumItems: 10,
    }
  );

  const summary = useQuery(api.private.feedback.summary, {});

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: feedback.status,
    loadMore: feedback.loadMore,
    loadSize: 10,
  });

  const averageRating = summary?.averageRating ?? 0;
  const totalFeedback = summary?.total ?? 0;

  const positiveRatings =
    summary?.distribution
      .filter((item) => item.rating >= 4)
      .reduce((sum, item) => sum + item.count, 0) ?? 0;

  const positivePercentage =
    totalFeedback > 0
      ? Math.round((positiveRatings / totalFeedback) * 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-lg">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Customer Feedback</h1>
          <p className="text-muted-foreground">
            Review ratings and comments submitted by your customers.
          </p>
        </div>

        {/* Feedback statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Responses
              </p>
              <MessageSquareTextIcon className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-3xl font-semibold">
              {summary === undefined ? "..." : totalFeedback}
            </p>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Average Rating
              </p>
              <StarIcon className="size-5 text-yellow-500" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-3xl font-semibold">
                {summary === undefined ? "..." : averageRating.toFixed(1)}
              </p>
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Positive Ratings
              </p>
              <StarIcon className="size-5 text-green-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold">
              {summary === undefined ? "..." : `${positivePercentage}%`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ratings of 4 or 5 stars
            </p>
          </div>
        </div>

        {/* Feedback table */}
        <div className="mt-8 rounded-lg border bg-background">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">All Feedback</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Customer ratings and comments
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">Rating</TableHead>
                <TableHead className="px-6 py-4">Comment</TableHead>
                <TableHead className="px-6 py-4">Submitted On</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(() => {
                if (isLoadingFirstPage) {
                  return (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Loading feedback...
                      </TableCell>
                    </TableRow>
                  );
                }

                if (feedback.results.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No feedback received yet.
                      </TableCell>
                    </TableRow>
                  );
                }

                return feedback.results.map((item) => (
                  <TableRow key={item._id} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <StarIcon
                            key={index}
                            className={`size-4 ${
                              index < item.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-muted-foreground">
                          {item.rating}/5
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-md px-6 py-4">
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {item.comment || "No comment provided"}
                      </p>
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>

          {!isLoadingFirstPage && feedback.results.length > 0 && (
            <div className="border-t">
              <InfiniteScrollTrigger
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                ref={topElementRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
