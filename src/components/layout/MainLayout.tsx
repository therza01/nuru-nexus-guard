import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-afro">
      <Sidebar />
      <div className="ml-[80px] lg:ml-[260px] transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
