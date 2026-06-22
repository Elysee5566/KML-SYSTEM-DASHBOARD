import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export function ProfileDropdown({ onLogout }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {role}=useSelector((state:RootState)=>state.auth)
  // console.log(role)
  /* =========================
     CLOSE ON OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* PROFILE ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
      >
        <User size={18} />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute bottom-12 left-0 w-48 bg-white text-black rounded-xl shadow-lg overflow-hidden">
          {/* <button
            onClick={() => {
              navigate("/dashboard/profile");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
          >
            <User size={16} /> Profile
          </button> */}

          {role !=='client' && <button
            onClick={() => {
              navigate("/dashboard/settings");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
          >
            <Settings size={16} /> Settings
          </button>}

          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}