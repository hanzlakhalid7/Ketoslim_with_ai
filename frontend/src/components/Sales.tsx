import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/images/logo.png';
import salesBg from '../assets/images/sales.png';
import sales1 from '../assets/images/sales1.webp';
import sales3 from '../assets/images/sales3.webp';
import ketoFood from '../assets/images/keto-food.webp';
import cartImg from '../assets/images/cart.webp';
import heartPot from '../assets/images/heart-pot.webp';
import educationIcon from '../assets/images/education-icon.webp';
import iphoneMock from '../assets/images/iphone-mockup.webp';
import pubmedLogo from '../assets/images/pubmed-logo.svg';
import mayoClinic from '../assets/images/mayo-clinic-b.webp';
import guarantee60 from '../assets/images/60-day-guarantee.webp';

import SalesHero from './sales/SalesHero';
import StatsFeatures from './sales/StatsFeatures';
import Benefits from './sales/Benefits';
import PricingBlock from './sales/PricingBlock';
import Guarantee from './sales/Guarantee';
import { ParameterContext } from './ParameterContext';

function Sales() {
  const navigate = useNavigate();
  const { mode, formData } = useContext(ParameterContext);

  // Use image from context if available, otherwise fallback to default
  const userImage = formData?.image || sales1;

  return (
    <div className={`${!mode ? 'bg-pink-50 text-black' : 'bg-black text-white'}`}>
      <div className="flex flex-col items-center min-h-screen px-4 py-6">
        <ThemeToggle />

        <img src={logoImg} className="h-10" alt="" />

        <div className="w-full max-w-xl">
          <div
            className={`flex flex-col p-8 w-full mb-6 rounded-2xl shadow-xl ${!mode ? 'bg-white text-black' : 'dMB text-white'
              }`}
          >
            <SalesHero salesBg={salesBg} sales1={userImage} sales3={sales3} />
            <StatsFeatures />

            <div className="w-full my-6">
              <div className="w-full flex flex-col">
                <div className="font-semibold mb-2">Your Program Will also work on:</div>
                <ul className="flex flex-col gap-2 w-full max-w-xs items-center">
                  {[
                    'Improving Digestion',
                    'Toning Muscles',
                    'Mental Wellness Reset',
                    'Physical Endurance Boost',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 w-full">
                      <span className="text-xl rounded-full border w-7 h-7 pb-1 flex items-center justify-center tick">
                        ✔
                      </span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h1 className="font-bold text-lg sm:text-xl">Get all the right tools & knowledge.</h1>

            <Benefits
              ketoFood={ketoFood}
              cartImg={cartImg}
              heartPot={heartPot}
              educationIcon={educationIcon}
              iphoneMock={iphoneMock}
            />

            <div className="w-full mt-10">
              <h2 className="font-bold text-3xl sm:text-4xl mb-10 text-left">
                Trusted by health & nutrition professionals
              </h2>
            </div>

            <div className="flex flex-col gap-10">
              <div>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex justify-center items-center gap-2 mb-1 w-full">
                    <img src={pubmedLogo} alt="" className="h-14 w-auto" />
                  </div>
                  <p className="text-base">
                    There is evidence to suggest that a Ketogenic Diet can help with weight loss,
                    visceral adiposity, and appetite control.
                  </p>
                </div>
                <a href="#" className="underline text-sm mt-1 text-red-500">
                  source
                </a>
              </div>

              <div>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex justify-center items-center gap-2 mb-1 w-full">
                    <img src={mayoClinic} className="h-14 w-auto" alt="" />
                  </div>
                  <p className="text-base">
                    Research shows that a keto diet can result in weight loss and improvements in
                    cardiovascular risk factors.
                  </p>
                </div>
                <a href="#" className="underline text-sm mt-1 text-red-500">
                  source
                </a>
              </div>
            </div>

            <PricingBlock
              mode={mode}
              navigate={navigate}
              formData={formData}
            />
          </div>
        </div>
        <Guarantee guarantee60={guarantee60} />
      </div>
    </div>
  );
}

export default Sales;
