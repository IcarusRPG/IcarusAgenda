import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTenant } from '../../hooks/useTenant';
import { createCompany, getCompanyById, updateCompany } from '../../services/companyService';

const STATUS_OPTIONS = ['active', 'inactive', 'suspended'];

export function CompanyFormPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { setTenant } = useTenant();

  const isEditMode = useMemo(() => Boolean(companyId), [companyId]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    timezone: 'America/Sao_Paulo',
    status: 'active',
    logo_url: '',
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCompany() {
      if (!isEditMode) {
        return;
      }

      try {
        const company = await getCompanyById(companyId);

        if (!active) {
          return;
        }

        setFormData({
          name: company.name || '',
          slug: company.slug || '',
          timezone: company.timezone || 'America/Sao_Paulo',
          status: company.status || 'active',
          logo_url: company.logo_url || '',
        });
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || 'Não foi possível carregar a empresa.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCompany();

    return () => {
      active = false;
    };
  }, [companyId, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const updated = await updateCompany(companyId, formData);

        setTenant((currentTenant) => {
          if (!currentTenant || currentTenant.id !== updated.id) {
            return currentTenant;
          }

          return {
            ...currentTenant,
            name: updated.name,
            slug: updated.slug,
            logoUrl: updated.logo_url || '',
            timezone: updated.timezone,
          };
        });
      } else {
        await createCompany(formData);
      }

      navigate('/app/companies');
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível salvar a empresa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando dados da empresa...</p>;
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{isEditMode ? 'Editar empresa' : 'Criar empresa'}</h1>
        <p className="text-sm text-slate-600">Informe os dados de branding e operação da empresa.</p>
      </div>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm text-slate-600">Nome</label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Slug</label>
          <Input name="slug" value={formData.slug} onChange={handleChange} required />
          <p className="mt-1 text-xs text-slate-500">Use apenas letras minúsculas, números e hífens.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Timezone</label>
          <Input name="timezone" value={formData.timezone} onChange={handleChange} required />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Logo URL</label>
          <Input name="logo_url" value={formData.logo_url} onChange={handleChange} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/app/companies')}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
