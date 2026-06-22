// import { useEffect, useState } from "react";
// import { ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import HeroSection from "./HomepageSections/Hero";
import { OurProduct } from "./HomepageSections/OurProduct";
import FAQSection from "./HomepageSections/FAQ";
import AboutUs from "./HomepageSections/AboutUs";
import Footer from "./HomepageSections/Footer";
export default function HomePage() {
  // const navigate = useNavigate();

  // const [stats, setStats] = useState({ clients: 0, loans: 0, approval: 0 });

  // useEffect(() => {
  //   let i = 0;
  //   const interval = setInterval(() => {
  //     i++;
  //     setStats({
  //       clients: Math.min(1200, i * 20),
  //       loans: Math.min(3500, i * 40),
  //       approval: Math.min(2, i * 0.05),
  //     });
  //     if (i > 60) clearInterval(interval);
  //   }, 30);
  //   return () => clearInterval(interval);
  // }, []);

  // // console.log(stats);
  

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary text-white">
      {/* NAVBAR */}
      <HeroSection />

      {/* PRODUCT */}
      <OurProduct />

      {/* HOW IT WORKS */}
      {/* <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {["Apply", "Review", "Approval", "Receive Funds"].map((step, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-xl">
              {step}
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ */}
      <FAQSection />

      {/* ABOUT */}
      <AboutUs />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
