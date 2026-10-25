import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  manualPhoneNumbersAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useState } from "react";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const manualPhoneNumbers = useAtomValue(manualPhoneNumbersAtom);

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const handleCopy = async (number: string) => {
    if (!number) {
      return;
    }

    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (error) {
      console.error("Failed to copy phone number:", error);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
                  <Button
                    variant="transparent"
                    size="icon"
                    onClick={() => setScreen("selection")}
                  >
                    <ArrowLeftIcon />
                  </Button>
                  <p>Contact Us</p>
                </div>
      </WidgetHeader>
      
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">

        {manualPhoneNumbers.map((contact) => (
          <div key={contact._id} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full border bg-white p-3">
                <PhoneIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{contact.name}</p>
                <p className="break-all text-sm text-muted-foreground">
                  {contact.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() => handleCopy(contact.phoneNumber)}
              >
                {copiedNumber === contact.phoneNumber ? (
                  <>
                    <CheckIcon className="mr-2 size-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="mr-2 size-4" />
                    Copy Number
                  </>
                )}
              </Button>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  window.location.href = `tel:${contact.phoneNumber}`;
                }}
              >
                <PhoneIcon className="mr-2 size-4" />
                Call Now
              </Button>
            </div>
          </div>
        ))}

        {manualPhoneNumbers.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No contact numbers are currently available.
          </p>
        )}
      </div>

    </>
  );
};