import { useEffect, useState } from 'react';

function DiscountTimer() {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Convert seconds → MM:SS format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-2 mb-4 bg-orange-500">
      <span className="text-white font-medium text-base">Discount expires in:</span>

      <span className="text-white font-bold text-lg flex items-center gap-1">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

export default DiscountTimer;
