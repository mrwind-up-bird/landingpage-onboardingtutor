"use server";

type FormData = {
  name: string;
  email: string;
  teamSize: string;
  useCase: string;
  locale: string;
};

type Result = { success: true } | { success: false; error: string };

export async function submitToAirtable(data: FormData): Promise<Result> {
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
                Name: data.name,
                Email: data.email,
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
      const body = await res.text();
      console.error("Airtable error:", res.status, body);
      return { success: false, error: "Submission failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("Airtable network error:", err);
    return { success: false, error: "Network error" };
  }
}
