import { LoadingProvider } from "@/lib/loading";
import LoadingScreen from "@/components/LoadingScreen";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingScreen />
      {children}
    </LoadingProvider>
  );
}
