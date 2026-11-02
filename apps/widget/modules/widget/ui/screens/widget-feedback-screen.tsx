
"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "convex/react";
import {
  StarIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { api } from "@workspace/backend/_generated/api";

import {
  screenAtom,
  organizationIdAtom,
  contactSessionIdAtomFamily,
} from "../../atoms/widget-atoms";

import { WidgetHeader } from "../components/widget-header";

export const WidgetFeedbackScreen = () => {
  const setScreen = useSetAtom(screenAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const submitFeedback = useMutation(api.public.feedback.submit);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (rating === 0 || isPending) return;

    if (!organizationId || !contactSessionId) {
      setErrorMessage("Unable to identify your session. Please try again.");
      return;
    }

    setIsPending(true);
    setErrorMessage("");

    try {
      await submitFeedback({
        organizationId,
        contactSessionId,
        rating,
        comment: feedback.trim() || undefined,
      });

      setIsSubmitted(true);
    } catch {
      setErrorMessage("Unable to submit feedback. Please try again.");
    } finally {
      setIsPending(false);
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
          <p>Share Feedback</p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden bg-muted p-5">
        {isSubmitted ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <CheckCircle2Icon className="mb-4 size-14 text-green-600" />

            <h2 className="text-xl font-semibold">
              Thank you for your feedback!
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              We appreciate you taking the time to share your experience.
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() => setScreen("selection")}
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 min-w-0 flex-col gap-5">
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h2 className="text-base font-semibold">
                How was your overall support experience?
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Please rate your experience from 1 to 5 stars.
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    aria-pressed={rating === value}
                    className="rounded-md p-1 transition hover:scale-110"
                  >
                    <StarIcon
                      className={`size-8 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                {rating === 0
                  ? "Select your rating"
                  : `${rating} out of 5 stars`}
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h2 className="text-base font-semibold">
                Additional comments
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Share anything that could help us improve. (Optional)
              </p>

              <Textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Write your feedback here..."
                className="mt-3 min-h-28 resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={rating === 0 || isPending}
            >
              {isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
