"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    const ok =
      (username === "admin" && password === "password") ||
      (username === "worker" && password === "password");

    if (!ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }
    if (username === "admin") {
      router.replace("/admin/dashboard");
      router.refresh();
      return;
    } else if (username === "worker") {
      router.replace("/worker/dashboard");
      router.refresh();
      return;
    }

    // try {
    //   const response = await fetch("api/auth/signin", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Invalid credentials");
    //   }
    //   router.replace("/dashboard");
    //   router.refresh();
    // } catch (err) {
    //   if (err instanceof Error) {
    //     setError(err.message);
    //   } else {
    //     setError("Something went wrong");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="min-h-screen px-4 bg-gray-100 grid place-items-center">
      <div className="w-full max-w-sm p-6 border bg-white rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold text-black text-center mb-3">
          Sign in
        </h1>
        <p className="text-sm text-slate-700 mb-3 text-center">
          Use your credentials to continue.
        </p>

        <form
          onSubmit={onSubmit}
          className="space-y-4 grid place-content-center"
        >
          <div>
            <label
              className="text-sm font-medium mr-2 text-black"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="border outline-none focus:ring-2 rounded-lg focus:ring-black/50 px-3 py-2 text-black"
            />
          </div>

          <div>
            <label
              className="text-sm font-medium mr-2 text-black"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border outline-none focus:ring-2 rounded-lg focus:ring-black/50 px-3 py-2 text-black"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white px-3 py-2 font-medium hover:bg-black/80"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
