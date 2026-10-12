import type Lenis from "lenis";

// Tiny singleton so dialogs and anchor links can reach the smooth-scroll instance.
let instance: Lenis | null = null;
export const getLenis = () => instance;
export const setLenis = (l: Lenis | null) => { instance = l; };
