/**
 * Premium Theme Configuration
 * Centralizing animation timings, easing functions, and layout constants.
 */

export const theme = {
  animations: {
    durations: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      xl: 0.8,
      loading: 1.0,
    },
    easing: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      premium: [0.16, 1, 0.3, 1] as any, // Cast to any to satisfy Framer Motion's Easing type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      standard: [0.4, 0, 0.2, 1] as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      in: [0.4, 0, 1, 1] as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      out: [0, 0, 0.2, 1] as any,
    },
  },
  zindex: {
    below: -10,
    base: 0,
    above: 10,
    overlay: 50,
    max: 100,
  },
  colors: {
    // These match the oklch values in globals.css for JS integration if needed
    green: "oklch(0.65 0.2 160)",
    blue: "oklch(0.6 0.18 250)",
    slate: "oklch(0.18 0.04 240)",
  }
};
