import { useContext } from 'react';
import { ParameterContext } from './ParameterContext';

interface DayPlan {
    day: string;
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
}

interface Props {
    plans: DayPlan[];
}

export default function PlanDisplay({ plans }: Props) {
    const { mode } = useContext(ParameterContext);

    if (!plans || plans.length === 0) {
        return <div className="text-center py-10 opacity-70">No meal plan data available.</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
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
    );
}
