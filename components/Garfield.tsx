import { cn } from "@/lib/utils";

export type GarfieldState = "idle" | "listening" | "thinking" | "speaking";

type Props = {
  state?: GarfieldState;
  size?: number;
  className?: string;
  /** Head only — for tiny inline marks. */
  bare?: boolean;
  /** Being dragged. Garfield has opinions about this. */
  grabbed?: boolean;
};

/**
 * Garfield, as a 20×19 pixel sprite.
 *
 * K outline · F fur · S stripe · L light fur · P pink · E eye · T tail
 * The whiskers are the K pixels that poke out past the head on rows 6, 8, 10.
 */
const SPRITE = [
  "...KK........KK.....",
  "..K.K........K.K....",
  "..K.PK......KP.K....",
  "..KPP.KKKKKK.PPK....",
  ".KFFFFFFFFFFFFFFK...",
  ".KFSFFFFFFFFFFSFK...",
  "KKFSFFFFFFFFFFSFKK..",
  ".KFFFFFFFFFFFFFFK...",
  "KKFFEEFFFFFFEEFFKK..",
  ".KFFEEFFFFFFEEFFK...",
  "KKFFFFFFLLFFFFFFKK..",
  ".KFFFFFLPPLFFFFFK...",
  "..KFFFFLLLLFFFFK....",
  "...KKFFFFFFFFKK.....",
  "....KFFFFFFFFK..TT..",
  "....KFLLLLLLFK.T..T.",
  "....KFLLLLLLFK.T....",
  "....KKLLKKLLKK.T....",
  ".....KKKK.KKKK.TT...",
];

/**
 * Ears pinned flat, which is the whole tell. Replaces rows 0-3 while Garfield is
 * being carried around against its wishes.
 */
const FLAT_EARS = [
  "....................",
  "....................",
  ".KK............KK...",
  ".KPPKKKKKKKKKKPPK...",
];

const COLORS: Record<string, string> = {
  K: "#2f3336",
  F: "#9aa4ad",
  S: "#6f7981",
  L: "#eef1f4",
  P: "#e79aa8",
  E: "#2f3336",
  T: "#9aa4ad",
};

/** Rows below this are body — dropped in `bare` mode. */
const HEAD_ROWS = 13;

export default function Garfield({
  state = "idle",
  size = 72,
  className,
  bare = false,
  grabbed = false,
}: Props) {
  const listening = state === "listening";
  const speaking = state === "speaking";
  const thinking = state === "thinking";

  const base = grabbed ? [...FLAT_EARS, ...SPRITE.slice(4)] : SPRITE;
  const rows = bare ? base.slice(0, HEAD_ROWS) : base;
  const body: React.ReactNode[] = [];
  const eyes: React.ReactNode[] = [];
  const tail: React.ReactNode[] = [];

  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const rect = (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill={COLORS[ch]}
        />
      );
      if (ch === "E") eyes.push(rect);
      else if (ch === "T") tail.push(rect);
      else body.push(rect);
    });
  });

  return (
    <svg
      viewBox={`0 0 20 ${rows.length}`}
      width={size}
      height={(size * rows.length) / 20}
      className={cn(className)}
      role="img"
      aria-label={`Garfield the cat is ${state}`}
      // Without this, neighbouring pixels get antialiased and hairline seams
      // show through the sprite.
      shapeRendering="crispEdges"
    >
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom center",
          animation: grabbed
            ? "sprite-squirm 0.75s steps(2, end) infinite"
            : speaking
              ? "sprite-bob 0.42s steps(2, end) infinite"
              : listening
                ? "sprite-bob 0.9s steps(2, end) infinite"
                : "sprite-bob 2.4s steps(2, end) infinite",
        }}
      >
        {/* Tail flicks from its base. */}
        {!bare && (
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "bottom left",
              animation: `sprite-tail ${grabbed ? "0.45s" : speaking ? "0.5s" : "1.8s"} steps(2, end) infinite`,
            }}
          >
            {tail}
          </g>
        )}

        {body}

        {/* Eyes: squint when thinking, blink on their own when idle. */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            transform: thinking || grabbed ? "scaleY(0.4)" : undefined,
            animation:
              state === "idle" && !grabbed
                ? "sprite-blink 4s steps(1, end) infinite"
                : undefined,
          }}
        >
          {eyes}
        </g>

        {/* Yowling, plus the manga anger mark. */}
        {grabbed && (
          <>
            <rect x="8" y="12" width="2" height="1" fill="#2f3336" />
          </>
        )}

        {/* Mouth opens only while talking. */}
        {speaking && !bare && !grabbed && (
          <rect
            x="8"
            y="12"
            width="2"
            height="1"
            fill="#2f3336"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "sprite-mouth 0.42s steps(2, end) infinite",
            }}
          />
        )}
      </g>
    </svg>
  );
}
