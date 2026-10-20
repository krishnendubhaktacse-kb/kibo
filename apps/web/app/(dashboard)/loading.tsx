export default function Loading() {
  return (
    <div
      className="flex min-h-[240px] flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Loading page"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

        <div className="relative h-16 w-16 animate-[pulse_1.8s_ease-in-out_infinite] overflow-hidden rounded-full border-2 border-primary/40 shadow-lg shadow-primary/20">
          <img
            src="/logo.png"
            alt="KIBO"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>

      <p className="animate-pulse text-sm text-muted-foreground">
        Preparing your workspace...
      </p>
    </div>
  );
}