import { redirect } from "next/navigation";

// Case studies live in the homepage expand overlay, which pushes /work/<slug>
// into history. Landing here directly (reload, shared link) sends you home.
export default function WorkProjectPage() {
  redirect("/");
}
