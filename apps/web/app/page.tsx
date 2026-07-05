import { Button } from "@workspace/ui/components/button"
import { add } from "@workspace/math/add"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Hello apps/web</h1>
      <Button>Button</Button>
      <p>{add(2, 2)}</p>
    </main>
  )
}