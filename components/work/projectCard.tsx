import Image from "next/image";
import type { WorkCardProps } from "@/components/ui/WorkCard";
import { pick, type IllustrationPosition, type ProjectData } from "@/lib/queries";

// Full-bleed project artwork behind a work card — used by the homepage slider
// (Work.tsx) and the expand overlay hero card (ProjectOverlay).
//
// The box is positioned from Sanity, one set of CSS lengths per breakpoint, fed
// to the `.project-illustration` rules in globals.css as custom properties.
// Media queries can't live in an inline style, so the cascade lives in CSS and
// only the values cross over.

const clean = (p?: IllustrationPosition): Record<string, string> =>
  Object.fromEntries(
    Object.entries(p ?? {}).filter(
      ([, v]) => typeof v === "string" && v.trim().length > 0
    ) as Array<[string, string]>
  );

const vars = (p: Record<string, string>, suffix: string) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`--ill-${k}${suffix}`, v]));

/**
 * The slider card's props for a project. Shared by the homepage slider and the
 * expand overlay's hero, so both render byte-identical content and the morph
 * between them reads as one element.
 */
export function projectCardProps(project: ProjectData, lang: "en" | "fr"): WorkCardProps {
  return {
    slug: project.slug,
    logo: project.logo?.url
      ? {
          src: project.logo.url,
          alt: project.name ?? project.slug,
          width: project.logo.width,
          height: project.logo.height,
        }
      : undefined,
    title: pick(project, "cardTitle", lang),
    showWorkedOn: !!project.showWorkedOn,
    // Absent on documents predating the field — scrolling stays the default.
    scrollLogos: project.scrollLogos !== false,
    workedOnLogos: (project.workedOnLogos ?? [])
      .filter((l) => !!l.url)
      .map((l) => ({ src: l.url as string, alt: l.name ?? "", width: l.width, height: l.height })),
    ctaSecondary: project.ctaHref
      ? { label: pick(project, "ctaLabel", lang) ?? "", href: project.ctaHref }
      : undefined,
    illustration: <ProjectIllustration project={project} />,
  };
}

export function ProjectIllustration({ project }: { project: ProjectData }) {
  // Smaller breakpoints inherit the larger one unless they override it.
  const desktop = clean(project.posDesktop);
  const tablet = { ...desktop, ...clean(project.posTablet) };
  const mobile = { ...tablet, ...clean(project.posMobile) };

  const opacity = project.illustrationOpacity ?? 1;
  const desktopImg = project.illustrationDesktop;
  const mobileImg = project.illustrationMobile ?? desktopImg;

  if (!desktopImg?.url && !mobileImg?.url) return null;

  return (
    <div
      className="project-illustration pointer-events-none"
      style={{
        ...vars(mobile, ""),
        ...vars(tablet, "-md"),
        ...vars(desktop, "-lg"),
      } as React.CSSProperties}
      aria-hidden
    >
      {desktopImg?.url && (
        <Image
          src={desktopImg.url}
          alt=""
          width={desktopImg.width ?? 1600}
          height={desktopImg.height ?? 900}
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="w-full object-cover hidden md:block"
          style={{ opacity }}
        />
      )}
      {mobileImg?.url && (
        <Image
          src={mobileImg.url}
          alt=""
          width={mobileImg.width ?? 800}
          height={mobileImg.height ?? 800}
          sizes="100vw"
          className={`w-full object-cover${desktopImg?.url ? " md:hidden" : ""}`}
          style={{ opacity }}
        />
      )}
    </div>
  );
}
