export const revalidate = 60;

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import WhoIAm from "@/components/sections/WhoIAm";
import Process from "@/components/sections/Process";
import Work from "@/components/sections/Work";
import FAQServer from "@/components/sections/FAQServer";
import Footer from "@/components/sections/Footer";
import { client, urlFor } from "@/lib/sanity";
import { homepageQuery, type HomepageData } from "@/lib/queries";

export default async function Page() {
  let homepage: HomepageData | null = null;
  try {
    homepage = await client.fetch<HomepageData | null>(homepageQuery, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — every section falls back to i18n
  }

  const profileImageUrl = homepage?.profileImage
    ? urlFor(homepage.profileImage).width(144).height(144).url()
    : null;

  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />
      <Hero data={homepage} />
      <WhoIAm data={homepage} profileImageUrl={profileImageUrl} />
      <div className="relative bg-background-base" style={{ zIndex: 10000 }}>
        <Work data={homepage} />
        <Process data={homepage} />
        <FAQServer data={homepage} />
        <Footer data={homepage} />
      </div>
    </main>
  );
}
