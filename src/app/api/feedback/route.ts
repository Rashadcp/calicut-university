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

  // 4. Forward to the Google Apps Script Web App in the background.
  // We do not await this fetch so that the user's request completes instantly.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal,
    redirect: "follow",
  })
    .then((res) => {
      clearTimeout(timeout);
      if (!res.ok) {
        console.error("Apps Script background save failed with status:", res.status);
      } else {
        console.log("Feedback successfully saved to Google Sheets in background.");
      }
    })
    .catch((err) => {
      clearTimeout(timeout);
      console.error("Failed to reach Apps Script in background:", err);
    });

  // Return success immediately to make the UI transition instant.
  return NextResponse.json({ ok: true });
}
