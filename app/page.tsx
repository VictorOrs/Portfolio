import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import WhoIAm from "@/components/sections/WhoIAm";
import Process from "@/components/sections/Process";
import CubeScrollSequence from "@/components/CubeScrollSequence";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px]">
      <Navbar />
      <Hero />
      <WhoIAm />
      <Process />
      <CubeScrollSequence />
    </main>
  );
}
