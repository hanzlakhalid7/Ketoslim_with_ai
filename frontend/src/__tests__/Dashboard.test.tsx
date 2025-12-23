
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard'; // adjust path to component
import { ParameterContext } from '../components/ParameterContext';

// Mock mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
}));

// Mock PlanDisplay and UpdateStats (children) to simplify test
jest.mock('../components/PlanDisplay', () => () => <div data-testid="plan-display">Mock PlanDisplay</div>);
jest.mock('../components/UpdateStats', () => () => <div data-testid="update-stats">Mock UpdateStats</div>);
jest.mock('../components/ThemeToggle', () => () => null);

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'fake-token');
    });

    it('renders loading state then content', async () => {
        // Mock successful plan fetch
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ mealPlan: [] }),
        });

        render(
            <ParameterContext.Provider value={{
                formData: {},
                setFormData: jest.fn(),
                mode: false,
                setMode: jest.fn(),
                resultArray: [],
                setResultArray: jest.fn()
            }}>
                <Dashboard />
            </ParameterContext.Provider>
        );

        // Initial loading
        expect(screen.getByText(/Loading Dashboard/i)).toBeInTheDocument();

        // Wait for fetch
        await waitFor(() => {
            // Should show "Your Weekly Meal Plan"
            expect(screen.getByText(/Your Weekly Meal Plan/i)).toBeInTheDocument();
        });
    });

    it('redirects if no token', async () => {
        localStorage.removeItem('token');
        render(
            <ParameterContext.Provider value={{
                formData: {},
                setFormData: jest.fn(),
                mode: false,
                setMode: jest.fn(),
                resultArray: [],
                setResultArray: jest.fn()
            }}>
                <Dashboard />
            </ParameterContext.Provider>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
