import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { url } from "../../../url";
import { toast } from "react-toastify";

export default function AboutUs() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${url}/api/users/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      {/* ================= ABOUT ================= */}
      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="relative overflow-hidden py-32 px-6 md:px-16 bg-linear-to-br from-secondary via-[#0c2450] to-[#132f68] text-white"
      >
        {/* animated glow backgrounds */}
        <div className="absolute top-0 left-0 w-105 h-105 bg-cyan-400/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-105 h-105 bg-indigo-500/10 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full border border-cyan-300/20 bg-white/5 text-cyan-300 text-xs tracking-[0.25em] uppercase mb-5">
              About Kigali Microloans
            </span>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Smart Lending for a
              <span className="block bg-linear-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Modern Rwanda
              </span>
            </h2>

            <p className="text-gray-300 text-lg leading-8 max-w-3xl mx-auto">
              Kigali Microloans Ltd. (KML) is a forward-thinking financial
              institution delivering fast, affordable, and accessible personal
              loans through seamless digital experiences built for today’s
              customer.
            </p>
          </motion.div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-10 mt-20 items-start">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Story Card */}
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  Empowering Financial Access
                </h3>

                <p className="text-gray-300 leading-8 mb-5">
                  With a mission to help clients secure faster and cheaper loans
                  using modern digital tools, we prioritize customer-centricity,
                  innovation, timeliness, and agility in every service we offer.
                </p>

                <p className="text-gray-300 leading-8">
                  Whether it’s school fees, medical emergencies, business needs,
                  or urgent personal expenses — we’re here to support you when
                  it matters most.
                </p>
              </div>

              {/* Product Card */}
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-xl p-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-semibold text-cyan-300">
                    Umurabyo Loan
                  </h3>

                  <span className="px-3 py-1 rounded-full text-xs bg-cyan-300/10 text-cyan-200 border border-cyan-300/20">
                    Flagship Product
                  </span>
                </div>

                <p className="text-gray-300 leading-8">
                  Designed to provide short-term financial relief, the Umurabyo
                  Loan helps clients solve emergencies quickly with a
                  transparent, efficient, and stress-free borrowing experience.
                </p>
              </div>
            </motion.div>

            {/* RIGHT SIDE STATS + VISION */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    number: "24/7",
                    label: "Digital Access",
                  },
                  {
                    number: "Fast",
                    label: "Loan Processing",
                  },
                  {
                    number: "100%",
                    label: "Transparent Terms",
                  },
                  {
                    number: "Trusted",
                    label: "Client Support",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl"
                  >
                    <h4 className="text-3xl font-bold text-cyan-300 mb-2">
                      {item.number}
                    </h4>
                    <p className="text-sm text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Vision / Mission */}
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                      Our Vision
                    </h3>
                    <p className="text-gray-300 leading-7">
                      To become the best national lending institution through
                      innovative and agile financial solutions.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                      Our Mission
                    </h3>
                    <p className="text-gray-300 leading-7">
                      To assist our clients in securing cheaper and faster loans
                      through modern digital tools and technologies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="rounded-3xl border border-orange-300/10 bg-orange-300/5 backdrop-blur-xl p-8">
                <h3 className="text-xl font-semibold text-orange-200 mb-5">
                  Core Values
                </h3>

                <div className="grid gap-4">
                  {[
                    "Customer Oriented",
                    "Innovation",
                    "Timeliness",
                    "Agility",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="relative px-6 md:px-16 py-32 bg-white text-gray-900 overflow-hidden"
      >
        {/* background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* floating soft light */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-200/30 blur-[120px] rounded-full top-[-120px] right-[-100px]" />

        <div className="relative max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-indigo-600 font-medium mb-3">
              Contact Us
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>

            <p className="text-gray-600">
              Our team is available to assist you with any inquiries.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* LEFT */}
            <div className="space-y-6">
              {[
                { title: "Email", value: "kigalimicroloans@gmail.com" },
                { title: "Phone", value: "+250781001491, +250784603391" },
                { title: "Location", value: "Nyamirambo, Kigali" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-indigo-600 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </motion.div>
              ))}

              <button
                onClick={() => setOpen(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:opacity-90 transition"
              >
                Contact Support
              </button>
            </div>

            {/* MAP */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden border shadow-xl"
            >
              <iframe
                src="https://www.google.com/maps?q=Nyamirambo%20Kigali&output=embed"
                className="w-full h-[450px]"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 text-gray-600 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl  p-8 w-full max-w-md shadow-xl relative"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-4 text-indigo-600">
                Contact Support
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-indigo-600 p-3 rounded-md"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-indigo-600 p-3 rounded-md"
                  required
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  className="w-full border border-indigo-600 p-3 rounded-md"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-md"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                {success && (
                  <p className="text-green-600 text-sm text-center">
                    Message sent successfully ✅
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
