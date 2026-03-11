"use server";

import { headers } from "next/headers";

type FormData = {
  name: string;
  email: string;
  teamSize: string;
  useCase: string;
  locale: string;
};

type Result = { success: true } | { success: false; error: string };

const ALLOWED_TEAM_SIZES = ["1-5", "6-20", "21-50", "50+"] as const;
const ALLOWED_USE_CASES = [
  "onboarding",
  "architecture",
  "codeReview",
  "knowledgeBase",
  "other",
] as const;
const ALLOWED_LOCALES = ["en", "de"] as const;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/;

// Simple in-memory rate limiter (per-IP, 5 requests per 10 minutes)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function validate(data: FormData): string | null {
  if (!data.name?.trim() || data.name.length > 120) return "Invalid name";
  if (!EMAIL_RE.test(data.email)) return "Invalid email";
  if (!(ALLOWED_TEAM_SIZES as readonly string[]).includes(data.teamSize))
    return "Invalid team size";
  if (!(ALLOWED_USE_CASES as readonly string[]).includes(data.useCase))
    return "Invalid use case";
  if (!(ALLOWED_LOCALES as readonly string[]).includes(data.locale))
    return "Invalid locale";
  return null;
}

export async function submitToAirtable(data: FormData): Promise<Result> {
  // Rate limiting
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return { success: false, error: "Too many requests" };
  }

  // Input validation
  const validationError = validate(data);
  if (validationError) {
    return { success: false, error: "Invalid input" };
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    console.error("Airtable not configured");
    return { success: false, error: "Service unavailable" };
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Name: data.name.trim(),
                Email: data.email.trim(),
                "Team Size": data.teamSize,
                "Use Case": data.useCase,
                Locale: data.locale,
                Timestamp: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      console.error("Airtable error:", res.status);
      return { success: false, error: "Submission failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("Airtable network error:", err);
    return { success: false, error: "Network error" };
  }
}
