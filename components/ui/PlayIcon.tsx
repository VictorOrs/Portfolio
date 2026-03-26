type Props = {
  className?: string;
  size?: number;
};

/**
 * Play icon — 24×24.
 * Triangle right-pointing, centered with a 0.5px right optical offset.
 * Figma Design System node 2556:109.
 */
export default function PlayIcon({ className, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* Triangle: left-top (6,4) → right-apex (19,12) → left-bottom (6,20) */}
      <path d="M 6 4 L 19 12 L 6 20 Z" />
    </svg>
  );
}
