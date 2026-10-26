// Economic calculation utilities for The Market Lab.
// Markets use linear supply and demand functions of the form P = intercept + slope * Q.

export interface LinearCurve {
  /** Price-axis intercept: price when Q = 0. */
  intercept: number;
  /** Slope: change in price per unit of quantity. */
  slope: number;
}

export interface MarketState {
  demand: LinearCurve;
  supply: LinearCurve;
}

export interface Equilibrium {
  price: number;
  quantity: number;
}

export const DEFAULT_DEMAND: LinearCurve = { intercept: 10, slope: -0.5 };
export const DEFAULT_SUPPLY: LinearCurve = { intercept: 1, slope: 0.4 };

export const PRICE_MIN = 0;
export const PRICE_MAX = 14;
export const QTY_MIN = 0;
export const QTY_MAX = 30;

export const round = (n: number, dp = 2): number => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const priceForQty = (curve: LinearCurve, q: number): number =>
  curve.intercept + curve.slope * q;

export const qtyForPrice = (curve: LinearCurve, p: number): number => {
  if (curve.slope === 0) return Infinity;
  return (p - curve.intercept) / curve.slope;
};

export const calcEquilibrium = (
  demand: LinearCurve,
  supply: LinearCurve
): Equilibrium => {
  // demand.intercept + demand.slope * Q = supply.intercept + supply.slope * Q
  const q = (supply.intercept - demand.intercept) / (demand.slope - supply.slope);
  return {
    price: round(priceForQty(demand, q)),
    quantity: round(q),
  };
};

export interface Disequilibrium {
  price: number;
  quantityDemanded: number;
  quantitySupplied: number;
  imbalance: number; // +ve = surplus, -ve = shortage
  type: 'shortage' | 'surplus' | 'equilibrium';
}

export const calcDisequilibrium = (
  demand: LinearCurve,
  supply: LinearCurve,
  price: number
): Disequilibrium => {
  const qd = clamp(qtyForPrice(demand, price), QTY_MIN, QTY_MAX);
  const qs = clamp(qtyForPrice(supply, price), QTY_MIN, QTY_MAX);
  const imbalance = round(qs - qd);
  return {
    price: round(price),
    quantityDemanded: round(qd),
    quantitySupplied: round(qs),
    imbalance,
    type:
      imbalance > 0.05 ? 'surplus' : imbalance < -0.05 ? 'shortage' : 'equilibrium',
  };
};

export interface PriceControlResult {
  controlledPrice: number;
  qd: number;
  qs: number;
  imbalance: number;
  type: 'shortage' | 'surplus' | 'none';
  isBinding: boolean;
  kind: 'ceiling' | 'floor';
}

export const calcPriceControl = (
  demand: LinearCurve,
  supply: LinearCurve,
  equilibriumPrice: number,
  controlledPrice: number,
  kind: 'ceiling' | 'floor'
): PriceControlResult => {
  const isBinding =
    kind === 'ceiling'
      ? controlledPrice < equilibriumPrice - 0.05
      : controlledPrice > equilibriumPrice + 0.05;
  const qd = clamp(qtyForPrice(demand, controlledPrice), QTY_MIN, QTY_MAX);
  const qs = clamp(qtyForPrice(supply, controlledPrice), QTY_MIN, QTY_MAX);
  const imbalance = round(qd - qs);
  return {
    controlledPrice: round(controlledPrice),
    qd: round(qd),
    qs: round(qs),
    imbalance,
    type: isBinding ? (imbalance > 0 ? 'shortage' : imbalance < 0 ? 'surplus' : 'none') : 'none',
    isBinding,
    kind,
  };
};

export interface ElasticityResult {
  elasticity: number;
  absElasticity: number;
  classification: 'elastic' | 'inelastic' | 'unit-elastic';
  pctChangePrice: number;
  pctChangeQty: number;
}

export const calcElasticityMidpoint = (
  p1: number,
  p2: number,
  q1: number,
  q2: number
): ElasticityResult | null => {
  if (p1 === p2 || q1 === q2) return null;
  if (p1 < 0 || p2 < 0 || q1 < 0 || q2 < 0) return null;
  const midP = (p1 + p2) / 2;
  const midQ = (q1 + q2) / 2;
  const pctChangePrice = ((p2 - p1) / midP) * 100;
  const pctChangeQty = ((q2 - q1) / midQ) * 100;
  const elasticity = pctChangeQty / pctChangePrice;
  const absElasticity = Math.abs(elasticity);
  const classification =
    absElasticity > 1.01
      ? 'elastic'
      : absElasticity < 0.99
        ? 'inelastic'
        : 'unit-elastic';
  return {
    elasticity: round(elasticity, 4),
    absElasticity: round(absElasticity, 4),
    classification,
    pctChangePrice: round(pctChangePrice),
    pctChangeQty: round(pctChangeQty),
  };
};

export const classifyElasticity = (absE: number): string => {
  if (absE > 1.01) return 'Elastic demand';
  if (absE < 0.99) return 'Inelastic demand';
  return 'Unit elastic demand';
};

export const calcTotalRevenue = (price: number, quantity: number): number =>
  round(price * quantity);
