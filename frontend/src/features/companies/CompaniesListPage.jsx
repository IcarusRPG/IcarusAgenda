import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ICARUS_BRAND } from '../../config/constants';
import { listCompanies } from '../../services/companyService';

export function CompaniesListPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await listCompanies();

        if (active) {
          setItems(response.items || []);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || 'Não foi possível carregar as empresas.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Empresas</h1>
          <p className="text-sm text-slate-600">Gerencie dados de branding e configurações básicas.</p>
        </div>

        <Link to="/app/companies/new">
          <Button>Nova empresa</Button>
        </Link>
      </div>

      {isLoading ? <p className="text-sm text-slate-500">Carregando empresas...</p> : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((company) => (
          <article key={company.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={company.logo_url || ICARUS_BRAND.defaultLogoUrl}
                alt={company.name}
                className="h-9 w-9 rounded object-cover"
              />
              <div>
                <h2 className="font-medium text-slate-900">{company.name}</h2>
                <p className="text-xs text-slate-500">/{company.slug}</p>
              </div>
            </div>

            <div className="mb-4 space-y-1 text-sm text-slate-600">
              <p>
                <strong>Status:</strong> {company.status}
              </p>
              <p>
                <strong>Timezone:</strong> {company.timezone}
              </p>
            </div>

            <Link to={`/app/companies/${company.id}/edit`}>
              <Button variant="ghost">Editar</Button>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
