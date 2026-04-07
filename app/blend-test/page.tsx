export default function BlendTest() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        isolation: "isolate",
      }}
    >
      {/* Background image */}
      <img
        src="/img/background.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />

      {/* Text with color-dodge — color is pre-multiplied RGB, no opacity */}
      <div
        style={{
          position: "absolute",
          top: "300px",
          left: "100px",
          mixBlendMode: "color-dodge",
          color: "#999999",
          fontSize: "88px",
          fontFamily: "sans-serif",
          fontWeight: 500,
        }}
      >
        TEST
      </div>
    </div>
  );
}
