import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}
