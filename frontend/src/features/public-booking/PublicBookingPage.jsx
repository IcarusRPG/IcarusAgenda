import { useParams } from 'react-router-dom';

export function PublicBookingPage() {
  const { companySlug } = useParams();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">Agendamento Público</h1>
      <p className="mb-6 text-slate-600">
        Página pública preparada para o slug da empresa: <strong>{companySlug}</strong>
      </p>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Estrutura inicial pronta para evoluir o fluxo de agendamento (serviços, horários e confirmação).
      </div>
    </section>
  );
}
