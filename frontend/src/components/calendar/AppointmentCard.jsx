import { Button } from '../ui/Button';

function formatInTimezone(isoDate, timezone) {
  return new Date(isoDate).toLocaleString('pt-BR', {
    timeZone: timezone || 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}

export function AppointmentCard({ appointment, timezone, onConfirm, onCancel, onEdit }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-900">{appointment.customer_name}</h3>
          <p className="text-xs text-slate-500">{appointment.customer_email}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{appointment.status}</span>
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        <p>
          <strong>Serviço:</strong> {appointment.service_name || appointment.service_id}
        </p>
        <p>
          <strong>Início:</strong> {formatInTimezone(appointment.scheduled_start, timezone)}
        </p>
        <p>
          <strong>Fim:</strong> {formatInTimezone(appointment.scheduled_end, timezone)}
        </p>
        <p>
          <strong>Origem:</strong> {appointment.source}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="ghost" onClick={() => onEdit(appointment)}>
          Editar
        </Button>
        <Button type="button" onClick={() => onConfirm(appointment.id)}>
          Confirmar
        </Button>
        <Button type="button" variant="ghost" onClick={() => onCancel(appointment.id)}>
          Cancelar
        </Button>
      </div>
    </article>
  );
}
