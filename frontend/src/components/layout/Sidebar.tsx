"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Test", href: "/dashboard/test" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-1/5 bg-red shadow-lg p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">MyApp</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100",
              pathname === item.href && "bg-gray-200 font-semibold"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
