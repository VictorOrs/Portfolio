import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { LoadingProvider } from "@/lib/loading";
import { WorkExpandProvider } from "@/components/work/WorkExpandContext";
import { client } from "@/lib/sanity";
import { homepageQuery, projectsQuery, type HomepageData, type ProjectData } from "@/lib/queries";
import SiteChrome from "@/components/SiteChrome";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Absolute urls for sharing cards. Vercel exposes the production domain on every
// deployment, so previews still advertise the real one rather than localhost.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const FALLBACK_TITLE = "Victor Oursin — Product & Brand Designer";
const FALLBACK_DESCRIPTION =
  "Product & Brand Designer with over 7 years' experience, creating clean, user-centric and functional designs across fintech, data and web3.";

/**
 * Built on the server, before the visitor has picked a language — and the
 * document is served as <html lang="en"> — so these fields are single-language
 * by design rather than bilingual like the rest of the homepage.
 */
export async function generateMetadata(): Promise<Metadata> {
  let data: HomepageData | null = null;
  try {
    data = await client.fetch<HomepageData | null>(homepageQuery, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — fall back to the constants above
  }

  const title = data?.seo_title || FALLBACK_TITLE;
  const description = data?.seo_description || FALLBACK_DESCRIPTION;
  const og = data?.seo_ogImage;
  const favicon = data?.seo_favicon?.url;
  const webclip = data?.seo_webclip?.url ?? favicon;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: title,
      title,
      description,
      images: og?.url
        ? [{ url: og.url, width: og.width, height: og.height, alt: title }]
        : undefined,
    },
    twitter: {
      card: og?.url ? "summary_large_image" : "summary",
      title,
      description,
      images: og?.url ? [og.url] : undefined,
    },
    icons: {
      icon: favicon ?? "/favicon.ico",
      apple: webclip ?? undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The expand overlay is mounted here, so it needs the projects too — it has to
  // rebuild a case study by slug on history navigation, without the slider.
  let projects: ProjectData[] = [];
  try {
    projects = await client.fetch<ProjectData[]>(projectsQuery, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — the slider renders the white card alone
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${inter.variable} antialiased`}
      >
        <SiteChrome />
        <I18nProvider>
          <LoadingProvider>
            <WorkExpandProvider projects={projects}>
              {children}
            </WorkExpandProvider>
          </LoadingProvider>
        </I18nProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
