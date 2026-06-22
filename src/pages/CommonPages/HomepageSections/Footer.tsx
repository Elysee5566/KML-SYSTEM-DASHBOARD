export default function Footer() {
  return (
    <footer className="bg-[#0a1a33] text-gray-300 px-6 md:px-16 py-16">
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-primary font-bold px-3 py-1 rounded text-sm">
              KML
            </div>
            <span className="font-semibold text-white">Kigali Microloans</span>
          </div>

          <p className="text-sm text-gray-400">
            Providing fast, reliable, and accessible financial solutions to
            salaried professionals across Rwanda.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-indigo-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#product" className="hover:text-indigo-400">
                Loan Product
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-indigo-400">
                FAQs
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-indigo-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>Personal Loans</li>
            <li>Salary-Based Loans</li>
            <li>Quick Disbursement</li>
            <li>Financial Support</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email:  kigalimicroloans@gmail.com</li>
            <li>Phone: +250781001491, +250784603391, +250798117214</li>
            <li>Nyamirambo, Basil Heights, 2nd floor, P.O. Box 677 Kigali</li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kigali Microloans. All rights reserved.
      </div>
    </footer>
  );
}
