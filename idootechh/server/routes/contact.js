import { Router } from 'express';
import { pool } from '../db.js';
import nodemailer from 'nodemailer';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(v) {
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

router.post('/', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const subject = String(req.body.subject || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields are required' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (name.length > 200 || subject.length > 300 || message.length > 5000) return res.status(400).json({ error: 'Fields too long' });

  try {
    await pool.query('INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)', [name,email,subject,message]);
  } catch (e) {
    console.error('DB insert failed', e.message);
    // continue to mail
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      const recipient = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER;
      await transporter.sendMail({
        from: `IdooTech Website <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: email,
        subject: `[IdooTech] New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `<div style="font-family:Arial,sans-serif"><h2>New contact</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Subject:</b> ${escapeHtml(subject)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`
      });
    } catch (e) {
      console.error('Mail failed', e);
      return res.status(500).json({ error: 'Message saved but email not delivered' });
    }
  }
  res.json({ ok: true });
});

export default router;
