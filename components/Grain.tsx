export default function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: "-200%",
        width: "400%",
        height: "400%",
        backgroundImage: "url(/grain.svg)",
        backgroundSize: "256px 256px",
        opacity: 0.5,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
