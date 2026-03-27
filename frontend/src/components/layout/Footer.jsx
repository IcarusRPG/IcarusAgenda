import { BrandLogo } from '../branding/BrandLogo';

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
      <span className="text-xs text-slate-500">Powered by</span>
      <BrandLogo className="h-6" />
    </footer>
  );
}
