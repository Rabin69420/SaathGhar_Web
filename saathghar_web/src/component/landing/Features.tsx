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
    <section className="py-8">
      <h2 className="text-center text-3xl font-bold text-slate-900 mb-2 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-green-primary after:mx-auto after:mt-3">
        Why Choose SathGhar?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {featuresList.map((feat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-teal-primary text-center hover:transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-4xl mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              {feat.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
