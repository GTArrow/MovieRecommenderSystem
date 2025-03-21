"use client";

import Link from "next/link";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Bars3Icon className="w-6 h-6 text-gray-700 cursor-pointer" />

      <h1 className="text-2xl font-bold text-gray-800">MovieRecommender</h1>

      <Link href="/login">
        <UserCircleIcon className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900 transition" />
      </Link>
    </header>
  );
}
