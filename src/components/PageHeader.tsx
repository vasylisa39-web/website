import type { ReactNode } from 'react';
import type { PageId } from './Navbar';
import { ArrowRight } from 'lucide-react';

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  next?: { id: PageId; label: string };
  onNavigate: (page: PageId) => void;
}

export default function PageHeader({ eyebrow, title, subtitle, children, next, onNavigate }: Props) {
  return (
    <div className="pt-24 pb-8 bg-gradient-to-b from-navy-50/60 to-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="label-tag bg-navy-100 text-navy-700 mb-4">{eyebrow}</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 mb-4 leading-tight">{title}</h1>
        <p className="text-lg text-navy-600 leading-relaxed max-w-2xl mb-6">{subtitle}</p>
        {children}
        {next && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                onNavigate(next.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors group"
            >
              Next: {next.label}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
