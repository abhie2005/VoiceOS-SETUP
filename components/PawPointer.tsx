import { cn } from "@/lib/utils";

/**
 * A 16×16 cat paw, drawn in the same pixel idiom as Garfield.
 * K outline · W fur · P pad
 */
const PAW = [
  "....KKK..KKK....",
  "...KWWWKKWWWK...",
  "..KWWPPWWPPWWK..",
  "..KWPPPWWPPPWK..",
  "..KWPPPWWPPPWK..",
  ".KWWWPPWWPPWWWK.",
  ".KWWWWWWWWWWWWK.",
  "KWPPWWWPPPWWPPWK",
  "KWPPWWPPPPPWPPWK",
  "KWWPWWPPPPPWWPWK",
  ".KWWWWPPPPPWWWK.",
  ".KWWWWPPPPPWWWK.",
  "..KWWWWPPPWWWWK.",
  "..KWWWWWWWWWWK..",
  "...KWWWWWWWWK...",
  "....KKKKKKKK....",
];

const COLORS: Record<string, string> = {
  K: "#2f3336",
  W: "#9aa4ad", // matches Garfield's fur
  P: "#c4778f",
};

export default function PawPointer({
  size = 44,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn(className)}
      style={style}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {PAW.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={COLORS[ch]}
            />
          ),
        ),
      )}
    </svg>
  );
}
