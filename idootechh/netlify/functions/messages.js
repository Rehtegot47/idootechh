import { createClient } from "@supabase/supabase-js";

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const token = event.headers["x-admin-token"];

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return json(401, { error: "Unauthorized" });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase not configured" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const limit = Math.min(parseInt(event.queryStringParameters?.limit || "50", 10), 100);

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase select error:", error.message);
    return json(500, { error: "Could not fetch messages" });
  }

  return json(200, { messages: data || [] });
}
