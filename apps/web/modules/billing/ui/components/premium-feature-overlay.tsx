"use client";

import {
  type LucideIcon,
  BookOpenIcon,
  BotIcon,
  GemIcon,
  MicIcon,
  PaletteIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from "@workspace/ui/components/card";

interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
};

interface PremiumFeatureOverlayProps {
  children: React.ReactNode;
};

const features: Feature[] = [
  {
  icon: BotIcon,
  label: "AI Customer Support",
  description:  "Intelligent automated responses 24/7"
  },
  {
  icon: MicIcon,
  label: "AI Voice Agent",
  description:  "Natural voice conversations with customers",
  },
  {
  icon: PhoneIcon,
  label: "Phone System",
  description:  "Inbound & outbound calling capabilities",
  },
  {
  icon: BookOpenIcon,
  label: "Knowledge  Base",
  description:  "Train AI on your documentation",
  },
  {
  icon: UserIcon,
  label: "Team Access",
  description:  "Up to 5 operators per organization",
  },
  {
  icon: PaletteIcon,
  label: "Widget Customization",
  description: "Customize your chat widget appearance",
  },
];

export const PremiumFeatureOverlay = ({
  children
}: PremiumFeatureOverlayProps) => {
  const router = useRouter();

    return (
    <div className="relative isolate min-h-screen">
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-[2px]">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px]" />
      {/* Upgrade prompt */}
      <div className="fixed inset-y-0 left-64 right-0 z-40 flex items-center justify-center p-4 max-md:left-0 max-md:items-start max-md:px-4 max-md:pt-20 max-md:pb-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center max-md:p-4 max-md:pb-2">
            <div className="flex items-center justify-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                <GemIcon className="size-6 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Premium Feature</CardTitle>
              <CardDescription>
                This feature requires a Pro subscription
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 max-md:space-y-3 max-md:p-4 max-md:pt-2">
          {/* Features List */}
          <div className="space-y-3 md:space-y-6">
            {features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
              <feature.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">{feature.label}</p>
              <p className="text-muted-foreground text-xs">{feature.description}</p>
            </div>
          </div>
        ))}
          </div>
          <Button
            className="w-full"
            onClick={() => router.push("/billing")}
            size="lg"
          >
            View Plans
          </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};