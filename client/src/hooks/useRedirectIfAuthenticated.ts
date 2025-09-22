import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000") + "/api/v1/me",
          { credentials: "include" }
        );
        if (res.ok) {
          router.replace("/business-hub");
        }
      } catch {
        // User not authenticated, do nothing
      }
    }
    checkAuth();
  }, [router]);
}