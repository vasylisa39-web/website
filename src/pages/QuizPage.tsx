import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ChevronRight, Award, Brain } from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/lib/quizData';

interface Props {
  onNavigate: (page: PageId) => void;
}

type Phase = 'intro' | 'asking' | 'answered' | 'done';

function MiniQuizGraph({ type }: { type: string }) {
  const W = 220, H = 150, pad = 22;
  const axisColor = '#3a4a66';
  const demandColor = '#3b6fd6';
  const supplyColor = '#d97026';

  const render = () => {
    switch (type) {
      // Q3: supply shifts right. Q on x, P on y. Two upward supply curves S and S1 (S1 to the right), demand D downward.
      case 'shift-right':
        return (
          <>
            {/* Demand: downward sloping from left to right */}
            <line x1={pad} y1={pad + 8} x2={W - pad} y2={H - pad} stroke={demandColor} strokeWidth="2.5" />
            <text x={W - pad - 2} y={H - pad - 4} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
            {/* Supply S (original) */}
            <line x1={pad} y1={H - pad - 8} x2={W - pad - 30} y2={pad + 20} stroke={supplyColor} strokeWidth="2.5" />
            <text x={W - pad - 34} y={pad + 18} textAnchor="end" fontSize="11" fill={supplyColor} fontWeight="800">S</text>
            {/* Supply S1 (shifted right) */}
            <line x1={pad + 35} y1={H - pad - 8} x2={W - pad + 2} y2={pad + 20} stroke={supplyColor} strokeWidth="2.5" opacity="0.6" />
            <text x={W - pad - 2} y={pad + 18} textAnchor="end" fontSize="11" fill={supplyColor} fontWeight="800" opacity="0.7">S₁</text>
            {/* shift arrow */}
            <path d={`M ${pad + 70} ${H - pad - 30} L ${pad + 100} ${H - pad - 30}`} stroke="#22365e" strokeWidth="1.5" fill="none" markerEnd="url(#arrowQ3)" />
            <defs>
              <marker id="arrowQ3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#22365e" />
              </marker>
            </defs>
          </>
        );
      case 'surplus':
        return (
          <>
            <line x1={pad} y1={pad + 8} x2={W - pad} y2={H - pad} stroke={demandColor} strokeWidth="2.5" />
            <line x1={pad} y1={H - pad - 8} x2={W - pad} y2={pad + 18} stroke={supplyColor} strokeWidth="2.5" />
            <line x1={pad} y1={45} x2={W - pad} y2={45} stroke="#d99a26" strokeWidth="2" strokeDasharray="4 3" />
            <rect x={xScaleQ(45)} y={42} width={Math.abs(xScaleQ(75) - xScaleQ(45))} height={6} fill="#d99a26" opacity="0.4" />
            <text x={W - pad - 2} y={H - pad - 4} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
            <text x={W - pad - 2} y={pad + 16} textAnchor="end" fontSize="11" fill={supplyColor} fontWeight="800">S</text>
          </>
        );
      // Q6: shortage — shade triangle bounded by supply (left), demand (right), and the price line (bottom).
      // Apex is the actual intersection of the two curves.
      case 'shortage': {
        // Demand: (pad, pad+8) -> (W-pad, H-pad)
        // Supply: (pad, H-pad-8) -> (W-pad, pad+18)
        // Solve intersection: t = s, (pad+8) + t*((H-pad)-(pad+8)) = (H-pad-8) + t*((pad+18)-(H-pad-8))
        const dY0 = pad + 8, dY1 = H - pad;
        const sY0 = H - pad - 8, sY1 = pad + 18;
        const span = W - pad - pad;
        const tEq = (sY0 - dY0) / ((dY1 - dY0) - (sY1 - sY0));
        const eqX = pad + tEq * span;
        const eqY = dY0 + tEq * (dY1 - dY0);
        // price line clearly below equilibrium
        const priceLineY = Math.min(H - pad - 6, eqY + 22);
        // Qs: on supply at priceLineY
        const sT = (priceLineY - sY0) / (sY1 - sY0);
        const supplyX = pad + sT * span;
        // Qd: on demand at priceLineY
        const dT = (priceLineY - dY0) / (dY1 - dY0);
        const demandX = pad + dT * span;
        const triPoints = `${eqX.toFixed(1)},${eqY.toFixed(1)} ${supplyX.toFixed(1)},${priceLineY} ${demandX.toFixed(1)},${priceLineY}`;
        return (
          <>
            <line x1={pad} y1={dY0} x2={W - pad} y2={dY1} stroke={demandColor} strokeWidth="2.5" />
            <line x1={pad} y1={sY0} x2={W - pad} y2={sY1} stroke={supplyColor} strokeWidth="2.5" />
            <line x1={pad} y1={priceLineY} x2={W - pad} y2={priceLineY} stroke="#d9523a" strokeWidth="2" strokeDasharray="4 3" />
            <polygon points={triPoints} fill="#d9523a" opacity="0.2" />
            <text x={W - pad - 2} y={H - pad - 4} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
            <text x={W - pad - 2} y={pad + 16} textAnchor="end" fontSize="11" fill={supplyColor} fontWeight="800">S</text>
          </>
        );
      }
      // Q9: elasticity steep demand
      case 'elastic-steep':
        return (
          <>
            <line x1={pad + 40} y1={pad} x2={pad + 48} y2={H - pad} stroke={demandColor} strokeWidth="2.5" />
            <text x={pad + 56} y={pad + 12} fontSize="11" fill={demandColor} fontWeight="800">D (steep)</text>
          </>
        );
      case 'ceiling-binding':
        return (
          <>
            <line x1={pad} y1={pad + 8} x2={W - pad} y2={H - pad} stroke={demandColor} strokeWidth="2.5" />
            <line x1={pad} y1={H - pad - 8} x2={W - pad} y2={pad + 18} stroke={supplyColor} strokeWidth="2.5" />
            <line x1={pad} y1={90} x2={W - pad} y2={90} stroke="#d9523a" strokeWidth="2" strokeDasharray="4 3" />
            <text x={W - pad - 4} y={86} textAnchor="end" fontSize="9" fill="#d9523a" fontWeight="600">Ceiling</text>
            <text x={W - pad - 2} y={H - pad - 4} textAnchor="end" fontSize="11" fill={demandColor} fontWeight="800">D</text>
            <text x={W - pad - 2} y={pad + 16} textAnchor="end" fontSize="11" fill={supplyColor} fontWeight="800">S</text>
          </>
        );
      default:
        return null;
    }
  };
  function xScaleQ(q: number) { return pad + (q / 100) * (W - pad * 2); }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto">
      {/* axes: P (y), Q (x) */}
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke={axisColor} strokeWidth="1.5" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={axisColor} strokeWidth="1.5" />
      <text x={5} y={pad + 5} fontSize="11" fill={axisColor} fontWeight="700">P</text>
      <text x={W - pad - 2} y={H - 6} fontSize="11" fill={axisColor} fontWeight="700">Q</text>
      {render()}
    </svg>
  );
}

export default function QuizPage({ onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const total = QUIZ_QUESTIONS.length;
  const question: QuizQuestion | null = QUIZ_QUESTIONS[currentIdx] ?? null;
  const score = answers.filter(Boolean).length;

  const start = () => {
    setPhase('asking');
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
  };

  const selectAnswer = (i: number) => {
    if (phase !== 'asking') return;
    setSelected(i);
    const correct = i === question!.correctIndex;
    setAnswers((a) => [...a, correct]);
    setPhase('answered');
  };

  const next = () => {
    if (currentIdx + 1 >= total) {
      setPhase('done');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setPhase('asking');
    }
  };

  const progress = phase === 'done' ? 100 : (currentIdx / total) * 100;

  if (phase === 'intro') {
    return (
      <>
        <PageHeader
          eyebrow="Test Your Knowledge"
          title="Interactive Economics Quiz"
          subtitle="Fourteen questions across supply & demand, equilibrium, elasticity, and price controls. Graphs, scenarios, and instant explanations — no memorisation required."
          onNavigate={onNavigate}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 text-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 text-cream-50 mx-auto mb-5">
              <Brain size={32} />
            </span>
            <h2 className="text-2xl font-extrabold text-navy-900 mb-3">Ready to Begin?</h2>
            <p className="text-navy-600 mb-6 max-w-md mx-auto">
              {total} questions · immediate feedback with explanations · a running score and progress bar.
              Take your time — this is about reasoning, not speed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {['Supply & Demand', 'Equilibrium', 'Elasticity', 'Price Controls'].map((t) => (
                <div key={t} className="rounded-lg bg-navy-50 px-3 py-2 text-xs font-semibold text-navy-700">
                  {t}
                </div>
              ))}
            </div>
            <button onClick={start} className="btn-primary mx-auto">
              Start Quiz <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 90 ? 'Outstanding' : pct >= 75 ? 'Great work' : pct >= 50 ? 'Good effort' : 'Keep practising';
    return (
      <>
        <PageHeader eyebrow="Results" title="Quiz Complete" subtitle="Here is how you did across all four topics." onNavigate={onNavigate} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 text-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 text-cream-50 mx-auto mb-5">
              <Award size={32} />
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 mb-1">{grade}</h2>
            <p className="text-navy-600 mb-6">You scored</p>
            <div className="inline-flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-navy-900">{score}</span>
              <span className="text-2xl text-navy-400 font-bold">/ {total}</span>
              <span className="text-lg text-success-600 font-bold ml-2">({pct}%)</span>
            </div>

            {/* Per-topic breakdown */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6 text-left">
              {['Supply & Demand', 'Equilibrium', 'Elasticity', 'Price Controls'].map((topic) => {
                const topicQs = QUIZ_QUESTIONS.filter((q) => q.topic === topic);
                const correct = topicQs.filter((q) => answers[QUIZ_QUESTIONS.indexOf(q)]).length;
                return (
                  <div key={topic} className="rounded-xl bg-navy-50 px-4 py-3">
                    <p className="text-xs text-navy-500 font-semibold uppercase">{topic}</p>
                    <p className="text-lg font-bold text-navy-900">{correct} / {topicQs.length}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={start} className="btn-primary">
                <RotateCcw size={18} /> Restart Quiz
              </button>
              <button onClick={() => onNavigate('home')} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Asking / answered
  return (
    <>
      <PageHeader eyebrow={`Question ${currentIdx + 1} of ${total}`} title="Economics Quiz" subtitle="" onNavigate={onNavigate} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-semibold text-navy-600 mb-2">
            <span>Progress</span>
            <span>Score: {score} / {answers.length}</span>
          </div>
          <div className="h-2.5 bg-navy-100 rounded-full overflow-hidden">
            <div className="h-full bg-navy-900 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="label-tag bg-navy-100 text-navy-700">{question!.topic}</span>
            <span className="label-tag bg-supply-500/10 text-supply-600 capitalize">{question!.type}</span>
          </div>

          <h2 className="text-xl font-bold text-navy-900 mb-5 leading-relaxed">{question!.question}</h2>

          {question!.graph && (
            <div className="mb-5 rounded-xl bg-cream-100 border border-navy-100 p-4">
              <MiniQuizGraph type={question!.graph} />
            </div>
          )}

          <div className="space-y-3">
            {question!.choices.map((choice, i) => {
              const isCorrect = i === question!.correctIndex;
              const isSelected = i === selected;
              let style = 'border-navy-200 bg-white hover:bg-navy-50 hover:border-navy-300';
              if (phase === 'answered') {
                if (isCorrect) style = 'border-success-500 bg-success-400/10';
                else if (isSelected) style = 'border-error-500 bg-error-400/10';
                else style = 'border-navy-100 bg-navy-50/40 opacity-60';
              }
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  disabled={phase === 'answered'}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all flex items-start gap-3 ${style} ${phase === 'asking' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                    phase === 'answered' && isCorrect ? 'bg-success-500 text-white' :
                    phase === 'answered' && isSelected ? 'bg-error-500 text-white' :
                    'bg-navy-100 text-navy-700'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-navy-800 font-medium flex-1">{choice}</span>
                  {phase === 'answered' && isCorrect && <CheckCircle2 size={20} className="text-success-600 shrink-0" />}
                  {phase === 'answered' && isSelected && !isCorrect && <XCircle size={20} className="text-error-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {phase === 'answered' && (
            <div className={`mt-5 rounded-xl p-4 border-l-4 ${answers[answers.length - 1] ? 'border-success-500 bg-success-400/10' : 'border-error-500 bg-error-400/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                {answers[answers.length - 1] ? <CheckCircle2 size={18} className="text-success-600" /> : <XCircle size={18} className="text-error-500" />}
                <h4 className="font-bold text-navy-900">
                  {answers[answers.length - 1] ? 'Correct!' : 'Not quite.'}
                </h4>
              </div>
              <p className="text-sm text-navy-700 leading-relaxed">{question!.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {phase === 'answered' && (
            <div className="mt-6 flex justify-end">
              <button onClick={next} className="btn-primary">
                {currentIdx + 1 >= total ? 'See Results' : 'Next Question'}
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
