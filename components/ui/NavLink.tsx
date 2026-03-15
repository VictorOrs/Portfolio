import Link from "next/link";
import { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link>;

export default function NavLink({ className, children, ...props }: NavLinkProps) {
  return (
    <Link
      className={[
        // Layout & shape
        "inline-flex items-center justify-center px-4 py-3 rounded-full",
        // Typography — Link token (Nohemi Medium 16px/20px)
        "font-display text-link",
        // Default state
        "text-text-secondary",
        // Hover state — glass pill
        "hover:text-text-primary hover:bg-alpha hover:backdrop-blur-glass",
        // Transition
        "transition-all duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="flex items-center justify-center pt-1 px-1 leading-5">
        {children}
      </span>
    </Link>
  );
}
