interface GuaranteeProps {
  guarantee60?: string;
}

export default function Guarantee({ guarantee60 }: GuaranteeProps) {
  return (
    <div className="w-full max-w-xl flex flex-col gap-2 mt-8 px-2">
      <div className="flex items-center gap-4 mb-2">
        <h3 className="font-bold text-4xl sm:text-5xl flex-1">Money Back Guarantee</h3>
        <img src={guarantee60} alt="60-day" className="h-26 w-26" />
      </div>
      <p className="text-base mb-1">We are confident with our service quality and its results. So, if you are ready to reach your goals, it’s a risk-free offer.</p>
      <p className="text-base mb-2">We guarantee you’ll see visible results or you’ll receive a full refund within 60 days after your purchase.</p>
      <hr className="w-12 mb-2" />
      <ul className="flex flex-col text-sm gap-2">
        <li>By continuing, you represent that you are over 18 years of age and agree if for whatever reason you’re unhappy with your plan to contact customer support for a refund.</li>
        <li>You will only be charged $67 today for your first quarter (details above)</li>
        <li>Your introductory period will last until Aug 27, 2025. You may cancel at any time before Aug 27, 2025, and you will not be charged.</li>
      </ul>
      <div className="rounded-xl text-sm">
        <p className="mb-3">If you don’t cancel, KetoSlim will automatically continue your membership at the end of your introductory period and charge the membership fee of <span className="font-bold"> $67 quarterly </span> until you cancel.</p>
        <p className="mb-3">Your subscription will be bound by our <span> <a href="#" className="text-red-500 underline">Terms and Privacy Policy</a>.</span></p>
        <p>If you would like a refund for any reason call <a href="tel:1-800-695-5045" className="text-red-500 underline">1-800-695-5045</a> or email <a href="mailto:support@myketoslim.com" className="text-red-500 underline">support@myketoslim.com</a>.</p>
      </div>
    </div>
  );
}
