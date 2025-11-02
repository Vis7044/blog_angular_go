"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "antd";
import {
  House,
  BookOpenText,
  Phone,
  Bookmark,
  Settings,
  CircleUserRound,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: House },
    { href: "/blogs", label: "Blogs", icon: BookOpenText },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: CircleUserRound },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`relative bg-white border-r border-gray-200 transition-all duration-500 ease-in-out flex flex-col h-full shadow-sm overflow-hidden 
        ${sidebarOpen ? "w-50" : "w-18"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div
          className={`flex items-center px-4 py-6 mt-4 transition-all duration-500 ease-in-out ${
            sidebarOpen ? "justify-start" : ""
          }`}
        >
          <div className="w-10 h-10 min-w-[2.5rem] rounded-xl bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap ${
              sidebarOpen ? "opacity-100 ml-3 w-auto" : "opacity-0 w-0 ml-0"
            }`}
          >
            <h2 className="font-semibold text-gray-800 text-lg leading-tight">
              Dashboard
            </h2>
            <p className="text-xs text-gray-500 leading-tight">Welcome back</p>
          </div>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-out ${
                  isActive
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {/* Light pipe indicator */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gray-400 transition-all duration-300 ${
                    isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                  }`}
                />
               {sidebarOpen && <Icon
                    className={`flex-shrink-0 w-5 h-5 transition-colors duration-300 ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  />}
                {!sidebarOpen && <Tooltip placement="right" title={label}>
                  <Icon
                    className={`flex-shrink-0 w-5 h-5 transition-colors duration-300 ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  />
                </Tooltip>}
                <span
                  className={`text-sm transition-all duration-300 ease-in-out ${
                    sidebarOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                >
                  {label}
                </span>

                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out whitespace-nowrap shadow-xl">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- Logout --- */}
        {user && (
          <div className="px-3 pb-4">
            <div
              className={`border-t border-gray-200 pt-4 mb-2 ${
                !sidebarOpen && "mx-2"
              }`}
            />
            <button
              onClick={logout}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg w-full text-gray-600 transition-all duration-300 hover:text-red-600`}
            >
              <LogOut
                className={`flex-shrink-0 w-5 h-5 transition-colors duration-200 group-hover:scale-105`}
              />
              <span
                className={`text-sm transition-all duration-300 ease-in-out ${
                  sidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
