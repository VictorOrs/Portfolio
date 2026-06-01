import { redirect } from "next/navigation";

// Standalone /work/moso page temporarily disabled — the case study is shown via
// the homepage expand overlay. Re-enable by restoring the commented body below.
export default function MosoPage() {
  redirect("/");
}

/*
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import MosoCaseStudy from "@/components/work/MosoCaseStudy";

export default function MosoPage() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />
      <MosoCaseStudy />
      <Footer />
    </main>
  );
}
*/
