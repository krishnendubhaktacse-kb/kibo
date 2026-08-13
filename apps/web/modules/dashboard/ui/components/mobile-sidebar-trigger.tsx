"use client";

import { Menu } from "lucide-react";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";

export function MobileSidebarTrigger() {
  return (
    <div className="flex h-14 items-center border-b px-2 md:hidden">
      <SidebarTrigger
        render={
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        }
      />

      <div className="ml-2">
        <h1 className="text-sm font-semibold">Conversations</h1>
      </div>
    </div>
  );
}