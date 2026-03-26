type Props = {
  className?: string;
  size?: number;
};

/**
 * Minus icon — 24×24.
 * Single horizontal bar, stroke-based.
 * Figma Design System node 2502:25.
 */
export default function MinusIcon({ className, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d="M 4 12 L 20 12" />
    </svg>
  );
}
