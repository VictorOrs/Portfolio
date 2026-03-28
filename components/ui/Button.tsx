import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

// Exported so this can also be applied to links (<Link> / <a>)
export const buttonVariants = cva(
  // Outer container — layout, background, transitions
  [
    "inline-flex items-center justify-center",
    "font-display font-semibold whitespace-nowrap",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "btn-primary",
        ],
        secondary: [
          "bg-alpha-revert backdrop-blur-glass outline outline-2 outline-alpha outline-offset-[-2px] text-text-primary",
          "hover:bg-alpha",
        ],
      },
      size: {
        lg: "p-3 lg:p-4 gap-1 lg:gap-2 rounded-full text-s lg:text-sm", // md on mobile, lg on desktop
        md: "p-3 gap-1 rounded-full text-s",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

// Inner label wrapper — optical top offset for Nohemi descenders, no bottom padding
// lg: pt-1 px-2 (4px top, 8px sides)
// md: pt-1 px-1 (4px top, 4px sides) — secondary size m spec
const labelClass: Record<string, string> = {
  lg: "flex items-center justify-center pt-1 px-1 lg:px-2 leading-5",
  md: "flex items-center justify-center pt-1 px-1 leading-5",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: ReactNode; // rendered directly, outside the label span
  };

export default function Button({ variant, size, className, icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {icon}
      {children && (
        <span className={labelClass[size ?? "lg"]}>
          {children}
        </span>
      )}
    </button>
  );
}
