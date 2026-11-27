import { useState, useMemo } from 'react';
import { RotateCcw, ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
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
        {/* What are price controls & why they exist */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h2 className="font-display font-bold text-xl text-navy-900 mb-3">
              What Are Price Controls and Why Do They Exist?
            </h2>
            <p className="text-navy-700 leading-relaxed mb-4">
              The price of a product or service is not only determined by supply and demand. Sometimes
              governments, regulatory authorities, and industry organisations may set a maximum or
              minimum price. A <strong>price ceiling</strong> is when a maximum is set, and a
              <strong> price floor</strong> is when a minimum is set. In economics, we call this
              restriction a <strong>price control</strong> <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, p. 159)</span>. In this section, we explore price controls
              imposed by governments.
            </p>
            <p className="text-navy-700 leading-relaxed">
              So why do governments control the prices of products in a market? They do this in hopes
              of influencing market outcomes to <strong>protect consumers or producers</strong>.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Binding vs. Non-Binding</h3>
            <p className="text-sm text-navy-700 leading-relaxed mb-3">
              Price controls can either be <strong>binding</strong> or <strong>non-binding</strong>.
            </p>
            <div className="space-y-2">
              <div className="rounded-lg bg-error-400/10 px-3 py-2">
                <p className="text-sm text-navy-800"><strong>Binding</strong> — prevents the market from reaching its equilibrium price, directly affecting the market outcome.</p>
              </div>
              <div className="rounded-lg bg-navy-50 px-3 py-2">
                <p className="text-sm text-navy-800"><strong>Non-binding</strong> — the market still reaches equilibrium, so the outcome is unaffected <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 160-161)</span>.</p>
              </div>
            </div>
          </div>
        </div>

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
              <p className="text-sm text-navy-800"><strong>Binding</strong> when set below the equilibrium price → creates a shortage <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 159-160)</span>.</p>
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
              <p className="text-sm text-navy-800"><strong>Binding</strong> when set above the equilibrium price → creates a surplus <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 159, 161)</span>.</p>
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
              <li><strong>Rent control</strong> — caps on monthly rent in cities like New York and Stockholm. Designed to protect tenants, but can reduce new construction and maintenance when binding <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 159-161)</span>.</li>
              <li><strong>Price gouging laws</strong> — emergency caps on essentials like bottled water after disasters.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Real-World Floors</h3>
            <ul className="space-y-3 text-sm text-navy-700">
              <li><strong>Minimum wage</strong> — a floor on hourly wages. When above the market-clearing wage, it can create surplus labour (unemployment) in simple models <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, p. 19)</span>.</li>
              <li><strong>Agricultural price supports</strong> — governments guarantee minimum prices for crops, sometimes buying the surplus.</li>
            </ul>
          </div>
        </div>

        {/* Worked examples in detail */}
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Worked Examples in Detail</h2>
          <p className="text-navy-600 mb-6 max-w-3xl">Let's walk through the rent ceiling and minimum wage scenarios step by step.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 border-l-4 border-error-500">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownCircle size={22} className="text-error-500" />
                <h3 className="font-display font-bold text-lg text-navy-900">Price Ceiling: Rent in City A</h3>
              </div>
              <div className="space-y-3 text-sm text-navy-700 leading-relaxed">
                <p>
                  The equilibrium price for rent in City A is <strong>$1,500</strong> a month. The
                  government sets a price ceiling of <strong>$1,000</strong>.
                </p>
                <div className="rounded-lg bg-navy-50 px-4 py-3 space-y-1.5">
                  <p>1. At $1,000, more people want to rent properties → <strong>quantity demanded rises</strong>.</p>
                  <p>2. Some landlords withdraw from the rental market as it becomes less profitable → <strong>quantity supplied falls</strong>.</p>
                  <p>3. Quantity demanded exceeds quantity supplied → a <strong>shortage of rental housing</strong>.</p>
                </div>
                <p className="text-xs text-navy-500 italic">The ceiling is binding because $1,000 is below the $1,500 equilibrium.</p>
              </div>
            </div>

            <div className="card p-6 border-l-4 border-warning-500">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpCircle size={22} className="text-warning-500" />
                <h3 className="font-display font-bold text-lg text-navy-900">Price Floor: Wages in Country C</h3>
              </div>
              <div className="space-y-3 text-sm text-navy-700 leading-relaxed">
                <p>
                  The equilibrium wage in Country C is <strong>$10</strong> an hour. The government sets
                  a minimum wage (price floor) of <strong>$15</strong> an hour.
                </p>
                <div className="rounded-lg bg-navy-50 px-4 py-3 space-y-1.5">
                  <p>1. At $15, more people want to work → <strong>quantity supplied of labour rises</strong>.</p>
                  <p>2. Some companies reduce the number of workers they employ to cut costs → <strong>quantity demanded of labour falls</strong>.</p>
                  <p>3. Quantity supplied exceeds quantity demanded → a <strong>surplus of labour</strong> (unemployment).</p>
                </div>
                <p className="text-xs text-navy-500 italic">The floor is binding because $15 is above the $10 equilibrium.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Try it yourself */}
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-6">
          <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Try It Yourself</h3>
          <ul className="space-y-2 text-sm text-navy-700">
            <li>1. Select <strong>Price Ceiling</strong> and drag above equilibrium (${eq.price.toFixed(2)}). Notice it becomes non-binding.</li>
            <li>2. Drag the ceiling below equilibrium and watch the shortage grow as you lower it.</li>
            <li>3. Switch to <strong>Price Floor</strong> and drag below equilibrium — it does nothing (non-binding).</li>
            <li>4. Raise the floor above equilibrium and watch the surplus appear.</li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-navy-900">Common Mistakes</h3>
          <Collapsible title='"A price ceiling always lowers the price consumers pay."'>
            <p>Only if it is binding. A ceiling set above the equilibrium has no effect — the market already clears below it. The same logic applies to floors set below equilibrium <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 160-161)</span>.</p>
          </Collapsible>
          <Collapsible title='"Price controls are always bad / always good."'>
            <p>The basic model shows shortages and surpluses, but real outcomes depend on market conditions, policy design, and goals. Economists debate trade-offs; the model helps you see them, not settle the debate <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 161-163)</span>.</p>
          </Collapsible>
        </div>

        <KeyTakeaway>
          A price ceiling binds only below equilibrium and creates a shortage; a price floor binds only above equilibrium and creates a surplus. Non-binding controls leave the market outcome unchanged. Real-world effects depend on design and context <span className="text-navy-400">(Mankiw &amp; Taylor, 2020, pp. 160-163)</span>.
        </KeyTakeaway>

        {/* References */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={20} className="text-navy-700" />
            <h2 className="text-xl font-extrabold text-navy-900">References</h2>
          </div>
          <ol className="space-y-4 text-sm text-navy-700 leading-relaxed list-decimal pl-5">
            <li>
              <p>
                Mankiw, N. G., &amp; Taylor, M. P. (2020). <em>Economics</em> (5th ed.). Cengage Learning.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
