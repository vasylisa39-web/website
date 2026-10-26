import { useState, useMemo } from 'react';
import { RotateCcw, ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SupplyDemandGraph from '@/components/SupplyDemandGraph';
import Collapsible from '@/components/Collapsible';
import KeyTakeaway from '@/components/KeyTakeaway';
import {
  DEFAULT_DEMAND,
  DEFAULT_SUPPLY,
  calcEquilibrium,
  calcPriceControl,
  round,
} from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

export default function PriceControlsPage({ onNavigate }: Props) {
  const [kind, setKind] = useState<'ceiling' | 'floor'>('ceiling');
  const [controlledPrice, setControlledPrice] = useState(4);

  const demand = DEFAULT_DEMAND;
  const supply = DEFAULT_SUPPLY;
  const eq = useMemo(() => calcEquilibrium(demand, supply), [demand, supply]);
  const result = useMemo(
    () => calcPriceControl(demand, supply, eq.price, controlledPrice, kind),
    [demand, supply, eq, controlledPrice, kind]
  );

  const reset = () => {
    setKind('ceiling');
    setControlledPrice(4);
  };

  const switchKind = (k: 'ceiling' | 'floor') => {
    setKind(k);
    // set a sensible default that's binding
    setControlledPrice(k === 'ceiling' ? round(eq.price - 2) : round(eq.price + 2));
  };

  const bindingInfo = useMemo(() => {
    if (!result.isBinding) {
      return {
        icon: <CheckCircle2 size={20} className="text-navy-500" />,
        title: 'Non-binding control',
        text: `The ${kind} at $${controlledPrice.toFixed(2)} does not constrain the market. Equilibrium remains at $${eq.price.toFixed(2)} and ${eq.quantity.toFixed(1)} units. The control has no effect on the market outcome in this model.`,
        color: 'navy',
      };
    }
    if (result.type === 'shortage') {
      return {
        icon: <AlertTriangle size={20} className="text-error-500" />,
        title: 'Binding ceiling → Shortage',
        text: `The ceiling at $${controlledPrice.toFixed(2)} is below equilibrium. Buyers demand ${result.qd.toFixed(1)} units but sellers only supply ${result.qs.toFixed(1)} units, creating a shortage of ${result.imbalance.toFixed(1)} units.`,
        color: 'error',
      };
    }
    if (result.type === 'surplus') {
      return {
        icon: <AlertTriangle size={20} className="text-warning-500" />,
        title: 'Binding floor → Surplus',
        text: `The floor at $${controlledPrice.toFixed(2)} is above equilibrium. Sellers supply ${result.qs.toFixed(1)} units but buyers only demand ${result.qd.toFixed(1)} units, creating a surplus of ${Math.abs(result.imbalance).toFixed(1)} units.`,
        color: 'warning',
      };
    }
    return { icon: <CheckCircle2 size={20} className="text-success-600" />, title: '', text: '', color: 'success' };
  }, [result, kind, controlledPrice, eq]);

  const sliderMin = 2;
  const sliderMax = 10;

  return (
    <>
      <PageHeader
        eyebrow="Topic 4 · Intervention"
        title="Price Controls"
        subtitle="Governments sometimes set legal limits on prices. Explore when ceilings and floors actually bind — and when they quietly do nothing at all."
        next={{ id: 'quiz', label: 'Take the Quiz' }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Definitions */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 border-l-4 border-error-500">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle size={22} className="text-error-500" />
              <h3 className="font-display font-bold text-xl text-navy-900">Price Ceiling</h3>
            </div>
            <p className="text-navy-700 leading-relaxed mb-3">
              A legal <strong>maximum</strong> price. Sellers cannot charge more than this amount.
            </p>
            <div className="definition">
              <p className="text-sm text-navy-800"><strong>Binding</strong> when set below the equilibrium price → creates a shortage.</p>
            </div>
          </div>
          <div className="card p-6 border-l-4 border-warning-500">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle size={22} className="text-warning-500" />
              <h3 className="font-display font-bold text-xl text-navy-900">Price Floor</h3>
            </div>
            <p className="text-navy-700 leading-relaxed mb-3">
              A legal <strong>minimum</strong> price. Sellers cannot charge less than this amount.
            </p>
            <div className="definition">
              <p className="text-sm text-navy-800"><strong>Binding</strong> when set above the equilibrium price → creates a surplus.</p>
            </div>
          </div>
        </div>

        {/* Simulator */}
        <div className="card p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-extrabold text-navy-900">Price Control Simulator</h2>
            <button onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors">
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => switchKind('ceiling')}
              className={`flex-1 rounded-xl px-4 py-3 font-semibold text-sm transition-all ${
                kind === 'ceiling' ? 'bg-error-500 text-white shadow-md' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              <ArrowDownCircle size={18} className="inline mr-2" /> Price Ceiling
            </button>
            <button
              onClick={() => switchKind('floor')}
              className={`flex-1 rounded-xl px-4 py-3 font-semibold text-sm transition-all ${
                kind === 'floor' ? 'bg-warning-500 text-white shadow-md' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              <ArrowUpCircle size={18} className="inline mr-2" /> Price Floor
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <SupplyDemandGraph
                demand={demand}
                supply={supply}
                equilibrium={eq}
                controlledPrice={controlledPrice}
                kind={kind}
                showImbalance
              />
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-navy-900">
                    {kind === 'ceiling' ? 'Ceiling Price' : 'Floor Price'}
                  </span>
                  <span className="text-lg font-bold text-navy-900">${controlledPrice.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  step="0.05"
                  value={controlledPrice}
                  onChange={(e) => setControlledPrice(Number(e.target.value))}
                  className={kind === 'ceiling' ? 'range-price w-full' : 'range-supply w-full'}
                />
                <div className="flex justify-between text-xs text-navy-400 mt-1">
                  <span>${sliderMin.toFixed(2)}</span>
                  <span className="text-success-600 font-semibold">Eq: ${eq.price.toFixed(2)}</span>
                  <span>${sliderMax.toFixed(2)}</span>
                </div>
              </div>

              {/* Binding indicator */}
              <div className={`rounded-xl p-4 border-l-4 ${
                bindingInfo.color === 'error' ? 'border-error-500 bg-error-400/10' :
                bindingInfo.color === 'warning' ? 'border-warning-500 bg-warning-400/10' :
                'border-navy-400 bg-navy-50'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {bindingInfo.icon}
                  <h4 className="font-bold text-navy-900">{bindingInfo.title}</h4>
                </div>
                <p className="text-sm text-navy-700 leading-relaxed">{bindingInfo.text}</p>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-demand-500/5 border border-demand-500/20 px-4 py-3">
                  <p className="text-xs text-demand-600 font-semibold uppercase">Qty Demanded</p>
                  <p className="text-xl font-bold text-navy-900">{result.qd.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-supply-500/5 border border-supply-500/20 px-4 py-3">
                  <p className="text-xs text-supply-600 font-semibold uppercase">Qty Supplied</p>
                  <p className="text-xl font-bold text-navy-900">{result.qs.toFixed(1)}</p>
                </div>
              </div>

              {result.isBinding && (
                <div className={`rounded-lg px-4 py-3 text-center ${result.type === 'shortage' ? 'bg-error-400/10' : 'bg-warning-400/10'}`}>
                  <p className="text-xs text-navy-500 font-semibold uppercase">
                    {result.type === 'shortage' ? 'Shortage' : 'Surplus'}
                  </p>
                  <p className={`text-2xl font-bold ${result.type === 'shortage' ? 'text-error-500' : 'text-warning-500'}`}>
                    {Math.abs(result.imbalance).toFixed(1)} units
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-world examples */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Real-World Ceilings</h3>
            <ul className="space-y-3 text-sm text-navy-700">
              <li><strong>Rent control</strong> — caps on monthly rent in cities like New York and Stockholm. Designed to protect tenants, but can reduce new construction and maintenance when binding.</li>
              <li><strong>Price gouging laws</strong> — emergency caps on essentials like bottled water after disasters.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Real-World Floors</h3>
            <ul className="space-y-3 text-sm text-navy-700">
              <li><strong>Minimum wage</strong> — a floor on hourly wages. When above the market-clearing wage, it can create surplus labour (unemployment) in simple models.</li>
              <li><strong>Agricultural price supports</strong> — governments guarantee minimum prices for crops, sometimes buying the surplus.</li>
            </ul>
          </div>
        </div>

        {/* Try it yourself */}
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-6">
          <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Try It Yourself</h3>
          <ul className="space-y-2 text-sm text-navy-700">
            <li>1. Select <strong>Price Ceiling</strong> and drag above equilibrium ($${eq.price.toFixed(2)}). Notice it becomes non-binding.</li>
            <li>2. Drag the ceiling below equilibrium and watch the shortage grow as you lower it.</li>
            <li>3. Switch to <strong>Price Floor</strong> and drag below equilibrium — it does nothing (non-binding).</li>
            <li>4. Raise the floor above equilibrium and watch the surplus appear.</li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-navy-900">Common Mistakes</h3>
          <Collapsible title='"A price ceiling always lowers the price consumers pay."'>
            <p>Only if it is binding. A ceiling set above the equilibrium has no effect — the market already clears below it. The same logic applies to floors set below equilibrium.</p>
          </Collapsible>
          <Collapsible title='"Price controls are always bad / always good."'>
            <p>The basic model shows shortages and surpluses, but real outcomes depend on market conditions, policy design, and goals. Economists debate trade-offs; the model helps you see them, not settle the debate.</p>
          </Collapsible>
        </div>

        <KeyTakeaway>
          A price ceiling binds only below equilibrium and creates a shortage; a price floor binds only above equilibrium and creates a surplus. Non-binding controls leave the market outcome unchanged. Real-world effects depend on design and context.
        </KeyTakeaway>
      </div>
    </>
  );
}
