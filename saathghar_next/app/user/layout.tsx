import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-[#0a0a0f]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
