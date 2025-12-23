import { useContext } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import logoImg from '../assets/images/logo.png';
import HomeForm from './HomeForm';
import { ParameterContext } from './ParameterContext';

function Home() {
  const { mode } = useContext(ParameterContext);

  return (
    <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'}`}>
      <div className="flex flex-col items-center min-h-screen px-4 py-6">
        <ThemeToggle />

        <div>
          <img src={logoImg} className="h-10 mb-3" alt="logo" />
        </div>

        <div className="flex text-[34px] leading-[1.2em] font-semibold gap-2">
          <h1 className={`${!mode ? 'text-black' : 'text-white'}`}>Enter Your</h1>
          <h1 className="text-orange-600">Details</h1>
        </div>

        <HomeForm />

      </div>
    </div>
  );
}

export default Home;