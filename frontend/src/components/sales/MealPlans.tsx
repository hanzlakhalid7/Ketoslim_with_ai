import { useEffect, useState, useContext } from 'react';
import { ParameterContext } from '../ParameterContext';
import ThemeToggle from '../ThemeToggle';
import logoImg from '../../assets/images/logo.png';

interface DayPlan {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

const MealPlans = () => {
  const { mode } = useContext(ParameterContext);
  const [plans, setPlans] = useState<DayPlan[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("resultArray");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Handle both { plan: [...] } and direct array [...]
        if (parsed.plan && Array.isArray(parsed.plan)) {
          setPlans(parsed.plan);
        } else if (Array.isArray(parsed)) {
          setPlans(parsed);
        }
      } catch (e) {
        console.error("Failed to parse meal plans", e);
      }
    }
  }, []);

  if (plans.length === 0) {
    return (
      <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'} min-h-screen flex flex-col items-center justify-center p-6`}>
        <ThemeToggle />
        <img src={logoImg} className="h-10 mb-6" alt="" />
        <h1 className="text-3xl font-bold mb-4">No Meal Plans Found</h1>
        <p className="text-lg opacity-70">Please go back and generate your meal plan.</p>
      </div>
    );
  }

  return (
    <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'}`}>
      <div className="flex flex-col items-center min-h-screen px-4 py-6">
        <ThemeToggle />
        <img src={logoImg} className="h-10 mb-8" alt="" />

        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-center mb-8 textColor">Your 7-Day Custom Meal Plan</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((day, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-xl overflow-hidden flex flex-col ${!mode ? 'bg-white text-black' : 'dMB text-white'}`}
              >
                <div className="rangeColor p-4">
                  <h2 className="text-xl font-bold text-white text-center">{day.day}</h2>
                </div>
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h3 className="text-xs font-bold textColor uppercase tracking-wider mb-1">Breakfast</h3>
                    <p className="text-sm opacity-80">{day.breakfast}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold textColor uppercase tracking-wider mb-1">Lunch</h3>
                    <p className="text-sm opacity-80">{day.lunch}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold textColor uppercase tracking-wider mb-1">Snack</h3>
                    <p className="text-sm opacity-80">{day.snack}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold textColor uppercase tracking-wider mb-1">Dinner</h3>
                    <p className="text-sm opacity-80">{day.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlans;