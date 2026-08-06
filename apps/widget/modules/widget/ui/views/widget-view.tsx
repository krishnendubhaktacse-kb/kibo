"use client";

import { useAtomValue } from "jotai";
import {
  MessageSquare,
  Mic,
  Phone,
  ChevronRight,
} from "lucide-react";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { error } from "console";

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
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <p>TODO: Error</p>,
    loading: <p>TODO: Loading</p>,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <p>TODO: Selection</p>,
    chat: <p>TODO: Chat</p>,
    contact: <p>TODO: Contact</p>,
  }

  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        {screenComponents[screen]}
    </main>
  );
};