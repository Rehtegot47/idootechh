import { Router } from 'express';
import { pool } from '../db.js';
import nodemailer from 'nodemailer';

const router = Router();

const NIGERIAN_STATES = {
  'abia': 800, 'adamawa': 1200, 'akwa-ibom': 900, 'anova': 700, 'bauchi': 1100,
  'bayelsa': 1000, 'benue': 900, 'borno': 1300, 'cross-river': 1100, 'delta': 1000,
  'ebonyi': 900, 'edo': 900, 'ekiti': 800, 'enyi': 700, 'fct-abuja': 600,
  'gombe': 1000, 'imo': 800, 'jigawa': 1100, 'kaduna': 1000, 'kano': 1200,
  'katsina': 1100, 'kebbi': 1000, 'kogi': 900, 'kwara': 800, 'lagos': 500,
  'nasarawa': 800, 'niger': 1000, 'ogun': 700, 'ondo': 800, 'osun': 700,
  'oyo': 700, 'plateau': 1000, 'rivers': 900, 'sokoto': 1100, 'taraba': 1200,
  'yobe': 1200, 'zamfara': 1100
};

function escapeHtml(v) {
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

router.post('/', async (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, shipping_state, items } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !items?.length) return res.status(400).json({ error: 'Missing fields' });

  const shippingFee = NIGERIAN_STATES[shipping_state?.toLowerCase()] || 1000;
  const subtotal = items.reduce((s, it) => s + Number(it.price) * it.qty, 0);
  const total = subtotal + shippingFee;

  try {
    const [orderRes] = await pool.query(
      'INSERT INTO orders (customer_name,customer_email,customer_phone,shipping_address,shipping_state,shipping_fee,subtotal,total) VALUES (?,?,?,?,?,?,?,?)',
      [customer_name, customer_email, customer_phone || null, shipping_address, shipping_state || '', shippingFee, subtotal, total]
    );
    const orderId = orderRes.insertId;

    for (const it of items) {
      await pool.query('INSERT INTO order_items (order_id,product_id,qty,price) VALUES (?,?,?,?)', [orderId, it.product_id, it.qty, it.price]);
      await pool.query('UPDATE products SET stock = stock - ? WHERE id=?', [it.qty, it.product_id]);
    }

    // Send email notification if SMTP configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: `IdooTech Website <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
          to: customer_email,
          subject: `[IdooTech] Order #${orderId} Confirmed`,
          html: `<div style="font-family:Arial,sans-serif"><h2>Order Confirmed!</h2><p>Thank you for your order, <b>${escapeHtml(customer_name)}</b>.</p><table style="border-collapse:collapse;margin:1rem 0"><tr style="background:#f5f5f5"><th style="padding:0.5rem;text-align:left;border:1px solid #ddd">Item</th><th style="padding:0.5rem;text-align:left;border:1px solid #ddd">Qty</th><th style="padding:0.5rem;text-align:left;border:1px solid #ddd">Price</th></tr>${items.map(it=>`<tr><td style="padding:0.5rem;border:1px solid #ddd">${escapeHtml(it.name)}</td><td style="padding:0.5rem;border:1px solid #ddd">${it.qty}</td><td style="padding:0.5rem;border:1px solid #ddd">₦${Number(it.price).toLocaleString()}</td></tr>`).join('')}<tr style="font-weight:700"><td colspan="2" style="padding:0.5rem;text-align:right;border:1px solid #ddd">Subtotal:</td><td style="padding:0.5rem;border:1px solid #ddd">₦${subtotal.toLocaleString()}</td></tr><tr><td colspan="2" style="padding:0.5rem;text-align:right;border:1px solid #ddd">Shipping (${escapeHtml(shipping_state || 'Nigeria')}):</td><td style="padding:0.5rem;border:1px solid #ddd">₦${shippingFee.toLocaleString()}</td></tr><tr style="background:#e8f5e9;font-weight:800"><td colspan="2" style="padding:0.5rem;text-align:right;border:1px solid #ddd">Total:</td><td style="padding:0.5rem;border:1px solid #ddd">₦${total.toLocaleString()}</td></tr></table><p style="color:green;font-weight:700">Your order has been placed successfully! We'll deliver to ${escapeHtml(shipping_address)}.</p><p>Contact us: info@idootech.com.ng | +234 816 989 1512</p></div>`
        });
      } catch (mailErr) { console.error('Order email failed', mailErr); }
    }

    res.json({ ok: true, order_id: orderId, total, shippingFee, subtotal });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/states', (_req, res) => {
  const states = Object.entries(NIGERIAN_STATES).map(([slug, fee]) => ({ slug, name: slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), fee }));
  res.json({ states });
});

export { NIGERIAN_STATES };
export default router;
