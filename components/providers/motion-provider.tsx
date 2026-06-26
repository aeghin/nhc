"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide provider that loads Motion's feature set once so components can use
 * the lightweight `m` component instead of importing the full `motion` graph.
 * Uses `domMax` because the member dashboard relies on layout animations
 * (`layoutId`); `domMax` is the superset of `domAnimation`.
 *
 * `reducedMotion="user"` makes every animation honor the OS "reduce motion"
 * accessibility setting (WCAG 2.3.3).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
