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
        // Outer padding matches Figma: p-[var(--4,16px)] for L, p-[var(--3,12px)] for M
        lg: "p-4 gap-2 rounded-full",
        md: "p-3 gap-1 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

// Inner label wrapper — matches Figma inner container: pt-[3px] px-[var(--1,4px)]
// pt-[3px]: optical top adjustment for Nohemi descenders
// px-1: 4px horizontal inset (spacing token 1)
const labelWrapperClass = "flex items-center justify-center pt-1 px-1 leading-5";

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
        <span className={labelWrapperClass}>
          {children}
        </span>
      )}
    </button>
  );
}
