import { changeAppointmentStatus, editAppointment, getCompanyAppointmentsCalendar } from '../modules/appointments/appointmentService.js';

function isDbNotConfigured(error) {
  return error.message.includes('DATABASE_URL não configurada');
}

export async function listAppointmentsController(req, res, next) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const view = req.query.view || 'day';

    const data = await getCompanyAppointmentsCalendar({
      companyId: req.tenant.companyId,
      date,
      view,
    });

    return res.json(data);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}

export async function updateAppointmentStatusController(req, res, next) {
  try {
    const updated = await changeAppointmentStatus({
      companyId: req.tenant.companyId,
      appointmentId: req.params.id,
      status: req.body.status,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    return res.json(updated);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}

export async function updateAppointmentController(req, res, next) {
  try {
    const updated = await editAppointment({
      companyId: req.tenant.companyId,
      appointmentId: req.params.id,
      payload: req.body,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    return res.json(updated);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}
