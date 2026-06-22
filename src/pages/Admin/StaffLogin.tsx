import { useState } from "react";
import { useLoginMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import { Eye, EyeOff, Shield, Lock, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";
import { motion } from "framer-motion";

export default function StaffLogin() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await login({
        identifier: email,
        password,
      }).unwrap();

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("access", res.access);

      dispatch(setCredentials({ ...res, remember }));

      toast.success("Staff login successful");

      if (res.is_2fa_enabled) {
        sessionStorage.setItem("temp_token", res.access);
        return (window.location.href = "/two-factor-verification");
      }

      setTimeout(() => {
        window.location.href = res.must_change_password
          ? "/change-password"
          : "/dashboard";
      }, 800);
    } catch (err: any) {
      toast.error(err?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-white flex-col justify-between p-12 relative overflow-hidden">

        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="black" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* top branding */}
        <div className="relative z-10">
          <div className="bg-primary text-white px-4 py-1 rounded font-bold w-fit">
            KML
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Internal Loan Management System
          </p>
        </div>

        {/* center message */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            Manage loans,
            <br /> clients & payments
            <br /> in one place.
          </h2>

          <p className="mt-4 text-gray-500 max-w-md">
            Securely access the internal dashboard to monitor activity,
            manage records, and keep operations running smoothly.
          </p>

          {/* simple illustration */}
          <div className="mt-10">
            <svg viewBox="0 0 200 120" className="w-64">
              <rect x="10" y="20" width="180" height="80" rx="10" fill="#0f2a52" />
              <rect x="20" y="35" width="60" height="10" fill="white" />
              <rect x="20" y="55" width="120" height="8" fill="white" opacity="0.6" />
              <rect x="20" y="70" width="100" height="8" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* footer */}
        <p className="text-xs text-gray-400 relative z-10">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#020617] px-6 relative overflow-hidden">

        {/* glow effects */}
        <div className="absolute w-[400px] h-[400px] bg-secondary/20 blur-[100px] rounded-full top-[-80px] left-[-80px]" />
        <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full bottom-[-80px] right-[-80px]" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >

          {/* HEADER */}
          <div className="text-center mb-8 text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-4 rounded-full border border-white/20">
                <Shield size={24} />
              </div>
            </div>

            <h1 className="text-2xl font-bold">Staff Login</h1>
            <p className="text-gray-400 text-sm">
              Authorized access only
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">

            {/* EMAIL */}
            <div className="relative mb-4">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Email or Username"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative mb-5">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-sm mb-6 text-gray-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>

              <span
                onClick={() => (window.location.href = "/forgot-password")}
                className="cursor-pointer hover:text-white"
              >
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              {isLoading ? "Signing in..." : "Login"}
            </motion.button>

            <p className="text-xs text-center text-gray-500 mt-5">
              🔒 Internal system • 2FA protected
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}