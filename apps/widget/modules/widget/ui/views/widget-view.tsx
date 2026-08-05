"use client";

import {
  MessageSquare,
  Mic,
  Phone,
  ChevronRight,
} from "lucide-react";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";

// import { WidgetHeader } from "../components/widget-header";
// import { WidgetFooter } from "../components/widget-footer";

interface Props {
  organizationId: string;
}

const actions = [
  {
    title: "Start chat",
    icon: MessageSquare,
  },
  {
    title: "Start voice call",
    icon: Mic,
  },
  {
    title: "Call us",
    icon: Phone,
  },
];

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        <WidgetAuthScreen />
      {/* <WidgetFooter /> */}
    </main>
  );
};