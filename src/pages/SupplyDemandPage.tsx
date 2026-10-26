import { useState, useMemo } from 'react';
import { RotateCcw, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SupplyDemandGraph from '@/components/SupplyDemandGraph';
import Collapsible from '@/components/Collapsible';
import KeyTakeaway from '@/components/KeyTakeaway';
import {
  DEFAULT_DEMAND,
  DEFAULT_SUPPLY,
  LinearCurve,
  calcEquilibrium,
  round,
} from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

// Slider range: -5 to +5. Shifts the intercept (parallel shift of the curve).
const SHIFT_MIN = -5;
const SHIFT_MAX = 5;

export default function SupplyDemandPage({ onNavigate }: Props) {
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);

  const demand: LinearCurve = useMemo(
    () => ({ intercept: DEFAULT_DEMAND.intercept + demandShift, slope: DEFAULT_DEMAND.slope }),
    [demandShift]
  );
  const supply: LinearCurve = useMemo(
    () => ({ intercept: DEFAULT_SUPPLY.intercept + supplyShift, slope: DEFAULT_SUPPLY.slope }),
    [supplyShift]
  );

  const eq = useMemo(() => calcEquilibrium(demand, supply), [demand, supply]);
  const eqOriginal = useMemo(() => calcEquilibrium(DEFAULT_DEMAND, DEFAULT_SUPPLY), []);

  const priceChange = round(eq.price - eqOriginal.price);
  const qtyChange = round(eq.quantity - eqOriginal.quantity);

  const reset = () => {
    setDemandShift(0);
    setSupplyShift(0);
  };

  const explainShift = (): string => {
    const parts: string[] = [];
    if (demandShift > 0) parts.push(`Demand shifted right (increase) by ${demandShift} — e.g. higher incomes or more buyers entered the market.`);
    if (demandShift < 0) parts.push(`Demand shifted left (decrease) by ${Math.abs(demandShift)} — e.g. incomes fell or a substitute became cheaper.`);
    if (supplyShift > 0) parts.push(`Supply shifted right (increase) by ${supplyShift} — e.g. lower production costs or improved technology.`);
    if (supplyShift < 0) parts.push(`Supply shifted left (decrease) by ${Math.abs(supplyShift)} — e.g. higher costs or a new tax on producers.`);
    if (parts.length === 0) return 'The market is at its baseline. Move a slider to shift a curve and watch equilibrium adjust.';
    parts.push(`Result: equilibrium price ${priceChange > 0 ? 'rose' : priceChange < 0 ? 'fell' : 'stayed'} to $${eq.price.toFixed(2)} and quantity ${qtyChange > 0 ? 'rose' : qtyChange < 0 ? 'fell' : 'stayed'} to ${eq.quantity.toFixed(1)} units.`);
    return parts.join(' ');
  };

  return (
    <>
      <PageHeader
        eyebrow="Topic 1 · Foundations"
        title="Supply & Demand"
        subtitle="The two forces behind every market price. Adjust demand or supply and watch the curves — and the equilibrium — move in real time."
        next={{ id: 'equilibrium', label: 'Market Equilibrium' }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Core explanation */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-demand-500" /> The Law of Demand
            </h3>
            <p className="text-navy-700 leading-relaxed mb-4">
              All else equal, as price rises, the <strong>quantity demanded</strong> falls. The demand
              curve slopes downward because consumers buy less at higher prices.
            </p>
            <div className="definition">
              <p className="text-sm text-navy-800"><strong>Demand curve:</strong> shows the quantity buyers are willing and able to purchase at each price.</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-supply-500" /> The Law of Supply
            </h3>
            <p className="text-navy-700 leading-relaxed mb-4">
              All else equal, as price rises, the <strong>quantity supplied</strong> rises. The supply
              curve slopes upward because producers offer more at higher prices.
            </p>
            <div className="definition">
              <p className="text-sm text-navy-800"><strong>Supply curve:</strong> shows the quantity sellers are willing and able to produce at each price.</p>
            </div>
          </div>
        </div>

        {/* Interactive simulator */}
        <div className="card p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-extrabold text-navy-900">Interactive Simulator</h2>
            <button onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors">
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Graph */}
            <div className="lg:col-span-3">
              <SupplyDemandGraph demand={demand} supply={supply} equilibrium={eq} />
            </div>

            {/* Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-demand-500" /> Demand shift
                  </span>
                  <span className={`text-sm font-bold ${demandShift > 0 ? 'text-success-600' : demandShift < 0 ? 'text-error-500' : 'text-navy-400'}`}>
                    {demandShift > 0 ? '+' : ''}{demandShift}
                  </span>
                </label>
                <input
                  type="range"
                  min={SHIFT_MIN}
                  max={SHIFT_MAX}
                  step="0.5"
                  value={demandShift}
                  onChange={(e) => setDemandShift(Number(e.target.value))}
                  className="range-demand w-full"
                />
                <div className="flex justify-between text-xs text-navy-400 mt-1">
                  <span>Decrease</span>
                  <span>No shift</span>
                  <span>Increase</span>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-supply-500" /> Supply shift
                  </span>
                  <span className={`text-sm font-bold ${supplyShift > 0 ? 'text-success-600' : supplyShift < 0 ? 'text-error-500' : 'text-navy-400'}`}>
                    {supplyShift > 0 ? '+' : ''}{supplyShift}
                  </span>
                </label>
                <input
                  type="range"
                  min={SHIFT_MIN}
                  max={SHIFT_MAX}
                  step="0.5"
                  value={supplyShift}
                  onChange={(e) => setSupplyShift(Number(e.target.value))}
                  className="range-supply w-full"
                />
                <div className="flex justify-between text-xs text-navy-400 mt-1">
                  <span>Decrease</span>
                  <span>No shift</span>
                  <span>Increase</span>
                </div>
              </div>

              {/* Live values */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-navy-50 px-4 py-3">
                  <p className="text-xs text-navy-500 font-semibold uppercase">Eq. Price</p>
                  <p className="text-2xl font-bold text-navy-900">${eq.price.toFixed(2)}</p>
                  <p className={`text-xs ${priceChange !== 0 ? (priceChange > 0 ? 'text-error-500' : 'text-success-600') : 'text-navy-400'}`}>
                    {priceChange === 0 ? 'no change' : `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}`}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-50 px-4 py-3">
                  <p className="text-xs text-navy-500 font-semibold uppercase">Eq. Quantity</p>
                  <p className="text-2xl font-bold text-navy-900">{eq.quantity.toFixed(1)}</p>
                  <p className={`text-xs ${qtyChange !== 0 ? (qtyChange > 0 ? 'text-success-600' : 'text-error-500') : 'text-navy-400'}`}>
                    {qtyChange === 0 ? 'no change' : `${qtyChange > 0 ? '+' : ''}${qtyChange.toFixed(1)}`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-l-4 border-navy-400 bg-navy-50/50 px-4 py-3">
                <p className="text-sm text-navy-700 leading-relaxed">{explainShift()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shift vs movement */}
        <div className="card p-6 lg:p-8">
          <h2 className="text-2xl font-extrabold text-navy-900 mb-4">Shift vs. Movement Along a Curve</h2>
          <p className="text-navy-700 leading-relaxed mb-6">
            A common source of confusion. They are different events caused by different things.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-demand-500/30 p-5">
              <h3 className="font-bold text-demand-600 mb-2 flex items-center gap-2">
                <ArrowRight size={18} /> Shift of the curve
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Caused by a change in a <strong>determinant</strong> other than price. The entire curve
                moves to a new position. A new quantity is bought/sold at <em>every</em> price.
              </p>
            </div>
            <div className="rounded-xl border-2 border-supply-500/30 p-5">
              <h3 className="font-bold text-supply-600 mb-2 flex items-center gap-2">
                <TrendingUp size={18} /> Movement along the curve
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Caused <strong>only</strong> by a change in the good's own price. We move to a different
                point on the same curve. This is a change in <em>quantity demanded/supplied</em>, not demand/supply.
              </p>
            </div>
          </div>
        </div>

        {/* Shifters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-demand-600 mb-3">Demand Shifters</h3>
            <ul className="space-y-2 text-sm text-navy-700">
              <li className="flex gap-2"><TrendingUp size={16} className="text-demand-500 mt-0.5 shrink-0" /> <span><strong>Income</strong> — higher income raises demand for normal goods.</span></li>
              <li className="flex gap-2"><TrendingUp size={16} className="text-demand-500 mt-0.5 shrink-0" /> <span><strong>Tastes &amp; preferences</strong> — trends shift demand.</span></li>
              <li className="flex gap-2"><TrendingUp size={16} className="text-demand-500 mt-0.5 shrink-0" /> <span><strong>Expectations</strong> — expecting future price rises increases today's demand.</span></li>
              <li className="flex gap-2"><TrendingUp size={16} className="text-demand-500 mt-0.5 shrink-0" /> <span><strong>Prices of related goods</strong> — substitutes and complements.</span></li>
              <li className="flex gap-2"><TrendingUp size={16} className="text-demand-500 mt-0.5 shrink-0" /> <span><strong>Number of buyers</strong> — a larger market shifts demand right.</span></li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-supply-600 mb-3">Supply Shifters</h3>
            <ul className="space-y-2 text-sm text-navy-700">
              <li className="flex gap-2"><TrendingDown size={16} className="text-supply-500 mt-0.5 shrink-0" /> <span><strong>Production costs</strong> — higher costs shift supply left.</span></li>
              <li className="flex gap-2"><TrendingDown size={16} className="text-supply-500 mt-0.5 shrink-0" /> <span><strong>Technology</strong> — better tech shifts supply right.</span></li>
              <li className="flex gap-2"><TrendingDown size={16} className="text-supply-500 mt-0.5 shrink-0" /> <span><strong>Taxes</strong> — raise costs, shifting supply left.</span></li>
              <li className="flex gap-2"><TrendingDown size={16} className="text-supply-500 mt-0.5 shrink-0" /> <span><strong>Subsidies</strong> — lower costs, shifting supply right.</span></li>
              <li className="flex gap-2"><TrendingDown size={16} className="text-supply-500 mt-0.5 shrink-0" /> <span><strong>Number of sellers</strong> — more producers shift supply right.</span></li>
            </ul>
          </div>
        </div>

        {/* Common mistakes */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-navy-900">Common Mistakes</h3>
          <Collapsible title='"A price increase causes demand to fall."'>
            <p>Not quite. A price increase causes <strong>quantity demanded</strong> to fall — a movement along the curve. Demand itself (the whole curve) only shifts when a non-price determinant changes.</p>
          </Collapsible>
          <Collapsible title='"When demand rises, supply must fall to match."'>
            <p>No. Demand and supply are independent. When demand shifts right, the new equilibrium has a higher price and higher quantity along the <em>existing</em> supply curve — supply did not move.</p>
          </Collapsible>
        </div>

        <KeyTakeaway>
          Prices emerge from the interaction of supply and demand. A change in price moves you along a curve; a change in any other determinant shifts the curve entirely. Equilibrium is where the two curves cross.
        </KeyTakeaway>
      </div>
    </>
  );
}
