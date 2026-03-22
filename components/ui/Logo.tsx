import Image from "next/image";

type Props = {
  variant?: "flat" | "3d";
  size?: number;
  className?: string;
};

/**
 * Logo — 56×56 container, two variants:
 * - flat: logo.svg with 2.45% horizontal inset (~1.4px each side)
 * - 3d:   logo3D.png (full bleed, cropped)
 */
export default function Logo({ variant = "flat", size = 56, className }: Props) {
  if (variant === "3d") {
    return (
      <div className={className} style={{ width: size, height: size, position: "relative" }}>
        <Image
          src="/img/logo3D.png"
          alt="Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ width: size, height: size, position: "relative" }}>
      {/* 2.45% inset on left/right ≈ 1.4px each side at 56px */}
      <div style={{ position: "absolute", inset: "0 2.45%" }}>
        <Image
          src="/img/logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
