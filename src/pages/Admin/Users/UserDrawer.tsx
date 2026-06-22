import { useEffect, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../api/usersApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

export function UserDrawer({ user, onClose }: any) {
  const isEdit = user?.id;

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const loading = creating || updating;
  const { role } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    full_name: "",
    id_card: null as File | null,
    marital_status: "single",
    role: "client",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        id_card: user.id_card || null,
        marital_status: user.marital_status || "single",
        role: user.role || "client",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!form.username || !form.email) {
      toast.error("Username and email are required");
      return;
    }

    try {
      // const data = new FormData(); Testing Fire mode and writting codes is now very goo

      // data.append("username", form.username);
      // data.append("email", form.email);
      // data.append("full_name", form.full_name);
      // data.append("phone_number", form.phone_number);
      // data.append("role", form.role);
      // data.forEach((element) => {
      //   console.log(element);
      // });
      // if (form.id_card) {
      //   data.append("id_card", form.id_card);
      // }
      const data = new FormData();

      if (form.username !== user.username) {
        data.append("username", form.username);
      }

      if (form.email !== user.email) {
        data.append("email", form.email);
      }

      if (form.full_name !== user.full_name) {
        data.append("full_name", form.full_name);
      }

      if (form.phone_number !== user.phone_number) {
        data.append("phone_number", form.phone_number);
      }
      if (form.marital_status !== user.marital_status) {
        data.append("marital_status", form.marital_status);
      }

      if (form.role !== user.role) {
        data.append("role", form.role);
      }
      if (!isEdit && !form.id_card) {
        toast.error("ID Card is required");
        return;
      }
      if (form.id_card instanceof File) {
        data.append("id_card", form.id_card);
      }

      if (isEdit) {
        await updateUser({
          id: user.id,
          body: data, // 👈 important
        }).unwrap();

        toast.success("User updated");
      } else {
        await createUser(data).unwrap();
        toast.success("User created");
      }

      onClose();
    } catch (err: any) {
      console.log(err.data);

      if (err?.data?.detail) {
        toast.error(err.data.detail);
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else if (err?.data?.non_field_errors) {
        toast.error(err.data.non_field_errors[0]);
      } else if (err?.data) {
        const firstKey = Object.keys(err.data)[0];

        if (firstKey) {
          const errorMessage = err.data[firstKey][0];

          toast.error(`${firstKey}: ${errorMessage}`);
        } else {
          toast.error("Failed to Create Client");
        }
      } else {
        toast.error("Failed to Create Client");
      }
    }
  };

  return (
    <AnimatePresence>
      {user && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="relative z-50 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEdit ? "Edit User" : "Create User"}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  required
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              {/* Full Names */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Names
                </label>
                <input
                  required
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter User Full Names"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              </div>
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  required
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {/* Phone number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  required
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder="Enter Phone Number"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                />
              </div>
              {/* Id card */}
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
                  required={!isEdit}
                  className="w-full text-sm border border-gray-300 p-2 rounded-lg"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      id_card: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Marital Status
                </label>
                <select
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  value={form.marital_status}
                  onChange={(e) =>
                    setForm({ ...form, marital_status: e.target.value })
                  }
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {role == "admin" && (
                    <>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </>
                  )}
                  <option value="reviewer">Reviewer</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* PASSWORD */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {isEdit ? "New Password (optional)" : "Password"}
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition"
                  placeholder={
                    isEdit
                      ? "Leave empty to keep current password"
                      : "Enter password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div> */}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition"
              >
                {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
