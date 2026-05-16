"use client";

type SimpleBarsProps = {
  values: number[];
  color?: string;
};

export default function SimpleBars({
  values,
  color = "var(--primary)",
}: SimpleBarsProps) {
  const max = Math.max(...values, 1);

  return (
    <svg className="chart-svg" viewBox="0 0 320 180" preserveAspectRatio="none">
      {values.map((value, index) => {
        const width = 22;
        const gap = 10;
        const height = Math.max((value / max) * 120, 10);
        const x = 18 + index * (width + gap);
        const y = 150 - height;

        return (
          <g key={`${index}-${value}`}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={8}
              fill={color}
              opacity={0.9}
            />
          </g>
        );
      })}
      <line x1="10" y1="150" x2="310" y2="150" stroke="var(--border)" />
    </svg>
  );
}
