import { useState, useEffect } from 'react';
import { Menu, X, FlaskConical } from 'lucide-react';

export type PageId =
  | 'home'
  | 'supply-demand'
  | 'equilibrium'
  | 'elasticity'
  | 'price-controls'
  | 'quiz';

interface Props {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

const LINKS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'supply-demand', label: 'Supply & Demand' },
  { id: 'equilibrium', label: 'Equilibrium' },
  { id: 'elasticity', label: 'Elasticity' },
  { id: 'price-controls', label: 'Price Controls' },
  { id: 'quiz', label: 'Quiz' },
];

export default function Navbar({ current, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: PageId) => {
    onNavigate(id);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-navy-100' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-navy-900 text-cream-50 group-hover:bg-navy-800 transition-colors">
            <FlaskConical size={20} />
          </span>
          <span className="font-display font-extrabold text-lg text-navy-900">The Market Lab</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                current === link.id
                  ? 'bg-navy-900 text-cream-50'
                  : 'text-navy-700 hover:bg-navy-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg text-navy-800 hover:bg-navy-100"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-cream-50 border-b border-navy-100 shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-1">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-4 py-2.5 rounded-lg text-left text-sm font-semibold transition-all ${
                  current === link.id
                    ? 'bg-navy-900 text-cream-50'
                    : 'text-navy-700 hover:bg-navy-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
