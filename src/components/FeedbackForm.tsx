"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import {
  DISTRICTS,
  FEEDBACK_MAX,
  feedbackSchema,
  type FeedbackValues,
} from "@/lib/schema";
import SuccessScreen from "./SuccessScreen";

const TOTAL_STEPS = 3;

// Direction-aware slide transition between steps.
const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

type Phase = 1 | 2 | 3 | "success";

const stepsInfo = [
  { title: "Personal Information", subtitle: "Step 1 of 3" },
  { title: "Academic Background", subtitle: "Step 2 of 3" },
  { title: "Your Thoughts", subtitle: "Step 3 of 3" },
];

export default function FeedbackForm() {
  const [phase, setPhase] = useState<Phase>(1);
  const [direction, setDirection] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      mobile: "",
      collegeName: "",
      district: undefined,
      feedback: "",
    },
  });

  const feedbackValue = watch("feedback") ?? "";
  const selectedDistrict = watch("district");

  async function goNext() {
    let valid = false;
    if (phase === 1) {
      valid = await trigger(["fullName", "mobile"]);
    } else if (phase === 2) {
      valid = await trigger(["collegeName", "district"]);
    }
    
    if (valid) {
      setDirection(1);
      setPhase((p) => (p as number) + 1 as Phase);
    }
  }

  function goBack() {
    if (phase !== "success" && phase > 1) {
      setDirection(-1);
      setPhase((p) => (p as number) - 1 as Phase);
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? "Something went wrong.");
      }
      setDirection(1);
      setPhase("success");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Could not submit your feedback. Please try again."
      );
    }
  });

  function handleReset() {
    reset();
    setServerError(null);
    setDirection(-1);
    setPhase(1);
  }

  const currentStep = phase === "success" ? TOTAL_STEPS : phase;
  const stepData = phase !== "success" ? stepsInfo[phase - 1] : stepsInfo[2];
  const offset = 163 - (163 * (currentStep / TOTAL_STEPS));

  if (phase === "success") {
    return (
      <div className="glass-panel rounded-3xl md:h-full py-16 px-6 md:p-8 flex items-center justify-center relative overflow-hidden border-primary/10">
        <SuccessScreen onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl md:h-full flex flex-col relative overflow-hidden border-primary/10 shadow-sm">
      {/* Progress Header */}
      <div className="p-6 md:p-8 border-b border-black/5 flex justify-between items-center">
        <div className="flex flex-col">
          {phase === 1 && (
            <span className="text-secondary font-label-sm text-label-sm tracking-widest uppercase mb-1">Welcome</span>
          )}
          <h2 className="font-headline-md text-headline-md text-on-surface">{stepData.title}</h2>
          <span className="text-on-surface-variant font-label-sm text-label-sm">{stepData.subtitle}</span>
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle className="text-black/10" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="3"></circle>
            <circle 
              className="text-primary transition-all duration-700" 
              cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" 
              strokeDasharray="163" 
              strokeDashoffset={offset} 
              strokeLinecap="round" strokeWidth="3">
            </circle>
          </svg>
          <span className="absolute font-label-sm text-label-sm text-primary">{currentStep}/{TOTAL_STEPS}</span>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between md:overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${phase}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 flex flex-col relative"
          >
            {/* ---------------- STEP 1 ---------------- */}
            {phase === 1 && (
              <div className="space-y-stack-md w-full">
                <div className="flex flex-col gap-stack-sm">
                  <label className="font-label-sm text-label-sm text-primary ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Julian Aetheris"
                    className={`input-inset border border-black/10 hover:border-black/20 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-body-lg text-body-lg ${errors.fullName ? "ring-1 ring-error/50 border-error/50" : ""}`}
                    {...register("fullName")}
                  />
                  {errors.fullName && <span className="text-error text-sm px-2">{errors.fullName.message}</span>}
                </div>
                <div className="flex flex-col gap-stack-sm">
                  <label className="font-label-sm text-label-sm text-primary ml-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 "
                    maxLength={10}
                    className={`input-inset border border-black/10 hover:border-black/20 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-body-lg text-body-lg ${errors.mobile ? "ring-1 ring-error/50 border-error/50" : ""}`}
                    {...register("mobile")}
                  />
                  {errors.mobile && <span className="text-error text-sm px-2">{errors.mobile.message}</span>}
                </div>
              </div>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {phase === 2 && (
              <div className="space-y-stack-md w-full">
                <div className="flex flex-col gap-stack-sm">
                  <label className="font-label-sm text-label-sm text-primary ml-1">College Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your college / institution"
                      className={`input-inset w-full border border-black/10 hover:border-black/20 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-body-lg text-body-lg ${errors.collegeName ? "ring-1 ring-error/50 border-error/50" : ""}`}
                      {...register("collegeName")}
                    />
                  </div>
                  {errors.collegeName && <span className="text-error text-sm px-2">{errors.collegeName.message}</span>}
                </div>
                <div className="flex flex-col gap-stack-sm">
                  <label className="font-label-sm text-label-sm text-primary ml-1">District</label>
                  <div className="relative">
                    <input type="hidden" {...register("district")} />
                    
                    {isDistrictOpen && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDistrictOpen(false)} 
                      />
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                      className={`input-inset w-full border border-black/10 hover:border-black/20 rounded-xl p-4 text-on-surface text-left flex justify-between items-center transition-all outline-none font-body-lg text-body-lg relative z-40 ${errors.district ? "ring-1 ring-error/50 border-error/50" : ""}`}
                    >
                      <span className={selectedDistrict ? "text-on-surface" : "text-on-surface-variant/40"}>
                        {selectedDistrict || "Select district"}
                      </span>
                      <span className={`material-symbols-outlined transition-transform duration-200 text-on-surface-variant ${isDistrictOpen ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </button>

                    <AnimatePresence>
                      {isDistrictOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-0 w-full bottom-full mb-2 bg-surface border border-black/10 rounded-xl shadow-lg overflow-y-auto max-h-60 z-50 py-1"
                        >
                          {DISTRICTS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setValue("district", d, { shouldValidate: true });
                                setIsDistrictOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-body-lg font-body-lg transition-colors flex justify-between items-center ${
                                selectedDistrict === d
                                  ? "bg-primary-container text-primary font-semibold"
                                  : "text-on-surface hover:bg-surface-container"
                              }`}
                            >
                              {d}
                              {selectedDistrict === d && (
                                <span className="material-symbols-outlined text-sm">check</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {errors.district && <span className="text-error text-sm px-2">{errors.district.message}</span>}
                </div>
              </div>
            )}

            {/* ---------------- STEP 3 ---------------- */}
            {phase === 3 && (
              <div className="flex flex-col gap-stack-sm flex-1">
                <label className="font-body-lg text-body-lg font-semibold text-primary ml-1 block mb-1">
                  What improvements would you like to see in Calicut University?
                </label>
                <textarea
                  placeholder="Share your thoughts on facilities, curriculum, or general campus improvements..."
                  maxLength={FEEDBACK_MAX}
                  className={`input-inset flex-1 border border-black/10 hover:border-black/20 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-body-lg text-body-lg resize-none min-h-[160px] ${errors.feedback ? "ring-1 ring-error/50 border-error/50" : ""}`}
                  {...register("feedback")}
                ></textarea>
                <div className="flex justify-between items-center px-2">
                  <span className="text-error text-sm">{errors.feedback?.message}</span>
                  <span className={`text-xs font-medium tabular-nums ${feedbackValue.length >= FEEDBACK_MAX ? "text-error" : "text-on-surface-variant"}`}>
                    {feedbackValue.length} / {FEEDBACK_MAX}
                  </span>
                </div>

                {serverError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-xl bg-error-container border border-error/20 px-4 py-3 text-sm font-medium text-error"
                    role="alert"
                  >
                    {serverError}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="pt-8 mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className={`h-14 px-6 rounded-xl border border-black/10 text-on-surface font-label-sm text-label-sm hover:bg-black/5 transition-colors flex items-center justify-center gap-2 ${phase === 1 ? 'hidden' : 'flex'}`}
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 h-14 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-primary/90"
            >
              Continue
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 h-14 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Sending...
                </>
              ) : (
                <>
                  Ready to Send
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    
  );
}

