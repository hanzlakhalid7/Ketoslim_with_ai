
import { render, screen } from '@testing-library/react';
import UpdateStats from '../components/UpdateStats';
import { ParameterContext } from '../components/ParameterContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../components/form-fields/GenderField', () => () => <div data-testid="gender-field" />);
jest.mock('../components/form-fields/RangeField', () => () => <div data-testid="range-field" />);
jest.mock('../components/form-fields/NumberField', () => () => <div data-testid="number-field" />);
jest.mock('../components/home-form/HealthScanSection', () => () => <div data-testid="health-scan" />);
jest.mock('../components/home-form/CameraModal', () => () => <div data-testid="camera-modal" />);

describe('UpdateStats Component', () => {
    it('renders form and elements', () => {
        render(
            <ParameterContext.Provider value={{
                formData: { gender: 'male' }, // provide some initial data
                setFormData: jest.fn(),
                mode: false,
                setMode: jest.fn(),
                resultArray: [],
                setResultArray: jest.fn()
            }}>
                <UpdateStats />
            </ParameterContext.Provider>
        );

        expect(screen.getByText(/Update Health Stats & Generate Plan/i)).toBeInTheDocument();
        expect(screen.getByTestId('health-scan')).toBeInTheDocument();

        // Check for some fields via mocked test IDs
        expect(screen.getByTestId('gender-field')).toBeInTheDocument();
        expect(screen.getAllByTestId('range-field').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('number-field').length).toBeGreaterThan(0);
    });
});
