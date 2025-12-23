import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeForm from '../components/HomeForm';
import { ParameterContext } from '../components/ParameterContext';
import { MemoryRouter } from 'react-router-dom';

describe('HomeForm unit', () => {
  it('submit button is disabled until the form is valid', async () => {
    const user = userEvent.setup();
    const setFormData = jest.fn();

    render(
      <MemoryRouter>
        <ParameterContext.Provider value={{ formData: {}, setFormData, mode: false, setMode: jest.fn() }}>
          <HomeForm />
        </ParameterContext.Provider>
      </MemoryRouter>
    );

    const btn = screen.getByRole('button', { name: /See My Results/i });
    expect(btn).toBeDisabled();

    // select gender
    const maleInput = document.querySelector('input[name="gender"][value="male"]') as HTMLInputElement | null;
    await user.click(maleInput!);

    // set sliders (Body Fat and BMI)
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '25' } });
    fireEvent.change(sliders[1], { target: { value: '25' } });

    // daily calories
    const calories = screen.getByPlaceholderText('e.g. 2000');
    await user.clear(calories);
    await user.type(calories, '2000');

    // water select
    const combobox = screen.getByRole('combobox');
    await user.selectOptions(combobox, '2');

    // weekly weight
    const weightInput = screen.getByPlaceholderText('e.g. 1.5');
    await user.clear(weightInput);
    await user.type(weightInput, '1.5');

    // days
    const days = screen.getByPlaceholderText('e.g. 30');
    await user.clear(days);
    await user.type(days, '30');

    // now button should be enabled
    expect(btn).toBeEnabled();
  });

  it('applies dark/light classes based on mode', () => {
    const setFormData = jest.fn();

    const { rerender } = render(
      <MemoryRouter>
        <ParameterContext.Provider value={{ formData: {}, setFormData, mode: false, setMode: jest.fn() }}>
          <HomeForm />
        </ParameterContext.Provider>
      </MemoryRouter>
    );

    const container = document.querySelector('.w-full.max-w-xl > div') as HTMLElement | null;
    // when mode is false expect light classes
    expect(container?.className).toMatch(/bg-white/);

    // rerender with dark mode
    rerender(
      <MemoryRouter>
        <ParameterContext.Provider value={{ formData: {}, setFormData, mode: true, setMode: jest.fn() }}>
          <HomeForm />
        </ParameterContext.Provider>
      </MemoryRouter>
    );

    const containerDark = document.querySelector('.w-full.max-w-xl > div') as HTMLElement | null;
    expect(containerDark?.className).toMatch(/dMB/);
  });
});
