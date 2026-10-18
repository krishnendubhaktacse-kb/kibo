import { auth } from "@clerk/nextjs/server";
import { FilesView } from "@/modules/files/ui/views/files-view";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const Page = async () => {
  const { has } = await auth();

  if (!has({ plan: "pro" })) {
    return (
      <PremiumFeatureOverlay>
        <FilesView />
      </PremiumFeatureOverlay>
    );
  }

  return <FilesView />;
};

export default Page;