import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/Header";
import { useGetProfileQuery } from "../api/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.auth);
  const { data: userProfile, isLoading } = useGetProfileQuery();

  const handleLogout = () => {
    localStorage.removeItem("access");
    sessionStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Header
          onMenu={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          username={userProfile?.username}
        />

        {/* 🔴 GLOBAL WARNINGS */}
        {!isLoading && userProfile && (
          <div className="px-4 md:px-6 pt-4 space-y-3">
            {/* 🔐 2FA WARNING (for staff only) */}
            {role !== "client" && !userProfile.is_2fa_enabled && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                <span>
                  🔐 Two-Factor Authentication is required for staff accounts.
                </span>

                <button
                  onClick={() => navigate("/dashboard/settings")}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Enable Now
                </button>
              </div>
            )}

            {/* ⚠️ PROFILE INCOMPLETE */}
            {role !== "client" && !userProfile.is_profile_complete && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                <span>
                  ⚠️ Your profile is incomplete:{" "}
                  <strong>{userProfile.missing_fields.join(", ")}</strong>
                </span>

                <button
                  onClick={() => navigate("/dashboard/settings")}
                  className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
