"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { errorMessageAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
    <WidgetHeader>
    <div className="rounded-t-xl bg-gradient-to-b from-blue-500 to-sky-500 px-5 py-6 text-white">
          <h1 className="text-3xl font-bold">
            Hi there! <span>👋</span>
          </h1>

          <p className="mt-2 text-sm text-blue-100">
            Let&apos;s get you started
          </p>
        </div>
    </WidgetHeader>
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon />
        <p className="text-sm">
          {errorMessage || "Invalid configuration"}
        </p>
    </div>
    </>
  );
};