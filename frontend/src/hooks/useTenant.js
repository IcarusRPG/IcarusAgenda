import { createContext, useContext, useMemo, useState } from 'react';
import { getStoredTenant } from '../services/authStorage';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(() => getStoredTenant());

  const value = useMemo(
    () => ({
      tenant,
      setTenant,
      companyId: tenant?.id || null,
    }),
    [tenant],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider');
  }

  return context;
}
