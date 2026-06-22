import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/CommonPages/Login";
import Clients from "./pages/Admin/Client/Clients";
// import LoanManagementPage from "./pages/Admin/Loan";
import LoanTypeManagementPage from "./pages/Admin/LoanType";
import ApplyLoan from "./pages/Clients/ApplyLoan";
import LoanApplications from "./pages/Admin/LoanApplications";
// import HomePage from "./pages/CommonPages/Home";
import ChangePassword from "./pages/CommonPages/ChangePassword";
import ProtectedRoute from "./app/Routes/ProtectedRoutes";
import Loans from "./pages/Admin/Loans/Loan";
import PaymentPage from "./pages/Clients/Payment";
import ErrorBoundary from "./components/ErrorBoundary";
import LoanApplicationPublic from "./pages/Clients/PublicApplication";
import PublicApplicationsDashboard from "./pages/Admin/PublicApplications";
import UsersPage from "./pages/Admin/Users/Users";
import Thanking from "./pages/CommonPages/Thanking";
import GlobalLoader from "./pages/CommonPages/Loader";
import ForgotPassword from "./pages/CommonPages/ForgotPassword";
import ResetRequests from "./pages/Admin/ResetPasswordRequests";
import ResetPassword from "./pages/CommonPages/NewPassword";
import SettingsPage from "./pages/CommonPages/SettingPage";
import Verify2FA from "./pages/CommonPages/2FAAuthentication";
import NotFound from "./pages/CommonPages/404";
import StaffLogin from "./pages/Admin/StaffLogin";
import PastLoanSheetsPage from "./pages/Admin/Loans/PastLoans";
import OnBoarding from "./pages/CommonPages/OnBoarding";
import VideoPlayer from "./pages/CommonPages/VideoPlayer";

function App() {
  return (
    <>
      <GlobalLoader />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* PUBLIC */}
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<StaffLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/thank-you" element={<Thanking />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/application" element={<LoanApplicationPublic />} />
            <Route path="/two-factor-verification" element={<Verify2FA />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/staff-login" element={<StaffLogin />} />

            {/* PROTECTED */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            {/* ADMIN LAYOUT */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
              <Route
                path="apply-loan"
                element={
                  <ProtectedRoute>
                    <ApplyLoan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="loans"
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                }
              />
              <Route path="clients" element={<Clients />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="payments" element={<PaymentPage />} />
              <Route path="past-loans" element={<PastLoanSheetsPage />} />
              <Route path="loan-types" element={<LoanTypeManagementPage />} />
              <Route path="loan-applications" element={<LoanApplications />} />
              <Route
                path="reset-password-requests"
                element={<ResetRequests />}
              />
              <Route
                path="public-applications"
                element={<PublicApplicationsDashboard />}
              />
              <Route path="onboarding" element={<OnBoarding />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
}

export default App;
