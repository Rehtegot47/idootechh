import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, items } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !items?.length) return res.status(400).json({ error: 'Missing fields' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let total = 0;
    for (const it of items) {
      const [rows] = await conn.query('SELECT price, stock FROM products WHERE id=?', [it.product_id]);
      if (!rows.length) throw new Error(`Product ${it.product_id} not found`);
      if (rows[0].stock < it.qty) throw new Error(`Insufficient stock for product ${it.product_id}`);
      total += Number(rows[0].price) * it.qty;
    }
    const [orderRes] = await conn.query('INSERT INTO orders (customer_name,customer_email,customer_phone,shipping_address,total) VALUES (?,?,?,?,?)', [customer_name,customer_email,customer_phone||null,shipping_address,total]);
    const orderId = orderRes.insertId;
    for (const it of items) {
      const [rows] = await conn.query('SELECT price FROM products WHERE id=?', [it.product_id]);
      await conn.query('INSERT INTO order_items (order_id,product_id,qty,price) VALUES (?,?,?,?)', [orderId, it.product_id, it.qty, rows[0].price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id=?', [it.qty, it.product_id]);
    }
    await conn.commit();
    res.json({ ok: true, order_id: orderId, total });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally { conn.release(); }
});

export default router;
