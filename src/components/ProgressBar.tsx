"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  /** Current step (1-based). */
  step: number;
  /** Total number of input steps (excludes the success screen). */
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const clamped = Math.min(step, totalSteps);
  const pct = (clamped / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-brand-700">
          Step {clamped} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {Math.round(pct)}%
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-brand-100/70"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={clamped}
        aria-label={`Step ${clamped} of ${totalSteps}`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
