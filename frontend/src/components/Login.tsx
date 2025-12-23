import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/images/logo.png';
import { ParameterContext } from './ParameterContext';

function Login() {
    const { mode, setResultArray, setFormData } = useContext(ParameterContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Login
            const loginRes = await fetch('http://localhost:3000/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!loginRes.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const loginData = await loginRes.json();
            const token = loginData.token || loginData.user?.token; // Adjust based on actual response structure

            if (!token) {
                // If token is in cookie or header, handle accordingly. Assuming response body for now.
                // Based on typical JWT flows.
            }

            localStorage.setItem('token', token); // Optional: if you want persistence

            // 2. Fetch Messages (Results) and Form Data
            // We need to pass the token in headers
            const [resultsRes, formsRes] = await Promise.all([
                fetch('http://localhost:3000/Result/getById', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/Form/getById', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!resultsRes.ok) {
                if (resultsRes.status === 404) {
                    throw new Error('No saved plans found for this user.');
                }
                throw new Error('Failed to fetch plans.');
            }

            const resultsData = await resultsRes.json();

            if (resultsData.results && resultsData.results.length > 0) {
                const latestResult = resultsData.results[resultsData.results.length - 1];
                setResultArray(latestResult.steps);

                // Handle Form Data
                if (formsRes.ok) {
                    const formsData = await formsRes.json();
                    if (formsData.forms && formsData.forms.length > 0) {
                        const latestForm = formsData.forms[formsData.forms.length - 1];
                        // Update Context with fetched form data
                        // Ensure we map correctly to FormData interface
                        setFormData({
                            gender: latestForm.gender,
                            fatScale: latestForm.fatScale,
                            height: latestForm.height || 0,
                            weight: latestForm.weight || 0,
                            age: latestForm.age || 0,
                            bmi: latestForm.bmi,
                            calorie: latestForm.calorie,
                            water: latestForm.water,
                            weightLoss: latestForm.weightLoss,
                            days: latestForm.days,
                            image: latestForm.image || undefined // Ensure image text/string is stored
                        });
                    }
                }

                navigate('/Result');
            } else {
                setError('No saved plans found.');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'} min-h-screen flex flex-col items-center py-6 px-4`}>
            <ThemeToggle />

            <img src={logoImg} className="h-10 mb-3" alt="logo" />

            <div className="flex text-[34px] leading-[1.2em] font-semibold gap-2 mb-8">
                <h1 className={`${!mode ? 'text-black' : 'text-white'}`}>Welcome</h1>
                <h1 className="text-orange-600">Back</h1>
            </div>

            <div className={`w-full max-w-md shadow-lg p-8 rounded-2xl ${!mode ? 'bg-white text-black' : 'dMB text-white'}`}>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl outline-none border ${!mode ? 'bg-white border-gray-200' : 'bg-transparent border-gray-700'}`}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl outline-none border ${!mode ? 'bg-white border-gray-200' : 'bg-transparent border-gray-700'}`}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl mt-2 hover:bg-orange-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Don't have an account? </span>
                    <button onClick={() => navigate('/register')} className="text-orange-600 font-semibold hover:underline">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
