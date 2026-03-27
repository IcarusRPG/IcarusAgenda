import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { useTenant } from '../../hooks/useTenant';
import { ICARUS_BRAND } from '../../config/constants';

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
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100" href="/app">
          Dashboard
        </a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100" href="#">
          Agendamentos
        </a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100" href="#">
          Serviços
        </a>
      </nav>
    </aside>
  );
}

function Header() {
  const { tenant } = useTenant();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <strong className="text-slate-800">{tenant?.name || 'Ambiente da Empresa'}</strong>
      <span className="text-sm text-slate-500">Painel interno</span>
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
