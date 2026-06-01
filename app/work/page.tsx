import { redirect } from "next/navigation";

// /work index (project grid) temporarily disabled and removed from the nav.
// The full implementation is preserved in git history — restore it to re-enable.
export default function WorkPage() {
  redirect("/");
}
