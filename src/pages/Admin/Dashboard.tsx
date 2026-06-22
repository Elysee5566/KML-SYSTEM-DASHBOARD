import { useState, useMemo } from "react";
import { useGetDashboardQuery } from "../../api/dashboardApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Users,
  Filter,
  Activity,
} from "lucide-react";
import { formatCompactNumber } from "../../components/formatCompactNumber";
import { motion, AnimatePresence } from "framer-motion";

// ======================================================
// CONFIG
// ======================================================
const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

const cardStyle =
  "rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all";

// ======================================================
// HELPERS
// ======================================================
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
  });

// ======================================================
// COMPONENTS
// ======================================================

interface KPIProps {
  label: string;
  value: string;
  secondaryValue?: string;
  icon: React.ElementType;
  color: string;
  fullnumber: boolean;
  setFullnumber?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KPI = ({
  label,
  value,
  secondaryValue,
  icon,
  color,
  fullnumber,
  setFullnumber,
}: KPIProps) => {
  const Icon = icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setFullnumber?.(!fullnumber)}
      className={`${cardStyle} md:p-5 p-4 relative cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Decorative background */}
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50 ${color}`}
      />

      <div className="relative flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>

          <AnimatePresence mode="wait">
            <motion.h2
              key={value}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm md:text-md font-bold text-gray-900 mt-1 truncate"
            >
              {value}
            </motion.h2>
          </AnimatePresence>

          {secondaryValue && (
            <p className="text-xs text-gray-400 truncate">{secondaryValue}</p>
          )}
        </div>

        <div
          className={`p-3 rounded-2xl ${color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Floating hint */}
      <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[10px] text-gray-400">
          Click to {fullnumber ? "compact" : "expand"}
        </span>
      </div>
    </motion.div>
  );
};

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: any;
}) => (
  <div className={`${cardStyle} p-5`}>
    <div className="mb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Badge = ({ status }: any) => {
  const map: any = {
    active: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${map[status]}`}>
      {status}
    </span>
  );
};

// ======================================================
// MAIN DASHBOARD
// ======================================================

export default function Dashboard() {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });
  const [fullnumber, setFullnumber] = useState(false);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v),
  );

  const { data, isLoading, isError, error } = useGetDashboardQuery(
    cleanFilters,
    {
      pollingInterval: 60000,
    },
  );
  console.log("Dashboard data", data);
  console.log(isError, error);

  const role = data?.role || "client";
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};

  const progress = charts.payment_progress || {
    paid: 0,
    remaining: 0,
  };

  const progressPercent = useMemo(() => {
    const total = progress.paid + progress.remaining;
    return total ? (progress.paid / total) * 100 : 0;
  }, [progress]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="md:text-3xl text-lg font-bold capitalize text-gray-800">
            {`${role} Dashboard`}
          </h1>
          <p className="text-gray-500">
            {role !== "client" && `Real-time analytics, trends & insights`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center md:px-3 px-2 rounded-xl border bg-white">
            <Filter className="md:w-4 md:h-4 h-3 w-3 text-gray-500 mr-2" />
            <input
              type="date"
              className="md:p-2 p-1 text-sm md:text-md outline-none"
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  start_date: e.target.value,
                }))
              }
            />
          </div>

          <input
            type="date"
            className="px-3 text-sm md:text-md rounded-xl border bg-white"
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                end_date: e.target.value,
              }))
            }
          />

          <select
            className="px-3 rounded-xl border bg-white"
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                status: e.target.value,
              }))
            }
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* KPI SECTION */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI
          label="Total Loans"
          value={formatCompactNumber(kpis.total_loans ?? 0, true)}
          icon={Wallet}
          fullnumber={fullnumber}
          color="bg-blue-500"
        />

        <KPI
          label="Active Loans"
          value={formatCompactNumber(kpis.active_loans ?? 0, true)}
          icon={Activity}
          fullnumber={fullnumber}
          color="bg-emerald-500"
        />

        {role !== "client" ? (
          <>
            <KPI
              label="Overdue"
              value={formatCompactNumber(kpis.overdue_loans ?? 0, true)}
              icon={AlertTriangle}
              fullnumber={fullnumber}
              color="bg-red-500"
            />

            <KPI
              label="Disbursed"
              value={
                !fullnumber
                  ? ` ≈ RF ${formatCompactNumber(kpis.total_disbursed, true)} `
                  : formatCurrency(kpis.total_disbursed)
              }
              icon={TrendingUp}
              fullnumber={fullnumber}
              setFullnumber={setFullnumber}
              color="bg-indigo-500"
            />

            <KPI
              label="Collected"
              value={
                !fullnumber
                  ? ` ≈ RF ${formatCompactNumber(kpis.total_collected, true)} `
                  : formatCurrency(kpis.total_collected)
              }
              icon={CheckCircle}
              fullnumber={fullnumber}
              setFullnumber={setFullnumber}
              color="bg-green-600"
            />
          </>
        ) : (
          <>
            <KPI
              label="Total Paid"
              value={
                !fullnumber
                  ? ` RF ${formatCompactNumber(kpis.total_paid, true)} `
                  : formatCurrency(kpis.total_paid)
              }
              icon={CheckCircle}
              fullnumber={fullnumber}
              setFullnumber={setFullnumber}
              color="bg-green-600"
            />

            <KPI
              label="My Loans"
              value={
                !fullnumber
                  ? ` RF ${formatCompactNumber(kpis.total_loans, true)} `
                  : formatCurrency(kpis.total_loans)
              }
              icon={Users}
              fullnumber={fullnumber}
              setFullnumber={setFullnumber}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      {/* ================================================= */}
      {/* ADMIN VIEW */}
      {/* ================================================= */}
      {role !== "client" && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Loans */}
            <Section
              title="Loans Growth Trend"
              subtitle="Historical monthly performance"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={(charts.monthly_loans || []).map((d: any) => ({
                    ...d,
                    month: formatMonth(d.month),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    fill="#bfdbfe"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            {/* Payments */}
            <Section
              title="Collections Trend"
              subtitle="Loan repayments by month"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={(charts.monthly_payments || []).map((d: any) => ({
                    ...d,
                    month: formatMonth(d.month),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* Loan Status */}
            <Section title="Loan Portfolio Mix">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.loan_status_distribution || []}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={100}
                    label
                  >
                    {(charts.loan_status_distribution || []).map(
                      (_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Section>

            {/* Applications */}
            <Section title="Applications Pipeline">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.application_status_distribution || []}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={100}
                    label
                  >
                    {(charts.application_status_distribution || []).map(
                      (_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Section>
          </div>

          {/* Predictive Insight */}
          {/* <Section
            title="Predictive Insight"
            subtitle="Estimated next month collections based on trend"
          >
            <p className="text-3xl font-bold text-emerald-600">
              {formatCurrency(
                (kpis.total_collected || 0) * 1.08
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Projected +8% growth
            </p>
          </Section> */}
        </>
      )}

      {/* ================================================= */}
      {/* CLIENT VIEW */}
      {/* ================================================= */}
      {role === "client" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Section title="My Payments History">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={(charts.monthly_payments || []).map((d: any) => ({
                  ...d,
                  month: formatMonth(d.month),
                }))}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Loan Completion Progress">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <h2 className="text-sm md:text-xl font-bold text-green-600">
                  {formatCurrency(progress.paid)}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <h2 className="text-sm md:text-xl font-bold text-red-500">
                  {formatCurrency(progress.remaining)}
                </h2>
              </div>

              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-4"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-sm text-gray-500">
                {progressPercent.toFixed(1)}% completed
              </p>
            </div>
          </Section>
        </div>
      )}

      {/* ================================================= */}
      {/* TABLES */}
      {/* ================================================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Recent Loans">
          <table className="w-full text-sm">
            <tbody>
              {(tables.recent_loans || []).map((loan: any) => (
                <tr key={loan.id} className="border-t">
                  <td className="py-3">{loan.client_names}</td>
                  <td>{formatCurrency(loan.loan_amount)}</td>
                  <td>
                    <Badge status={loan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Recent Payments">
          <table className="w-full text-sm">
            <tbody>
              {(tables.recent_payments || []).map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="py-3">{p.loan?.id}</td>
                  <td>{formatCurrency(p.amount_paid)}</td>
                  <td>
                    <Badge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}
