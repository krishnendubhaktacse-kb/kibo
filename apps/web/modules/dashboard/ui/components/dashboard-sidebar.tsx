"use client";

import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import {
  InboxIcon,
  LibraryBigIcon,
  PuzzleIcon,
  MicIcon,
  PaletteIcon,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@workspace/ui/components/sidebar";

const menuGroups = [
  {
    title: "Customer Support",
    items: [
      {
        title: "Conversations",
        url: "/conversations",
        icon: InboxIcon,
      },
      {
        title: "Knowledge Base",
        url: "/files",
        icon: LibraryBigIcon,
      },
    ],
  },

  {
    title: "Configuration",
    items: [
      {
        title: "Widget Customization",
        url: "/customizations",
        icon: PaletteIcon,
      },
      {
        title: "Integrations",
        url: "/integrations",
        icon: PuzzleIcon,
      },
      {
        title: "Voice Assistant",
        url: "/plugins/vapi",
        icon: MicIcon,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        title: "Plans & Billing",
        url: "/billing",
        icon: CreditCardIcon,
      },
    ],
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher
              hidePersonal
              skipInvitationScreen
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
  {menuGroups.map((group) => (
    <SidebarGroup key={group.title}>
      <SidebarGroupLabel>
        {group.title}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))}
</SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-3">
          <UserButton />

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {user?.fullName || user?.firstName}
            </span>

            <span className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};