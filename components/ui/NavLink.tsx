"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NavLinkProps = ComponentProps<typeof Link> & {
  isHovered?: boolean;
};

export default function NavLink({ className, children, isHovered, ...props }: NavLinkProps) {
  return (
    <Link
      className={[
        "relative inline-flex items-center justify-center p-2 rounded-full",
        "font-display text-link",
        isHovered ? "text-text-primary" : "text-text-secondary",
        "transition-colors duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "var(--color-alpha)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10 flex items-center justify-center pt-1 px-2 leading-5">
        {children}
      </span>
    </Link>
  );
}
