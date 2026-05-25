import Footer from "@/component/common/Footer";
import Navbar from "@/component/common/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
