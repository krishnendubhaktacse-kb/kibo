import { auth } from "@clerk/nextjs/server";
import { VapiView } from "@/modules/plugins/ui/views/vapi-view";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const Page = async () => {
  const { has } = await auth();

  if (!has({ plan: "pro" })) {
    return (
      <PremiumFeatureOverlay>
        <VapiView />
      </PremiumFeatureOverlay>
    );
  }

  return <VapiView />;
};

export default Page;