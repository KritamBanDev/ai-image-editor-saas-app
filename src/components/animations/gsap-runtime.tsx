"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GsapRuntime() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const shell = document.querySelector<HTMLElement>("[data-page-shell]");
    if (!shell) {
      return;
    }

    const overlay = overlayRef.current;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const floatingTargets = Array.from(shell.querySelectorAll<HTMLElement>("[data-gsap='float']"));

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        const normalizedX = (pointerX / width - 0.5) * 2;
        const normalizedY = (pointerY / height - 0.5) * 2;

        floatingTargets.forEach((target, index) => {
          const depth = index % 2 === 0 ? 10 : 7;
          gsap.to(target, {
            x: normalizedX * depth,
            y: normalizedY * depth,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        rafId = 0;
      });
    };

    if (!isCoarsePointer && floatingTargets.length > 0) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const ctx = gsap.context(() => {
      if (overlay) {
        gsap.set(overlay, {
          scaleX: 1,
          transformOrigin: "right center",
          opacity: 0.92,
        });
        gsap.to(overlay, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power3.inOut",
          opacity: 0,
        });
      }

      const navTargets = shell.querySelectorAll("[data-gsap='nav']");
      const introTargets = shell.querySelectorAll("[data-gsap='intro']");
      const cardTargets = shell.querySelectorAll("[data-gsap='card']");
      const revealTargets = shell.querySelectorAll("[data-gsap='reveal']");
      const heroTargets = shell.querySelectorAll("[data-gsap='hero']");

      if (navTargets.length > 0) {
        gsap.fromTo(
          navTargets,
          { y: -18, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power2.out",
            stagger: 0.08,
          },
        );
      }

      if (introTargets.length > 0) {
        gsap.fromTo(
          introTargets,
          { y: 32, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.16,
          },
        );
      }

      if (heroTargets.length > 0) {
        gsap.fromTo(
          heroTargets,
          { y: 20, opacity: 0.75 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.08,
          },
        );
      }

      cardTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { y: 34, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      revealTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { y: 42, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      floatingTargets.forEach((target, index) => {
        gsap.to(target, {
          y: index % 2 === 0 ? -16 : -10,
          duration: 2.4 + index * 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, shell);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("pointermove", onPointerMove);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-60 origin-right bg-linear-to-r from-sky-200/45 via-cyan-100/45 to-amber-100/45"
      aria-hidden
    />
  );
}
