"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";

export function MobileSidebarTrigger() {
  const pathname = usePathname();

  const pageTitle =
    ({
      "/conversations": "Conversations",
      "/files": "Knowledge Base",
      "/customization": "Widget Customization",
      "/integrations": "Integrations",
      "/plugins/vapi": "Voice Call & Contact Support",
      "/billing": "Plans & Billing",
    } as Record<string, string>)[pathname] ?? "Dashboard";

  return (
    <div className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-2 md:hidden">
      <SidebarTrigger
        render={
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        }
      />

      {pathname === "/" ? (
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <Image
            src="/logo.png"
            alt="KIBO Logo"
            width={40}
            height={40}
            className="size-10 rounded-full border-2 border-blue-600 object-cover"
          />
          <h1 className="text-lg font-extrabold text-blue-600">
            KIBO
          </h1>
        </div>
      ) : (
        <div className="ml-2">
          <h1 className="text-sm font-semibold">{pageTitle}</h1>
        </div>
      )}
    </div>
  );
}