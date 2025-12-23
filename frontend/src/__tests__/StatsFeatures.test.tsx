
import { render, screen } from '@testing-library/react';
import StatsFeatures from '../components/sales/StatsFeatures';

describe('StatsFeatures', () => {
  it('renders left and right stat blocks', () => {
    render(<StatsFeatures />);

    // left and right columns both include 'Body Fat'
    const matches = screen.getAllByText(/Body Fat/i);
    expect(matches.length).toBeGreaterThanOrEqual(2);
    // right column has 10-12% value present
    expect(screen.getByText('10-12%')).toBeInTheDocument();
  });
});
