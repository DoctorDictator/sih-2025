import type { Metadata } from "next";
import "../globals.css";
import WorkerNavbar from "./components/WorkerNavbar";

export const metadata: Metadata = {
  title: "SIH 2025 - Worker",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-black">
      <WorkerNavbar />
      <main className="pt-16 p-4 lg:pl-64">{children}</main>
    </div>
  );
}
