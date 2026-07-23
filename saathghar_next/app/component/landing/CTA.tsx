export default function CTA() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground p-12 md:p-20 rounded-3xl text-center shadow-xl overflow-hidden border border-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]" />
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
          Ready to find your next space?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed font-medium">
          Join thousands of students and professionals matching up and booking
          accommodation effortlessly.
        </p>
        <button className="px-10 py-4 bg-white text-primary hover:bg-white/95 font-bold rounded-xl shadow-lg hover:shadow-white/10 transition-all transform hover:-translate-y-0.5 cursor-pointer text-base">
          Get Started Free
        </button>
      </div>
    </section>
  );
}