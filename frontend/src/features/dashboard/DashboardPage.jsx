import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useTenant } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';

export function DashboardPage() {
  const { tenant, companyId } = useTenant();
  const { user } = useAuth();

  const publicLink = tenant?.slug ? `${window.location.origin}/book/${tenant.slug}` : '-';

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Bem-vindo, {user?.name || 'usuário'} 👋</h1>
        <p className="mt-1 text-sm text-slate-600">Tudo pronto para ativar sua operação de agendamentos.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Setup inicial da sua empresa</h2>
        <p className="mt-1 text-sm text-slate-600">Siga estes passos para começar a receber agendamentos hoje.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-800">1) Crie seu primeiro serviço</p>
            <p className="mt-1 text-xs text-slate-600">Defina nome e duração para aparecer no agendamento público.</p>
            <div className="mt-3">
              <Button type="button" variant="ghost" disabled>
                Em breve
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-800">2) Configure sua disponibilidade</p>
            <p className="mt-1 text-xs text-slate-600">Escolha dias e horários para gerar janelas automáticas.</p>
            <div className="mt-3">
              <Button type="button" variant="ghost" disabled>
                Em breve
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-800">3) Compartilhe seu link</p>
            <p className="mt-1 text-xs text-slate-600">Use seu link público para receber agendamentos online.</p>
            {tenant?.slug ? (
              <a className="mt-3 block text-xs font-medium text-blue-700 hover:underline" href={publicLink} target="_blank" rel="noreferrer">
                Abrir {publicLink}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-700">
        <p>
          <strong>Empresa:</strong> {tenant?.name || '-'}
        </p>
        <p>
          <strong>company_id:</strong> {companyId || '-'}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || '-'}
        </p>
        <div className="mt-3">
          <Link to="/app/appointments" className="text-blue-700 hover:underline">
            Ir para agenda interna
          </Link>
        </div>
      </div>
    </section>
  );
}
