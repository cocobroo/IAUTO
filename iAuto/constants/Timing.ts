export const Timing = {
  debounceDelay: 300,        // Show "analizando" after user stops typing (ms)
  confirmationDuration: 1500, // Show detection result (ms)
  animationDuration: 500,     // Metrics counter animation (ms)
  fadeInDuration: 200,        // Fade in animation (ms)
  fadeOutDuration: 200,       // Fade out animation (ms)
  entryMoveDuration: 300,     // Entry move to history animation (ms)
} as const;
