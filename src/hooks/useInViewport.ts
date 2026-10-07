import { RefObject, useEffect, useState } from "react";

/** Becomes true once the element scrolls into view (and stays true). */
export function useInViewport(ref: RefObject<Element | null>, threshold = 0.2) {
  const [inViewport, setInViewport] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || inViewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, inViewport]);

  return inViewport;
}
