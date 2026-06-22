import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../../api/clientApi";

export default function ClientDrawer({ open, onClose, client }: any) {
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();

  const loading = creating || updating;

  const [form, setForm] = useState<any>({
    names: "",
    email: "",
    phone: "",
    gender: "",
    marital_status: "",
    id_number: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    id_document: null,
    job_contract: null,
    bank_statement: null,
  });

  useEffect(() => {
    if (client) {
      setForm({
        ...client,
        // id_document: null,
        // job_contract: null,
        // bank_statement: null,
      });
    }
  }, [client]);

  if (!open) return null;

  // ✅ HANDLE CHANGE
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value === null || value === "") return;

        // Handle file fields specially
        if (
          key === "id_document" ||
          key === "job_contract" ||
          key === "bank_statement"
        ) {
          // Only send newly selected files
          if (value instanceof File) {
            data.append(key, value);
          }
        } else {
          data.append(key, value as string);
        }
      });

      if (client) {
        await updateClient({
          id: client.id,
          data,
        }).unwrap();

        toast.success("Client updated successfully");
      } else {
        await createClient(data).unwrap();

        toast.success("Client created & credentials sent");
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
          toast.error("Failed to create Client");
        }
      } else {
        toast.error("Failed to create Client");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* DRAWER */}
      <div className="w-full md:w-[45vw] bg-white h-full shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              {client ? "Edit Client" : "Create New Client"}
            </h2>
            <p className="text-xs text-gray-500">
              Enter accurate client information
            </p>
          </div>

          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* PERSONAL INFO */}
          <Section title="Personal Information">
            <Input
              label="Full Name"
              value={form.names}
              onChange={(v: any) => handleChange("names", v)}
            />
            <Input
              label="Email Address"
              value={form.email}
              onChange={(v: any) => handleChange("email", v)}
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(v: any) => handleChange("phone", v)}
            />

            <Grid>
              <Select
                label="Gender"
                value={form.gender}
                onChange={(v: any) => handleChange("gender", v)}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </Select>

              <Select
                label="Marital Status"
                value={form.marital_status}
                onChange={(v: any) => handleChange("marital_status", v)}
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
              </Select>
              {/* <Select
                label="Role"
                value={form.role}
                onChange={(v: any) => handleChange("role", v)}
              >
                <option value="">Select</option>
                <option>client</option>
                <option>reviewer</option>
                <option>manager</option>
                <option>admin</option>
              </Select> */}
            </Grid>
          </Section>

          {/* IDENTIFICATION */}
          <Section title="Identification">
            <Input
              label="National ID Number"
              value={form.id_number}
              onChange={(v: any) => handleChange("id_number", v)}
            />
          </Section>

          {/* LOCATION */}
          <Section title="Location">
            <Grid>
              <Input
                label="District"
                value={form.district}
                onChange={(v: any) => handleChange("district", v)}
              />
              <Input
                label="Sector"
                value={form.sector}
                onChange={(v: any) => handleChange("sector", v)}
              />
              <Input
                label="Cell"
                value={form.cell}
                onChange={(v: any) => handleChange("cell", v)}
              />
              <Input
                label="Village"
                value={form.village}
                onChange={(v: any) => handleChange("village", v)}
              />
            </Grid>
          </Section>

          {/* DOCUMENTS */}
          <Section title="Documents Upload">
            <FileInput
              label="ID Document"
              existingFile={client?.id_document}
              onChange={(f) => handleChange("id_document", f)}
            />

            <FileInput
              label="Job Contract"
              existingFile={client?.job_contract}
              onChange={(f) => handleChange("job_contract", f)}
            />

            <FileInput
              label="Bank Statement"
              existingFile={client?.bank_statement}
              onChange={(f) => handleChange("bank_statement", f)}
            />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-secondary text-white px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : client ? "Update Client" : "Create Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Grid = ({ children }: any) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-secondary outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, value, onChange, children }: any) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <select
      className="w-full border p-3 rounded-lg mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

const FileInput = ({
  label,
  onChange,
  existingFile,
}: {
  label: string;
  onChange: (file: File | undefined) => void;
  existingFile?: string;
}) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>

    {existingFile && (
      <div className="mt-1 mb-2">
        <a
          href={existingFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View Current Document
        </a>
      </div>
    )}

    <input
      type="file"
      className="w-full text-sm border border-gray-300 rounded-md py-2 px-2"
      onChange={(e) => onChange(e.target.files?.[0])}
    />
  </div>
);
