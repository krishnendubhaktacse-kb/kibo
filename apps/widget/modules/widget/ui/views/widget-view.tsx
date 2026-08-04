"use client";

import {
  MessageSquare,
  Mic,
  Phone,
  ChevronRight,
} from "lucide-react";

import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";

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
      <WidgetHeader>
        <div className="rounded-t-xl bg-gradient-to-b from-blue-500 to-sky-500 px-5 py-6 text-white">
          <h1 className="text-3xl font-bold">
            Hi there! <span>👋</span>
          </h1>

          <p className="mt-2 text-sm text-blue-100">
            How can we help you today?
          </p>
        </div>
      </WidgetHeader>

      <div className="flex-1 bg-gray-50 px-4 py-5">
        <div className="space-y-3">
          {actions.map((item) => (
            <button
              key={item.title}
              className="flex w-full items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-5 text-gray-500" />
                <span className="font-medium text-gray-700">
                  {item.title}
                </span>
              </div>

              <ChevronRight className="size-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <WidgetFooter />
    </main>
  );
};