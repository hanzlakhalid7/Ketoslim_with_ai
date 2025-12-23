import { ReactNode } from 'react';

interface CardStepProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: string;
  image?: string;
  description?: string;
  callouts?: string | (() => string);
}

function CardStep({ icon, title, subtitle, image, description, callouts }: CardStepProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[34px]">{icon}</span>
      <div className="text-[34px] text-center leading-[1.2em] font-semibold mb-1">{title}</div>
      {subtitle && <h2 className="text-[20px] mb-2 font-semibold">{subtitle}</h2>}
      {image && <img src={image} alt="" className="mb-4" />}
      {description && <p className="text-[20px] font-normal mb-2">{description}</p>}
      {callouts && (
        <p className="mt-2 mb-6 text-[16px] text-red-500 ">
          {typeof callouts === 'function' ? callouts() : callouts}
        </p>
      )}
    </div>
  );
}

export default CardStep;
