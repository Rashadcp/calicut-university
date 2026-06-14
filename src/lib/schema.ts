import { z } from "zod";

export const DISTRICTS = [
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Palakkad",
  "Thrissur",
] as const;

export const FEEDBACK_MAX = 1000;

/** Step 1 — personal / institutional details. */
export const step1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  mobile: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit mobile number"
    ),
  collegeName: z
    .string()
    .trim()
    .min(2, "Please enter your college name")
    .max(120, "College name is too long"),
  district: z.enum(DISTRICTS, {
    errorMap: () => ({ message: "Please select your district" }),
  }),
});

/** Step 2 — the open feedback. */
export const step2Schema = z.object({
  feedback: z
    .string()
    .trim()
    .min(10, "Please share at least a few words (min 10 characters)")
    .max(FEEDBACK_MAX, `Please keep it under ${FEEDBACK_MAX} characters`),
});

/** Full submission payload. */
export const feedbackSchema = step1Schema.merge(step2Schema);

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type FeedbackValues = z.infer<typeof feedbackSchema>;
