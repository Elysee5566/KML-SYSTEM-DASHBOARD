import { useState } from "react";
import { Loader2, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../../url";
import { loaderService } from "../../components/Loaders/loaderService";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"app" | "email">("app");

  const navigate = useNavigate();
  const tempToken = sessionStorage.getItem("temp_token");

  const sendEmailCode = async () => {
    try {
      setMethod("email");
      loaderService.show();
      const res=await fetch(`${url}/api/users/2fa/send-email/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      });
      // console.log(res);
      if(!res.ok){
        throw new Error("Failed to send email code")
      }
      loaderService.hide();
      toast.success("Code sent to your email");
      
    } catch (error) {
      // console.error(error);

      loaderService.hide();
      toast.error("Failed to send email code");
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      return toast.error("Enter valid 6-digit code");
    }

    loaderService.show();
    setLoading(true);

    try {
      const res = await fetch(`${url}/api/users/2fa/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code, method }),
      });

      const data = await res.json();
      // console.log(data);
      if (data.success) {
        localStorage.setItem("access", data.access);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error("Invalid code");
      }
    } catch(error: any) {
      // console.error(error);
      toast.error("Verification failed");
    } finally {
      setLoading(false);
      loaderService.hide();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 text-white">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Shield />
          </div>
          <h2 className="text-xl font-bold">Two-Factor Verification</h2>
          <p className="text-gray-400 text-sm mt-1">
            {method === "app"
              ? "Enter code from your authenticator app"
              : "Enter code sent to your email"}
          </p>
        </div>

        {/* SWITCH */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMethod("app")}
            className={`flex-1 p-2 rounded ${
              method === "app" ? "bg-secondary" : "bg-white/10"
            }`}
          >
            Authenticator
          </button>

          <button
            onClick={sendEmailCode}
            className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
              method === "email" ? "bg-secondary" : "bg-white/10"
            }`}
          >
            <Mail size={14} /> Email
          </button>
        </div>

        {/* INPUT */}
        <input
          type="text"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 text-center text-lg tracking-widest rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-secondary outline-none"
          placeholder="123456"
        />

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-5 bg-secondary text-white p-3 rounded-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Verify & Continue
        </button>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-500 mt-6">
          🔐 Secure verification • KML
        </p>
      </div>
    </div>
  );
}