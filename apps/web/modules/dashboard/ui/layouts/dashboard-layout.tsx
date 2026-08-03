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
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />

        <SidebarInset>
          <div className="flex h-14 items-center border-b px-4 md:hidden">
            <MobileSidebarTrigger />
          </div>

          <main className="flex flex-1 flex-col">
            {children}
          </main>
        </SidebarInset>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
};