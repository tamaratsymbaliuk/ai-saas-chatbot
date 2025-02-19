"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, User, Settings, Menu, ChevronLeft, MessageSquare, Calendar, Package, Mail, Sun, LogOut } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    // Implement your sign-out logic here (e.g., clearing session, redirecting, etc.)
    console.log("Signing out...");
  };

  return (
    <div
      className={`h-screen bg-gray-800 text-white transition-all flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Title/Icon when collapsed */}
      <div className="flex items-center justify-center p-4">
        {collapsed ? (
          <Sun size={24} /> // Sun icon when collapsed
        ) : (
          <span className="font-bold text-xl">MailGenie</span> // MailGenie when expanded
        )}
      </div>

      <button
        className="p-2 w-full flex justify-end"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
      </button>

      <nav className="flex flex-col gap-4 mt-4 flex-grow">
        {/* Menu Item above Dashboard */}
        {!collapsed && (
          <SidebarItem
            href="/dashboard/menu"
            icon={<Menu size={16} />}
            label="Menu"
            collapsed={collapsed}
            isMenu
          />
        )}

        <SidebarItem href="/dashboard" icon={<Home />} label="Dashboard" collapsed={collapsed} />
        <SidebarItem href="/conversations" icon={<MessageSquare />} label="Conversations" collapsed={collapsed} />
        <SidebarItem href="/integrations" icon={<Package />} label="Integrations" collapsed={collapsed} />
        <SidebarItem href="/appointments" icon={<Calendar />} label="Appointments" collapsed={collapsed} />
        <SidebarItem href="/email-marketing" icon={<Mail />} label="Email Marketing" collapsed={collapsed} />
        <SidebarItem href="/settings" icon={<Settings />} label="Settings" collapsed={collapsed} />
      </nav>

      {/* Sign Out Button at the very bottom */}
      <div className="p-3">
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-2 w-full p-3 text-white hover:bg-gray-700 transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={24} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ href, icon, label, collapsed, isMenu }: any) => (
  <Link
    href={href}
    className={`flex items-center gap-2 p-3 hover:bg-gray-700 transition ${isMenu ? "text-sm text-gray-300" : "text-white"}`}
  >
    {icon}
    {!collapsed && <span className={`${isMenu ? "text-xs" : ""}`}>{label}</span>}
  </Link>
);

export default Sidebar;
