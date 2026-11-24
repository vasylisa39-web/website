import { useState } from 'react';
import {
  RotateCcw,
  Calculator,
  Zap,
  Droplet,
  Minus,
  Coffee,
  HeartPulse,
  ShoppingBasket,
  Truck,
  Shirt,
  Sprout,
  Apple,
  Banknote,
  Utensils,
  PackageX,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  ExternalLink,
  Infinity as InfinityIcon,
  Wheat,
  GlassWater,
  Pill,
  Bolt as BoltIcon,
} from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Collapsible from '@/components/Collapsible';
import KeyTakeaway from '@/components/KeyTakeaway';
import {
  calcElasticityMidpoint,
  calcTotalRevenue,
  round,
  ElasticityResult,
} from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

// Five PED graph types. All have Quantity on x-axis and Price on y-axis.
type PEDType = 'perfectly-elastic' | 'elastic' | 'unit' | 'inelastic' | 'perfectly-inelastic';

const PED_TYPES: {
  type: PEDType;
  label: string;
  ped: string;
  icon: typeof Zap;
  color: string;
  blurb: string;
  example: string;
  exampleIcon: typeof Zap;
}[] = [
  {
    type: 'perfectly-elastic',
    label: 'Perfectly Elastic Demand',
    ped: 'PED = ∞',
    icon: InfinityIcon,
    color: 'demand',
    blurb: 'Consumers are extremely responsive to price changes. Even a very small increase in price causes quantity demanded to drop to zero.',
    example: 'Products sold in perfectly competitive markets, such as wheat, rice or other standardised commodities.',
    exampleIcon: Wheat,
  },
  {
    type: 'elastic',
    label: 'Elastic Demand',
    ped: 'PED > 1',
    icon: Zap,
    color: 'demand',
    blurb: 'The percentage change in quantity demanded is greater than the percentage change in price. Consumers react strongly to price changes.',
    example: 'Branded soft drinks, restaurant meals and clothing, where many alternatives are available.',
    exampleIcon: GlassWater,
  },
  {
    type: 'unit',
    label: 'Unitary Elastic Demand',
    ped: 'PED = 1',
    icon: Minus,
    color: 'navy',
    blurb: 'The percentage change in quantity demanded is exactly equal to the percentage change in price. The curve is a rectangular hyperbola.',
    example: 'Certain consumer goods and services where quantity demanded changes proportionally with price.',
    exampleIcon: Minus,
  },
  {
    type: 'inelastic',
    label: 'Inelastic Demand',
    ped: 'PED < 1',
    icon: Droplet,
    color: 'supply',
    blurb: 'The percentage change in quantity demanded is smaller than the percentage change in price. Consumers are relatively less sensitive to price changes.',
    example: 'Essential medicines, salt and electricity, which people continue to purchase despite price increases.',
    exampleIcon: Pill,
  },
  {
    type: 'perfectly-inelastic',
    label: 'Perfectly Inelastic Demand',
    ped: 'PED = 0',
    icon: BoltIcon,
    color: 'supply',
    blurb: 'Quantity demanded remains completely unchanged regardless of how much the price increases or decreases. The curve is vertical.',
    example: 'Life-saving medicines with no available alternatives or essential treatments for critical conditions.',
    exampleIcon: HeartPulse,
  },
];

// Calculator quick-load presets (kept for the calculator buttons)
const EXAMPLES = [
  { label: 'Elastic (> 1)', p1: 4, p2: 6, q1: 20, q2: 10, icon: Zap, color: 'demand' },
  { label: 'Inelastic (< 1)', p1: 4, p2: 6, q1: 100, q2: 90, icon: Droplet, color: 'supply' },
  { label: 'Unit elastic (= 1)', p1: 4, p2: 6, q1: 20, q2: 13.33, icon: Minus, color: 'navy' },
];

const DETERMINANTS = [
  {
    icon: ShoppingBasket,
    title: 'Substitutes',
    question: 'Are there many substitutes for this product?',
    rule: 'More available substitutes → more elastic. Limited substitutes → inelastic.',
    example: {
      heading: 'Example: Cereal',
      body: 'There are many alternatives for a similar type of cereal — Cocopops from Kellogg\'s and CocoSnaps from Tesco. With so many stand-ins, buyers easily switch when prices move, making cereal elastic.',
    },
    accent: 'demand',
  },
  {
    icon: Truck,
    title: 'Necessity',
    question: 'Is this service necessary for me?',
    rule: 'Luxuries are elastic. Necessities are inelastic.',
    example: {
      heading: 'Example: Food delivery',
      body: 'Food itself is essential for survival, so it is inelastic. But having fast food delivered to you by services like Deliveroo is a luxury — that extra convenience makes food delivery elastic.',
    },
    accent: 'supply',
  },
  {
    icon: Shirt,
    title: 'Market Definition',
    question: 'A specific product I can replace — but what about the broad category?',
    rule: 'The more narrowly the market is defined, the more elastic it tends to become.',
    example: {
      heading: 'Example: Jacket vs. Leather Jacket',
      body: 'A jacket is essential to survive the Irish weather, so the broad category is inelastic. But leather jackets are a specific sub-category: if their price rises, buyers switch to a different style of jacket. That makes leather jackets elastic.',
    },
    accent: 'navy',
  },
  {
    icon: Sprout,
    title: 'Time Horizon',
    question: 'Will the elasticity of this product change in the future?',
    rule: 'Demand is more elastic in the long run as consumers adapt.',
    example: {
      heading: 'Example: Store-bought vs. home-grown vegetables',
      body: 'If vegetable prices suddenly rise, immediate demand stays high — inelastic in the short run. Over time, consumers adapt by growing their own vegetables in the garden, so store-bought vegetables become elastic in the long run.',
    },
    accent: 'success',
  },
];

function ElasticityBar({ result }: { result: ElasticityResult | null }) {
  if (!result) return null;
  const maxBars = 5;
  const filled = Math.min(maxBars, Math.round(result.absElasticity));
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: maxBars }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-full transition-all ${
            i < filled
              ? result.classification === 'elastic'
                ? 'bg-demand-500'
                : result.classification === 'inelastic'
                  ? 'bg-supply-500'
                  : 'bg-navy-700'
              : 'bg-navy-100'
          }`}
        />
      ))}
    </div>
  );
}

// Visual representation of each PED demand curve. Q on x-axis, P on y-axis.
function ElasticityVisual({ type }: { type: PEDType }) {
  const W = 170, H = 130, pad = 18;
  const axisColor = '#3a4a66';
  const demandColor = '#3b6fd6';

  // Rectangular hyperbola (P×Q = constant) for unitary elastic demand.
  // Approaches both axes asymptotically but never touches either.
  const unitPath = (() => {
    const plotBottom = H - pad;
    const k = 1400;
    const pts: string[] = [];
    for (let px = 16; px <= 132; px += 3) {
      const py = k / px;
      const svgX = pad + px;
      const svgY = plotBottom - py;
      if (svgY >= pad + 2) {
        pts.push(`${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
      }
    }
    return pts.length ? `M ${pts.join(' L ')}` : '';
  })();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      {/* axes: P (y), Q (x) */}
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke={axisColor} strokeWidth="1.5" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={axisColor} strokeWidth="1.5" />
      <text x={4} y={pad + 4} fontSize="10" fill={axisColor} fontWeight="700">P</text>
      <text x={W - pad - 2} y={H - 4} fontSize="10" fill={axisColor} fontWeight="700">Q</text>

      {type === 'perfectly-elastic' && (
        <>
          <line x1={pad} y1={pad + 22} x2={W - pad} y2={pad + 22} stroke={demandColor} strokeWidth="3" />
          <text x={W - pad - 4} y={pad + 16} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
        </>
      )}

      {type === 'elastic' && (
        <>
          <line x1={pad} y1={pad + 10} x2={W - pad} y2={H - pad} stroke={demandColor} strokeWidth="3" />
          <text x={W - pad - 4} y={H - pad - 5} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
        </>
      )}

      {type === 'unit' && (
        <>
          <path d={unitPath} fill="none" stroke={demandColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x={W - pad - 2} y={H - pad - 8} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
        </>
      )}

      {type === 'inelastic' && (
        <>
          <line x1={pad} y1={pad + 4} x2={W - pad - 40} y2={H - pad} stroke={demandColor} strokeWidth="3" />
          <text x={W - pad - 44} y={H - pad - 5} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
        </>
      )}

      {type === 'perfectly-inelastic' && (
        <>
          <line x1={pad + 55} y1={pad} x2={pad + 55} y2={H - pad} stroke={demandColor} strokeWidth="3" />
          <text x={pad + 62} y={pad + 12} fontSize="11" fill={demandColor} fontWeight="800">D</text>
        </>
      )}
    </svg>
  );
}

function StepLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-navy-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy-400 sm:w-32 shrink-0">{label}</span>
      <span className="font-mono text-sm text-navy-800">{value}</span>
    </div>
  );
}

export default function ElasticityPage({ onNavigate }: Props) {
  const [p1, setP1] = useState('4');
  const [p2, setP2] = useState('6');
  const [q1, setQ1] = useState('20');
  const [q2, setQ2] = useState('10');

  const numP1 = parseFloat(p1);
  const numP2 = parseFloat(p2);
  const numQ1 = parseFloat(q1);
  const numQ2 = parseFloat(q2);

  const valid =
    !isNaN(numP1) && !isNaN(numP2) && !isNaN(numQ1) && !isNaN(numQ2) &&
    numP1 > 0 && numP2 > 0 && numQ1 > 0 && numQ2 > 0 && numP1 !== numP2 && numQ1 !== numQ2;

  const result = valid ? calcElasticityMidpoint(numP1, numP2, numQ1, numQ2) : null;

  const tr1 = valid ? calcTotalRevenue(numP1, numQ1) : 0;
  const tr2 = valid ? calcTotalRevenue(numP2, numQ2) : 0;
  const trChange = round(tr2 - tr1);

  const reset = () => {
    setP1('4'); setP2('6'); setQ1('20'); setQ2('10');
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setP1(String(ex.p1)); setP2(String(ex.p2)); setQ1(String(ex.q1)); setQ2(String(ex.q2));
  };

  const interpretation = (): string => {
    if (!result) return '';
    const priceUp = numP2 > numP1;
    const dir = priceUp ? 'rose' : 'fell';
    if (result.classification === 'elastic') {
      return `Demand is elastic (|E| = ${result.absElasticity}). The ${Math.abs(result.pctChangeQty).toFixed(1)}% change in quantity is larger than the ${Math.abs(result.pctChangePrice).toFixed(1)}% change in price. Buyers are responsive. When price ${dir}, total revenue ${trChange > 0 ? 'increased' : 'decreased'} — price and revenue move in opposite directions for elastic goods.`;
    }
    if (result.classification === 'inelastic') {
      return `Demand is inelastic (|E| = ${result.absElasticity}). The ${Math.abs(result.pctChangeQty).toFixed(1)}% change in quantity is smaller than the ${Math.abs(result.pctChangePrice).toFixed(1)}% change in price. Buyers are not very responsive. When price ${dir}, total revenue ${trChange > 0 ? 'increased' : 'decreased'} — price and revenue move in the same direction for inelastic goods.`;
    }
    return `Demand is unit elastic (|E| ≈ ${result.absElasticity}). The percentage change in quantity matches the percentage change in price. Total revenue stays roughly the same when price changes.`;
  };

  // Worked example: Pink Lady apples (simple % change method, not midpoint)
  const pinkOriginal = 3.4;
  const pinkNew = 4.0;
  const pinkPctPrice = ((pinkNew - pinkOriginal) / pinkOriginal) * 100;
  const pinkPctQty = -30;
  const pinkEd = pinkPctQty / pinkPctPrice;

  return (
    <>
      <PageHeader
        eyebrow="Topic 3 · Responsiveness"
        title="Price Elasticity"
        subtitle="How strongly do buyers respond to a price change? Work through everyday examples, calculate elasticity yourself, and discover why it matters for revenue."
        next={{ id: 'price-controls', label: 'Price Controls' }}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Formula & explanation */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-3">What Is Price Elasticity of Demand?</h3>
            <p className="text-navy-700 leading-relaxed mb-4">
              Price elasticity of demand measures how much the quantity demanded changes when price
              changes by one percent. It tells us how <em>responsive</em> buyers are.
            </p>
            <div className="formula">
              E<sub>d</sub> = % change in quantity demanded ÷ % change in price
            </div>
            <p className="text-sm text-navy-600 leading-relaxed">
              Because price and quantity demanded usually move in opposite directions, elasticity is
              typically <strong>negative</strong>. Economists use the <strong>absolute value</strong> (|E|) for
              classification, so they can say "elastic" or "inelastic" without the sign getting in the way.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-3">The Midpoint Method</h3>
            <p className="text-navy-700 leading-relaxed mb-4">
              The midpoint method gives the same elasticity whether price rises or falls, by using the
              average (midpoint) of the two values as the base.
            </p>
            <div className="formula text-sm">
              %ΔQ = (Q₂ − Q₁) ÷ [(Q₁ + Q₂) ÷ 2] × 100<br />
              %ΔP = (P₂ − P₁) ÷ [(P₁ + P₂) ÷ 2] × 100
            </div>
            <p className="text-sm text-navy-600 leading-relaxed">
              This avoids the problem where elasticity differs depending on which point you start from.
            </p>
          </div>
        </div>

        {/* Everyday life intro */}
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Elasticity in Everyday Life</h2>
          <p className="text-navy-600 mb-6 max-w-3xl leading-relaxed">
            We defined elasticity mathematically above — but what does it actually mean day to day?
            There are many items and services we purchase every day. Some are <strong>elastic</strong>,
            some are <strong>inelastic</strong>. The difference comes down to how sensitive buyers are
            to a change in price.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 border-l-4 border-demand-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-demand-500/10 flex items-center justify-center">
                  <Coffee size={20} className="text-demand-600" />
                </div>
                <div>
                  <span className="label-tag bg-demand-500/10 text-demand-600">Elastic</span>
                  <h3 className="font-display font-bold text-lg text-navy-900 mt-1">A mediocre coffee</h3>
                </div>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed">
                If the low-quality americano at the local Insomnia café rose by <strong>€1.00</strong>, how
                many people would stop buying it? Probably many — such a large jump in price for a
                mediocre product easily turns customers away. Buyers are <em>sensitive</em> to the price
                change, so demand is <strong>elastic</strong>.
              </p>
            </div>

            <div className="card p-6 border-l-4 border-supply-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-supply-500/10 flex items-center justify-center">
                  <HeartPulse size={20} className="text-supply-600" />
                </div>
                <div>
                  <span className="label-tag bg-supply-500/10 text-supply-600">Inelastic</span>
                  <h3 className="font-display font-bold text-lg text-navy-900 mt-1">Life-saving medicine</h3>
                </div>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed">
                How about prescription medicine — especially life-saving medication with no alternatives?
                Even if the price jumps by hundreds of euros, people would still buy it. Buyers are
                <em> not sensitive</em> to the price change, so demand is <strong>inelastic</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Five types of PED */}
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Types of Price Elasticity of Demand (PED)</h2>
          <p className="text-navy-600 mb-6 max-w-3xl leading-relaxed">
            Based on how responsive buyers are to a price change, demand is classified into five
            types. Each graph below shows quantity demanded on the x-axis and price on the y-axis
            <span className="text-navy-400"> (upGrad, 2026)</span>.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PED_TYPES.map((t) => {
              const Icon = t.icon;
              const ExIcon = t.exampleIcon;
              const accentText = t.color === 'demand' ? 'text-demand-600' : t.color === 'supply' ? 'text-supply-600' : 'text-navy-700';
              const accentBg = t.color === 'demand' ? 'bg-demand-500/10' : t.color === 'supply' ? 'bg-supply-500/10' : 'bg-navy-100';
              return (
                <div key={t.type} className="card p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={accentText} />
                    <h3 className="font-display font-bold text-base text-navy-900 leading-tight">{t.label}</h3>
                  </div>
                  <span className={`label-tag ${accentBg} ${accentText} mb-3 w-fit`}>{t.ped}</span>
                  <ElasticityVisual type={t.type} />
                  <p className="text-sm text-navy-700 leading-relaxed mt-3 mb-3">{t.blurb}</p>
                  <div className="mt-auto rounded-lg bg-navy-50/70 px-4 py-3">
                    <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ExIcon size={13} className={accentText} /> Example
                    </p>
                    <p className="text-sm text-navy-600 leading-relaxed">{t.example}</p>
                  </div>
                </div>
              );
            })}
            {/* References link card fills the last grid cell on lg */}
            <div className="card p-6 bg-navy-900 text-cream-50 flex flex-col justify-center">
              <p className="text-xs text-cream-100/60 font-semibold uppercase tracking-wider mb-2">Classification rule</p>
              <p className="text-sm text-cream-100/80 leading-relaxed">
                The further the demand curve sits from a vertical line, the more elastic it is.
                A horizontal curve is perfectly elastic; a vertical curve is perfectly inelastic.
              </p>
              <p className="text-xs text-cream-100/40 mt-4">
                See the references at the bottom of this page for the sources cited above.
              </p>
            </div>
          </div>
        </div>

        {/* Worked example: Pink Lady apples */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-demand-500/10 flex items-center justify-center">
              <Apple size={22} className="text-demand-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">Worked Example: Pink Lady Apples</h2>
              <p className="text-sm text-navy-600">Let's apply the formula step by step.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Scenario */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl bg-navy-50 px-5 py-4">
                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">The Scenario</p>
                <p className="text-sm text-navy-800 leading-relaxed">
                  In a local supermarket, Pink Lady apples were originally <strong>€3.40</strong> per pack.
                  The price rose to <strong>€4.00</strong> per pack, and the quantity demanded
                  <strong> fell by 30%</strong>. Are Pink Lady apples elastic or inelastic — and why?
                </p>
              </div>

              <div className="rounded-xl border border-success-400/40 bg-success-400/10 px-5 py-4">
                <p className="text-xs font-semibold text-success-600 uppercase tracking-wider mb-1">Verdict</p>
                <p className="text-lg font-bold text-navy-900">|E| = 1.70 &gt; 1 → Elastic</p>
                <p className="text-xs text-navy-600 mt-1">Buyers are responsive to the price increase.</p>
              </div>
            </div>

            {/* Calculation */}
            <div className="lg:col-span-3">
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Calculation</p>
              <div className="rounded-xl border border-navy-100 px-5 py-3">
                <StepLine
                  label="Step 1"
                  value={`%ΔP = ((4.00 − 3.40) ÷ 3.40) × 100 = ${pinkPctPrice.toFixed(3)}%`}
                />
                <StepLine
                  label="Step 2"
                  value={`E_d = %ΔQ ÷ %ΔP = ${pinkPctQty}% ÷ ${pinkPctPrice.toFixed(3)}% = ${pinkEd.toFixed(2)}`}
                />
                <StepLine
                  label="Step 3"
                  value={`|${pinkEd.toFixed(2)}| = 1.70 > 1  →  elastic`}
                />
              </div>

              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mt-5 mb-2">Why might it be elastic?</p>
              <div className="space-y-2">
                <div className="rounded-lg bg-navy-50/60 px-4 py-3">
                  <p className="text-sm font-bold text-navy-900 flex items-center gap-2">
                    <ShoppingBasket size={15} className="text-demand-600" /> Substitution
                  </p>
                  <p className="text-sm text-navy-600 leading-relaxed mt-1">
                    Pink Lady apples can be easily substituted by other apple brands such as Gala or
                    Granny Smith. When the price rises, customers switch to cheaper alternatives.
                  </p>
                </div>
                <div className="rounded-lg bg-navy-50/60 px-4 py-3">
                  <p className="text-sm font-bold text-navy-900 flex items-center gap-2">
                    <HeartPulse size={15} className="text-supply-600" /> Necessity
                  </p>
                  <p className="text-sm text-navy-600 leading-relaxed mt-1">
                    Apples are not essential to our diet — customers may choose other fruits instead,
                    which makes apples in general elastic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="card p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-extrabold text-navy-900 flex items-center gap-2">
              <Calculator size={24} /> Elasticity Calculator
            </h2>
            <button onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors">
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-navy-900 mb-2">Enter values</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-500 uppercase mb-1">Initial Price (P₁)</label>
                  <input type="number" step="0.5" min="0" value={p1} onChange={(e) => setP1(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-500 uppercase mb-1">New Price (P₂)</label>
                  <input type="number" step="0.5" min="0" value={p2} onChange={(e) => setP2(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-500 uppercase mb-1">Initial Qty (Q₁)</label>
                  <input type="number" step="1" min="0" value={q1} onChange={(e) => setQ1(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-500 uppercase mb-1">New Qty (Q₂)</label>
                  <input type="number" step="1" min="0" value={q2} onChange={(e) => setQ2(e.target.value)} className="w-full" />
                </div>
              </div>

              {/* Worked examples */}
              <div>
                <p className="text-xs font-semibold text-navy-500 uppercase mb-2">Load a worked example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => loadExample(ex)}
                      className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              {!valid && (
                <p className="text-sm text-error-500 bg-error-400/10 rounded-lg px-3 py-2">
                  Enter valid positive numbers. P₁ ≠ P₂ and Q₁ ≠ Q₂ are required.
                </p>
              )}
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              {result ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-navy-50 px-4 py-3">
                      <p className="text-xs text-navy-500 font-semibold uppercase">% Change Price</p>
                      <p className="text-xl font-bold text-navy-900">{result.pctChangePrice.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-xl bg-navy-50 px-4 py-3">
                      <p className="text-xs text-navy-500 font-semibold uppercase">% Change Qty</p>
                      <p className="text-xl font-bold text-navy-900">{result.pctChangeQty.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-navy-900 text-cream-50 px-5 py-4">
                    <p className="text-xs text-cream-100/60 font-semibold uppercase mb-1">Price Elasticity of Demand</p>
                    <p className="text-3xl font-bold">{result.elasticity.toFixed(2)}</p>
                    <p className="text-sm text-cream-100/70">|E| = {result.absElasticity.toFixed(2)}</p>
                    <div className="mt-3">
                      <ElasticityBar result={result} />
                      <p className="text-sm font-semibold text-cream-50 mt-2">
                        {result.classification === 'elastic' ? 'Elastic demand' : result.classification === 'inelastic' ? 'Inelastic demand' : 'Unit elastic demand'}
                      </p>
                    </div>
                  </div>

                  {/* Visual comparison */}
                  <div className="rounded-xl border border-navy-100 p-4">
                    <p className="text-xs font-semibold text-navy-500 uppercase mb-3">Visual Comparison</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-navy-600">Price change</span>
                          <span className="font-bold text-navy-900">{Math.abs(result.pctChangePrice).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
                          <div className="h-full bg-navy-700 rounded-full" style={{ width: `${Math.min(100, Math.abs(result.pctChangePrice))}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-navy-600">Quantity change</span>
                          <span className="font-bold text-navy-900">{Math.abs(result.pctChangeQty).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${result.classification === 'elastic' ? 'bg-demand-500' : result.classification === 'inelastic' ? 'bg-supply-500' : 'bg-navy-700'}`} style={{ width: `${Math.min(100, Math.abs(result.pctChangeQty))}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="rounded-xl border-l-4 border-navy-400 bg-navy-50/50 px-4 py-3">
                    <p className="text-sm text-navy-700 leading-relaxed">{interpretation()}</p>
                  </div>

                  {/* Total revenue */}
                  <div className="rounded-xl bg-gradient-to-br from-success-400/10 to-navy-50 px-5 py-4">
                    <p className="text-xs text-navy-500 font-semibold uppercase mb-2">Total Revenue Experiment</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-navy-500">Before</p>
                        <p className="text-lg font-bold text-navy-900">${tr1.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">After</p>
                        <p className="text-lg font-bold text-navy-900">${tr2.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Change</p>
                        <p className={`text-lg font-bold ${trChange > 0 ? 'text-success-600' : trChange < 0 ? 'text-error-500' : 'text-navy-500'}`}>
                          {trChange > 0 ? '+' : ''}{trChange.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-navy-200 p-8 text-center text-navy-400">
                  Enter valid values to see the calculation.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Determinants */}
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Determinants of Elasticity</h2>
          <p className="text-navy-600 mb-6 max-w-3xl">There are many aspects that affect the elasticity of a product. Here are four of the most important.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {DETERMINANTS.map((d) => {
              const Icon = d.icon;
              const accentText =
                d.accent === 'demand' ? 'text-demand-600' : d.accent === 'supply' ? 'text-supply-600' : d.accent === 'success' ? 'text-success-600' : 'text-navy-700';
              const accentBg =
                d.accent === 'demand' ? 'bg-demand-500/10' : d.accent === 'supply' ? 'bg-supply-500/10' : d.accent === 'success' ? 'bg-success-400/10' : 'bg-navy-100';
              return (
                <div key={d.title} className="card p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl ${accentBg} flex items-center justify-center shrink-0`}>
                      <Icon size={22} className={accentText} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-navy-900">{d.title}</h3>
                  </div>
                  <p className="text-sm text-navy-500 italic mb-2">{d.question}</p>
                  <p className="text-sm text-navy-700 leading-relaxed mb-4">{d.rule}</p>
                  <div className="mt-auto rounded-xl bg-navy-50/70 px-4 py-3">
                    <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">{d.example.heading}</p>
                    <p className="text-sm text-navy-600 leading-relaxed">{d.example.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income & elasticity */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center">
              <Banknote size={22} className="text-navy-700" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">Another Aspect: Income</h2>
              <p className="text-sm text-navy-600">How much we earn also affects demand.</p>
            </div>
          </div>

          <p className="text-navy-700 leading-relaxed mb-6 max-w-3xl">
            Goods can be categorised into <strong>Normal Goods</strong> and <strong>Inferior Goods</strong>,
            depending on how demand responds to a change in income.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-success-400/40 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={20} className="text-success-600" />
                <h3 className="font-display font-bold text-lg text-success-600">Normal Goods</h3>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed mb-4">
                Products or services for which quantity demanded <strong>increases</strong> as
                customers' income rises.
              </p>
              <div className="rounded-lg bg-success-400/10 px-4 py-3">
                <p className="text-xs font-bold text-success-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Utensils size={14} /> Example: Restaurant meals
                </p>
                <p className="text-sm text-navy-600 leading-relaxed">
                  Demand rises as income rises, and falls as income falls. When people earn more, they
                  dine out more often.
                </p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-supply-500/40 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownRight size={20} className="text-supply-600" />
                <h3 className="font-display font-bold text-lg text-supply-600">Inferior Goods</h3>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed mb-4">
                Products or services for which quantity demanded <strong>decreases</strong> as
                customers' income rises — consumers move to higher-quality products they can now afford.
              </p>
              <div className="rounded-lg bg-supply-500/10 px-4 py-3">
                <p className="text-xs font-bold text-supply-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <PackageX size={14} /> Example: Off-brand items
                </p>
                <p className="text-sm text-navy-600 leading-relaxed">
                  Demand falls as income rises and grows as income falls. Customers switch between
                  budget and branded products depending on what they can afford.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common mistakes */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-navy-900">Common Mistakes</h3>
          <Collapsible title='"Elasticity is the slope of the demand curve."'>
            <p>Related, but not the same. Slope depends on the units of the axes; elasticity is unit-free (a ratio of percentages). Two curves with the same slope can have different elasticities at different points.</p>
          </Collapsible>
          <Collapsible title='"A steep demand curve always means inelastic demand."'>
            <p>Often true visually, but strictly it depends on the scale of the axes. The midpoint formula is the reliable way to compute elasticity, not eyeballing steepness.</p>
          </Collapsible>
        </div>

        <KeyTakeaway>
          Elasticity measures how responsive buyers are to price. When |E| &gt; 1 demand is elastic
          (e.g. a mediocre coffee) and when |E| &lt; 1 demand is inelastic
          (e.g. life-saving medicine) assuming other factors remain constant. Substitutes, necessity, market
          definition, and time horizon all all affect elasticity. Meanwhile, change in income also influences demand. Income elasticity measures how changes in income affect quantity demanded in a market. Based on this relationship, goods can be classified as either normal or inferior.
        </KeyTakeaway>

        {/* References */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={20} className="text-navy-700" />
            <h2 className="text-xl font-extrabold text-navy-900">References</h2>
          </div>
          <ol className="space-y-4 text-sm text-navy-700 leading-relaxed list-decimal pl-5">
            <li>
              <p>Mankiw, N. Gregory, &amp; Taylor, Mark P. (2020).
        <em> Economics </em> (5th ed.). Cengage Learning.</p>
            
              <p>upGrad. (2026, August 10). <em>A complete guide on price elasticity of demand with examples</em>. upGrad blog. Available at:</p>
              <a
                href="https://www.upgrad.com/blog/price-elasticity-of-demand/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-demand-600 hover:text-demand-500 transition-colors break-all"
              >
                upgrad.com/blog/price-elasticity-of-demand/
                <ExternalLink size={13} className="shrink-0" />
              </a>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
