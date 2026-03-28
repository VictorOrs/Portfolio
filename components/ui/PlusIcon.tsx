type Props = {
  className?: string;
  size?: number;
};

/**
 * Plus icon — 24×24.
 * Horizontal + vertical bars, stroke-based.
 * Figma Design System node 2502:23.
 */
export default function PlusIcon({ className, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d="M 12 4 L 12 20" />
      <path d="M 4 12 L 20 12" />
    </svg>
  );
}
