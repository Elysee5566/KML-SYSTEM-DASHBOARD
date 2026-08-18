import { useState, useEffect } from "react";
import { useGetLoansQuery, useUpdateLoanMutation } from "../../../api/loanApi";
import LoanCards from "./LoanCard";
import LoanTable from "./LoanTable";
import LoanDrawer from "./LoanDrawer";
import CardSkeleton from "../../../components/Loaders/CardSkeleton";
import TableSkeleton from "../../../components/Loaders/TableSkeleton";
import CreateLoanDrawer from "./CreateLoanDrawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
// import PaymentDrawer from "./PaymentDrawer";
import { useCreatePaymentMutation } from "../../../api/paymentApi";
import { toast } from "react-toastify";
import EditLoanDrawer from "./LoanEditDrawer";
import { loaderService } from "../../../components/Loaders/loaderService";
import { formatCompactNumber } from "../../../components/formatCompactNumber";
// import { useGetDashboardQuery } from "../../../api/dashboardApi";
export default function Loans() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const {
    data: loansData = [],
    isLoading,
    refetch,
  } = useGetLoansQuery({
    page,
    page_size: 50,
    search,
    status,
    from_date: fromDate,
    to_date: toDate,
  });
  const loans = loansData?.results || [];
  console.log(loansData);

  const totalPages = loansData?.total_pages || 1;
  // const currentPage = loansData?.current_page || 1;
  console.log("Loans:", loans);
  // const totalPages = Math.ceil(totalCount / 10);
  const [updateLoan, { isLoading: isUpdating }] = useUpdateLoanMutation();

  useEffect(() => {
    refetch();
  }, []);

  // const { data } = useGetDashboardQuery(undefined);
  // console.log("dashboard Loans data", data);

  const { role } = useSelector((state: RootState) => state.auth);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingLoan, setEditingLoan] = useState<any>(null);
  // const [openDrawer, setOpenDrawer] = useState(false);
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  // const handlePay = (loan: any) => {
  //   setSelectedLoan(loan);
  //   // setOpenDrawer(true);
  // };

  // 👉 close drawer
  const handleClose = () => {
    // setOpenDrawer(false);
    setSelectedLoan(null);
  };

  // 👉 submit payment
  const handleSubmitPayment = async (data: any) => {
    try {
      await createPayment(data).unwrap();
      handleClose();
      toast.success("Payment recorded");
      refetch();
    } catch (error) {
      // console.log(error);
      toast.error("Failed to record payment");
    }
  };
  // edit Loan
  const handleUpdateLoan = async (id: number, formData: FormData) => {
    try {
      loaderService.show();
      await updateLoan({ id, formData }).unwrap();
      toast.success("Loan updated");
      setEditingLoan(null);
      loaderService.hide();
    } catch (error: any) {
      // console.log(error);
      if (error.data) {
        toast.error(error.data[0] || "Update failed");
      }
      toast.error("Update failed");
      loaderService.hide();
    }
  };
  // const stats = loans.reduce(
  //   (acc: any, loan: any) => {
  //     acc.totalLoans += 1;
  //     acc.totalDisbursed += Number(loan.loan_amount);
  //     acc.totalBalance += Number(loan.remaining_balance);

  //     if (loan.status === "overdue") acc.overdue += 1;
  //     if (loan.status === "paid") acc.paid += 1;
  //     if (loan.status === "active") acc.active += 1;

  //     return acc;
  //   },
  //   {
  //     totalLoans: 0,
  //     totalDisbursed: 0,
  //     totalBalance: 0,
  //     overdue: 0,
  //     paid: 0,
  //     active: 0,
  //   },
  // );
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden">
      {/* TITLE */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">Loans</h1>
          <p className="text-sm text-gray-500">Manage all issued loans</p>
        </div>

        {role !== "client" && (
          <button
            onClick={() => setOpenCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full sm:w-auto"
          >
            + Create Loan Application
          </button>
        )}
      </div>
      {/* 🔥 STATS */}
      {isLoading ? <CardSkeleton /> : <StatsCards stats={loansData?.summary} />}
      {/* MOBILE CARDS */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="hidden">
          <LoanCards
            loans={loans}
            onSelect={setSelectedLoan}
            onEdit={setEditingLoan}
          />
        </div>
      )}

      {/* DESKTOP TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="w-[90vw] md:w-[75vw] lg:w-full overflow-hidden">
          <LoanTable
            loans={loans}
            onSelect={setSelectedLoan}
            onEdit={(loan: any) => setEditingLoan(loan)}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </div>
      )}

      {/* DRAWER */}
      {/* <LoanDrawer loan={selectedLoan} onClose={() => setSelectedLoan(null)} onPay={handlePay} /> */}
      <LoanDrawer
        open={!!selectedLoan}
        loan={selectedLoan}
        onClose={() => setSelectedLoan(null)}
        onPay={handleSubmitPayment}
        isLoadingPayment={isCreatingPayment}
      />
      <CreateLoanDrawer
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      {/* <PaymentDrawer
        loan={selectedLoan}
        open={openDrawer}
        onClose={handleClose}
        onSubmit={handleSubmitPayment}
      /> */}
      <EditLoanDrawer
        loan={editingLoan}
        open={!!editingLoan}
        onClose={() => setEditingLoan(null)}
        onSave={handleUpdateLoan}
        isLoading={isUpdating}
      />
    </div>
  );
}
function StatsCards({ stats }: any) {
  // console.log(stats);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  const cards = [
    {
      title: "Total Loans",
      value: formatCompactNumber(stats?.total_loans),
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Disbursed",
      value: formatCurrency(stats?.total_disbursed),
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Outstanding Balance",
      value: formatCurrency(stats?.total_balance),
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Active Loans",
      value: formatCompactNumber(stats?.active),
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      title: "Overdue",
      value: formatCompactNumber(stats?.overdue),
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
    {
      title: "Paid",
      value: formatCompactNumber(stats?.paid),
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`${card.bg} rounded-2xl border p-4 shadow-sm`}>
          <p className="text-xs text-gray-500">{card.title}</p>

          <h2
            className={`mt-1 text-lg lg:text-xl font-semibold ${card.text} wrap-break-words`}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
