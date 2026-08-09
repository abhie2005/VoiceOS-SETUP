import { cn } from "@/lib/utils";
import { PALETTE, SPRITES, type SpriteName } from "./sprites";

type Props = {
  name: SpriteName;
  /** Rendered width in px. Height follows the grid's aspect ratio. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders one sprite from the library as crisp pixels.
 *
 * Each cell becomes a 1×1 rect in a viewBox sized to the grid, so the sprite
 * scales to any size without blurring. crispEdges stops the browser
 * antialiasing neighbouring cells into hairline seams.
 */
export default function PixelSprite({
  name,
  size = 96,
  className,
  style,
}: Props) {
  const rows = SPRITES[name];
  const w = rows[0].length;
  const h = rows.length;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      className={cn(className)}
      style={style}
      shapeRendering="crispEdges"
      role="img"
      aria-label={name}
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={PALETTE[ch]}
            />
          ),
        ),
      )}
    </svg>
  );
}
