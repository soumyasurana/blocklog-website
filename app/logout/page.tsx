"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/blocklog";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearSession();
    router.replace("/login");
  }, [router]);

  return (
    <main className="auth-page">
      <div className="card auth-card">
        <div className="spinner" />
        <p className="muted" style={{ marginBottom: 0 }}>
          Ending session...
        </p>
      </div>
    </main>
  );
}
