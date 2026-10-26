import { FlaskConical } from 'lucide-react';
import type { PageId } from './Navbar';

interface Props {
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

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-navy-900 text-cream-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-cream-50 text-navy-900">
                <FlaskConical size={20} />
              </span>
              <span className="font-display font-extrabold text-lg">The Market Lab</span>
            </div>
            <p className="text-sm text-cream-100/70 max-w-xs">
              An interactive economics laboratory. Experiment with markets, discover how prices
              emerge, and learn the forces that shape the world around you.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-100/60 mb-3">Explore</h3>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => {
                      onNavigate(l.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm text-cream-100/80 hover:text-cream-50 hover:underline transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-100/60 mb-3">About</h3>
            <p className="text-sm text-cream-100/70">
              Built for students of microeconomics. All calculations use linear supply and demand
              models for clarity and are illustrative, not real market data.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-700 text-center text-xs text-cream-100/50">
          The Market Lab — An educational project. Economic models are simplified for learning.
        </div>
      </div>
    </footer>
  );
}
