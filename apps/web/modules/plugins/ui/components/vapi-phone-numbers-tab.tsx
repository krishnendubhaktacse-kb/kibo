
"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircleIcon,
  PhoneIcon,
  XCircleIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";

export const VapiPhoneNumbersTab = () => {
  // Existing Vapi phone numbers — unchanged
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();

  // Manually added phone numbers
  const manualNumbers = useQuery(api.private.manualPhoneNumbers.getAll);
  const addManualNumber = useMutation(api.private.manualPhoneNumbers.add);
  const deleteManualNumber = useMutation(
    api.private.manualPhoneNumbers.remove,
  );

  // Existing widget customization settings
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const customPhoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  // Form state
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<Id<"manualPhoneNumbers"> | null>(null);

  const handleAddNumber = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedName || !trimmedPhoneNumber) {
      toast.error("Enter both a name and phone number");
      return;
    }

    setIsSaving(true);

    try {
      await addManualNumber({
        name: trimmedName,
        phoneNumber: trimmedPhoneNumber,
      });

      setName("");
      setPhoneNumber("");
      toast.success("Phone number added");
    } catch (error) {
      console.error("Failed to add manual phone number:", error);
      toast.error("Failed to add phone number");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNumber = async (
    id: Id<"manualPhoneNumbers">,
  ) => {
    setDeletingId(id);

    try {
      await deleteManualNumber({ id });
      toast.success("Phone number deleted");
    } catch (error) {
      console.error("Failed to delete manual phone number:", error);
      toast.error("Failed to delete phone number");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border-t bg-background">
      {/* Form for adding manual phone numbers */}
      <form
        onSubmit={handleAddNumber}
        className="flex flex-col gap-3 border-b p-4 sm:flex-row"
      >
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (e.g. Support)"
          aria-label="Phone number name"
          required
        />

        <Input
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="Phone number (e.g. +919876543210)"
          aria-label="Phone number"
          type="tel"
          required
        />

        <Button disabled={isSaving} type="submit">
          <PlusIcon className="mr-2 size-4" />
          {isSaving ? "Adding..." : "Add Number"}
        </Button>
      </form>

      {/* Vapi and manual phone numbers share the same table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">
              Phone Number
            </TableHead>
            <TableHead className="px-6 py-4">
              Name
            </TableHead>
            <TableHead className="px-6 py-4">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Existing Vapi phone numbers */}
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                Loading phone numbers...
              </TableCell>
            </TableRow>
          ) : phoneNumbers.length > 0 ? (
            phoneNumbers.map((phone) => (
              <TableRow className="hover:bg-muted/50" key={phone.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {customPhoneNumber || phone.number || "Not configured"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  {phone.name || "Unnamed"}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <Badge
                    className="capitalize"
                    variant={
                      phone.status === "active" ? "default" : "destructive"
                    }
                  >
                    {phone.status === "active" ? (
                      <CheckCircleIcon className="mr-1 size-3" />
                    ) : (
                      <XCircleIcon className="mr-1 size-3" />
                    )}
                    {phone.status || "Unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : null}

          {/* Manual phone numbers */}
          {manualNumbers === undefined ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-6 py-4 text-center text-muted-foreground"
              >
                Loading manually added numbers...
              </TableCell>
            </TableRow>
          ) : (
            manualNumbers.map((entry) => (
              <TableRow className="hover:bg-muted/50" key={entry._id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">{entry.phoneNumber}</span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  {entry.name}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary">Manual</Badge>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === entry._id}
                      onClick={() => handleDeleteNumber(entry._id)}
                    >
                      <Trash2Icon className="mr-1 size-4" />
                      {deletingId === entry._id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}

          {/* Empty state when neither source has any numbers */}
          {!isLoading &&
            phoneNumbers.length === 0 &&
            manualNumbers !== undefined &&
            manualNumbers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No phone numbers configured. Add a number using the form above.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  );
};
