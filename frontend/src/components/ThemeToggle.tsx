import { ParameterContext } from './ParameterContext';
import { useState, useContext, useEffect } from 'react';

function ThemeToggle() {
  const { mode, setMode } = useContext(ParameterContext);
  const [modeClass, setModeClass] = useState(mode ? 'Light Mode' : 'Dark Mode');

  useEffect(() => {
    setModeClass(mode ? 'Light Mode' : 'Dark Mode');
  }, [mode]);

  function ChangeModeClass() {
    setMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mode', String(next));
      } catch (e) {
      }
      setModeClass(next ? 'Light Mode' : 'Dark Mode');
      return next;
    });
  }
  return (
    <div className="w-full flex justify-end mb-8">
      <button
        onClick={ChangeModeClass}
        value={modeClass}
        className={`fixed border-2 rounded-1xl font-semibold borderb rounded-xl py-2 px-4 cursor-pointer ${!mode ? 'bg-white text-black' : 'dMB text-white'}`}
      >
        {modeClass}
      </button>
    </div>
  );
}

export default ThemeToggle;
