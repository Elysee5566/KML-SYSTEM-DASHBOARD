import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetUsersQuery } from "../../../api/usersApi";
import { UserDrawer } from "./UserDrawer";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [twoFAFilter, setTwoFAFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data: usersData = [], isLoading } = useGetUsersQuery({
    page,
    page_size: 100,
    search,
    role: roleFilter || "all",
    two_fa: twoFAFilter,
  });
  const users = Array.isArray(usersData) ? usersData : usersData?.results || [];
  const [deleteUser] = useDeleteUserMutation();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [grid, setGrid] = useState(false);
  console.log(users);
  // const filteredUsers = users.filter((u: any) => {
  //   const matchesSearch = `${u.username} ${u.email} ${u.role}`
  //     .toLowerCase()
  //     .includes(search.toLowerCase());

  //   const matchesRole = !roleFilter || u.role === roleFilter;

  //   const matches2FA =
  //     !twoFAFilter ||
  //     (twoFAFilter === "enabled" && u.is_2fa_enabled) ||
  //     (twoFAFilter === "disabled" && !u.is_2fa_enabled);

  //   return matchesSearch && matchesRole && matches2FA;
  // });

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id).unwrap();
      toast.success("User deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "manager":
        return "bg-blue-100 text-blue-600";
      case "reviewer":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        <button
          onClick={() => setSelectedUser({})}
          className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-4
    py-2
    rounded-xl
    w-full
    sm:w-auto
  "
        >
          + Add User
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col w-auto md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 border rounded-lg p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-3"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="manager">Manager</option>
          <option value="reviewer">Reviewer</option>
        </select>

        <select
          value={twoFAFilter}
          onChange={(e) => setTwoFAFilter(e.target.value)}
          className="border rounded-lg px-3"
        >
          <option value="">2FA</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <div>
          <button
            onClick={() => setGrid(!grid)}
            className="bg-secondary text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow"
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* RESPONSIVE USERS VIEW */}
      <div>
        {/* MOBILE CARDS */}
        {grid && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
                No users found
              </div>
            ) : (
              users.map((u: any) => (
                <div
                  key={u.id}
                  className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            hover:shadow-md
            transition-all
            overflow-hidden
          "
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold break-all text-slate-800 text-lg">
                          {u.username}
                        </h3>

                        <p className="text-sm text-slate-500 break-all">
                          {u.email}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${roleColor(
                          u.role,
                        )}`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase text-slate-400">Role</p>

                        <p className="font-medium text-slate-700">{u.role}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-slate-400">
                          2FA Status
                        </p>

                        <p
                          className={`font-medium ${
                            u.is_2fa_enabled ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {u.is_2fa_enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="
                  flex items-center gap-2
                  px-3 py-2
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  hover:bg-blue-100
                  transition
                "
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="
                  flex items-center gap-2
                  px-3 py-2
                  rounded-xl
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  transition
                "
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!grid && (
          <div className="w-[85vw] md:w-full bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-4">Username</th>
                  <th>Full Names</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>2FA Enabled</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr
                      key={u.id}
                      className="border-t text-sm text-gray-700 border-gray-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-medium">{u.username}</td>
                      <td className="p-4 font-medium">
                        {u?.full_name || u?.client?.names || "N/A"}
                      </td>

                      <td>{u.email}</td>

                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${roleColor(
                            u.role,
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            u.is_2fa_enabled ? "text-green-600" : "text-red-500"
                          }
                        >
                          {u.is_2fa_enabled ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="
                      flex items-center gap-2
                      px-3 py-2
                      rounded-lg
                      text-blue-600
                      hover:bg-blue-50
                    "
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            onClick={() => setConfirmDelete(u)}
                            className="
                      flex items-center gap-2
                      px-3 py-2
                      rounded-lg
                      text-red-600
                      hover:bg-red-50
                    "
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 text-gray-400 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {usersData?.total_pages || 1}
          </span>

          <button
            disabled={page === usersData?.total_pages}
            onClick={() => setPage(page + 1)}
            className="px-4 text-gray-400 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= DRAWER ================= */}
      <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* ================= DELETE MODAL ================= */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold mb-3">Delete User</h2>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{confirmDelete.username}</strong>?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
