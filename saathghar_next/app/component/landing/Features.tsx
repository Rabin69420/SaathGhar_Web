interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export default function Features() {
  const featuresList: FeatureCard[] = [
    {
      icon: "🤝",
      title: "Verified Room Partners",
      description:
        "Browse detailed profiles, backgrounds, and lifestyle preferences to find a compatible roommate safely.",
    },
    {
      icon: "🔑",
      title: "Instant Solo Booking",
      description:
        "Prefer your own space? Skip the partner search and instantly secure independent rooms or entire flats.",
    },
    {
      icon: "🛡️",
      title: "Secure & Transparent",
      description:
        "Every listing and user profile goes through a strict verification system to prevent scams and fraud.",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-center text-3xl font-extrabold text-foreground mb-2 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-secondary after:mx-auto after:mt-4 after:rounded-full">
        Why Choose SathGhar?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {featuresList.map((feat, index) => (
          <div
            key={index}
            className="bg-card border border-border hover:border-primary/30 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col items-center text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {feat.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}