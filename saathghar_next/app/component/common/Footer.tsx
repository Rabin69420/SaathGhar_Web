import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0f172a] text-slate-200 pt-12 pb-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
        {/* Core Value Statement Profile */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-primary">SathGhar</h3>
          <p className="max-w-md text-sm text-slate-400">
            Your trusted portal to find matching roommates or seamlessly book
            individual housing spaces entirely on your own terms.
          </p>
        </div>

        {/* Informational Platform Indexes */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-100">
            Platform Links
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link
                href="/partners"
                className="hover:text-secondary transition-colors"
              >
                Find Partners
              </Link>
            </li>
            <li>
              <Link
                href="/rooms"
                className="hover:text-secondary transition-colors"
              >
                Book a Room
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-secondary transition-colors"
              >
                How it Works
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Disclaimer Segment */}
      <div className="max-w-7xl mx-auto pt-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SathGhar. All rights reserved.</p>
      </div>
    </footer>
  );
}