"use client";
import { useEffect, useRef } from "react";

// Content is visible before enhancement, including without JavaScript.
export function Reveal({
  children,
  pattern = "content",
  className = "",
}: {
  children: React.ReactNode;
  pattern?: "content" | "image" | "line";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`public-reveal ${className}`}
      data-pattern={pattern}
    >
      {children}
    </div>
  );
}
