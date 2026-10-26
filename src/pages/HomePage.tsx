import type { PageId } from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TopicCardGrid from '@/components/TopicCard';
import { Home, Coffee, Music, Fuel, ShoppingCart } from 'lucide-react';

interface Props {
  onNavigate: (page: PageId) => void;
}

const EXAMPLES = [
  { icon: Home, title: 'Housing', text: 'Rent controls keep some rents affordable, but can reduce available housing when the ceiling binds below market rent.' },
  { icon: Coffee, title: 'Coffee', text: 'A poor harvest shifts supply left, raising prices — your morning espresso costs more because of a frost in Brazil.' },
  { icon: Music, title: 'Concert Tickets', text: 'High demand and limited seats create shortages at face value, which is why popular shows sell out in minutes.' },
  { icon: Fuel, title: 'Fuel', text: 'Gasoline demand is inelastic in the short run — even big price jumps barely reduce how much people drive.' },
  { icon: ShoppingCart, title: 'Groceries', text: 'When incomes rise, demand for premium products shifts right; budget brands lose ground as shoppers upgrade.' },
];

export default function HomePage({ onNavigate }: Props) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <TopicCardGrid onNavigate={onNavigate} />

      {/* Why this matters */}
      <section className="py-16 lg:py-20 bg-white border-y border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="label-tag bg-demand-500/10 text-demand-600 mb-4">Why This Matters</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">Economics Is Everywhere</h2>
            <p className="text-navy-600 max-w-2xl mx-auto">
              These ideas are not abstract — they explain the prices you pay, the shortages you see,
              and the choices governments make every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {EXAMPLES.map((ex) => {
              const Icon = ex.icon;
              return (
                <div key={ex.title} className="rounded-xl border border-navy-100 p-5 hover:shadow-card transition-shadow">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-supply-500/10 text-supply-600 mb-3">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-bold text-navy-900 mb-2">{ex.title}</h3>
                  <p className="text-sm text-navy-600 leading-relaxed">{ex.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-navy-900 px-8 py-12 text-center">
            <h2 className="text-3xl font-extrabold text-cream-50 mb-4">Ready to test your understanding?</h2>
            <p className="text-cream-100/70 mb-6 max-w-xl mx-auto">
              Twelve questions across all four topics — with graphs, scenarios, and instant explanations.
            </p>
            <button onClick={() => onNavigate('quiz')} className="btn-accent">
              Take the Quiz
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
