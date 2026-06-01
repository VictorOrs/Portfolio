import { redirect } from "next/navigation";

// Standalone /work/enuma page temporarily disabled — the case study is shown via
// the homepage expand overlay. Re-enable by restoring the commented body below.
export default function EnumaPage() {
  redirect("/");
}

/*
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import EnumaCaseStudy from "@/components/work/EnumaCaseStudy";

export default function EnumaPage() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />
      <EnumaCaseStudy />
      <Footer />
    </main>
  );
}
*/
