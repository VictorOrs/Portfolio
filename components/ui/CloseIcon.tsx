type Props = {
  className?: string;
  size?: number;
};

/** Close (X) icon — 24×24, stroke. Matches the navbar icon-button sizing. */
export default function CloseIcon({ className, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  );
}
