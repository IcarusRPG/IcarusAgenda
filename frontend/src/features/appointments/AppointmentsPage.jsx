import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppointmentCard } from '../../components/calendar/AppointmentCard';
import { CalendarToolbar } from '../../components/calendar/CalendarToolbar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTenant } from '../../hooks/useTenant';
import { getAppointments, updateAppointment, updateAppointmentStatus } from '../../services/appointmentService';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/LoadingState';

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export function AppointmentsPage() {
  const { tenant } = useTenant();
  const [date, setDate] = useState(todayInput());
  const [view, setView] = useState('day');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editing, setEditing] = useState(null);

  const timezone = useMemo(() => tenant?.timezone || 'UTC', [tenant?.timezone]);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await getAppointments({ date, view });
      setItems(response.items || []);
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível carregar agendamentos.');
    } finally {
      setIsLoading(false);
    }
  }, [date, view]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleChangeStatus = async (appointmentId, status) => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      await updateAppointmentStatus(appointmentId, status);
      await loadAppointments();
      setSuccessMessage(`Agendamento atualizado para ${status}.`);
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível alterar status.');
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    try {
      setSuccessMessage('');
      setErrorMessage('');
      await updateAppointment(editing.id, {
        customer_name: editing.customer_name,
        customer_email: editing.customer_email,
        scheduled_start: editing.scheduled_start,
        scheduled_end: editing.scheduled_end,
        notes: editing.notes,
      });
      setEditing(null);
      await loadAppointments();
      setSuccessMessage('Agendamento editado com sucesso.');
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível editar agendamento.');
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Agenda da empresa</h1>
        <p className="mt-1 text-sm text-slate-600">Visualize por dia/semana e gerencie confirmações, cancelamentos e edições.</p>
      </div>

      <CalendarToolbar date={date} view={view} onDateChange={setDate} onViewChange={setView} />

      {errorMessage ? <Alert type="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert type="success">{successMessage}</Alert> : null}

      {editing ? (
        <form onSubmit={handleSaveEdit} className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h2 className="font-medium text-slate-900">Editar agendamento</h2>
          <Input
            value={editing.customer_name}
            onChange={(event) => setEditing((current) => ({ ...current, customer_name: event.target.value }))}
          />
          <Input
            type="email"
            value={editing.customer_email || ''}
            onChange={(event) => setEditing((current) => ({ ...current, customer_email: event.target.value }))}
          />
          <Input
            type="datetime-local"
            value={editing.scheduled_start.slice(0, 16)}
            onChange={(event) =>
              setEditing((current) => ({
                ...current,
                scheduled_start: new Date(event.target.value).toISOString(),
              }))
            }
          />
          <Input
            type="datetime-local"
            value={editing.scheduled_end.slice(0, 16)}
            onChange={(event) =>
              setEditing((current) => ({
                ...current,
                scheduled_end: new Date(event.target.value).toISOString(),
              }))
            }
          />
          <div className="flex gap-2">
            <Button type="submit">Salvar alterações</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancelar edição
            </Button>
          </div>
        </form>
      ) : null}

      {isLoading ? <LoadingState label="Carregando agenda..." /> : null}

      {!isLoading && items.length === 0 ? (
        <EmptyState
          title="Nenhum agendamento encontrado"
          description="Não há registros para o período selecionado. Tente outro dia/semana ou compartilhe seu link de booking público."
        />
      ) : null}

      <div className="grid gap-3">
        {items.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            timezone={timezone}
            onConfirm={(id) => handleChangeStatus(id, 'confirmed')}
            onCancel={(id) => handleChangeStatus(id, 'cancelled')}
            onEdit={setEditing}
          />
        ))}
      </div>
    </section>
  );
}
