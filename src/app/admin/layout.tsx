import type { Metadata } from "next";
import AdminNavbar from "./components/AdminNavbar"; // see component below

export const metadata: Metadata = {
  title: "SIH 2025 - Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* fixed navbar + sidebar lives inside body, not outside */}
      <AdminNavbar />
      {/* add top padding so content isn't hidden under fixed navbar */}
      <main className="pt-16 p-4 lg:pl-64">{children}</main>
    </div>
  );
}
