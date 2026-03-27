import { AuthProvider } from '../../hooks/useAuth';
import { TenantProvider } from '../../hooks/useTenant';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <TenantProvider>{children}</TenantProvider>
    </AuthProvider>
  );
}
