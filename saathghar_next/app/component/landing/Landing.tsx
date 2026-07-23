import Hero from "./Hero";
import Features from "./Features";
import CTA from "./CTA";

export default function LandingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 md:space-y-24">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}