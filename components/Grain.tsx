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
        backgroundSize: "128px 128px",
        opacity: 0.4,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 10001,
      }}
    />
  );
}
