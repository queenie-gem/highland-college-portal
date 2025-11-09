"use client";

import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // Add stagger delay per element
            target.style.transitionDelay = `${index * 0.1}s`;
            target.classList.add("active");
          } else {
            target.classList.remove("active");
            target.style.transitionDelay = "0s"; // reset delay
          }
        });
      },
      { threshold: 0.15 } // triggers when 15% visible
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
