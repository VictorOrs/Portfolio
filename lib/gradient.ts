export const GRADIENT_STOPS = `
  #E0E0E0 0%,   #F7BF7E 2%,  #FFB35E 4%,  #FF665C 6%,  #C261AE 8%,  #A45ED6 10%, #865BFF 12%, #98A8FF 14%, #AAF5FF 16%, #D3FFE7 18%, #E0E0E0 24%,
  #E0E0E0 33%,
  #E0E0E0 36%,  #F7BF7E 38%, #FFB35E 40%, #FF665C 42%, #C261AE 44%, #A45ED6 46%, #865BFF 48%, #98A8FF 50%, #AAF5FF 52%, #D3FFE7 54%, #E0E0E0 60%,
  #E0E0E0 69%,
  #E0E0E0 72%,  #F7BF7E 74%, #FFB35E 76%, #FF665C 78%, #C261AE 80%, #A45ED6 82%, #865BFF 84%, #98A8FF 86%, #AAF5FF 88%, #D3FFE7 90%, #E0E0E0 100%
`.replace(/\n\s*/g, " ").trim();

export const GRADIENT_STYLE = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "300% 300%",
  backgroundPosition: "50% 50%",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};
