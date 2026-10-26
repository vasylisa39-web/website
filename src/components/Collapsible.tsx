import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Collapsible({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-navy-100 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-navy-50/50 transition-colors"
      >
        <span className="font-semibold text-navy-800 text-sm">{title}</span>
        <ChevronDown
          size={18}
          className={`text-navy-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-navy-600 leading-relaxed">{children}</div>}
    </div>
  );
}
