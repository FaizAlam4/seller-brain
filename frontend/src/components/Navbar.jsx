import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Analyze", to: "/" },
    { label: "About", to: "/about" },
  ];

  return (
    <header className="border-b border-gray-800/50 glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18 L8 10 L12 14 L16 6 L20 8" />
              <circle cx="20" cy="8" r="2" fill="#34d399" stroke="#34d399" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight gradient-text">Revenue Lens AI</h1>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hidden md:block">
            Free tier · Limited lookups for new URLs
          </span>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-3">
            <span className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              Free tier · Limited lookups for new URLs
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
