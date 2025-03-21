"use client";

import TopBar from "@/components/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Fixed TopBar with a white background */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <TopBar />
      </header>

      {/* Page Content (Pushed Down to Avoid Overlapping TopBar) */}
      <main className="flex-grow flex items-center justify-center pt-16 px-6">
        {children}
      </main>
    </div>
  );
}
