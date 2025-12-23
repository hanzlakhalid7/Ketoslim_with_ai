interface SalesHeroProps {
  salesBg?: string;
  sales1?: string;
  sales3?: string;
}

export default function SalesHero({ salesBg, sales1, sales3 }: SalesHeroProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[34px]">🎯</span>
      <h1 className="text-[34px] text-center leading-[1.2em] font-semibold mb-1">
        Your Personalized
        <br />
        KetoSlim Plan Is Ready
      </h1>

      <div className="flex items-center justify-center gap-18 mt-4 mb-2 relative">
        <img src={salesBg} className="absolute h-[250px] w-[250px] blur-sm opacity-70" alt="bg" />
        <img src={sales1} className="relative w-[180px] h-[250px]" alt="product" />
        <img src={sales3} className="relative w-[180px] h-[250px]" alt="product" />
      </div>

      <div className="flex items-center justify-center w-full py-4 mt-2 mb-4 font-bold shadow-md">
        <div className="w-1/2 text-center">Now</div>
        <div className="w-1/2 text-center">6 Months</div>
      </div>
    </div>
  );
}
