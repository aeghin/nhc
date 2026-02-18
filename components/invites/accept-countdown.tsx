"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface AcceptedCountdownProps {
  orgId?: string;
  organizationName: string;
}

export const AcceptedCountdown = ({ orgId, organizationName }: AcceptedCountdownProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          setTimeout(() => {
            router.push(`/dashboard/organizations/${orgId}`);
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orgId, router]);

  return (
    <Card className="border-2 overflow-hidden text-center">
      <CardContent className="p-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold tracking-tight mb-2"
        >
          Welcome Aboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-6"
        >
          {"You've successfully joined "}
          <span className="font-semibold text-foreground">
            {organizationName}
          </span>
          .
        </motion.p>

        {/* Countdown circle */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center relative">
          <svg className="absolute h-16 w-16 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </svg>
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <Check className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <motion.span
              key={countdown}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-primary"
            >
              {countdown}
            </motion.span>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground mb-4"
        >
          {completed
            ? "Redirecting now..."
            : `Redirecting in ${countdown} second${countdown !== 1 ? "s" : ""}...`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href={`/dashboard/organizations/${orgId}`}>
            <Button className="cursor-pointer shadow-lg shadow-primary/25">
              Go to Dashboard Now
            </Button>
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  );
};