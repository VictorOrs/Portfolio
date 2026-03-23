"use client";

import { useLayoutEffect, useRef, useState, HTMLAttributes } from "react";
import { getSvgPath } from "figma-squircle";

type Props = HTMLAttributes<HTMLDivElement> & {
  radius?: number;
  smoothing?: number;
};

/**
 * Drop-in <div> replacement that clips itself to a squircle.
 * Falls back to border-radius on SSR; clip-path takes over after hydration.
 */
export default function SquircleCard({
  radius = 40,
  smoothing = 0.6,
  style,
  children,
  ...props
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState<string>("");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const path = getSvgPath({ width, height, cornerRadius: radius, cornerSmoothing: smoothing });
      setClipPath(`path('${path}')`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [radius, smoothing]);

  return (
    <div
      ref={ref}
      style={{
        // SSR fallback — replaced by clip-path after hydration
        borderRadius: radius,
        ...style,
        ...(clipPath ? { clipPath } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
