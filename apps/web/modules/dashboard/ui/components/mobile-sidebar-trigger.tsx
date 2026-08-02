"use client";

import { Menu } from "lucide-react";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";

export function MobileSidebarTrigger() {
  return (
    <SidebarTrigger
      className="md:hidden"
      render={
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      }
    />
  );
}