"use client";

import { usePathname } from "next/navigation";
import GradientTracker from "./GradientTracker";
import Grain from "./Grain";
import SmoothScroll from "./SmoothScroll";

/**
 * Everything that dresses the site itself — mouse-tracked gradient, grain
 * overlay, smooth scroll.
 *
 * The Sanity Studio is an admin app that happens to live at /studio. It brings
 * its own scrolling, layering and interaction, so none of this belongs there:
 * Lenis leaves its panes unscrollable, and the grain sits over its interface.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      <GradientTracker />
      <Grain />
      <SmoothScroll />
    </>
  );
}
