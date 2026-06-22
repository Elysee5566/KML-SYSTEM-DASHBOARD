import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex items-center justify-center px-4">
      
      <div className="backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        
        <h1 className="text-5xl font-bold text-primary mb-4">404</h1>

        <p className="text-gray-600 mb-6">
          Page not found. It may have been moved or doesn’t exist.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-[#081426] transition"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="border border-primary text-primary px-5 py-2 rounded-lg hover:bg-primary hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}