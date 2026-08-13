"use client";

import { MessageSquareIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageSquareIcon className="size-6 text-muted-foreground" />
        </div>

        <h2 className="text-sm font-semibold">
          Select a conversation
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Select a conversation from the list to view the messages.
        </p>
      </div>
    </div>
  );
};

export default Page;