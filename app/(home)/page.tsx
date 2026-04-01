import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import WhoIAm from "@/components/sections/WhoIAm";
import Process from "@/components/sections/Process";
import Work from "@/components/sections/Work";
import FAQServer from "@/components/sections/FAQServer";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />
      <Hero />
      <WhoIAm />
      <Work />
      <Process />
      <FAQServer />
      <Footer />
    </main>
  );
}
