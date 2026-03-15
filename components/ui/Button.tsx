import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

// Exported so this can also be applied to links (<Link> / <a>)
export const buttonVariants = cva(
  // Base — layout, font, transitions
  [
    "inline-flex items-center justify-center",
    "font-display font-semibold whitespace-nowrap",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      // ─── variant ─────────────────────────────────────────────────────────
      // Primary: always dark bg + light text (inverted CTA, theme-invariant)
      // Secondary: transparent with alpha border, inherits text-primary
      variant: {
        primary: [
          "btn-primary text-btn-primary-text",
          "hover:shadow-btn-glow",
        ],
        secondary: [
          "border-2 border-alpha text-text-primary",
          "hover:bg-alpha hover:backdrop-blur-glass",
        ],
      },

      // ─── size ────────────────────────────────────────────────────────────
      // L → Button/L token (Nohemi SemiBold 18px, 16px padding, 8px gap)
      // M → Button/M token (Nohemi SemiBold 16px, 12px padding, 4px gap)
      size: {
        lg: "text-btn-lg gap-2 p-4 rounded-full",
        md: "text-btn-md gap-1 p-3 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
