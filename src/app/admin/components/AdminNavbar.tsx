"use client";

import Link from "next/link";
import Logo from "../../../components/Logo";
import { useState, useRef, useEffect } from "react";
import { Home, Clipboard, UserCheck, Users, Settings } from "lucide-react";
import NavLink from "../../../components/NavLink";

export interface NavbarUser {
  name: string;
}

export default function AdminNavbar() {
  const [toggle, setToggle] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLButtonElement>(null);

  const role = "admin" as const;

  const toggleMenu = () => {
    setToggle((prev) => !prev);
    if (!toggle) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    if (!sidebarOpen) setToggle(false);
  };

  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        if (
          sidebarOpen &&
          sidebarRef.current &&
          hamburgerRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          !hamburgerRef.current.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }

      if (
        toggle &&
        dropdownRef.current &&
        userMenuRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    if (sidebarOpen || toggle)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, toggle]);

  const NAV = [
    // Common
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/complaints", label: "My Complaints", icon: Clipboard },
    // Admin-only
    { href: "/admin/approvals", label: "User Approvals", icon: UserCheck },
    { href: "/admin/manage", label: "Manage Users", icon: Users },
    // Common
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                ref={hamburgerRef}
                onClick={toggleSidebar}
                className="lg:hidden mr-1 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {sidebarOpen ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </>
                  )}
                </svg>
              </button>

              <div className="px-2">
                <Logo />
              </div>
              <Link
                href="/"
                className="text-lg sm:text-2xl text-blue-950 font-bold"
                onClick={handleNavClick}
              >
                <span className="lg:hidden">Portal</span>
                <span className="hidden lg:inline">Portal</span>
              </Link>
            </div>

            {/* Desktop user area */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="text-black px-3 py-2 font-medium">
                Harsh Shishodia  
              </button>
              <span className="text-gray-500 text-opacity-50 px-3 py-2 text-sm font-medium capitalize">
                {role}
              </span>
              <button className="text-gray-500 text-opacity-50 px-3 py-2 text-sm font-medium">
                <Link href="/sign-in">Sign Out</Link>
              </button>
            </div>

            {/* Mobile user menu */}
            <div className="lg:hidden relative">
              <button
                ref={userMenuRef}
                onClick={toggleMenu}
                className="text-black focus:outline-none size-5 sm:size-8"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {toggle ? (
                    <>
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </>
                  ) : (
                    <>
                      <path d="M18 20a6 6 0 0 0-12 0" />
                      <circle cx="12" cy="10" r="4" />
                      <circle cx="12" cy="12" r="10" />
                    </>
                  )}
                </svg>
              </button>
              <div
                ref={dropdownRef}
                className={`absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white border-2 border-black transition-all duration-200 ease-in-out ${
                  toggle
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-1">
                  <div className="block w-full text-left px-4 py-2 text-sm text:black">
                    Harsh Shishodia  
                    <span className="text-xs text-gray-500 capitalize">
                      {role}
                    </span>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-black">
                    <Link href="/sign-in">Sign Out</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 left-0 w-64 bg-white border-r border-gray-400 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="px-4 space-y-1 mt-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href} onNavigate={handleNavClick}>
              <Icon className="size-4 text-gray-500" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
