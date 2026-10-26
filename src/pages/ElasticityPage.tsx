import { useState } from 'react';
import { RotateCcw, Calculator, Zap, Droplet, Minus } from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Collapsible from '@/components/Collapsible';
import KeyTakeaway from '@/components/KeyTakeaway';
import { calcElasticityMidpoint, calcTotalRevenue, round, ElasticityResult } from '@/lib/economics';

interface Props {
  onNavigate: (page: PageId) => void;
}

const EXAMPLES = [
  { label: 'Elastic (> 1)', p1: 4, p2: 6, q1: 20, q2: 10, icon: Zap, color: 'demand' },
  { label: 'Inelastic (< 1)', p1: 4, p2: 6, q1: 100, q2: 90, icon: Droplet, color: 'supply' },
  { label: 'Unit elastic (= 1)', p1: 4, p2: 6, q1: 20, q2: 13.33, icon: Minus, color: 'navy' },
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

// A simple visual of two demand curves with different steepness
function ElasticityVisual({ type }: { type: 'elastic' | 'inelastic' | 'unit' }) {
  const W = 160, H = 120, pad = 15;
  const lines = {
    elastic: { x1: pad, y1: 25, x2: W - pad, y2: H - pad },
    inelastic: { x1: pad, y1: 55, x2: W - pad, y2: H - pad - 8 },
    unit: { x1: pad, y1: pad, x2: W - pad, y2: H - pad },
  };
  const l = lines[type];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28">
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#3a4a66" strokeWidth="1.5" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#3a4a66" strokeWidth="1.5" />
      <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#3b6fd6" strokeWidth="3" />
      <text x={W - pad - 4} y={l.y2 - 6} textAnchor="end" fontSize="11" fill="#2a54b0" fontWeight="800">D</text>
    </svg>
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

  return (
    <>
      <PageHeader
        eyebrow="Topic 3 · Responsiveness"
        title="Price Elasticity"
        subtitle="How strongly do buyers respond to a price change? Calculate elasticity yourself with the midpoint method and discover why it matters for revenue."
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

        {/* Three examples */}
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Three Types of Demand</h2>
          <p className="text-navy-600 mb-6">The steeper the demand curve, the less responsive buyers are to price.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLES.map((ex) => {
              const Icon = ex.icon;
              const r = calcElasticityMidpoint(ex.p1, ex.p2, ex.q1, ex.q2);
              return (
                <div key={ex.label} className="card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={20} className={ex.color === 'demand' ? 'text-demand-600' : ex.color === 'supply' ? 'text-supply-600' : 'text-navy-700'} />
                    <h3 className="font-display font-bold text-lg text-navy-900">{ex.label}</h3>
                  </div>
                  <ElasticityVisual type={ex.label.includes('Elastic') && ex.label.startsWith('Elastic') ? 'elastic' : ex.label.includes('Inelastic') ? 'inelastic' : 'unit'} />
                  <p className="text-sm text-navy-600 mt-2">
                    |E| = {r?.absElasticity.toFixed(2)} — {r?.classification === 'elastic' ? 'buyers are very responsive' : r?.classification === 'inelastic' ? 'buyers are not very responsive' : 'proportional response'}
                  </p>
                </div>
              );
            })}
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
        <div className="card p-6 lg:p-8">
          <h2 className="text-2xl font-extrabold text-navy-900 mb-4">Determinants of Elasticity</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: 'Substitutes', d: 'More available substitutes → more elastic. Few substitutes → inelastic.' },
              { t: 'Necessity vs Luxury', d: 'Necessities are inelastic; luxuries are elastic.' },
              { t: 'Share of Income', d: 'Goods that take a large share of income are more elastic.' },
              { t: 'Time to Adjust', d: 'Demand is more elastic in the long run as consumers adapt.' },
            ].map((d) => (
              <div key={d.t} className="rounded-xl border border-navy-100 p-4">
                <h3 className="font-bold text-navy-900 mb-1">{d.t}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{d.d}</p>
              </div>
            ))}
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
          Elasticity measures responsiveness. When |E| &gt; 1 demand is elastic and price cuts raise revenue; when |E| &lt; 1 demand is inelastic and price hikes raise revenue. The midpoint method keeps the calculation consistent regardless of direction.
        </KeyTakeaway>
      </div>
    </>
  );
}
