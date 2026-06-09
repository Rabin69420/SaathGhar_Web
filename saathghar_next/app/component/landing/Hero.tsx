export default function Hero() {
  return (
    <section className="flex items-center justify-center text-center p-8 md:p-20 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl shadow-sm">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Your Home, <span className="text-teal-primary">Your Choice.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
          Find the ideal room partner to share expenses, or seamlessly book an
          entire independent room all to yourself. SathGhar makes living
          flexible.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-3 bg-teal-primary hover:bg-teal-700 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md">
            Find a Partner
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5">
            Book Full Room
          </button>
        </div>
      </div>
    </section>
  );
}