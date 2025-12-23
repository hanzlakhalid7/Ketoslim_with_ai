

interface BenefitsProps {
  ketoFood?: string;
  cartImg?: string;
  heartPot?: string;
  educationIcon?: string;
  iphoneMock?: string;
}


export default function Benefits({ ketoFood, cartImg, heartPot, educationIcon, iphoneMock }: BenefitsProps) {
  return (
    <div className="mt-6 flex flex-row items-center justify-between w-full">
      <div className="flex flex-col gap-4 flex-1 max-w-xs">
        <div className="flex items-center gap-3">
          <img src={ketoFood} alt="" className="w-8 h-8" />
          <span className="font-medium text-sm text-red-500">Daily Custom Meal Plan</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={cartImg} alt="" className="w-8 h-8" />
          <span className="font-medium text-sm text-red-500">Done-For-You Grocery Lists</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={heartPot} alt="" className="w-8 h-8" />
          <span className="font-medium text-sm text-red-500">Overwhelm-Free Delicious Recipes</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={educationIcon} alt="" className="w-8 h-8" />
          <span className="font-medium text-sm text-red-500">Weekly Tips & Guidance</span>
        </div>
      </div>

      <div className="flex-1 flex justify-end items-center">
        <img src={iphoneMock} alt="" className="h-80 w-auto max-h-[300px] drop-shadow-2xl" />
      </div>
    </div>
  );
}
