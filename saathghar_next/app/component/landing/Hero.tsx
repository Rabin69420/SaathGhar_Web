export default function Hero() {
  return (
    <section className="relative flex items-center justify-center text-center p-8 md:p-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5 rounded-3xl border border-border/50 shadow-sm overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl z-10">
        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 leading-tight">
          Your Home, <span className="text-primary bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Your Choice.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          Find the ideal room partner to share expenses, or seamlessly book an
          entire independent room all to yourself. SathGhar makes living
          flexible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer">
            Find a Partner
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 bg-background border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer">
            Book Full Room
          </button>
        </div>
      </div>
    </section>
  );
}