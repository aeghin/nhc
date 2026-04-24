"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedInvitationRowProps {
  children: ReactNode;
  index: number;
}

export const AnimatedInvitationRow = ({
  children,
  index,
}: AnimatedInvitationRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
    >
      {children}
    </motion.div>
  );
};