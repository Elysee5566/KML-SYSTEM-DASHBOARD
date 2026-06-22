import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Umurabyo Loan?",
      a: "The Umurabyo Loan is a short-term cash loan designed to help clients handle emergencies until their next payday. It is repaid within one month.",
    },
    {
      q: "How much can I borrow from Kigali Microloans?",
      a: "You can borrow up to 2,000,000 Rwandan Francs (Frw) under the Umurabyo Loan product.",
    },
    {
      q: "Who qualifies for Umurabyo Loan?",
      a: "Applicants must be employed in either the public or private sector and provide all required documents.",
    },
    {
      q: "What documents are required?",
      a: "You need a valid National ID, employment contract, and recent three months bank statements.",
    },
    {
      q: "What is the interest rate?",
      a: "The interest rate is 10% monthly with no hidden application, processing, administration, or insurance fees.",
    },
    {
      q: "How do I apply?",
      a: "You can apply by sending your documents to kigalimicroloans@gmail.com or use the online application form on our website.",
    },
    {
      q: "How long does approval take?",
      a: "Applications are reviewed within two hours after submission, and disbursement is usually completed within 24 hours.",
    },
    {
      q: "Can I reloan after repayment?",
      a: "Yes. Clients may reloan up to 2 times after repayment. Notify Kigali Microloans at least 10 days before your due date.",
    },
    {
      q: "How do I repay my loan?",
      a: "Repayments can be made through cash, mobile money, or direct bank deposit.",
    },
    {
      q: "How can I contact Kigali Microloans?",
      a: "You can contact us through the phone numbers listed in Contact Us or via our official email.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActive(active === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-28 px-6 md:px-16 bg-linear-to-br from-[#06152f] via-[#0c2450] to-[#142f69] text-white"
    >
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-100 h-100 bg-cyan-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-indigo-500/10 blur-[120px] rounded-full" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs uppercase tracking-[0.25em] mb-5">
            Frequently Asked Questions
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Answers to Help You
            <span className="block bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Borrow with Confidence
            </span>
          </h2>

          <p className="text-gray-300 text-lg">
            Everything you need to know about our loans, approvals,
            repayments, and support.
          </p>
        </motion.div>

        {/* FAQ GRID */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {faqs.map((item, i) => {
            const isOpen = active === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-white/5 transition"
                >
                  <span className="font-medium text-white text-base md:text-lg">
                    {item.q}
                  </span>

                  <span className="shrink-0 text-cyan-300">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-300 leading-8 text-sm md:text-base border-t border-white/10">
                        <div className="pt-4">{item.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-16 text-center rounded-3xl border border-cyan-300/10 bg-cyan-300/5 backdrop-blur-xl p-8"
        >
          <h3 className="text-2xl font-semibold mb-3 text-cyan-200">
            Still Have Questions?
          </h3>

          <p className="text-gray-300 mb-5">
            Our support team is ready to help you understand your options.
          </p>

          <a
            href="#contact"
            className="inline-flex px-6 py-3 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:scale-105 transition"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}