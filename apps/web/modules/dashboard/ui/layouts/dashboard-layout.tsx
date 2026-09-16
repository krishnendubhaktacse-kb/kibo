import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import {
  SidebarInset,
  SidebarProvider,
  SIDEBAR_COOKIE_NAME,
} from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { MobileSidebarTrigger } from "@/modules/dashboard/ui/components/mobile-sidebar-trigger";
import { Provider } from "jotai";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";

  return (
    <AuthGuard>
      <OrganizationGuard>
        <Provider>
        <SidebarProvider
          defaultOpen={defaultOpen}
          className="h-svh min-h-0 overflow-hidden"
        >
          <DashboardSidebar />

        <SidebarInset className="h-full min-h-0 min-w-0 overflow-hidden">
          <MobileSidebarTrigger />

          <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </SidebarInset>
        </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  );
};