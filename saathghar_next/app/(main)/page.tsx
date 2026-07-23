"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookieClientSide } from "@/lib/cookies-client";
import LandingPage from "../component/landing/Landing";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const userDataStr = await getCookieClientSide("user_data");
      if (userDataStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userDataStr));
          if (user.role === "admin") {
            router.replace("/admin/dashboard");
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    };
    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return <LandingPage />;
}
