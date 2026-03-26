type Props = {
  className?: string;
  size?: number;
};

/**
 * Pause icon — 24×24.
 * Two vertical bars, inset 18.75% top/bottom and 23.96% left/right (Figma spec).
 * Figma Design System node 2556:79.
 */
export default function PauseIcon({ className, size = 24 }: Props) {
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
      {/* Left bar  — x: 5.75→10.25, y: 4.5→19.5 */}
      <rect x="5.75" y="4.5" width="4.5" height="15" rx="1.5" />
      {/* Right bar — x: 13.75→18.25, y: 4.5→19.5 */}
      <rect x="13.75" y="4.5" width="4.5" height="15" rx="1.5" />
    </svg>
  );
}
