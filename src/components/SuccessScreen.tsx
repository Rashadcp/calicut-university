"use client";

import { motion } from "framer-motion";

interface SuccessScreenProps {
  onReset: () => void;
}

export default function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center p-6 md:p-8"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="relative mb-7"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/10"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
        />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary border border-primary/10">
          <svg
            viewBox="0 0 52 52"
            className="h-12 w-12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M14 27 L23 36 L39 18"
              stroke="#ffffff"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="font-headline-md text-headline-md text-on-surface"
      >
        Thank You!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-3 max-w-md font-body-md text-body-md text-on-surface-variant opacity-80 leading-relaxed"
      >
        Thank you for your feedback / suggestion! Your thoughts and input are highly valued and help us improve our campus.
      </motion.p>

      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 rounded-xl bg-primary text-on-primary px-7 py-3.5 font-label-sm text-label-sm uppercase tracking-widest transition-all hover:bg-primary/90 shadow-md"
      >
        Submit Another Response
      </motion.button>
    </motion.div>
  );
}
