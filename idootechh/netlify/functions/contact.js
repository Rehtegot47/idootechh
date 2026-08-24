import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !subject || !message) {
    return json(400, { error: "All fields are required" });
  }

  if (!EMAIL_RE.test(email)) {
    return json(400, { error: "Invalid email address" });
  }

  if (name.length > 200 || subject.length > 300 || message.length > 5000) {
    return json(400, { error: "One or more fields are too long" });
  }

  const dbWarnings = [];

  // 1. Save to Supabase (best effort - email still goes out if DB fails)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error: dbError } = await supabase
        .from("messages")
        .insert([{ name, email, subject, message }]);
      if (dbError) {
        dbWarnings.push("Could not save message to database");
        console.error("Supabase insert error:", dbError.message);
      }
    } catch (err) {
      dbWarnings.push("Database unavailable");
      console.error("Supabase error:", err);
    }
  }

  // 2. Email the recipient
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const recipient =
        process.env.CONTACT_RECIPIENT || process.env.SMTP_USER;

      await transporter.sendMail({
        from: `IdooTech Website <${process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: email,
        subject: `[IdooTech] New message from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          ``,
          message,
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px">
            <h2 style="color:#22075d">New contact message</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <hr>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
            <hr>
            <p style="color:#888;font-size:12px">Sent from the IdooTech website contact form.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Email error:", err);
      return json(500, {
        error: "Your message was not delivered. Please try again.",
        warnings: dbWarnings,
      });
    }
  }

  return json(200, { ok: true, warnings: dbWarnings });
}
