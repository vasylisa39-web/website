import { useState, useMemo } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Quote,
  Package,
  Gamepad2,
} from 'lucide-react';
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

        {/* Key principles of equilibrium */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center">
              <BookOpen size={20} className="text-navy-700" />
            </div>
            <h2 className="text-2xl font-extrabold text-navy-900">Key Principles of Equilibrium</h2>
          </div>
          <ul className="space-y-3 text-sm text-navy-700 leading-relaxed">
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span>Equilibrium is a <strong>state of rest</strong> in which the quantity demanded and quantity supplied of a good in a market are the same at a certain price <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 49)</span>.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span>Equilibrium or <strong>market price</strong> is the price where quantity demanded is equal to the quantity supplied.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span><strong>Equilibrium quantity</strong> is the quantity bought and sold at the equilibrium price.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span>In a market, the relationship between supply and demand applies <strong>pressure on price</strong>.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span>If supply is greater than demand (surplus) or demand is greater than supply (shortage), there is pressure on price to change as a way of <strong>restoring equilibrium</strong> within a market <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 49)</span>.</span></li>
            <li className="flex gap-3"><CheckCircle2 size={18} className="text-success-600 mt-0.5 shrink-0" /> <span>Equilibrium occurs when the amount sellers are willing and able to supply is the same as the amount buyers are willing and able to buy. It is considered ideal in a competitive market but can be difficult to achieve due to varying factors <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 49)</span>.</span></li>
          </ul>
        </div>

        {/* Surplus in depth */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-warning-400/15 flex items-center justify-center">
              <TrendingDown size={20} className="text-warning-500" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">Surplus in Depth</h2>
              <p className="text-sm text-navy-600">Excess supply and how the market responds.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-navy-700 leading-relaxed">
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>A <strong>surplus</strong> occurs when the amount sellers are willing and able to sell outweighs the amount buyers wish to buy at a given price <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>Sellers find themselves unable to sell the full amount they are willing to sell — known as a <strong>surplus</strong> or <strong>excess supply</strong>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>Due to increasing excess stocks, sellers are tempted to <strong>decrease prices</strong> to boost demand <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>Lower prices lead some consumers to purchase more, causing a <strong>movement along the demand curve</strong> until an equilibrium point is reached.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>Some sellers reduce the amount they are willing to sell, triggering a <strong>movement along the supply curve</strong>. This helps decrease excess stock but does not increase sales due to the Law of Demand <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 shrink-0" /> <span>Prices can continue to fall until the market reaches equilibrium — the desired state for a competitive market.</span></p>
            </div>

            {/* Prime case study */}
            <div className="rounded-xl border-2 border-warning-400/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Package size={18} className="text-warning-500" />
                <h3 className="font-display font-bold text-navy-900">Case Study: Prime Hydration</h3>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed mb-3">
                Launched by influencers Logan Paul and KSI in 2022, a powerful marketing campaign
                targeted at children and hysteria around the drink's <strong>scarcity</strong> meant demand
                far outweighed supply — an initial <strong>shortage</strong>.
              </p>
              <div className="rounded-lg bg-navy-50 px-4 py-3 mb-3">
                <p className="text-sm text-navy-600 leading-relaxed">
                  <Quote size={13} className="inline text-warning-500 mr-1" />
                  "Shoppers climbing over each other to get their hands on the luridly coloured bottles."
                </p>
                <p className="text-xs text-navy-400 mt-1">— Emma Jacobs, FT, 2023</p>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed">
                In recent years, demand diminished and Prime found itself with <strong>large amounts of
                excess stock</strong> — a supplier surplus. They have since been forced to reduce output as it
                heavily exceeded overall market demand for the product.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-navy-50/70 px-5 py-3">
            <p className="text-xs text-navy-600 leading-relaxed italic">
              "The effect on price and demand bought and sold depend on whether the demand curve or
              supply curve shifted in the first place (or both). This analysis of markets is referred to as
              <strong> comparative statics</strong>, because we are comparing one initial static equilibrium
              with another once market forces have worked their way through." — Mankiw &amp; Taylor, 2026
            </p>
          </div>
        </div>

        {/* Shortages in depth */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-error-400/15 flex items-center justify-center">
              <TrendingUp size={20} className="text-error-500" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">Shortages in Depth</h2>
              <p className="text-sm text-navy-600">Excess demand and how the market responds.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-navy-700 leading-relaxed">
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error-500 mt-2 shrink-0" /> <span>Shortages occur when the amount consumers are willing and able to buy is greater than the amount sellers are willing and able to supply — demand is not being met <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error-500 mt-2 shrink-0" /> <span>If there are too many buyers for too few goods, sellers may <strong>increase prices</strong> as it increases revenues, and due to excess demand they are at decreased risk of a supplier surplus <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error-500 mt-2 shrink-0" /> <span>As price rises, some consumers will no longer be willing or able to purchase the good, triggering a <strong>movement along the demand curve</strong> <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error-500 mt-2 shrink-0" /> <span>Rising prices may tempt some producers to produce more as it is more profitable, so <strong>supply increases</strong>. This continues until an equilibrium point is reached.</span></p>
              <p className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error-500 mt-2 shrink-0" /> <span>Individual buyers and sellers are unaware they are forces of change, but the combined actions of everyone in a market can <strong>automatically adjust</strong> the market toward an equilibrium position <span className="text-navy-400">(Mankiw &amp; Taylor, 2026, p. 50)</span>.</span></p>
            </div>

            {/* PS5 case study */}
            <div className="rounded-xl border-2 border-error-400/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 size={18} className="text-error-500" />
                <h3 className="font-display font-bold text-navy-900">Case Study: PlayStation 5</h3>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed mb-3">
                On release in late 2020, Sony were unable to meet market demand for the PS5. Retailers
                and resellers took advantage of the shortage by charging far higher prices than the
                console's initial price.
              </p>
              <div className="rounded-lg bg-navy-50 px-4 py-3 mb-3">
                <p className="text-sm text-navy-600 leading-relaxed">
                  <Quote size={13} className="inline text-error-500 mr-1" />
                  "Quickly sold out online and buyers relisted consoles online at inflated prices."
                </p>
                <p className="text-xs text-navy-400 mt-1">— Jonathan Eley, FT, 2020</p>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed">
                Eventually supply increased and market demand was met, with prices plateauing. In recent
                years, repeated price hikes have occurred due to rising production costs for Sony, driven
                by excess demand for RAM from the <strong>AI boom</strong> — another supplier shortage as
                chipmakers struggle to meet the demand of AI companies for their chips.
              </p>
            </div>
          </div>
        </div>

        {/* Try it yourself */}
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-6">
          <h3 className="font-display font-bold text-lg text-navy-900 mb-3">Try It Yourself</h3>
          <ul className="space-y-2 text-sm text-navy-700">
            <li>1. Drag the price slider <strong>below</strong> the equilibrium ($5.00). What happens? Read the shortage calculation.</li>
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
            <li>
              <p>
                Financial Times — Jonathan Eley, <em>PlayStation 5 Launch in UK Descends into Chaos</em>,
                published 19/11/2020. Available at:
              </p>
              <a
                href="https://www.ft.com/content/c316acaa-c99b-48ca-8374-c9191f4423b2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-demand-600 hover:text-demand-500 transition-colors break-all"
              >
                ft.com/content/c316acaa-c99b-48ca-8374-c9191f4423b2
                <ExternalLink size={13} className="shrink-0" />
              </a>
            </li>
            <li>
              <p>
                Financial Times — Emma Jacobs, <em>The Playground Prime Craze Is a Lesson in Modern Marketing</em>,
                published 11/3/2023. Available at:
              </p>
              <a
                href="https://www.ft.com/content/4e9c33f2-deeb-4dbe-a296-3cf44bb2c5de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-demand-600 hover:text-demand-500 transition-colors break-all"
              >
                ft.com/content/4e9c33f2-deeb-4dbe-a296-3cf44bb2c5de
                <ExternalLink size={13} className="shrink-0" />
              </a>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
