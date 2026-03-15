import Button from "@/components/ui/Button";

export default function Page() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col items-center justify-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="primary" size="lg">Book a call</Button>
        <Button variant="primary" size="md">Book a call</Button>
        <Button variant="secondary" size="lg">Book a call</Button>
        <Button variant="secondary" size="md">Book a call</Button>
      </div>
    </main>
  );
}
