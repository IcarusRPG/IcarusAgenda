import {
  createPublicAppointmentFromBooking,
  getPublicAvailabilityByCompanySlug,
  getPublicCompanyBySlug,
  getPublicServicesByCompanySlug,
} from '../modules/public/publicBookingService.js';

function isDbNotConfigured(error) {
  return error.message.includes('DATABASE_URL não configurada');
}

export async function getPublicCompanyController(req, res, next) {
  try {
    const company = await getPublicCompanyBySlug(req.params.slug);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada.',
      });
    }

    return res.json(company);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}

export async function getPublicServicesController(req, res, next) {
  try {
    const data = await getPublicServicesByCompanySlug(req.params.slug);

    if (!data) {
      return res.status(404).json({
        message: 'Empresa não encontrada.',
      });
    }

    return res.json(data);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}

export async function getPublicAvailabilityController(req, res, next) {
  try {
    const data = await getPublicAvailabilityByCompanySlug({
      slug: req.params.slug,
      serviceId: req.query.serviceId,
      date: req.query.date,
    });

    if (!data) {
      return res.status(404).json({
        message: 'Empresa não encontrada.',
      });
    }

    return res.json(data);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}

export async function createPublicAppointmentController(req, res, next) {
  try {
    const appointment = await createPublicAppointmentFromBooking(req.body);
    return res.status(201).json(appointment);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({ message: 'Banco de dados não configurado.' });
    }

    return next(error);
  }
}
