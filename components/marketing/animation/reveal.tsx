"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-triggered reveal. Children render normally in the SSR HTML (so SEO
 * and no-JS users see everything); GSAP hides them right before first paint
 * and fades/slides them in when the element scrolls into view.
 *
 * - `stagger` animates direct children one-by-one instead of the wrapper.
 * - Respects prefers-reduced-motion (content just stays visible).
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 28,
  stagger,
  once = true,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Stagger interval (seconds) — animates direct children instead. */
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets: Element[] | Element =
        stagger !== undefined ? Array.from(el.children) : el;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}
