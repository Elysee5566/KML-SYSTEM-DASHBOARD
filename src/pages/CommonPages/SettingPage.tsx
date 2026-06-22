import { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Loader2,
  // ToggleLeft,
  ToggleLeftIcon,
  ToggleRightIcon,
} from "lucide-react";
import { url } from "../../url";
import { loaderService } from "../../components/Loaders/loaderService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { TwoFAModal } from "../../components/Modals/2FAModal";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "../../api/loanapplication";

export default function SettingsPage() {
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  // const [maintenance_mode, setMaintenanceMode] = useState(false);
  const { role } = useSelector((state: RootState) => state.auth);
  const navigator = useNavigate();
  const [form, setForm] = useState({
    phone_number: "",
    full_name: "",
    id_card: null as File | null,
  });
  // FETCHING PROFILE
  const fetchProfile = async () => {
    loaderService.show();
    try {
      const res = await fetch(`${url}/api/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log(data)
      setUser(data);

      setIs2FAEnabled(data.is_2fa_enabled);
      loaderService.hide();
    } catch (err) {
      loaderService.hide();
      toast.error("Failed to fetch your Profile!");
      // console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (role === "client") {
      toast.error("You are not allowed to access this page.");
      navigator("/dashboard");
    }
  }, [role]);
  useEffect(() => {
    if (user) {
      setForm({
        phone_number: user.phone_number || "",
        full_name: user.full_name || "",
        id_card: user.id_card || null,
      });
    }
  }, [user]);
  /* =========================
     ENABLE 2FA
  ========================= */
  const handleEnable2FA = async () => {
    setLoading(true);
    loaderService.show();
    try {
      const res = await fetch(`${url}/api/users/2fa/generate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQr(data.qr_code);
      setOpenModal(true);
    } catch (err) {
      // console.error("Error enabling 2FA:", err);
      toast.error("Failed to enable 2FA. Please try again.");
    } finally {
      setLoading(false);
      loaderService.hide();
    }
  };

  /* =========================
     VERIFY
  ========================= */
  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/users/2fa/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.success) {
        setIs2FAEnabled(true);
        setQr(null);
        setCode("");
      } else {
        toast.error("Invalid 2FA code. Please try again.");
        // alert("Invalid code");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DISABLE
  ========================= */
  const handleDisable2FA = async () => {
    setLoading(true);
    loaderService.show();
    try {
      await fetch(`${url}/api/users/2fa/disable/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIs2FAEnabled(false);
    } catch (err) {
      // console.error("Error disabling 2FA:", err);
      toast.error("Failed to disable 2FA. Please try again.");
    } finally {
      setLoading(false);
      loaderService.hide();
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("phone_number", form.phone_number);
    if (form.full_name) {
      formData.append("full_name", form.full_name);
    }
    if (form.id_card) {
      formData.append("id_card", form.id_card);
    }

    try {
      const res = await fetch(`${url}/api/users/me/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Profile updated");
        fetchProfile(); // refresh
      } else {
        // console.log(await res.json())
        toast.error("Failed to update profile");
      }
    } catch (error) {
      // console.log(error);

      toast.error("Error updating profile");
    }
  };
  const { data, refetch } = useGetSystemSettingsQuery(undefined);
  const [updateSystemSettings] = useUpdateSystemSettingsMutation();

  const maintenance_mode = data?.loan_application_enabled;
  const onToggle = async () => {
    loaderService.show();
    try {
      await updateSystemSettings({
        loan_application_enabled: !maintenance_mode,
      }).unwrap();

      toast.success(
        !maintenance_mode
          ? "Loan applications disabled"
          : "Loan applications enabled",
      );

      refetch();
      loaderService.hide();
    } catch (err) {
      console.log(err);
      loaderService.hide();
      toast.error("Failed to update system settings");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-gray-500 text-sm">
            Manage your account and security preferences
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <span className="text-gray-400 font-bold text-sm">
            Laon Applications
          </span>
          {role == "admin" && (
            <button
              onClick={onToggle}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition ${!maintenance_mode && "bg-red-600"}`}
            >
              {maintenance_mode ? (
                <>
                  <ToggleRightIcon className="text-gray-500 " />
                  <span className="text-gray-500 text-sm">Enabled</span>
                </>
              ) : (
                <>
                  <ToggleLeftIcon className="text-white" />
                  <span className="text-white text-sm">Disabled</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-primary" />
          <h3 className="font-semibold text-lg">Profile</h3>
        </div>
        {user && !user.is_profile_complete && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
            ⚠️ Your profile is incomplete. Please fill in:
            <strong> {user.missing_fields.join(", ")}</strong>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={form?.full_name}
            disabled={user?.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Full Name"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            value={user?.email}
            disabled
            placeholder="Email"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={form?.phone_number}
            disabled={user?.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="Enter phone number"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ID Card (Upload)
            </label>

            {/* SHOW EXISTING FILE */}
            {user?.id_card && typeof form.id_card !== "object" && (
              <a
                href={user.id_card}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs underline block mb-2"
              >
                View current ID card
              </a>
            )}

            {/* SHOW NEW FILE NAME */}
            {form.id_card && typeof form.id_card === "object" && (
              <p className="text-xs text-gray-500 mb-2">
                Selected: {form.id_card.name}
              </p>
            )}

            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full text-sm border border-gray-300 p-2 rounded-lg"
              onChange={(e) =>
                setForm({
                  ...form,
                  id_card: e.target.files?.[0] || null,
                })
              }
            />
          </div>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="mt-4 bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90"
        >
          Save Changes
        </button>
      </div>

      {/* ================= SECURITY ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-green-600" />
          <h3 className="font-semibold text-lg">Security</h3>
        </div>

        {/* STATUS */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              is2FAEnabled
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {is2FAEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* ACTIONS */}
        {!is2FAEnabled ? (
          <>
            <button
              onClick={handleEnable2FA}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Enable 2FA
            </button>

            {qr && (
              <TwoFAModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                qr={qr}
                code={code}
                setCode={setCode}
                onVerify={handleVerify}
                loading={loading}
              />
            )}
          </>
        ) : (
          <button
            onClick={handleDisable2FA}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Disable 2FA
          </button>
        )}
      </div>
    </div>
  );
}
