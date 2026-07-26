import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gradient-to-tr from-teal-50 via-teal-100/40 to-emerald-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/40 px-4 py-16">
        <div className="w-full max-w-lg sm:max-w-xl transition-all duration-300">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
