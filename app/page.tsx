"use client";

import { Header } from "@/components/dashboard/Header";
import { SalesProvider } from "@/components/dashboard/SalesProvider";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Home() {
  return (
    <SalesProvider>
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8">
          <DashboardContent />
        </main>
      </div>
    </SalesProvider>
  );
}
