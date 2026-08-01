import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
      <Footer />
    </div>
  );
}
