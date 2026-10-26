import { useState, useEffect } from 'react';
import Navbar, { PageId } from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import SupplyDemandPage from '@/pages/SupplyDemandPage';
import EquilibriumPage from '@/pages/EquilibriumPage';
import ElasticityPage from '@/pages/ElasticityPage';
import PriceControlsPage from '@/pages/PriceControlsPage';
import QuizPage from '@/pages/QuizPage';

function App() {
  const [page, setPage] = useState<PageId>(() => {
    const hash = window.location.hash.replace('#', '') as PageId;
    const valid: PageId[] = ['home', 'supply-demand', 'equilibrium', 'elasticity', 'price-controls', 'quiz'];
    return valid.includes(hash) ? hash : 'home';
  });

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  const navigate = (p: PageId) => setPage(p);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar current={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'supply-demand' && <SupplyDemandPage onNavigate={navigate} />}
        {page === 'equilibrium' && <EquilibriumPage onNavigate={navigate} />}
        {page === 'elasticity' && <ElasticityPage onNavigate={navigate} />}
        {page === 'price-controls' && <PriceControlsPage onNavigate={navigate} />}
        {page === 'quiz' && <QuizPage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
