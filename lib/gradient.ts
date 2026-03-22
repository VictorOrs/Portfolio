export const GRADIENT_STOPS = `
  #E0E0E0 0%,   #F7BF7E 3%,  #FFB35E 6%,  #FF665C 9%,  #C261AE 12%, #A45ED6 14%, #865BFF 16%, #98A8FF 18%, #AAF5FF 21%, #D3FFE7 24%, #E0E0E0 30%,
  #E0E0E0 33%,
  #E0E0E0 36%,  #F7BF7E 39%, #FFB35E 42%, #FF665C 45%, #C261AE 48%, #A45ED6 50%, #865BFF 52%, #98A8FF 54%, #AAF5FF 57%, #D3FFE7 60%, #E0E0E0 66%,
  #E0E0E0 69%,
  #E0E0E0 72%,  #F7BF7E 75%, #FFB35E 78%, #FF665C 81%, #C261AE 84%, #A45ED6 86%, #865BFF 88%, #98A8FF 90%, #AAF5FF 93%, #D3FFE7 96%, #E0E0E0 100%
`.replace(/\n\s*/g, " ").trim();

export const GRADIENT_STYLE = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "300% 300%",
  backgroundPosition: "50% 50%",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};
