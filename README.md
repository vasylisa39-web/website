# The Market Lab — Interactive Economics Learning Website

An interactive educational website that teaches microeconomics through visual explanations, live graphs, simulations, and quizzes.

## Topics Covered

1. **Supply & Demand** — the laws of demand and supply, with sliders to shift curves in real time
2. **Market Equilibrium** — calculate equilibrium dynamically; experiment with prices above and below to create shortages and surpluses
3. **Price Elasticity** — midpoint-method calculator, three demand types, total-revenue experiment, determinants
4. **Price Controls** — ceiling and floor simulator showing binding vs non-binding controls
5. **Interactive Quiz** — 14 questions across all topics with graphs, scenarios, instant feedback, and explanations

## Getting Started

```bash
# install dependencies
npm install

# start the development server
npm run dev

# build for production
npm run build

# preview the production build
npm run preview
```

The dev server runs entirely in the browser — no backend or database required.

## Project Structure

```
src/
  components/
    Navbar.tsx           — top navigation (responsive, mobile menu)
    Footer.tsx           — site footer with links
    HeroSection.tsx      — homepage hero with live mini-graph
    TopicCard.tsx        — homepage topic cards
    SupplyDemandGraph.tsx — reusable SVG supply & demand chart
    PageHeader.tsx       — shared page header (eyebrow, title, next link)
    Collapsible.tsx      — progressive-disclosure expandable sections
    KeyTakeaway.tsx      — end-of-topic summary box
  pages/
    HomePage.tsx
    SupplyDemandPage.tsx
    EquilibriumPage.tsx
    ElasticityPage.tsx
    PriceControlsPage.tsx
    QuizPage.tsx
  lib/
    economics.ts         — all economic calculations (equilibrium, elasticity, price controls)
    quizData.ts          — quiz questions and answers
  App.tsx                — page router (hash-based navigation)
  main.tsx
  index.css              — Tailwind + custom component classes
```

## How to Edit

### Change colours
Open `tailwind.config.js` — the `colors` section defines the full palette (navy, cream, demand, supply, success, warning, error). Edit the hex values there and the whole site updates.

### Change text content
Each page is in `src/pages/`. Explanations, definitions, examples, and common-mistakes sections are written directly in the JSX — just edit the text between the tags.

### Change the graph behaviour
`src/components/SupplyDemandGraph.tsx` is the reusable chart. It takes `demand` and `supply` curves plus optional `equilibrium`, `controlledPrice`, and `kind` props. The chart scales automatically.

### Change the economic model
`src/lib/economics.ts` defines the linear supply and demand functions and all calculations:
- `DEFAULT_DEMAND` and `DEFAULT_SUPPLY` set the baseline curves (`P = intercept + slope * Q`)
- `calcEquilibrium`, `calcDisequilibrium`, `calcPriceControl`, `calcElasticityMidpoint` do the math
- Change the intercepts/slopes to use a different baseline market

### Add or edit quiz questions
`src/lib/quizData.ts` contains the `QUIZ_QUESTIONS` array. Each question has a `topic`, `type`, `question`, `choices`, `correctIndex`, and `explanation`. Add new objects to the array to extend the quiz.

## Economic Model

All curves are linear: **P = intercept + slope × Q**. The default market uses:
- Demand: P = 10 − 0.5Q (downward sloping)
- Supply: P = 1 + 0.4Q (upward sloping)

These are illustrative values for teaching, not real market data. Equilibrium, shortages, surpluses, and elasticity are all calculated dynamically from these functions.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Custom **SVG** charts (no external chart library) for full control over the visuals

## Working Together (Git)

This project is structured for collaboration:
- Each topic is a self-contained page — two people can work on different topics without conflicts
- Shared calculations live in `src/lib/economics.ts`
- The reusable chart is in one file so visual changes apply everywhere

```bash
git init
git add .
git commit -m "Initial commit: The Market Lab"
git remote add origin <your-repo-url>
git push -u origin main
```
