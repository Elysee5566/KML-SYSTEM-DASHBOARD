import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kmlVideo from "../../../assets/Kmlprofile.mp4";
import Header from "../../../components/PageHeader";
export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-linear-to-br from-primary via-[#0f2a52] to-secondary text-white overflow-hidden">
      {/* SUBTLE BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <path
            d="M0,200 C200,100 400,300 800,200"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* 🔷 NAVBAR */}
      {/* <header className="relative z-10 px-6 md:px-16 py-6 flex items-center justify-between"> */}
      {/* LOGO */}
      {/* <div className="flex items-center gap-3">
          <div className="bg-white text-primary font-bold px-3 py-1.5 rounded-md text-sm">
            KML
          </div>
          <span className="font-semibold text-lg tracking-wide">
            Kigali Microloans
          </span>
        </div> */}

      {/* NAV LINKS */}
      {/* <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#about" className="hover:text-white transition">
            About
          </a>
          <a href="#product" className="hover:text-white transition">
            Loans
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQs
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav> */}

      {/* ACTIONS */}
      {/* <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block px-5 py-2 border border-white/30 rounded-md text-sm hover:bg-white hover:text-primary transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/application")}
            className="px-5 py-2 bg-white text-primary rounded-md text-sm font-medium hover:scale-105 transition"
          >
            Apply Now
          </button>
        </div>
      </header> */}
      <Header />
      {/* 🔷 HERO */}
      <section className="relative z-10 px-6 md:px-16 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">
            Simple • Fast • Reliable
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Financial Support <br />
            <span className="text-gray-300">When You Need It Most</span>
          </h1>

          <p className="mt-6 text-gray-300 max-w-lg text-sm md:text-base">
            Kigali Microloans provides accessible short-term financing for
            salaried professionals. Experience a smooth, transparent, and
            efficient borrowing process.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/application")}
              className="bg-white text-primary px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:scale-105 transition"
            >
              Apply for a Loan <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/login")}
              className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition"
            >
              Client Login
            </button>
          </div>

          {/* TRUST LINE */}
          <p className="mt-6 text-xs text-gray-400">
            Serving salaried employees across Rwanda
          </p>
        </div>

        {/* RIGHT VISUAL (REDESIGNED) */}
        <div className="relative flex justify-center items-center">
          {/* BACKGROUND GLOW */}
          <div className="absolute w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full"></div>

          {/* MAIN VIDEO CARD */}
          <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* VIDEO */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-tl-2xl rounded-br-2xl mx-auto mt-6"
            >
              <source src={kmlVideo} type="video/mp4" />
            </video>

            {/* LABEL */}
            <div className="p-4">
              <h3 className="text-sm font-semibold">
                Digital Lending Experience
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Fast, secure and fully managed loan processing
              </p>
            </div>
          </div>

          {/* 📊 FLOATING ANALYTICS CARD */}
          <div className="absolute -bottom-10 -right-6 w-65 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl">
            <h4 className="text-xs font-semibold mb-2 text-gray-200">
              Live Portfolio Growth
            </h4>

            {/* GRAPH */}
            <svg viewBox="0 0 300 120" className="w-full h-20">
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="2"
                points="0,90 50,70 100,75 150,40 200,55 250,30 300,45"
                strokeDasharray="600"
                strokeDashoffset="600"
                className="animate-[dash_4s_linear_infinite]"
              />
            </svg>

            {/* MINI STATS */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-300">
              <div>📈 Growth: High</div>
              <div>⚡ Approval: Fast</div>
              <div>🛡 Risk: Controlled</div>
              <div>👥 Clients: Active</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
