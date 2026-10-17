
import { ContactPanel } from "../components/contact-panel";

export const ConversationIdLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        {children}
      </div>

      <aside className="hidden h-full min-h-0 min-w-0 overflow-hidden border-l bg-background lg:block">
        <ContactPanel />
      </aside>
    </div>
  );
};
