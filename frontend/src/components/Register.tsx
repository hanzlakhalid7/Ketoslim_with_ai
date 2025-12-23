import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/images/logo.png';
import { ParameterContext } from './ParameterContext';

function Register() {
    const { mode } = useContext(ParameterContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3000/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user' }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Registration failed.');
            }

            const data = await res.json();
            const token = data.token;

            if (token) {
                localStorage.setItem('token', token);
                // Proceed to fill the form
                navigate('/form');
            } else {
                // Fallback to login if no token returned (though controller shows it returns token)
                navigate('/');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'} min-h-screen flex flex-col items-center py-6 px-4`}>
            <ThemeToggle />

            <img src={logoImg} className="h-10 mb-3" alt="logo" />

            <div className="flex text-[34px] leading-[1.2em] font-semibold gap-2 mb-8">
                <h1 className={`${!mode ? 'text-black' : 'text-white'}`}>Create</h1>
                <h1 className="text-orange-600">Account</h1>
            </div>

            <div className={`w-full max-w-md shadow-lg p-8 rounded-2xl ${!mode ? 'bg-white text-black' : 'dMB text-white'}`}>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl outline-none border ${!mode ? 'bg-white border-gray-200' : 'bg-transparent border-gray-700'}`}
                            placeholder="Enter your name"
                        />
                    </div>

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
                            placeholder="Create a password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl mt-2 hover:bg-orange-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <button onClick={() => navigate('/')} className="text-orange-600 font-semibold hover:underline">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
