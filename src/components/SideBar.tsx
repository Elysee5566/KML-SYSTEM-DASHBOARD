import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";

import { SIDEBAR_CONFIG } from "./SideBarConfig";
import type { RootState } from "../app/store";

import { useGetLoansQuery } from "../api/loanApi";
import {
  useGetApplicationsQuery,
  useGetPublicApplicationsQuery,
} from "../api/loanapplication";
import { useGetResetRequestsQuery } from "../api/usersApi";
import { ProfileDropdown } from "./ProfileDropdown";

export function Sidebar({ open, setOpen, onLogout }: any) {
  const location = useLocation();
  const navigate = useNavigate();

  const { role } = useSelector((state: RootState) => state.auth);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  /* =========================
     DATA
  ========================= */
  const { data: loansData } = useGetLoansQuery(
    {
      page: 1,
      page_size: 50,
      status: "pending",
    },
    {
      pollingInterval: 0,
      skip: role === "client",
    },
  );
  // const loans = Array.isArray(loansData) ? loansData : loansData?.results || [];

  const { data: applicationsData = [] } = useGetApplicationsQuery(
    {
      page: 1,
      page_size: 1000,
      status: "pending",
    },
    {
      pollingInterval: 0,
      skip: role === "client",
    },
  );
  // const applications = Array.isArray(applicationsData)
  //   ? applicationsData
  //   : applicationsData?.results || [];

  const { data: publicApplicationsData = [] } = useGetPublicApplicationsQuery(
    {
      page: 1,
      page_size: 1000,
      status: "pending",
    },
    {
      pollingInterval: 0,
      skip: role === "client",
    },
  );
  // const publicApplications = Array.isArray(publicApplicationsData)
  //   ? publicApplicationsData
  //   : publicApplicationsData?.results || [];
  // console.log("Public Applications in Sidebar:", publicApplications);

  const { data: passwordResetRequestsData = [] } = useGetResetRequestsQuery(
    undefined,
    {
      pollingInterval: 0,
      skip: role === "client",
    },
  );
  const passwordResetRequests = Array.isArray(passwordResetRequestsData)
    ? passwordResetRequestsData
    : passwordResetRequestsData?.results || [];

  /* =========================
     COUNTS
  ========================= */
  const pendingLoans = loansData?.count || 0;
  const pendingApplications = applicationsData?.count || 0;

  const pendingPublicApplications = publicApplicationsData?.count || 0;

  const pendingPasswordResetRequests = useMemo(() => {
    if (role === "client") return 0;

    return passwordResetRequests.filter((r: any) => r.status === "PENDING")
      .length;
  }, [passwordResetRequests, role]);

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    if (!role) navigate("/");
  }, [role, navigate]);

  if (!role || !SIDEBAR_CONFIG[role]) return null;

  const baseMenu = SIDEBAR_CONFIG[role];

  /* =========================
     MENU COUNTS
  ========================= */
  const menuItems = useMemo(() => {
    return baseMenu.map((item: any) => {
      if (!item.children) return item;

      return {
        ...item,
        children: item.children.map((child: any) => {
          switch (child.to) {
            case "/dashboard/loans":
              return { ...child, count: pendingLoans };

            case "/dashboard/loan-applications":
              return { ...child, count: pendingApplications };

            case "/dashboard/public-applications":
              return { ...child, count: pendingPublicApplications };

            case "/dashboard/reset-password-requests":
              return {
                ...child,
                count: pendingPasswordResetRequests,
              };

            default:
              return child;
          }
        }),
      };
    });
  }, [
    baseMenu,
    pendingLoans,
    pendingApplications,
    pendingPublicApplications,
    pendingPasswordResetRequests,
  ]);

  /* =========================
     AUTO OPEN ACTIVE MENU
  ========================= */
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};

    menuItems.forEach((item: any) => {
      if (item.children) {
        const active = item.children.some((child: any) =>
          location.pathname.startsWith(child.to),
        );

        if (active) {
          newOpenMenus[item.label] = true;
        }
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [location.pathname, menuItems]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-auto ${role === "client" ? `bg-black` : `bg-primary`} text-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-bold text-lg">KML</span>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden hover:text-gray-300"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
          {/* NAV */}
          <nav className="p-3 space-y-2">
            {menuItems.map((item: any) => {
              const Icon = item.icon;

              /* =========================
                 MENU WITH CHILDREN
              ========================= */
              if (item.children) {
                const isOpen = openMenus[item.label];

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="">{item.label}</span>
                      </div>

                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child: any) => {
                          const active = location.pathname.startsWith(child.to);

                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setOpen(false)}
                              className={`flex items-center  justify-between p-2 rounded-md text-xs md:text-sm transition ${
                                active
                                  ? "bg-white text-primary font-semibold"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              <span>{child.label}</span>

                              {child.count > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-5.5 text-center">
                                  {child.count}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* =========================
                 SINGLE ITEM
              ========================= */
              const active = location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm transition ${
                    active
                      ? "bg-white text-primary font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          {/* <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="text-red-300 text-sm hover:text-red-200 transition"
            >
              Logout
            </button>
          </div> */}
          <div className="mt-auto p-4 border-t border-white/10 flex justify-start">
            <ProfileDropdown onLogout={onLogout} />
          </div>
        </div>
      </aside>
    </>
  );
}
