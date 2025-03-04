"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Calendar,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cable,
} from "lucide-react";
import DomainMenu from "./sidebar/domain-menu";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "ghost";
};

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "default",
  },
  {
    title: "Conversations",
    href: "/conversations",
    icon: <MessageSquare className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: <Cable className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: <Calendar className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Email Marketing",
    href: "/email-marketing",
    icon: <Mail className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
];

interface SidebarProps {
  domains?: {
    id: string;
    name: string;
    icon: string | null;
  }[];
}

export function Sidebar({ domains }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative min-h-screen border-r px-4 pb-10 pt-24 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute right-[-20px] top-7">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full border bg-white p-2 hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="py-2">
          <h2 className={cn("text-lg font-semibold", isCollapsed && "hidden")}>
            MENU
          </h2>
          <div className="space-y-1 py-4">
            {defaultItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 font-medium",
                  isCollapsed && "justify-center"
                )}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  {item.icon}
                </div>
                <span className={cn("ml-3 text-sm", isCollapsed && "hidden")}>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <DomainMenu domains={domains} min={isCollapsed} />
      </div>

      <div className="absolute bottom-4 left-4">
        <Link
          href="/sign-out"
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center w-5 h-5">
            <LogOut className="h-5 w-5 min-w-[20px] min-h-[20px]" />
          </div>
          <span className={cn("ml-3 text-sm", isCollapsed && "hidden")}>
            Sign Out
          </span>
        </Link>
      </div>
    </div>
  );
}