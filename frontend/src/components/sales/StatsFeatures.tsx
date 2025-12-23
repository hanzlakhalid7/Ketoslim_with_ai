interface StatBlockProps {
  heading: string;
  value: string;
  color?: string;
  barPct?: number;
}

function StatBlock({ heading, value, color = 'text-red-500', barPct }: StatBlockProps) {
  return (
    <div>
      <div className="text-[14px]">{heading}</div>
      <div className={`font-bold text-xl ${color}`}>{value}</div>
      {typeof barPct === 'number' && (
        <div className="w-full h-2 rounded-2xl bg-gray-400 mt-2">
          <div className={`h-2 rounded-2xl ${color.replace('text-', 'bg-')}`} style={{ width: `${barPct}%` }} />
        </div>
      )}
    </div>
  );
}

function StatBar({ heading, pct, barClass = 'bg-red-500' }: { heading: string; pct: number; barClass?: string }) {
  return (
    <div>
      <div className="text-[14px] mb-1">{heading}</div>
      <div className="w-full h-2 rounded-2xl bg-gray-400">
        <div className={`h-2 rounded-2xl ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StatsFeatures() {
  const left = [
    { type: 'stat' as const, heading: 'Body Fat', value: '20-25%', color: 'text-red-500' },
    { type: 'bar' as const, heading: 'Energy Levels', pct: 30, barClass: 'bg-red-500' },
    { type: 'bar' as const, heading: 'Physical Health', pct: 35, barClass: 'bg-red-500' },
    { type: 'bar' as const, heading: 'Metabolism', pct: 25, barClass: 'bg-red-500' },
  ];

  const right = [
    { type: 'stat' as const, heading: 'Body Fat', value: '10-12%', color: 'textColor' },
    { type: 'bar' as const, heading: 'Energy Levels', pct: 85, barClass: 'rangeColor' },
    { type: 'bar' as const, heading: 'Physical Health', pct: 90, barClass: 'rangeColor' },
    { type: 'bar' as const, heading: 'Metabolism', pct: 80, barClass: 'rangeColor' },
  ];

  return (
    <div className="w-full p-4 gap-4 flex">
      <div className="pr-2 flex flex-col w-1/2 gap-5">
        {left.map((item, idx) =>
          item.type === 'stat' ? (
            <StatBlock key={idx} heading={item.heading} value={item.value} color={item.color} />
          ) : (
            <StatBar key={idx} heading={item.heading} pct={item.pct} barClass={item.barClass} />
          )
        )}
      </div>

      <div className="pr-2 flex flex-col w-1/2 gap-5">
        {right.map((item, idx) =>
          item.type === 'stat' ? (
            <StatBlock key={idx} heading={item.heading} value={item.value} color={item.color} />
          ) : (
            <StatBar key={idx} heading={item.heading} pct={item.pct} barClass={item.barClass} />
          )
        )}
      </div>
    </div>
  );
}
