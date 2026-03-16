import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col">
      <Navbar />
      <Hero />
    </main>
  );
}
