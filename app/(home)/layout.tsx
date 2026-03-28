import { LoadingProvider } from "@/lib/loading";
import LoadingScreen from "@/components/LoadingScreen";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingScreen />
      {children}
    </LoadingProvider>
  );
}
