"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { usePathname } from "next/navigation";

import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isConversationSelected =
    pathname !== "/conversations" &&
    pathname.startsWith("/conversations/");

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      {/* Desktop */}
      <div className="hidden h-full min-h-0 w-full overflow-hidden md:block">
        <ResizablePanelGroup
          className="h-full min-h-0 w-full overflow-hidden"
          orientation="horizontal"
        >
          <ResizablePanel
            defaultSize="30%"
            minSize="25%"
            maxSize="40%"
            className="min-h-0 min-w-0 overflow-hidden"
          >
            <ConversationsPanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            className="h-full min-h-0 min-w-0 overflow-hidden"
            defaultSize="70%"
            minSize="60%"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile */}
      <div className="flex h-full min-h-0 w-full overflow-hidden md:hidden">
        <div className="h-full min-h-0 w-full min-w-0">
          {isConversationSelected ? children : <ConversationsPanel />}
        </div>
      </div>
    </div>
  );
};