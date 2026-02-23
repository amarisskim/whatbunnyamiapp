"use client";

import { useRef, useState, useEffect } from "react";

interface VerticalScrollProps {
  children: React.ReactNode[];
  onIndexChange?: (index: number) => void;
}

export default function VerticalScroll({
  children,
  onIndexChange,
}: VerticalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.index
            );
            if (!isNaN(index)) {
              setCurrentIndex(index);
              onIndexChange?.(index);
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const items = container.querySelectorAll("[data-index]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [children.length, onIndexChange]);

  return (
    <div
      ref={containerRef}
      className="snap-container h-dvh w-full"
    >
      {children.map((child, index) => (
        <div
          key={index}
          data-index={index}
          className="snap-item relative h-dvh w-full"
        >
          {child}
        </div>
      ))}

      {/* Scroll indicator dots */}
      <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-1.5">
        {children.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-neon-cyan scale-150"
                : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
