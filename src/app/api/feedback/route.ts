import { NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Parse the incoming JSON body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // 2. Validate against the same Zod schema used on the client.
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    console.error("GOOGLE_APPS_SCRIPT_URL is not configured.");
    return NextResponse.json(
      { ok: false, error: "Server is not configured to accept feedback yet." },
      { status: 500 }
    );
  }

  // 3. Build a timestamp (Asia/Kolkata) for the sheet.
  const now = new Date();
  const submissionDate = now.toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata",
  });
  const submissionTime = now.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  const payload = {
    ...parsed.data,
    submissionDate,
    submissionTime,
  };

  // 4. Forward to the Google Apps Script Web App.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Apps Script responded with status", res.status);
      return NextResponse.json(
        { ok: false, error: "Could not save your feedback. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to reach Apps Script:", err);
    return NextResponse.json(
      { ok: false, error: "Network error while saving your feedback." },
      { status: 502 }
    );
  }
}
