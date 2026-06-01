import Image from "next/image";

// Shared project illustrations — used by the homepage slider cards (Work.tsx)
// and the expand overlay hero card (ProjectOverlay).

export function EnumaIllustration() {
  return (
    <div className="absolute inset-0 top-[-170px] right-[-340px] bottom-0 left-8 max-lg:top-[-96px] max-lg:right-[-160px] max-lg:bottom-[160px] max-lg:left-[40px] max-md:top-[-176px] max-md:right-[-160px] max-md:left-[24px] max-md:bottom-[96px] max-[425px]:top-[-250px] max-[425px]:bottom-[150px] max-[425px]:left-0 max-[425px]:right-0 pointer-events-none" aria-hidden>
      <Image
        src="/img/work/enuma_illustration.png"
        alt=""
        fill
        unoptimized
        className="object-cover opacity-[0.72]"
      />
    </div>
  );
}

export function MosoIllustration() {
  return (
    <div
      className="absolute inset-0 max-md:top-[-90px] max-md:right-[-470px] max-md:left-[-28px] max-[425px]:top-[-60px] max-[425px]:right-[-162px] max-[425px]:left-0 pointer-events-none"
      aria-hidden
    >
      <Image
        src="/img/work/moso_illustration.png"
        alt=""
        fill
        unoptimized
        className="object-cover object-top"
      />
    </div>
  );
}
