export interface QuizQuestion {
  id: number;
  topic: 'Supply & Demand' | 'Equilibrium' | 'Elasticity' | 'Price Controls';
  type: 'concept' | 'graph' | 'scenario';
  question: string;
  // For graph questions, an optional mini SVG description
  graph?: 'shift-right' | 'surplus' | 'shortage' | 'elastic-steep' | 'ceiling-binding';
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Supply & Demand',
    type: 'concept',
    question: 'A new study shows that drinking coffee has significant health benefits. What happens to the demand curve for coffee?',
    choices: [
      'It shifts to the left (decrease in demand)',
      'It shifts to the right (increase in demand)',
      'There is a movement along the curve to a lower quantity',
      'Nothing happens to demand; only supply changes',
    ],
    correctIndex: 1,
    explanation: 'A change in tastes or preferences is a demand shifter. Positive health news makes consumers want more coffee at every price, shifting the demand curve to the right.',
  },
  {
    id: 2,
    topic: 'Supply & Demand',
    type: 'concept',
    question: 'The price of gasoline rises. Which of the following best describes the effect on demand for gasoline?',
    choices: [
      'Demand shifts to the left',
      'Demand shifts to the right',
      'There is a movement along the demand curve to a lower quantity demanded',
      'Demand does not change; supply shifts',
    ],
    correctIndex: 2,
    explanation: 'A change in the good\'s own price causes a movement ALONG the demand curve (a change in quantity demanded), not a shift of the curve. Shifts are caused by non-price determinants.',
  },
  {
    id: 3,
    topic: 'Supply & Demand',
    type: 'graph',
    graph: 'shift-right',
    question: 'The graph shows the supply curve shifting to the right (supply increases). Holding demand constant, what happens to equilibrium price and quantity?',
    choices: [
      'Price rises, quantity rises',
      'Price falls, quantity rises',
      'Price rises, quantity falls',
      'Price falls, quantity falls',
    ],
    correctIndex: 1,
    explanation: 'A rightward supply shift moves the intersection down and to the right along the demand curve. Equilibrium price falls and equilibrium quantity rises.',
  },
  {
    id: 4,
    topic: 'Supply & Demand',
    type: 'scenario',
    question: 'A frost destroys a large portion of Brazil\'s coffee crop. What is the most likely effect on the global coffee market?',
    choices: [
      'Supply shifts right, price falls',
      'Supply shifts left, price rises',
      'Demand shifts left, price falls',
      'Demand shifts right, price rises',
    ],
    correctIndex: 1,
    explanation: 'A destroyed crop reduces the amount producers can supply at every price — a leftward supply shift. With demand unchanged, the new equilibrium has a higher price and lower quantity.',
  },
  {
    id: 5,
    topic: 'Equilibrium',
    type: 'concept',
    question: 'At a price above the equilibrium price, which of the following is true?',
    choices: [
      'Quantity demanded equals quantity supplied',
      'There is a shortage (excess demand)',
      'There is a surplus (excess supply)',
      'The market is in equilibrium',
    ],
    correctIndex: 2,
    explanation: 'Above equilibrium, the higher price encourages producers to supply more but discourages buyers from demanding as much. Quantity supplied exceeds quantity demanded, creating a surplus.',
  },
  {
    id: 6,
    topic: 'Equilibrium',
    type: 'graph',
    graph: 'shortage',
    question: 'The graph shows a price set below the equilibrium price. The shaded gap between Qd and Qs represents:',
    choices: [
      'A surplus',
      'A shortage',
      'Equilibrium quantity',
      'Excess supply',
    ],
    correctIndex: 1,
    explanation: 'Below equilibrium, the low price means buyers want more than sellers provide. Quantity demanded exceeds quantity supplied — a shortage (excess demand). This puts upward pressure on price.',
  },
  {
    id: 7,
    topic: 'Equilibrium',
    type: 'scenario',
    question: 'Concert tickets for a popular artist are priced at $80, but millions of fans want to buy them and only 20,000 seats exist. The show sells out in minutes. This is an example of:',
    choices: [
      'Equilibrium — the market cleared',
      'A surplus of tickets',
      'A shortage at the $80 price',
      'A price floor',
    ],
    correctIndex: 2,
    explanation: 'At $80, quantity demanded (millions) far exceeds quantity supplied (20,000 seats). This is a shortage. In an unregulated market, price would rise until Qd = Qs — which is why resale prices often climb well above face value.',
  },
  {
    id: 8,
    topic: 'Elasticity',
    type: 'concept',
    question: 'Using the midpoint method, price rises from $4 to $6 and quantity demanded falls from 100 to 60. What is the price elasticity of demand (approximately)?',
    choices: [
      '|E| ≈ 0.75 (inelastic)',
      '|E| ≈ 1.25 (elastic)',
      '|E| ≈ 2.0 (elastic)',
      '|E| ≈ 1.0 (unit elastic)',
    ],
    correctIndex: 1,
    explanation: '%ΔP = (6−4)/5 × 100 = 40%. %ΔQ = (60−100)/80 × 100 = −50%. |E| = 50/40 = 1.25. Since |E| > 1, demand is elastic — quantity is quite responsive to price.',
  },
  {
    id: 9,
    topic: 'Elasticity',
    type: 'graph',
    graph: 'elastic-steep',
    question: 'The graph shows a steep (nearly vertical) demand curve. This most likely indicates:',
    choices: [
      'Elastic demand — buyers respond strongly to price',
      'Inelastic demand — buyers do not respond strongly to price',
      'Unit elastic demand',
      'Perfectly elastic demand',
    ],
    correctIndex: 1,
    explanation: 'A steep demand curve means large price changes cause only small changes in quantity — inelastic demand. This is typical of necessities with few substitutes, like insulin or basic fuel.',
  },
  {
    id: 10,
    topic: 'Elasticity',
    type: 'scenario',
    question: 'A pharmacy raises the price of a life-saving medication with no substitutes by 20% and sales fall by only 2%. This demand is:',
    choices: [
      'Elastic — revenue will fall',
      'Inelastic — revenue will rise',
      'Unit elastic — revenue stays the same',
      'Perfectly elastic — revenue drops to zero',
    ],
    correctIndex: 1,
    explanation: 'A tiny quantity response (2%) to a large price change (20%) means |E| ≈ 0.1 — very inelastic. With inelastic demand, a price increase raises total revenue because the quantity lost is small relative to the price gained.',
  },
  {
    id: 11,
    topic: 'Price Controls',
    type: 'concept',
    question: 'A government sets a price ceiling on bread at $5, but the equilibrium price of bread is $3. What is the effect?',
    choices: [
      'A shortage of bread',
      'A surplus of bread',
      'No effect — the ceiling is non-binding',
      'Equilibrium price rises to $5',
    ],
    correctIndex: 2,
    explanation: 'A ceiling is only binding when set BELOW equilibrium. At $5 (above the $3 equilibrium), the market already clears below the ceiling, so it has no effect on price or quantity.',
  },
  {
    id: 12,
    topic: 'Price Controls',
    type: 'graph',
    graph: 'ceiling-binding',
    question: 'The graph shows a binding price ceiling. Compared to equilibrium, what happens to quantity traded (the amount actually bought and sold)?',
    choices: [
      'It rises above equilibrium',
      'It stays at equilibrium',
      'It falls below equilibrium, equal to quantity supplied',
      'It falls below equilibrium, equal to quantity demanded',
    ],
    correctIndex: 2,
    explanation: 'When a binding ceiling creates a shortage, you cannot buy what sellers do not produce. The quantity actually traded is the quantity SUPPLIED (the smaller of Qd and Qs), which is below equilibrium.',
  },
  {
    id: 13,
    topic: 'Price Controls',
    type: 'scenario',
    question: 'A city imposes rent control (a price ceiling on rent) below the market equilibrium rent. In the basic supply-and-demand model, what is the most likely short-run result?',
    choices: [
      'A surplus of apartments and falling rents',
      'A shortage of apartments; quantity supplied falls',
      'No change in the housing market',
      'An increase in new construction',
    ],
    correctIndex: 1,
    explanation: 'A binding rent ceiling below equilibrium creates a shortage: more people want apartments than landlords offer. In the basic model, quantity supplied falls (landlords convert or neglect units), and new construction may slow. Real-world outcomes vary with policy design.',
  },
  {
    id: 14,
    topic: 'Price Controls',
    type: 'concept',
    question: 'Which statement about a binding price floor (like a minimum wage above equilibrium) is correct?',
    choices: [
      'It creates a shortage',
      'It creates a surplus (e.g. surplus labour / unemployment in the simple model)',
      'It has no effect on quantity',
      'It always improves outcomes for all sellers',
    ],
    correctIndex: 1,
    explanation: 'A binding floor above equilibrium means quantity supplied exceeds quantity demanded — a surplus. In the labour market, this surplus is unemployment in the simple model: more people want to work at the higher wage than employers are willing to hire.',
  },
];
