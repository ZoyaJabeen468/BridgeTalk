"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has been scrolled past a threshold.
 * Used to switch the navbar between a transparent "over hero" state
 * and a solid, backdrop-blurred state.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
