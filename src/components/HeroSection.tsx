import { ArrowRight, BookOpen } from 'lucide-react';
import type { PageId } from './Navbar';
import SupplyDemandGraph from './SupplyDemandGraph';
import { DEFAULT_DEMAND, DEFAULT_SUPPLY, calcEquilibrium } from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

export default function HeroSection({ onNavigate }: Props) {
  const eq = calcEquilibrium(DEFAULT_DEMAND, DEFAULT_SUPPLY);
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-demand-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-supply-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="animate-fade-in-up">
          <span className="label-tag bg-navy-100 text-navy-700 mb-5">Interactive Microeconomics</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-[1.1] mb-6">
            Understand Markets.<br />
            <span className="text-supply-500">Experiment with Economics.</span>
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed mb-8 max-w-lg">
            Explore how prices are determined, discover why markets change, and experiment with the
            economic forces shaping the world around you.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNavigate('supply-demand')} className="btn-accent group">
              Explore the Market
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => onNavigate('supply-demand')} className="btn-secondary group">
              <BookOpen size={18} />
              Start Learning
            </button>
          </div>
        </div>

        {/* Mini interactive graph */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="card p-6 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-navy-900">Live Market</h3>
              <span className="label-tag bg-success-400/15 text-success-600">Equilibrium</span>
            </div>
            <SupplyDemandGraph
              demand={DEFAULT_DEMAND}
              supply={DEFAULT_SUPPLY}
              equilibrium={eq}
              compact
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-lg bg-navy-50 px-4 py-3">
                <p className="text-xs text-navy-500 font-semibold uppercase tracking-wide">Equilibrium Price</p>
                <p className="text-xl font-bold text-navy-900">${eq.price.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-navy-50 px-4 py-3">
                <p className="text-xs text-navy-500 font-semibold uppercase tracking-wide">Equilibrium Quantity</p>
                <p className="text-xl font-bold text-navy-900">{eq.quantity.toFixed(1)} units</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
