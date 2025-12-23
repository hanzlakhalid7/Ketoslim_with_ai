
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ messages: ['msg1', 'msg2'] }),
  })
) as jest.Mock;

import HomeForm from '../components/HomeForm';
import { ParameterContext } from '../components/ParameterContext';

describe('HomeForm integration', () => {
  it('fills form and submits calling setFormData and navigate', async () => {
    const user = userEvent.setup();
    const setFormData = jest.fn();
    const setMode = jest.fn();
    const setResultArray = jest.fn();

    render(
      <ParameterContext.Provider value={{
        formData: {},
        setFormData,
        mode: false,
        setMode,
        resultArray: [],
        setResultArray
      }}>
        <HomeForm />
      </ParameterContext.Provider>
    );


    // 1. Select Gender
    // GenderField uses manually built radios without label tags for text association
    const radios = screen.getAllByRole('radio');
    const maleRadio = radios.find(r => r.getAttribute('value') === 'male');
    expect(maleRadio).toBeInTheDocument();
    await user.click(maleRadio!);

    // 2. Set Ranges (Body Fat, BMI)
    // There are two range sliders. distinct logic might be needed if they lack unique labels.
    // In HomeForm: <RangeField label="Body Fat %" ... /> and <RangeField label="BMI" ... />
    // RangeField usually has a label. Let's try finding by label text if possible, or falls back to all sliders.
    // But RangeField implementation (seen in file list, not content) probably has implicit label association?
    // Let's rely on getAllByRole('slider') as before but cleaner.
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    fireEvent.change(sliders[0], { target: { value: '25' } }); // Fat Scale
    fireEvent.change(sliders[1], { target: { value: '25' } }); // BMI

    // 3. Number Fields
    // Height
    const heightInput = screen.getByText(/Height/i).parentElement?.querySelector('input');
    // Or better: looks like Field component has label.
    // Let's assume the previous test used placeholders or similar.
    // The previous test used placeholder for calories but manual selectors for others?
    // Let's match the labels from HomeForm.tsx: "Height (centimeters)", "Weight (kilograms)", "Age", "Daily Calorie Target", etc.

    // Using simple "getByLabelText" might fail if 'for' attribute isn't set on label.
    // Let's inspect HomeForm.tsx again.
    // <NumberField label="Height (centimeters)" ... />
    // If NumberField doesn't associate label with input using id/for, we can't use getByLabelText.
    // Let's look at NumberField if needed, but safe bet is placeholder or strict structure.
    // HomeForm.tsx doesn't show placeholders for Height/Weight/Age, only for Calorie/WeightLoss/Days.

    // We can target by finding the label text and getting the input sibling/child.
    // But simpler: just get all 'spinbutton' types (number inputs) and assign based on order?
    // Order in form: Height, Weight, Age, Calories, Weight Loss, Days.
    // Calories, WeightLoss, Days have placeholders.
    // Height, Weight, Age do not.

    const numberInputs = screen.getAllByRole('spinbutton');
    // Height is 1st number input (index 0) if sliders use range type.
    // Wait, let's verify RangeField uses type="range".
    // Yes, sliders[0] worked.

    // New validation:
    // 0: Height
    // 1: Weight
    // 2: Age
    // 3: Calories
    // 4: Weight Loss
    // 5: Days

    // Wait, water is a select (combobox).

    // Let's assume order is consistent.
    fireEvent.change(numberInputs[0], { target: { value: '175' } }); // Height
    fireEvent.change(numberInputs[1], { target: { value: '70' } });  // Weight
    fireEvent.change(numberInputs[2], { target: { value: '30' } });  // Age

    // Calories (has placeholder)
    const calories = screen.getByPlaceholderText('e.g. 2000');
    fireEvent.change(calories, { target: { value: '2000' } });

    // Water (Select)
    const waterSelect = screen.getByRole('combobox');
    await user.selectOptions(waterSelect, '2');

    // Weight Loss (has placeholder)
    const weightLoss = screen.getByPlaceholderText('e.g. 1.5');
    fireEvent.change(weightLoss, { target: { value: '1.5' } });

    // Days (has placeholder)
    const days = screen.getByPlaceholderText('e.g. 30');
    fireEvent.change(days, { target: { value: '30' } });

    // Submit
    const btn = screen.getByRole('button', { name: /See My Results/i });
    expect(btn).not.toBeDisabled();

    await user.click(btn);

    await waitFor(() => {
      expect(setFormData).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/Result');
    });
  });
});
