import { useTenant } from '../../hooks/useTenant';

export function DashboardPage() {
  const { tenant, companyId } = useTenant();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-slate-600">Bem-vindo ao ambiente interno da empresa.</p>
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>
          <strong>Empresa:</strong> {tenant?.name || '-'}
        </p>
        <p>
          <strong>company_id:</strong> {companyId || '-'}
        </p>
      </div>
    </section>
  );
}
