{
  /* PRODUCT SECTION */
}
import { useNavigate } from "react-router-dom";
import umurabyo from "../../../assets/Umurabyo.png"
export const OurProduct = () => {
  const navigate=useNavigate()
  return (
    <section
      id="product"
      className="relative px-6 md:px-16 py-24 bg-white text-gray-900"
    >
      {/* HEADER */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm text-blue-600 font-medium mb-3">
          Our Loan Offering
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">
          Simple, Transparent Microloans
        </h2>

        <p className="mt-4 text-gray-600 text-sm md:text-base">
          Designed for salaried professionals, our loan product provides quick
          access to cash with a clear and straightforward repayment structure.
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT: IMAGE / VISUAL */}
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-2xl"></div>

          <img
            src={umurabyo}
            alt="Loan service"
            className="relative rounded-2xl shadow-lg object-cover w-full h-80"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Umurabyo Loan</h3>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Loan Amount", value: "Up to 2,000,000 RWF" },
              { label: "Repayment Period", value: "30 Days" },
              // { label: "Interest Rate", value: "10% / month" },
              // { label: "Collateral", value: "Not Required" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl bg-gray-50 hover:shadow-md transition"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-medium mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={() => navigate("/application")} className="mt-8 bg-primary text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition">
            Apply for This Loan
          </button>
        </div>
      </div>

      {/* EXTRA TRUST STRIP */}
      <div className="mt-20 grid md:grid-cols-3 gap-6 text-center text-sm text-gray-600">
        <div className="p-6 border rounded-xl">✔ No collateral required</div>
        <div className="p-6 border rounded-xl">
          ✔ Fast approval within hours
        </div>
        <div className="p-6 border rounded-xl">
          ✔ Secure and transparent process
        </div>
      </div>
    </section>
  );
};
