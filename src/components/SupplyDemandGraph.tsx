import { useMemo } from 'react';
import {
  LinearCurve,
  Equilibrium,
  PRICE_MIN,
  PRICE_MAX,
  QTY_MAX,
  priceForQty,
  qtyForPrice,
  round,
  clamp,
} from '@/lib/economics';

interface Props {
  demand: LinearCurve;
  supply: LinearCurve;
  equilibrium?: Equilibrium;
  controlledPrice?: number;
  kind?: 'ceiling' | 'floor' | null;
  showImbalance?: boolean;
  showEquilibrium?: boolean;
  className?: string;
  compact?: boolean;
}

const W = 520;
const H = 380;
const PAD = { left: 56, right: 28, top: 28, bottom: 52 };
const priceMin = PRICE_MIN;
const priceMax = PRICE_MAX;
const qtyMax = QTY_MAX;

const xScale = (q: number) =>
  PAD.left + ((clamp(q, 0, qtyMax) - 0) / qtyMax) * (W - PAD.left - PAD.right);
const yScale = (p: number) =>
  PAD.top + (1 - (clamp(p, priceMin, priceMax) - priceMin) / (priceMax - priceMin)) * (H - PAD.top - PAD.bottom);

export default function SupplyDemandGraph({
  demand,
  supply,
  equilibrium,
  controlledPrice,
  kind,
  showImbalance = false,
  showEquilibrium = true,
  className = '',
  compact = false,
}: Props) {
  const gridlines = useMemo(() => {
    const priceSteps = [0, 2, 4, 6, 8, 10, 12, 14];
    const qtySteps = [0, 5, 10, 15, 20, 25, 30];
    return { priceSteps, qtySteps };
  }, []);

  // Find Q-range where price is in [priceMin, priceMax] for each curve
  const demandPath = useMemo(() => {
    const qStart = Math.max(0, qtyForPrice(demand, priceMax));
    const qEnd = Math.max(0, qtyForPrice(demand, priceMin));
    const qLo = clamp(qStart, 0, qtyMax);
    const qHi = clamp(qEnd, 0, qtyMax);
    return { x1: xScale(qLo), y1: yScale(priceForQty(demand, qLo)), x2: xScale(qHi), y2: yScale(priceForQty(demand, qHi)) };
  }, [demand]);

  const supplyPath = useMemo(() => {
    const qStart = Math.max(0, qtyForPrice(supply, priceMin));
    const qEnd = Math.max(0, qtyForPrice(supply, priceMax));
    const qLo = clamp(qStart, 0, qtyMax);
    const qHi = clamp(qEnd, 0, qtyMax);
    return { x1: xScale(qLo), y1: yScale(priceForQty(supply, qLo)), x2: xScale(qHi), y2: yScale(priceForQty(supply, qHi)) };
  }, [supply]);

  const eq = equilibrium;
  const controlP = controlledPrice ?? null;
  const qdAtControl = controlP !== null ? clamp(qtyForPrice(demand, controlP), 0, qtyMax) : 0;
  const qsAtControl = controlP !== null ? clamp(qtyForPrice(supply, controlP), 0, qtyMax) : 0;
  const isBindingControl =
    kind &&
    eq &&
    controlP !== null &&
    ((kind === 'ceiling' && controlP < eq.price - 0.05) ||
      (kind === 'floor' && controlP > eq.price + 0.05));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Supply and demand graph"
    >
      {/* Background */}
      <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={H - PAD.top - PAD.bottom} fill="#fdfcf8" rx="6" />

      {/* Gridlines */}
      {gridlines.priceSteps.map((p) => (
        <line key={`p${p}`} x1={PAD.left} x2={W - PAD.right} y1={yScale(p)} y2={yScale(p)} stroke="#e8edf4" strokeWidth="1" />
      ))}
      {gridlines.qtySteps.map((q) => (
        <line key={`q${q}`} x1={xScale(q)} x2={xScale(q)} y1={PAD.top} y2={H - PAD.bottom} stroke="#e8edf4" strokeWidth="1" />
      ))}

      {/* Axes */}
      <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="#3a4a66" strokeWidth="2" />
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={H - PAD.bottom} stroke="#3a4a66" strokeWidth="2" />

      {/* Y-axis labels (Price) */}
      {gridlines.priceSteps.map((p) => (
        <text key={`pl${p}`} x={PAD.left - 10} y={yScale(p) + 4} textAnchor="end" fontSize={compact ? 10 : 11} fill="#5a6a82" fontWeight="500">
          ${p}
        </text>
      ))}
      {/* X-axis labels (Quantity) */}
      {gridlines.qtySteps.map((q) => (
        <text key={`ql${q}`} x={xScale(q)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize={compact ? 10 : 11} fill="#5a6a82" fontWeight="500">
          {q}
        </text>
      ))}

      {/* Axis titles */}
      <text x={(W + PAD.left) / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="#1a2a48" fontWeight="700">
        Quantity
      </text>
      <text x={16} y={H / 2} textAnchor="middle" fontSize={12} fill="#1a2a48" fontWeight="700" transform={`rotate(-90 16 ${H / 2})`}>
        Price ($)
      </text>

      {/* Price control line + imbalance shading */}
      {controlP !== null && (
        <g>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yScale(controlP)}
            y2={yScale(controlP)}
            stroke={isBindingControl ? '#d9523a' : '#8a9aaf'}
            strokeWidth="2"
            strokeDasharray={isBindingControl ? '6 4' : '4 4'}
          />
          <text x={W - PAD.right - 4} y={yScale(controlP) - 6} textAnchor="end" fontSize={10} fill={isBindingControl ? '#d9523a' : '#8a9aaf'} fontWeight="600">
            {kind === 'ceiling' ? 'Ceiling' : kind === 'floor' ? 'Floor' : 'Price'}: ${controlP.toFixed(2)}
          </text>
        </g>
      )}

      {/* Imbalance / shortage-surplus shading */}
      {showImbalance && controlP !== null && isBindingControl && (
        <g>
          {kind === 'ceiling' && qdAtControl > qsAtControl && (
            <rect
              x={xScale(qsAtControl)}
              y={yScale(controlP) - 5}
              width={xScale(qdAtControl) - xScale(qsAtControl)}
              height={10}
              fill="#d9523a"
              opacity="0.2"
            />
          )}
          {kind === 'floor' && qsAtControl > qdAtControl && (
            <rect
              x={xScale(qdAtControl)}
              y={yScale(controlP) - 5}
              width={xScale(qsAtControl) - xScale(qdAtControl)}
              height={10}
              fill="#d99a26"
              opacity="0.25"
            />
          )}
        </g>
      )}

      {/* Disequilibrium lines for equilibrium experiment */}
      {showImbalance && controlP !== null && !kind && eq && (
        <g>
          {/* QD line (blue) */}
          <line x1={xScale(0)} y1={yScale(controlP)} x2={xScale(qdAtControl)} y2={yScale(controlP)} stroke="#3b6fd6" strokeWidth="3" opacity="0.5" />
          <line x1={xScale(qdAtControl)} y1={yScale(controlP)} x2={xScale(qdAtControl)} y2={yScale(0)} stroke="#3b6fd6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          {/* QS line (orange) */}
          <line x1={xScale(0)} y1={yScale(controlP)} x2={xScale(qsAtControl)} y2={yScale(controlP)} stroke="#d97026" strokeWidth="3" opacity="0.5" />
          <line x1={xScale(qsAtControl)} y1={yScale(controlP)} x2={xScale(qsAtControl)} y2={yScale(0)} stroke="#d97026" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          {/* Shortage/surplus bar */}
          {Math.abs(qdAtControl - qsAtControl) > 0.05 && (
            <rect
              x={xScale(Math.min(qdAtControl, qsAtControl))}
              y={yScale(controlP) - 6}
              width={Math.abs(xScale(qdAtControl) - xScale(qsAtControl))}
              height={12}
              fill={qdAtControl > qsAtControl ? '#d9523a' : '#d99a26'}
              opacity="0.3"
              rx="2"
            />
          )}
          <circle cx={xScale(qdAtControl)} cy={yScale(controlP)} r="4" fill="#3b6fd6" stroke="white" strokeWidth="1.5" />
          <circle cx={xScale(qsAtControl)} cy={yScale(controlP)} r="4" fill="#d97026" stroke="white" strokeWidth="1.5" />
        </g>
      )}

      {/* Demand curve */}
      <line x1={demandPath.x1} y1={demandPath.y1} x2={demandPath.x2} y2={demandPath.y2} stroke="#3b6fd6" strokeWidth="3" strokeLinecap="round" />
      {/* Supply curve */}
      <line x1={supplyPath.x1} y1={supplyPath.y1} x2={supplyPath.x2} y2={supplyPath.y2} stroke="#d97026" strokeWidth="3" strokeLinecap="round" />

      {/* Curve labels */}
      <text x={demandPath.x2 - 4} y={demandPath.y2 - 8} textAnchor="end" fontSize={compact ? 11 : 13} fill="#2a54b0" fontWeight="800">D</text>
      <text x={supplyPath.x2 - 6} y={supplyPath.y2 - 8} textAnchor="end" fontSize={compact ? 11 : 13} fill="#b3561b" fontWeight="800">S</text>

      {/* Equilibrium marker */}
      {showEquilibrium && eq && (
        <g>
          <line x1={PAD.left} y1={yScale(eq.price)} x2={xScale(eq.quantity)} y2={yScale(eq.price)} stroke="#3da561" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
          <line x1={xScale(eq.quantity)} y1={yScale(eq.price)} x2={xScale(eq.quantity)} y2={H - PAD.bottom} stroke="#3da561" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
          <circle cx={xScale(eq.quantity)} cy={yScale(eq.price)} r="7" fill="#3da561" stroke="white" strokeWidth="2.5" className="animate-pulse-dot" style={{ transformOrigin: `${xScale(eq.quantity)}px ${yScale(eq.price)}px` }} />
          <text x={xScale(eq.quantity) + 12} y={yScale(eq.price) - 10} fontSize={11} fill="#2e884e" fontWeight="700">
            E (P=${round(eq.price)}, Q={round(eq.quantity)})
          </text>
        </g>
      )}

      {/* Legend */}
      <g transform={`translate(${PAD.left + 8}, ${PAD.top + 4})`}>
        <rect x="0" y="0" width={compact ? 120 : 140} height={compact ? 40 : 46} rx="6" fill="white" fillOpacity="0.85" stroke="#e8edf4" />
        <line x1="10" y1="16" x2="28" y2="16" stroke="#3b6fd6" strokeWidth="3" />
        <text x="34" y="19" fontSize={10} fill="#1a2a48" fontWeight="600">Demand</text>
        <line x1="10" y1="34" x2="28" y2="34" stroke="#d97026" strokeWidth="3" />
        <text x="34" y="37" fontSize={10} fill="#1a2a48" fontWeight="600">Supply</text>
      </g>
    </svg>
  );
}
