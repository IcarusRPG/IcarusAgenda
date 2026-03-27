import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Footer } from './Footer';
import { useTenant } from '../../hooks/useTenant';
import { ICARUS_BRAND } from '../../config/constants';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

function Sidebar() {
  const { tenant } = useTenant();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <div className="mb-8 flex items-center justify-center rounded-lg border border-dashed border-slate-300 p-4">
        <img
          src={tenant?.logoUrl || ICARUS_BRAND.defaultLogoUrl}
          alt={tenant?.name || 'Logo da empresa'}
          className="h-10 object-contain"
        />
      </div>
      <nav className="space-y-2 text-sm">
        <Link className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100" to="/app">
          Dashboard
        </Link>
        <Link className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100" to="/app/companies">
          Empresas
        </Link>
      </nav>
    </aside>
  );
}

function Header() {
  const navigate = useNavigate();
  const { tenant, setTenant } = useTenant();
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    signOut();
    setTenant(null);
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <strong className="block text-slate-800">{tenant?.name || 'Ambiente da Empresa'}</strong>
        <span className="text-xs text-slate-500">{user?.name || 'Usuário autenticado'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Painel interno</span>
        <Button variant="ghost" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
