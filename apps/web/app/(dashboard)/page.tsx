"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const addUser = useMutation(api.users.add);

  return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p>apps/web</p>
        <UserButton />
        <OrganizationSwitcher hidePersonal />
        <Button onClick={() => addUser()}>
          Add
        </Button>
      </main>
  );
}