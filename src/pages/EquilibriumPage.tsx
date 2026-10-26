import { useState, useMemo } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SupplyDemandGraph from '@/components/SupplyDemandGraph';
import Collapsible from '@/components/Collapsible';
import KeyTakeaway from '@/components/KeyTakeaway';
import {
  DEFAULT_DEMAND,
  DEFAULT_SUPPLY,
  calcEquilibrium,
  calcDisequilibrium,
  round,
} from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

export default function EquilibriumPage({ onNavigate }: Props) {
  const [price, setPrice] = useState(6.35); // start at equilibrium

  const demand = DEFAULT_DEMAND;
  const supply = DEFAULT_SUPPLY;
  const eq = useMemo(() => calcEquilibrium(demand, supply), [demand, supply]);
  const dis = useMemo(() => calcDisequilibrium(demand, supply, price), [demand, supply, price]);

  const reset = () => setPrice(round(eq.price));

  const statusInfo = useMemo(() => {
    if (dis.type === 'shortage') {
      return {
        icon: <AlertTriangle size={20} className="text-error-500" />,
        title: 'Shortage (Excess Demand)',
        color: 'error',
        text: `At $${price.toFixed(2)}, buyers want ${dis.quantityDemanded.toFixed(1)} units but sellers only offer ${dis.quantitySupplied.toFixed(1)} units. The shortage of ${Math.abs(dis.imbalance).toFixed(1)} units puts upward pressure on price.`,
      };
    }
    if (dis.type === 'surplus') {
      return {
        icon: <AlertTriangle size={20} className="text-warning-500" />,
        title: 'Surplus (Excess Supply)',
        color: 'warning',
        text: `At $${price.toFixed(2)}, sellers offer ${dis.quantitySupplied.toFixed(1)} units but buyers only want ${dis.quantityDemanded.toFixed(1)} units. The surplus of ${dis.imbalance.toFixed(1)} units puts downward pressure on price.`,
      };
    }
    return {
      icon: <CheckCircle2 size={20} className="text-success-600" />,
      title: 'Equilibrium Reached',
      color: 'success',
      text: `At $${price.toFixed(2)}, quantity demanded equals quantity supplied at ${dis.quantityDemanded.toFixed(1)} units. There is no shortage or surplus — the market clears.`,
    };
  }, [dis, price]);

  return (
    <>
      <PageHeader
        eyebrow="Topic 2 · Balance"
        title="Market Equilibrium"
        subtitle="Where supply meets demand. Change the price yourself and watch shortages and surpluses appear — then see why markets tend to drift back toward balance."
        next={{ id: 'elasticity', label: 'Price Elasticity' }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Explanation */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-3">What Is Equilibrium?</h3>
            <p className="text-navy-700 leading-relaxed mb-4">
              Market equilibrium is the price at which <strong>quantity demanded equals quantity supplied</strong>.
              At this point, every buyer who wants to buy at the price can find a seller, and every seller who
              wants to sell can find a buyer. There is no shortage and no surplus.
            </p>
            <div className="definition">
              <p className="text-sm text-navy-800">
                <strong>Equilibrium price</strong> (market-clearing price): the price where Qd = Qs.<br />
                <strong>Equilibrium quantity</strong>: the quantity bought and sold at that price.
              </p>
            </div>
          </div>
          <div className="card p-6 bg-navy-900 text-cream-50">
            <p className="text-xs text-cream-100/60 font-semibold uppercase tracking-wide mb-1">Equilibrium</p>
            <p className="text-sm text-cream-100/80 mb-4">Price · Quantity</p>
            <p className="text-3xl font-bold">${eq.price.toFixed(2)}</p>
            <p className="text-lg text-cream-100/70">{eq.quantity.toFixed(1)} units</p>
          </div>
        </div>

        {/* Interactive experiment */}
        <div className="card p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-extrabold text-navy-900">Equilibrium Experiment</h2>
            <button onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors">
              <RotateCcw size={16} /> Reset to equilibrium
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <SupplyDemandGraph
                demand={demand}
                supply={supply}
                equilibrium={eq}
                controlledPrice={price}
                showImbalance
              />
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-navy-900">Market Price</span>
                  <span className="text-lg font-bold text-navy-900">${price.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.05"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="range-price w-full"
                />
                <div className="flex justify-between text-xs text-navy-400 mt-1">
                  <span>$2.00</span>
                  <span className="text-success-600 font-semibold">Eq: ${eq.price.toFixed(2)}</span>
                  <span>$10.00</span>
                </div>
              </div>

              {/* Status */}
              <div className={`rounded-xl p-4 border-l-4 ${
                statusInfo.color === 'error' ? 'border-error-500 bg-error-400/10' :
                statusInfo.color === 'warning' ? 'border-warning-500 bg-warning-400/10' :
                'border-success-600 bg-success-400/10'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {statusInfo.icon}
                  <h4 className="font-bold text-navy-900">{statusInfo.title}</h4>
                </div>
                <p className="text-sm text-navy-700 leading-relaxed">{statusInfo.text}</p>
              </div>

              {/* Numerical breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-demand-500/5 border border-demand-500/20 px-4 py-3">
                  <p className="text-xs text-demand-600 font-semibold uppercase">Qty Demanded</p>
                  <p className="text-xl font-bold text-navy-900">{dis.quantityDemanded.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-supply-500/5 border border-supply-500/20 px-4 py-3">
                  <p className="text-xs text-supply-600 font-semibold uppercase">Qty Supplied</p>
                  <p className="text-xl font-bold text-navy-900">{dis.quantitySupplied.toFixed(1)}</p>
                </div>
              </div>

              {dis.type !== 'equilibrium' && (
                <div className={`rounded-lg px-4 py-3 text-center ${dis.type === 'shortage' ? 'bg-error-400/10' : 'bg-warning-400/10'}`}>
                  <p className="text-xs text-navy-500 font-semibold uppercase">
                    {dis.type === 'shortage' ? 'Shortage' : 'Surplus'}
                  </p>
                  <p className={`text-2xl font-bold ${dis.type === 'shortage' ? 'text-error-500' : 'text-warning-500'}`}>
                    {Math.abs(dis.imbalance).toFixed(1)} units
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market pressure explanation */}
        <div className="card p-6 lg:p-8">
          <h2 className="text-2xl font-extrabold text-navy-900 mb-4">Why Markets Tend Toward Equilibrium</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-error-500 mb-2">When price is too low → Shortage</h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Buyers want more than sellers provide. Some buyers cannot get the good and are willing to
                pay more. Sellers notice they can raise prices. Price is pushed <strong>up</strong> toward equilibrium.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-warning-500 mb-2">When price is too high → Surplus</h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Sellers produce more than buyers want. Unsold goods pile up. To clear inventory, sellers
                cut prices. Price is pushed <strong>down</strong> toward equilibrium.
              </p>
            </div>
          </div>
        </div>

        {/* Try it yourself */}
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-6">
          <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Try It Yourself</h3>
          <ul className="space-y-2 text-sm text-navy-700">
            <li>1. Drag the price slider <strong>below</strong> the equilibrium ($${eq.price.toFixed(2)}). What happens? Read the shortage calculation.</li>
            <li>2. Drag the price <strong>above</strong> equilibrium. Watch the surplus bar grow.</li>
            <li>3. Set the price exactly at equilibrium. Confirm Qd = Qs and the shortage/surplus is zero.</li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-navy-900">Common Mistakes</h3>
          <Collapsible title='"Equilibrium means everyone is happy."'>
            <p>Not necessarily. Equilibrium only means quantity demanded equals quantity supplied — the market clears. Some buyers who wanted the good at a lower price are priced out; some sellers who would have produced at a higher price do not. Equilibrium is about balance, not satisfaction.</p>
          </Collapsible>
          <Collapsible title='"A shortage means there is not enough of the good in existence."'>
            <p>A shortage means quantity demanded exceeds quantity supplied <em>at the current price</em>. At a higher price, the same market could have no shortage — or even a surplus. It is a price-specific concept, not an absolute scarcity.</p>
          </Collapsible>
        </div>

        <KeyTakeaway>
          Equilibrium is where quantity demanded equals quantity supplied. Prices below equilibrium create shortages (upward pressure); prices above create surpluses (downward pressure). In competitive markets, this pressure pushes price toward the equilibrium point.
        </KeyTakeaway>
      </div>
    </>
  );
}
