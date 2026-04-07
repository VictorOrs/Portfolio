import LoadingScreen from "@/components/LoadingScreen";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      {children}
    </>
  );
}
