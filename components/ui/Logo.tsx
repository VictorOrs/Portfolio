"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

type Props = {
  variant?: "flat" | "3d";
  size?: number;
  className?: string;
};

export default function Logo({ variant = "flat", size = 56, className }: Props) {
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const handleHoverStart = () => {
    setHovered(true);
    controls.start({
      rotate: 360,
      transition: { duration: 6, ease: "linear", repeat: Infinity },
    });
  };

  const handleHoverEnd = () => {
    setHovered(false);
    controls.stop();
    controls.start({
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  };

  const imageContent =
    variant === "3d" ? (
      <Image src="/img/logo3D.png" alt="Logo" fill className="object-cover" priority />
    ) : (
      <div style={{ position: "absolute", inset: "0 2.45%" }}>
        <Image src="/img/logo.svg" alt="Logo" fill className="object-contain" priority />
      </div>
    );

  return (
    <Link href="/" aria-label="Retour à l'accueil">
      <motion.div
        className={className}
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={{
          width: size,
          height: size,
          position: "relative",
          cursor: "pointer",
          filter: hovered
            ? "brightness(3) saturate(0) drop-shadow(0 0 6px rgba(255,255,255,0.25))"
            : "brightness(1)",
          transition: "filter 0.6s ease",
        }}
      >
        {imageContent}
      </motion.div>
    </Link>
  );
}
