import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/branding/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { getCurrentCompany, login } from '../../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { setTenant } = useTenant();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const authResponse = await login({ email, password });
      const company = await getCurrentCompany(authResponse.token);

      const nextUser = {
        id: authResponse.user_id,
        companyId: authResponse.company_id,
        name: authResponse.name,
        role: authResponse.role,
      };

      const nextTenant = {
        id: company.id,
        slug: company.slug,
        name: company.name,
        logoUrl: company.logo_url || authResponse.company?.logoUrl || '',
        timezone: company.timezone || authResponse.company?.timezone || '',
      };

      signIn({
        nextToken: authResponse.token,
        nextUser,
        nextTenant,
      });

      setTenant(nextTenant);
      navigate('/app');
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível autenticar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <BrandLogo className="h-12" />
        </div>

        <h1 className="mb-1 text-center text-xl font-semibold text-slate-800">Entrar na sua conta</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Login único do Icarus Agenda</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">E-mail</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Senha</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
