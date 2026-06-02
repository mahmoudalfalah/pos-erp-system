import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768;

let mqlCache: MediaQueryList | null = null;

const getMql = () => {
  if (typeof window === "undefined") return null;
  if (!mqlCache) {
    mqlCache = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  }
  return mqlCache;
}

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = getMql();
  if (!mql) return () => {};
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  const mql = getMql();
  return mql ? mql.matches : false;
}

const getServerSnapshot = () => false;

export const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);