"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
}
// NavLink component to handle navigation with active state
export default function NavLink({ href, children, onNavigate }: NavLinkProps) {
  const path = usePathname();

  const activeClasses = "bg-gray-300 text-gray-800 font-semibold";
  const baseClasses =
    "w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md text-gray-600 hover:bg-gray-200";
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };
  return (
    <Link
      href={href}
      className={`${baseClasses} ${path?.endsWith(href) ? activeClasses : ""}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
