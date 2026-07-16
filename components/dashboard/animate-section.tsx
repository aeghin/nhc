"use client"

import { m, type HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  className?: string
}

export const AnimatedSection = ({
  children,
  delay = 0,
  className,
  ...motionProps
}: AnimatedSectionProps) => (
  <m.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={className}
    {...motionProps}
  >
    {children}
  </m.div>
)