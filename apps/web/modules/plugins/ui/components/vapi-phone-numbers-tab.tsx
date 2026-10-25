
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PhoneIcon, Trash2Icon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

export const VapiPhoneNumbersTab = () => {
  const phoneNumbers = useQuery(api.private.manualPhoneNumbers.getAll);
  const removePhoneNumber = useMutation(api.private.manualPhoneNumbers.remove);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: (typeof phoneNumbers extends (infer T)[] | undefined ? T : never) extends { _id: infer I } ? I : never) => {
    if (!window.confirm("Delete this saved contact number?")) return;

    setDeletingId(String(id));

    try {
      await removePhoneNumber({ id });
      toast.success("Contact number deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete contact number");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Number</TableHead>
            <TableHead className="px-6 py-4">Name</TableHead>
            <TableHead className="px-6 py-4">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {phoneNumbers === undefined ? (
            <TableRow>
              <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                Loading saved contacts...
              </TableCell>
            </TableRow>
          ) : phoneNumbers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                No contact numbers saved yet. Add one in Widget Customization.
              </TableCell>
            </TableRow>
          ) : (
            phoneNumbers.map((phone) => (
              <TableRow className="hover:bg-muted/50" key={phone._id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">{phone.phoneNumber}</span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">{phone.name}</TableCell>

                <TableCell className="px-6 py-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === String(phone._id)}
                    onClick={() => handleDelete(phone._id)}
                  >
                    <Trash2Icon className="mr-2 size-4" />
                    {deletingId === String(phone._id) ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
