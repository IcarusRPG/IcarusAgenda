import { Button } from '../ui/Button';

function shiftDate(date, offsetDays) {
  const parsed = new Date(`${date}T00:00:00`);
  parsed.setDate(parsed.getDate() + offsetDays);
  return parsed.toISOString().slice(0, 10);
}

export function CalendarToolbar({ date, view, onDateChange, onViewChange }) {
  const step = view === 'week' ? 7 : 1;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
      <Button type="button" variant="ghost" onClick={() => onDateChange(shiftDate(date, -step))}>
        ← Anterior
      </Button>

      <input
        type="date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      <Button type="button" variant="ghost" onClick={() => onDateChange(shiftDate(date, step))}>
        Próximo →
      </Button>

      <div className="ml-auto flex gap-2">
        <Button type="button" variant={view === 'day' ? 'primary' : 'ghost'} onClick={() => onViewChange('day')}>
          Dia
        </Button>
        <Button type="button" variant={view === 'week' ? 'primary' : 'ghost'} onClick={() => onViewChange('week')}>
          Semana
        </Button>
      </div>
    </div>
  );
}
