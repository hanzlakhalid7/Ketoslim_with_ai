import { useState } from 'react';

import DiscountTimer from '../DiscountTimer';



export default function PricingBlock({ mode, navigate, formData }: any) { // Simplified props
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. Create Order
      const orderRes = await fetch('http://localhost:3000/Sales/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [{ sku: 'PLAN-50', quantity: 1, price: 50 }] // Using dynamic price/sku simulation
        })
      });

      if (!orderRes.ok) throw new Error('Order creation failed');

      // 2. Pay (Mock Payment)
      const payRes = await fetch('http://localhost:3000/Sales/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentRef: 'MOCK-PAYMENT-REF-' + Date.now()
        })
      });

      if (!payRes.ok) throw new Error('Payment failed');

      // 3. Navigate to Dashboard with intent to generate
      navigate('/dashboard', {
        state: {
          generatePlan: true,
          formData: formData
        }
      });

    } catch (error) {
      console.error(error);
      alert('Subscription process encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full">
      <div className="w-full mt-7">
        <h2 className="text-center text-[22px] sm:text-2xl mb-2">Your Personalized Meal Plan</h2>
        <DiscountTimer />
      </div>

      <div className="flex flex-col gap-3">
        {/* Single Plan Block */}
        <div
          className={`relative w-full max-w-2xl border-2 rounded-2xl cursor-pointer overflow-hidden ${!mode ? 'bg-pink-50 border-orange-500' : 'bg-black border-orange-500'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-4">
              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-md inline-block mb-1">BEST VALUE</div>
              <div className="text-base font-bold mb-1">Monthly Subscription</div>
              <div className="text-sm">Get your custom plan + dashboard access.</div>
            </div>

            <div className="flex flex-col items-end">
              <div className="font-bold text-lg px-6 py-1 rounded-bl-2xl bg-orange-100 text-orange-600">
                $50 / month
              </div>
              <span className="ml-4 flex items-center justify-center p-4">
                <span className="w-8 h-8 border-2 border-orange-500 bg-orange-500 rounded-full flex items-center justify-center pb-1 text-white">✔</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 mb-4 text-center"><span className="text-xs font-medium">✅ Risk-Free: Backed by 60-Day Money-Back Guarantee</span></div>

        <button
          disabled={loading}
          className="font-bold py-3 px-8 rounded-lg flex items-center justify-center transition w-full pointer-events-auto shadow-lg cursor-pointer bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          onClick={handleSubscribe}
        >
          <span className="mx-auto">{loading ? 'Processing...' : 'Subscribe Now - $50'}</span>
        </button>
        <div className="w-full text-center"><button className="underline text-base font-medium mt-2 cursor-pointer" onClick={() => navigate('/')}>No Thanks, I don’t want my plan.</button></div>
      </div>
    </div>
  );
}