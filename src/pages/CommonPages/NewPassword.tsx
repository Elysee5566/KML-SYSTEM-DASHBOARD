import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { url } from "../../url";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  // =========================
  // VERIFY TOKEN
  // =========================
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${url}/api/users/password-reset/${token}/`);
        const data = await res.json();

        if (data.valid) {
          setValid(true);
        } else {
          toast.error(data.error || "Invalid or expired link");
        }
      } catch {
        toast.error("Failed to verify link");
      }
    };

    verify();
  }, [token]);

  // =========================
  // RESET PASSWORD
  // =========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!password || !confirm) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${url}/api/users/password-reset/${token}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary via-[#0f2a52] to-secondary text-white">
        <p>Invalid or expired reset link</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-primary via-[#0f2a52] to-secondary flex items-center justify-center">
      
      {/* CARD (same style as login) */}
      <div className="w-full max-w-lg relative px-4">

        {/* GLOW */}
        <div className="absolute -inset-1 bg-linear-to-r from-secondary via-accent to-secondary blur-xl opacity-20 rounded-2xl"></div>

        <div className="relative backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-10">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary text-white px-5 py-1 rounded font-bold text-lg tracking-wide">
              KML
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary text-center">
            Reset Password
          </h2>

          <p className="text-center text-sm text-gray-500 mb-8">
            Enter your new password
          </p>

          {/* PASSWORD */}
          <div className="mb-5 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-5 relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none pr-10"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5 cursor-pointer text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-secondary text-white p-3.5 rounded-lg font-medium hover:bg-blue-800 transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {/* FOOTER */}
          <p className="text-xs text-center text-gray-500 mt-6">
            🔒 Secure system • Kigali Microloans
          </p>
        </div>
      </div>
    </div>
  );
}