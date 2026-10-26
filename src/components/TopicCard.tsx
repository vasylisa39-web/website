import { TrendingUp, Scale, Activity, Gauge, ArrowRight } from 'lucide-react';
import type { PageId } from './Navbar';

interface Props {
  onNavigate: (page: PageId) => void;
}

const CARDS = [
  {
    id: 'supply-demand' as PageId,
    title: 'Supply & Demand',
    desc: 'The foundational laws of markets — how buyers and sellers together shape every price.',
    icon: TrendingUp,
    color: 'demand',
    graph: 'demand-supply',
  },
  {
    id: 'equilibrium' as PageId,
    title: 'Market Equilibrium',
    desc: 'Where supply meets demand, and how shortages and surpluses pull prices back to balance.',
    icon: Scale,
    color: 'success',
    graph: 'intersection',
  },
  {
    id: 'elasticity' as PageId,
    title: 'Price Elasticity',
    desc: 'How strongly buyers respond to price changes — elastic, inelastic, or somewhere between.',
    icon: Gauge,
    color: 'supply',
    graph: 'elasticity',
  },
  {
    id: 'price-controls' as PageId,
    title: 'Price Controls',
    desc: 'Government ceilings and floors — when they bind, when they do not, and what happens next.',
    icon: Activity,
    color: 'navy',
    graph: 'controls',
  },
];

function MiniGraph({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-24">
      {type === 'demand-supply' && (
        <>
          <line x1="15" y1="20" x2="105" y2="65" stroke="#3b6fd6" strokeWidth="2.5" />
          <line x1="15" y1="60" x2="105" y2="25" stroke="#d97026" strokeWidth="2.5" />
          <text x="100" y="62" fontSize="9" fill="#2a54b0" fontWeight="800">D</text>
          <text x="100" y="22" fontSize="9" fill="#b3561b" fontWeight="800">S</text>
        </>
      )}
      {type === 'intersection' && (
        <>
          <line x1="15" y1="18" x2="105" y2="68" stroke="#3b6fd6" strokeWidth="2.5" />
          <line x1="15" y1="62" x2="105" y2="22" stroke="#d97026" strokeWidth="2.5" />
          <circle cx="60" cy="40" r="4" fill="#3da561" stroke="white" strokeWidth="1.5" />
        </>
      )}
      {type === 'elasticity' && (
        <>
          <line x1="15" y1="65" x2="105" y2="20" stroke="#3b6fd6" strokeWidth="2.5" />
          <line x1="15" y1="55" x2="105" y2="35" stroke="#3b6fd6" strokeWidth="2.5" opacity="0.4" />
          <text x="98" y="18" fontSize="8" fill="#2a54b0" fontWeight="700">E</text>
          <text x="98" y="33" fontSize="8" fill="#2a54b0" fontWeight="700">I</text>
        </>
      )}
      {type === 'controls' && (
        <>
          <line x1="15" y1="20" x2="105" y2="65" stroke="#3b6fd6" strokeWidth="2.5" />
          <line x1="15" y1="60" x2="105" y2="25" stroke="#d97026" strokeWidth="2.5" />
          <line x1="15" y1="35" x2="105" y2="35" stroke="#d9523a" strokeWidth="2" strokeDasharray="4 3" />
        </>
      )}
    </svg>
  );
}

export default function TopicCardGrid({ onNavigate }: Props) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="label-tag bg-supply-500/10 text-supply-600 mb-4">Core Topics</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">Four Ideas. One Market.</h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Each topic combines clear explanations with live, interactive graphs. Drag sliders,
            change prices, and watch the market respond.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => {
                  onNavigate(card.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="card p-6 text-left group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-navy-50 text-navy-800 group-hover:bg-navy-900 group-hover:text-cream-50 transition-colors">
                    <Icon size={22} />
                  </span>
                  <ArrowRight size={18} className="text-navy-300 group-hover:text-navy-700 group-hover:translate-x-1 transition-all" />
                </div>
                <MiniGraph type={card.graph} />
                <h3 className="font-display font-bold text-lg text-navy-900 mt-4 mb-2">{card.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{card.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
