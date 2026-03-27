import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginPage } from '../../features/auth/LoginPage';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { PublicBookingPage } from '../../features/public-booking/PublicBookingPage';
import { useAuth } from '../../hooks/useAuth';
import { CompaniesListPage } from '../../features/companies/CompaniesListPage';
import { CompanyFormPage } from '../../features/companies/CompanyFormPage';
import { AppointmentsPage } from '../../features/appointments/AppointmentsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:companySlug" element={<PublicBookingPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="companies" element={<CompaniesListPage />} />
        <Route path="companies/new" element={<CompanyFormPage />} />
        <Route path="companies/:companyId/edit" element={<CompanyFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
