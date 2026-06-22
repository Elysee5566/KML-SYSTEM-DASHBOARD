import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Loans", href: "/#product" },
    // { name: "How It Works", href: "/#how" },
    { name: "FAQs", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0  left-0 w-full z-50 transition-all duration-300 
       bg-[#0a1a33]/95  shadow-lg py-4
         
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-white text-[#0a1a33] font-bold px-3 py-2 rounded-lg text-sm shadow-md">
            {scrolled ? "KML" : "KML"}
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              Kigali Microloans
            </h1>
            <p className="text-gray-300 text-xs hidden sm:block">
              Fast • Trusted • Secure
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-white transition duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+250700000000"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <Phone size={16} />
            +250 798 117 214
          </a>

          <a
            href="/application"
            className="bg-white text-[#0a1a33] px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
          >
            Apply Now
          </a>
          <a
            href="/login"
            className="bg-white text-[#0a1a33] px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
          >
            Login
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-125" : "max-h-0"
        }`}
      >
        <div className="bg-[#0a1a33]/95 backdrop-blur-lg px-6 py-6 flex flex-col gap-5 text-gray-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-white transition border-b border-white/10 pb-2"
            >
              {link.name}
            </a>
          ))}

          {/* <a
            href="tel:+250700000000"
            className="flex items-center gap-2 text-sm pt-2"
          >
            <Phone size={16} />
            +250 700 000 000
          </a> */}

          <a
            href="/application"
            className="bg-white text-[#0a1a33] text-center py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Apply Now
          </a>
          <a
            href="#apply"
            className="bg-white text-[#0a1a33] text-center py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
