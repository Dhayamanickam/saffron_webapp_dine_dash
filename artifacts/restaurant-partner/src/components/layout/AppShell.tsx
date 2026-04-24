import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex max-w-[1480px] mx-auto">
        <Sidebar />
        <div className="flex-1 min-w-0 px-3 md:px-4 py-4">
          <TopNav />
          <main className="mt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
