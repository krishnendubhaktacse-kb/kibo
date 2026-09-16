import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex h-full items-center justify-center bg-muted">
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border bg-background shadow-sm">
        <Image
          src="/logo.png"
          alt="Kibo Logo"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};