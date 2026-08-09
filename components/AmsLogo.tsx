import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * AMS wordmark. The arrow beneath the wordmark points LEFT — mirrored from the
 * cloud-provider logo it riffs on. Monochrome: inherits currentColor, so it
 * works on any surface in the theme.
 */
export default function AmsLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 44"
      className={cn("text-foreground", className)}
      role="img"
      aria-label="AMS"
      fill="none"
    >
      <text
        x="50"
        y="24"
        textAnchor="middle"
        fill="currentColor"
        fontSize="27"
        fontWeight="700"
        letterSpacing="-1.5"
        fontFamily="var(--font-sans)"
      >
        ams
      </text>

      {/* Smile arrow, curving left. */}
      <path
        d="M78 33 C 62 42, 34 42, 19 34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Arrowhead on the LEFT terminus. */}
      <path
        d="M26 30 L17 33.6 L24 39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
