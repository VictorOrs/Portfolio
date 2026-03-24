export const GRADIENT_STOPS = `
  #E0E0E0 0%,   #F7BF7E 2%,  #FFB35E 4%,  #FF665C 6%,  #C261AE 8%,  #A45ED6 10%, #865BFF 12%, #98A8FF 14%, #AAF5FF 16%, #D3FFE7 18%, #E0E0E0 24%,
  #E0E0E0 33%,
  #E0E0E0 36%,  #F7BF7E 38%, #FFB35E 40%, #FF665C 42%, #C261AE 44%, #A45ED6 46%, #865BFF 48%, #98A8FF 50%, #AAF5FF 52%, #D3FFE7 54%, #E0E0E0 60%,
  #E0E0E0 69%,
  #E0E0E0 72%,  #F7BF7E 74%, #FFB35E 76%, #FF665C 78%, #C261AE 80%, #A45ED6 82%, #865BFF 84%, #98A8FF 86%, #AAF5FF 88%, #D3FFE7 90%, #E0E0E0 100%
`.replace(/\n\s*/g, " ").trim();

/**
 * Stops from Figma node 1519:3173 — 2× repeated bands for backgroundSize "250% 250%"
 * on the Process title (399 × 144 px).
 *
 * Band 1: 10–28 %  |  gray gap: 28–47 %  |  Band 2: 47–65 %  |  gray tail: 65–100 %
 * At backgroundPosition 55 % the visible window (≈ 33–73 %) shows band 2 +
 * the gray gap. As the mouse sweeps left the first band appears; right → gray.
 */
export const GRADIENT_STOPS_PROCESS = `
  #E0E0E0 0%,  #E0E0E0 10%,
  #F0CA9F 12%, #F7BF7E 14%, #FFB35E 16%, #FF8D5D 18%, #FF665C 19%,
  #E16385 20%, #C261AE 21%, #A45ED6 22%, #865BFF 23%, #8F82FF 24%,
  #98A8FF 25%, #AAF5FF 26%, #D3FFE7 27%, #E0E0E0 28%,
  #E0E0E0 47%,
  #F0CA9F 49%, #F7BF7E 51%, #FFB35E 53%, #FF8D5D 55%, #FF665C 56%,
  #E16385 57%, #C261AE 58%, #A45ED6 59%, #865BFF 60%, #8F82FF 61%,
  #98A8FF 62%, #AAF5FF 63%, #D3FFE7 64%, #E0E0E0 65%,
  #E0E0E0 100%
`.replace(/\n\s*/g, " ").trim();

export const GRADIENT_STYLE = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "300% 300%",
  backgroundPosition: "50% 50%",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};
