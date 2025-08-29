"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // After Google OAuth, the backend should redirect here with token/user info
    // This example assumes the backend redirects with query params: ?token=...&user=...
    // Adjust parsing as needed for your backend's actual response
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    // Optionally, parse user info if provided
    // const user = params.get("user");

    if (token) {
      // Store token (localStorage, cookie, or context)
      localStorage.setItem("auth_token", token);
      // Redirect to dashboard or home
      router.replace("/dashboard");
    } else {
      // Handle error or fallback
      router.replace("/auth/signin?error=google_auth_failed");
    }
  }, [router]);

  return <div>Signing you in with Google...</div>;
}
