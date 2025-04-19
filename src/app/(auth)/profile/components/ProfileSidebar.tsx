"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function ProfileSidebar({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}) {
  return (
    <aside className="w-56 bg-white border-r fixed left-0 top-0 bottom-0 z-10">
      <nav className="space-y-2 px-4 mt-25">
        {items.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className={clsx(
              "text-base w-full justify-start",
              selected === item && "bg-muted font-medium"
            )}
            onClick={() => onSelect(item)}
          >
            {item}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
