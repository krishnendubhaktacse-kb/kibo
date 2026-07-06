"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <p>apps/web</p>

      <Button onClick={() => addUser()}>
        Add
      </Button>

      <div className="max-w-sm w-full mx-auto">
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>
    </main>
  );
}