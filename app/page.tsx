import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import NavLink from "@/components/ui/NavLink";
import NavGroup from "@/components/ui/NavGroup";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-8 flex-1">
        <div className="flex items-center justify-center gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/work">Work</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>
        <NavGroup />
        <NavGroup scrolled />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" size="lg">Book a call</Button>
          <Button variant="primary" size="md">Book a call</Button>
          <Button variant="secondary" size="lg">Book a call</Button>
          <Button variant="secondary" size="md">Book a call</Button>
        </div>
      </div>
    </main>
  );
}
