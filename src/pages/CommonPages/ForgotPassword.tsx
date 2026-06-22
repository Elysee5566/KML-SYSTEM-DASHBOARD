"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../url";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return toast.error("Please enter your email");
    }

    setLoading(true);

    try {
      const res = await fetch(`${url}/api/users/password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        toast.success("Request submitted for approval");
      } else {
        toast.error(data.error || "Failed to send request");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex">
      
      {/* LEFT SIDE (same as login) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <svg viewBox="0 0 500 300" className="w-full h-[60vh]">
            <path
              d="M0,200 C150,100 350,300 500,200"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-y-[28vh]">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white text-primary font-bold px-3 py-1 rounded">
                KML
              </div>
              <span className="font-semibold text-lg">
                Kigali Microloans
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Secure password recovery system
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-snug">
              Reset access,
              <br /> securely and quickly.
            </h2>

            <p className="mt-3 text-gray-400 text-sm">
              Submit your request and wait for admin approval.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg relative">

          {/* GLOW */}
          <div className="absolute -inset-1 bg-linear-to-r from-secondary via-accent to-secondary blur-xl opacity-20 rounded-2xl"></div>

          {/* CARD */}
          <div className="relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10">
            
            {/* LOGO */}
            <div className="flex justify-center mb-6">
              <div className="bg-primary text-white px-5 py-1 rounded font-bold text-lg">
                KML
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary text-center">
              Forgot Password
            </h2>

            <p className="text-center text-muted text-sm mb-8">
              Enter your email to request a password reset
            </p>

            {/* SUCCESS STATE */}
            {sent ? (
              <div className="text-center">
                <p className="text-green-600 text-sm mb-4">
                  ✅ Request submitted successfully
                </p>
                <p className="text-muted text-sm">
                  Please wait for admin approval. You will receive an email once approved.
                </p>

                <button
                  onClick={() => (window.location.href = "/login")}
                  className="mt-6 w-full bg-secondary text-white p-3.5 rounded-lg"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                {/* EMAIL */}
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-secondary text-white p-3.5 rounded-lg font-medium hover:bg-blue-800 transition"
                >
                  {loading ? "Submitting..." : "Request Reset"}
                </button>

                {/* BACK */}
                <p
                  onClick={() => (window.location.href = "/login")}
                  className="text-center text-sm text-secondary mt-5 cursor-pointer hover:underline"
                >
                  Back to login
                </p>
              </>
            )}

            {/* FOOTER */}
            <p className="text-xs text-muted text-center mt-6">
              🔐 Secure recovery • Kigali Microloans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}