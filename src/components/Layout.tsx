"use client";

import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Fixed Navbar with a white background */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </header>

      {/* Page Content (Pushed Down to Avoid Overlapping Navbar) */}
      <main className="flex-grow flex items-center justify-center pt-16 px-6">
        {children}
      </main>
    </div>
  );
}
