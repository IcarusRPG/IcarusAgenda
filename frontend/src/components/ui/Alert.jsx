export function Alert({ type = 'info', children }) {
  const tone = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
  };

  return <div className={`rounded-lg border px-3 py-2 text-sm ${tone[type]}`}>{children}</div>;
}
