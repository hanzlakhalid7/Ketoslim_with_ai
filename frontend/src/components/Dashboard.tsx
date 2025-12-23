import { useEffect, useState, useContext } from 'react';
import { ParameterContext } from './ParameterContext';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import PlanDisplay from './PlanDisplay';
import UpdateStats from './UpdateStats';

interface DayPlan {
    day: string;
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
}

const Dashboard = () => {
    const { mode } = useContext(ParameterContext);
    const [currentPlan, setCurrentPlan] = useState<DayPlan[]>([]);
    const [history, setHistory] = useState<any[]>([]); // Store raw history objects

    // View State
    const [activeTab, setActiveTab] = useState<'current' | 'history' | 'update'>('current');
    const [selectedHistory, setSelectedHistory] = useState<DayPlan[] | null>(null); // To view specific history

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // -------------------------------------------------------------------------
    // 1. Initial Load & Generation Logic
    // -------------------------------------------------------------------------
    useEffect(() => {
        const initDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            // Check generation flag
            if (location.state?.generatePlan) {
                await handleGeneration(token);
            } else {
                // Normal Fetch of Current Plan
                await fetchCurrentPlan(token);
            }
        };

        initDashboard();
    }, [navigate, location.state]);

    // -------------------------------------------------------------------------
    // Core Functions
    // -------------------------------------------------------------------------

    const handleGeneration = async (token: string) => {
        setGenerating(true);
        setLoading(true);

        let sourceData = location.state?.formData;

        // Fallback Fetch
        if (!sourceData || Object.keys(sourceData).length === 0 || !sourceData.weight) {
            try {
                const formRes = await fetch('http://localhost:3000/Form/getById', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (formRes.ok) {
                    const formDataJson = await formRes.json();
                    if (formDataJson.forms && formDataJson.forms.length > 0) {
                        sourceData = formDataJson.forms[formDataJson.forms.length - 1];
                    }
                }
            } catch (e) {
                console.error("Failed to fetch fallback form data", e);
            }
        }

        if (!sourceData || !sourceData.weight) {
            alert("Could not retrieve details. Please fill out the form again.");
            navigate('/');
            return;
        }

        try {
            // --- CONTEXTUAL GENERATION ---
            // Fetch history first to provide context for the new plan
            let previousContext = {};
            try {
                const historyRes = await fetch('http://localhost:3000/MealPlan/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (historyRes.ok) {
                    const histData = await historyRes.json();
                    if (histData.plans && histData.plans.length > 0) {
                        const latestPrev = histData.plans[0];
                        // Normalize plan items
                        const prevItems = normalizePlan(latestPrev);
                        previousContext = {
                            previous_plan: prevItems,
                            previous_stats: latestPrev.stats || null
                        };
                        console.log("Using previous context for generation:", previousContext);
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch history for context, proceeding without it.", e);
            }

            const { image, ...generationPayload } = sourceData;

            // Build Payload
            const payload = {
                ...generationPayload,
                weight: Math.round(Number(generationPayload.weight)),
                height: Math.round(Number(generationPayload.height)),
                age: Math.round(Number(generationPayload.age)),
                days: Math.round(Number(generationPayload.days)),
                ...previousContext // Add previous_plan and previous_stats
            };

            const fastApiRes = await fetch('http://localhost:8000/getMealPlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!fastApiRes.ok) throw new Error('Generation failed');
            const mealPlanData = await fastApiRes.json();
            const itemsToSave = mealPlanData.plan || mealPlanData;

            // Save to Backend with stats
            const saveRes = await fetch('http://localhost:3000/MealPlan/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: itemsToSave, stats: generationPayload })
            });
            if (!saveRes.ok) throw new Error('Save failed');

            // Set Current Plan
            const final = normalizePlan(itemsToSave);
            setCurrentPlan(final);
            setActiveTab('current');

        } catch (error) {
            console.error("Generation error", error);
            alert("Generation failed. Please try again.");
            await fetchCurrentPlan(token);
        } finally {
            setGenerating(false);
            setLoading(false);
        }
    };

    const fetchCurrentPlan = async (token: string) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/MealPlan/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentPlan(normalizePlan(data.mealPlan));
            } else {
                setCurrentPlan([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:3000/MealPlan/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setHistory(data.plans || []);
            }
        } catch (e) {
            console.error("Fetch history failed", e);
        }
    };

    const normalizePlan = (data: any): DayPlan[] => {
        if (!data) return [];
        let planData = data;
        if (planData.plan && Array.isArray(planData.plan)) {
            planData = planData.plan;
        } else if (Array.isArray(planData) && planData.length > 0 && planData[0].plan) {
            planData = planData[0].plan;
        } else if (planData.items && (planData.items.plan || Array.isArray(planData.items))) {
            return normalizePlan(planData.items);
        }
        return Array.isArray(planData) ? planData : [];
    };

    const renderStatsSummary = (stats: any | undefined) => {
        if (!stats) return null;
        return (
            <div className={`p-4 rounded-xl mb-6 shadow-sm ${!mode ? 'bg-orange-50 border border-orange-100' : 'bg-gray-800 border border-gray-700'}`}>
                <h4 className="font-bold text-orange-500 uppercase tracking-wider text-xs mb-3">Snapshot Stats:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-2">
                    {stats.weight && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Weight</span><span className="font-bold text-sm">{stats.weight} kg</span></div>}
                    {stats.fatScale && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Fat %</span><span className="font-bold text-sm">{stats.fatScale}%</span></div>}
                    {stats.bmi && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">BMI</span><span className="font-bold text-sm">{stats.bmi}</span></div>}
                    {stats.calorie && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Calories</span><span className="font-bold text-sm">{stats.calorie} kcal</span></div>}
                    {stats.water && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Water</span><span className="font-bold text-sm">{stats.water} Cups</span></div>}

                    {stats.weightLoss && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Goal</span><span className="font-bold text-sm">-{stats.weightLoss} lbs/wk</span></div>}
                    {stats.days && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Duration</span><span className="font-bold text-sm">{stats.days} Days</span></div>}
                    {stats.height && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Height</span><span className="font-bold text-sm">{stats.height} cm</span></div>}
                    {stats.age && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Age</span><span className="font-bold text-sm">{stats.age}</span></div>}
                    {stats.gender && <div className="flex flex-col"><span className="text-[10px] opacity-70 uppercase tracking-wide">Gender</span><span className="font-bold text-sm capitalize">{stats.gender}</span></div>}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    if (loading) {
        return (
            <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'} min-h-screen flex items-center justify-center flex-col`}>
                <p className="text-xl font-bold mb-4">
                    {generating ? "Creating your new weekly meal plan..." : "Loading Dashboard..."}
                </p>
                {generating && <p className="text-sm opacity-75">Analyzing your new stats and previous progress...</p>}
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col md:flex-row ${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'}`}>
            {/* Sidebar */}
            <aside className={`w-full md:w-64 p-6 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r ${!mode ? 'border-gray-200 bg-white' : 'border-gray-800 dMB'}`}>
                <img src={logoImg} className="h-8 mb-8 cursor-pointer" alt="Logo" onClick={() => navigate('/')} />

                <nav className="flex flex-row md:flex-col gap-4 w-full overflow-x-auto md:overflow-visible no-scrollbar">
                    <button
                        onClick={() => { setActiveTab('current'); setSelectedHistory(null); }}
                        className={`px-4 py-3 rounded-xl font-semibold text-left transition whitespace-nowrap ${activeTab === 'current' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Current Meal Plan
                    </button>
                    <button
                        onClick={() => { setActiveTab('update'); setSelectedHistory(null); }}
                        className={`px-4 py-3 rounded-xl font-semibold text-left transition whitespace-nowrap ${activeTab === 'update' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Update My Stats
                    </button>
                    <button
                        onClick={() => { setActiveTab('history'); setSelectedHistory(null); }}
                        className={`px-4 py-3 rounded-xl font-semibold text-left transition whitespace-nowrap ${activeTab === 'history' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Plan History
                    </button>
                </nav>

                <div className="mt-auto pt-8 w-full flex justify-center md:justify-start">
                    <ThemeToggle />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">
                        {activeTab === 'current' && 'Your Weekly Meal Plan'}
                        {activeTab === 'update' && 'Prepare for Next Week'}
                        {activeTab === 'history' && 'Your Progress History'}
                    </h1>
                </header>

                <div className="max-w-6xl mx-auto">
                    {activeTab === 'current' && (
                        <div className="animate-fade-in-up">
                            {currentPlan.length > 0 ? (
                                <PlanDisplay plans={currentPlan} />
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <p className="text-lg opacity-60 mb-4">No meal plan active for this week.</p>
                                    <button
                                        onClick={() => setActiveTab('update')}
                                        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition"
                                    >
                                        Generate New Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'update' && (
                        <div className="animate-fade-in-up">
                            <UpdateStats />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="animate-fade-in-up w-full">
                            {selectedHistory ? (
                                <div>
                                    <button onClick={() => setSelectedHistory(null)} className="mb-4 text-sm text-orange-500 hover:underline font-bold">← Back to History List</button>

                                    {/* Link Stats to Selected History */}
                                    {(() => {
                                        const raw = (selectedHistory as any)._raw;
                                        return raw ? renderStatsSummary(raw.stats) : null;
                                    })()}

                                    <PlanDisplay plans={selectedHistory} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((h, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                const plan = normalizePlan(h);
                                                (plan as any)._raw = h; // Attach raw object to access stats later
                                                setSelectedHistory(plan);
                                            }}
                                            className={`p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex justify-between items-center ${!mode ? 'bg-white' : 'border border-gray-700 bg-transparent'}`}
                                        >
                                            <div>
                                                <h3 className="font-bold text-lg">Plan Generated on {new Date(h.createdAt).toLocaleDateString()}</h3>
                                                <div className="flex gap-4 text-sm opacity-60 mt-1">
                                                    <span>{normalizePlan(h).length > 0 ? normalizePlan(h).length + ' Days' : 'Plan Details'}</span>
                                                    {h.stats && <span>• {h.stats.weight}kg • {h.stats.calorie}kcal</span>}
                                                </div>
                                            </div>
                                            <span className="text-orange-500 font-bold bg-orange-100 px-4 py-2 rounded-lg">View Plan →</span>
                                        </div>
                                    ))}
                                    {history.length === 0 && <p className="opacity-60">No history found.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
