import { auth } from "@clerk/nextjs/server";
import { CustomizationView } from "@modules/customization/ui/views/customization-view";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const Page = async () => {
  const { has } = await auth();

  if (!has({ plan: "pro" })) {
    return (
      <PremiumFeatureOverlay>
        <CustomizationView />
      </PremiumFeatureOverlay>
    );
  }

  return <CustomizationView />;
};

export default Page;