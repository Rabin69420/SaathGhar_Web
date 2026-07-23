import Navbar from "@/app/component/common/Navbar";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto bg-card border border-border shadow-lg rounded-2xl p-6 md:p-8 space-y-8 animate-pulse">
          <div className="h-7 w-48 bg-muted rounded-md" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
            <div className="w-24 h-24 bg-muted rounded-full" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-5 w-32 bg-muted rounded-md mx-auto sm:mx-0" />
              <div className="h-9 w-28 bg-muted rounded-lg mx-auto sm:mx-0" />
              <div className="h-4 w-40 bg-muted rounded-md mx-auto sm:mx-0" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="h-10 w-full bg-muted rounded-lg" />
              </div>
            ))}
          </div>
          
          <div className="pt-4 flex justify-end">
            <div className="h-11 w-32 bg-muted rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
