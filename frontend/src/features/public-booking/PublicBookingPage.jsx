import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ICARUS_BRAND } from '../../config/constants';
import {
  createPublicAppointment,
  getPublicAvailability,
  getPublicCompany,
  getPublicServices,
} from '../../services/publicBookingService';

function formatDateToInput(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function formatSlot(isoString) {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function PublicBookingPage() {
  const { companySlug } = useParams();

  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDateToInput());
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [companyData, servicesData] = await Promise.all([
          getPublicCompany(companySlug),
          getPublicServices(companySlug),
        ]);

        if (!active) {
          return;
        }

        setCompany(companyData);
        const activeServices = servicesData.services || [];
        setServices(activeServices);

        if (activeServices.length > 0) {
          setSelectedServiceId(activeServices[0].id);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || 'Não foi possível carregar dados da empresa.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      active = false;
    };
  }, [companySlug]);

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      if (!selectedServiceId || !selectedDate) {
        setAvailability([]);
        return;
      }

      try {
        setErrorMessage('');

        const data = await getPublicAvailability({
          slug: companySlug,
          serviceId: selectedServiceId,
          date: selectedDate,
        });

        if (!active) {
          return;
        }

        setAvailability(data.slots || []);
        setSelectedSlot(null);
      } catch (error) {
        if (active) {
          setAvailability([]);
          setErrorMessage(error.message || 'Não foi possível carregar horários disponíveis.');
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, [companySlug, selectedDate, selectedServiceId]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || null,
    [selectedServiceId, services],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedService || !selectedSlot) {
      setErrorMessage('Selecione serviço e horário antes de confirmar.');
      return;
    }

    try {
      setIsSubmitting(true);

      await createPublicAppointment({
        company_slug: companySlug,
        service_id: selectedService.id,
        customer_name: customerName,
        customer_email: customerEmail,
        scheduled_start: selectedSlot.scheduled_start,
        scheduled_end: selectedSlot.scheduled_end,
      });

      setSuccessMessage('Agendamento solicitado com sucesso! Em breve você receberá confirmação.');
      setCustomerName('');
      setCustomerEmail('');
      setSelectedSlot(null);

      const refreshed = await getPublicAvailability({
        slug: companySlug,
        serviceId: selectedService.id,
        date: selectedDate,
      });

      setAvailability(refreshed.slots || []);
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível concluir o agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <section className="mx-auto max-w-4xl px-4 py-12 text-sm text-slate-500">Carregando...</section>;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={company?.logo_url || ICARUS_BRAND.defaultLogoUrl}
            alt={company?.name || 'Logo da empresa'}
            className="h-14 w-14 rounded object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{company?.name || 'Empresa'}</h1>
            <p className="text-sm text-slate-600">Selecione serviço, data e horário para agendar.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Serviço</label>
            <select
              value={selectedServiceId}
              onChange={(event) => setSelectedServiceId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Data</label>
            <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} required />
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-600">Horários disponíveis</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availability.map((slot) => {
                const isActive = selectedSlot?.scheduled_start === slot.scheduled_start;

                return (
                  <button
                    key={slot.scheduled_start}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded border px-3 py-2 text-sm ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {formatSlot(slot.scheduled_start)}
                  </button>
                );
              })}
            </div>
            {availability.length === 0 ? <p className="mt-2 text-xs text-slate-500">Sem horários para esta data.</p> : null}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Seu nome</label>
            <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Seu e-mail</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              required
            />
          </div>

          {selectedService ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p>
                <strong>Serviço:</strong> {selectedService.name}
              </p>
              <p>
                <strong>Duração:</strong> {selectedService.duration_minutes} min
              </p>
              <p>
                <strong>Horário:</strong>{' '}
                {selectedSlot ? `${formatSlot(selectedSlot.scheduled_start)} (${selectedDate})` : 'Não selecionado'}
              </p>
            </div>
          ) : null}

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

          <Button type="submit" disabled={isSubmitting || !selectedService || !selectedSlot}>
            {isSubmitting ? 'Confirmando...' : 'Confirmar agendamento'}
          </Button>
        </div>
      </form>
    </section>
  );
}
