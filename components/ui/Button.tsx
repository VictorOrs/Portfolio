import { cva, type VariantProps } from "class-variance-authority";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// Exported so this can also be applied to links (<Link> / <a>)
export const buttonVariants = cva(
  // Outer container — layout, background, transitions
  [
    "inline-flex items-center justify-center",
    "font-body font-semibold whitespace-nowrap",
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

// Inner label wrapper — optical vertical offset, balanced top/bottom
// lg: py-0.5 px-1 lg:px-2 (2px top/bottom, 4px sides / 8px sides on lg)
// md: py-0.5 px-1 (2px top/bottom, 4px sides)
const labelClass: Record<string, string> = {
  lg: "flex items-center justify-center py-0.5 px-1 lg:px-2 leading-5",
  md: "flex items-center justify-center py-0.5 px-1 leading-5",
};

type ButtonBaseProps = VariantProps<typeof buttonVariants> & { icon?: ReactNode };

type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & ButtonBaseProps & { href?: undefined })
  | (AnchorHTMLAttributes<HTMLAnchorElement>  & ButtonBaseProps & { href: string });

export default function Button({ variant, size, className, icon, children, ...props }: ButtonProps) {
  const cls = buttonVariants({ variant, size, className });
  const inner = (
    <>
      {icon}
      {children && (
        <span className={labelClass[size ?? "lg"]}>
          {children}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return <a href={href} className={cls} {...rest}>{inner}</a>;
  }

  return (
    <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
