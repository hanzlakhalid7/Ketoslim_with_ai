
import { render, screen, fireEvent } from '@testing-library/react';
import RangeField from '../components/form-fields/RangeField';

describe('RangeField', () => {
  it('renders with label and displays value', async () => {
    const onChange = jest.fn();
    render(<RangeField label="Body Fat %" min={0} max={100} value={5} onChange={onChange} />);

    expect(screen.getByText('Body Fat %')).toBeInTheDocument();
    const range = screen.getByRole('slider');
    expect(range).toHaveValue('5');

    // simulate changing the range value to 20
    fireEvent.change(range, { target: { value: '20' } });
    // onChange is controlled by the component; assert that callback was called at least once
    expect(onChange).toHaveBeenCalled();
  });
});
