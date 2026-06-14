# University Improvement Feedback

A premium, minimal **Next.js 15** feedback collection app. It opens straight to a
centered, multi-step glassmorphism form — no landing page, no nav, no marketing.
Responses are stored in **Google Sheets** via a Google Apps Script Web App.

## ✨ Features

- Full-screen animated soft blue/purple gradient background
- Premium glassmorphism card (24px radius, soft shadows)
- 2-step form + animated success state
- Animated progress bar
- Smooth, direction-aware step transitions (Framer Motion)
- Form validation with **React Hook Form + Zod** (incl. mobile-number validation)
- Character counter on the feedback field
- Loading spinner during submission, inline error handling
- Mobile-first responsive, keyboard accessible, respects `prefers-reduced-motion`
- Google Sheets storage through a secure server-side API route

## 🧱 Tech Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
React Hook Form · Zod · Lucide Icons

## 📁 Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/feedback/route.ts   # Server route → forwards to Apps Script
│   │   ├── globals.css             # Tailwind + glassmorphism / gradient styles
│   │   ├── layout.tsx              # Root layout + Inter font
│   │   └── page.tsx                # Full-screen centered layout
│   ├── components/
│   │   ├── FeedbackForm.tsx        # Multi-step orchestrator (steps + submit)
│   │   ├── ProgressBar.tsx         # Animated step progress
│   │   ├── Field.tsx               # Reusable label/input + error display
│   │   └── SuccessScreen.tsx       # Animated success checkmark state
│   └── lib/
│       └── schema.ts               # Zod schemas, districts, constants
├── google-apps-script/
│   ├── Code.gs                     # Apps Script Web App
│   └── README.md                   # Step-by-step Sheets setup
└── .env.example
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up Google Sheets storage
#    Follow google-apps-script/README.md, then:
cp .env.example .env.local
#    and paste your deployed Web App URL into GOOGLE_APPS_SCRIPT_URL

# 3. Run
npm run dev
```

Open <http://localhost:3000>.

> Without `GOOGLE_APPS_SCRIPT_URL` the UI works fully, but submitting returns a
> friendly "server not configured" error. See
> [`google-apps-script/README.md`](./google-apps-script/README.md).

## 🔐 Data stored per submission

Full Name · Mobile Number · College Name · District · Feedback ·
Submission Date · Submission Time

## 🛠 Build

```bash
npm run build && npm start
```
