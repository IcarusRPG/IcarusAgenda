export function Button({ children, variant = 'primary', ...props }) {
  const base = 'rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  };

  return (
    <button {...props} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
