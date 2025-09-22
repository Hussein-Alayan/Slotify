"use client";
import { useRouter } from "next/navigation";
// ...existing code...
import React, { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(
    null
  );

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000") +
            "/api/v1/me",
          { credentials: "include" }
        );
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.replace("/auth/signin");
        }
      } catch {
        setAuthenticated(false);
        router.replace("/auth/signin");
      }
    }
    checkAuth();
  }, [router]);

  if (authenticated === null) return null;
  if (!authenticated) return null;

  return <>{children}</>;
}
