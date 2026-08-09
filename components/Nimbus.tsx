import { cn } from "@/lib/utils";

export type NimbusState = "idle" | "listening" | "thinking" | "speaking";

type Props = {
  state?: NimbusState;
  size?: number;
  className?: string;
  /** Drops arms and face — for tiny inline marks. */
  bare?: boolean;
};

/**
 * Lumpy cloud silhouette. Circles of deliberately uneven size and spacing — a
 * smooth path reads as a weather icon; the irregularity is what makes it read
 * as drawn by hand.
 */
const PUFFS = [
  { cx: 50, cy: 30, r: 16 },
  { cx: 31, cy: 41, r: 17 },
  { cx: 70, cy: 39, r: 18 },
  { cx: 50, cy: 50, r: 25 },
  { cx: 23, cy: 58, r: 16 },
  { cx: 78, cy: 57, r: 16.5 },
  { cx: 37, cy: 68, r: 16 },
  { cx: 63, cy: 69, r: 15 },
];

/**
 * Nimbus — a flat cloud with a face and stubby arms.
 *
 * Solid currentColor fill, no gradient, no glow: the character is the
 * silhouette plus a few knocked-out strokes. Because the fill is currentColor
 * it inverts with the theme.
 *
 * The viewBox extends past the body on both sides so the arms have somewhere
 * to go without the body needing to shrink.
 */
export default function Nimbus({
  state = "idle",
  size = 96,
  className,
  bare = false,
}: Props) {
  const listening = state === "listening";
  const speaking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <svg
      viewBox="0 -4 120 106"
      width={size}
      height={size * 0.883}
      className={cn("text-foreground", className)}
      role="img"
      aria-label={`Nimbus is ${state}`}
    >
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: speaking
            ? "cloud-pulse 1.1s ease-in-out infinite"
            : listening
              ? "cloud-pulse 2.4s ease-in-out infinite"
              : "cloud-drift 8s ease-in-out infinite",
        }}
      >
        {/* Arms — straight tapered bars with flat chiselled ends, drawn under
            the body so the joins disappear. No hands, no rounding. */}
        {!bare && (
          <g fill="currentColor">
            {/* Two arms, both reaching right — the left side is the edge it
                peeks around, so nothing needs to be drawn over there. */}
            <polygon points="65,84 93,98 99,86 71,72" />

            {/* Upper right arm — raised, and it waves from the shoulder. */}
            <g
              style={{
                transformBox: "fill-box",
                transformOrigin: "bottom left",
                animation: `cloud-wave ${speaking ? "0.7s" : "2.8s"} ease-in-out infinite`,
              }}
            >
              <polygon points="81,62 117,40 113,32 75,50" />
            </g>
          </g>
        )}

        {/* Body. One flat colour, no strokes, so the overlaps vanish. */}
        <g fill="currentColor">
          {PUFFS.map((p, i) => (
            <circle key={i} {...p} />
          ))}
        </g>

        {/* Face, knocked out in the background colour. */}
        {!bare && (
          <g
            className="text-background"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          >
            {listening ? (
              <g fill="currentColor" stroke="none">
                <circle cx="41" cy="47" r="3.2" />
                <circle cx="59" cy="47" r="3.2" />
              </g>
            ) : (
              <>
                <path d="M36 49 Q41 43 46 49" />
                <path d="M54 49 Q59 43 64 49" />
              </>
            )}

            {speaking ? (
              <ellipse
                cx="50"
                cy="61"
                rx="6"
                ry="5"
                fill="currentColor"
                stroke="none"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animation: "cloud-mouth 0.44s ease-in-out infinite",
                }}
              />
            ) : thinking ? (
              <path d="M44 60 L56 60" />
            ) : (
              <path d="M41 57 Q50 66 59 57" />
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
