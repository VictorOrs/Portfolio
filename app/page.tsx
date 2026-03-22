import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import WhoIAm from "@/components/sections/WhoIAm";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col">
      <Navbar />
      <Hero />
      <WhoIAm />
    </main>
  );
}
