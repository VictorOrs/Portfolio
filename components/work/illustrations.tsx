import Image from "next/image";

// Shared project illustrations — used by the homepage slider cards (Work.tsx)
// and the expand overlay hero card (ProjectOverlay).

export function EnumaIllustration() {
  return (
    <div className="absolute inset-0 top-[-170px] right-[-340px] bottom-0 left-12 max-lg:top-[-96px] max-lg:bottom-0 max-md:top-0 max-md:right-auto max-md:bottom-0 max-md:left-8 max-md:w-full pointer-events-none" aria-hidden>
      {/* Desktop / tablet asset (≥ 768px) */}
      <Image
        src="/img/work/enuma_illustration.png"
        alt=""
        width={4036}
        height={2349}
        sizes="(max-width: 1024px) 100vw, 1280px"
        className="w-full object-cover opacity-[0.72] hidden md:block"
      />
      {/* Mobile asset (< 768px) */}
      <Image
        src="/img/work/enuma_illustration_mobile.webp"
        alt=""
        width={1374}
        height={1350}
        sizes="100vw"
        className="w-full object-cover opacity-[0.72] md:hidden"
      />
    </div>
  );
}

export function MosoIllustration() {
  return (
    <div
      className="absolute inset-0 bottom-0 left-12 max-lg:right-[-96px] max-lg:bottom-0 max-md:top-0 max-md:right-auto max-md:bottom-0 max-md:left-8 max-md:w-[686px] pointer-events-none"
      aria-hidden
    >
      {/* Desktop / tablet asset (≥ 768px) */}
      <Image
        src="/img/work/moso_illustration.webp"
        alt=""
        width={4036}
        height={2349}
        sizes="(max-width: 1024px) 100vw, 1280px"
        className="w-full object-cover hidden md:block"
      />
      {/* Mobile asset (< 768px) */}
      <Image
        src="/img/work/moso_illustration_mobile.webp"
        alt=""
        width={1020}
        height={832}
        sizes="100vw"
        className="w-full object-cover md:hidden"
      />
    </div>
  );
}
